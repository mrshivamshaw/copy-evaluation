import { Router } from "express"
import { auth } from "../middlewares/auth.js"
import user from "../models/user.js"
import { uploadImageToCloudinary } from "../utils/imageUploader.js"
import { updateProfile } from "../controllers/profile.js"

const userRoute = Router()

userRoute.get('/user',auth,(req,res)=>{
    res.status(200).json({
        success : true,
        message : "user is authenticated"
    })
})
userRoute.get('/profile/:id',auth,async(req,res)=>{
    try {
        const userId = req.params.id;
        const userDetail = await user.findById(userId)
        if(!userDetail){
            return res.status(404).json({
                message : "User not found",
                success: false
            })
        }
        userDetail.password = undefined
        return res.status(200).json({
            data : userDetail,
            message : "user profile",
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message : "Error occured while fetching User details",
            success : false
        })
    }

})

userRoute.post('/updateProfile',auth,updateProfile)

userRoute.post('/updatePic',auth,async(req,res)=>{
    try {
        const {image} = req.files
            const userId = req.user.id
        if(!image){
            return res.status(500).json({
                message : "Please upload an image",
                success : false
            })
        }
        if(!userId){
            return res.status(500).json({
                message : "Something went wrong",
                success : false
            })
        }
        const secureUrl = await uploadImageToCloudinary(image,process.env.FOLDER_NAME)
        const updatedUser = await user.findByIdAndUpdate(userId,{image : secureUrl.secure_url},{new : true})
        if(!updatedUser){
            return res.status(500).json({
                message : "Something went wrong",
                success : false
            })
        }
        updatedUser.password = undefined
        updatedUser.__v = undefined
        return res.status(200).json({
            image : secureUrl.secure_url,
            success : true,
            message : "Image updated successfully",
            user : updatedUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Error occured while updating User details",
            success : false
        })
    }
})

export default userRoute