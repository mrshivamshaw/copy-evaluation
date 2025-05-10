import Profile from "../models/profile.js";
import user from "../models/user.js";

export const updateProfile = async  (req,res)  =>  {
    try {
        const {firstName,lastName,contactNumber,email,department,semester} = req.body
        const id = req.user.id

        if(!id){
            return res.status(400).json({
                success : false,
                message : "id not fond"
            })
        }

        //find the user in user schema
        const userDetails = await user.findById(id)

        if(!userDetails){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        userDetails.firstName = firstName
        userDetails.lastName = lastName
        userDetails.email = email

        await userDetails.save()

        
        
        const profileId = userDetails.additionalDetails
        
        //find profile
        let profile = await Profile.findById(profileId)
        if(!profile){
            profile = await Profile.create({
                studentId: id,
                semester: semester,
                department: department,
                contactNumber: contactNumber
            })
        }
        else{
            //update profile
            profile.semester = semester
            profile.department = department
            profile.contactNumber = contactNumber
            await profile.save()
        }
        // console.log(userDetails);

        const userData = await user.findById(id).populate("additionalDetails");
        userData.password = undefined
        

        return res.status(200).json({
            success:true,
            message:"profile updated successfully",
            data: userData
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"profile updated Unsuccessfully",
        })
    }
}


//delete Account
export const deleteAccount = async(req,res) => {
    try {
        //get the user
        const userId = req.user.id

        //validate user
        const user = await user.findById(userId)
        if(!userId){
            return res.status(400).json({
                success : false,
                message : "id not fond"
            })
        }

        //find profile
        await Profile.findByIdAndDelete({_id:user.additionalDetails})
        await user.findByIdAndDelete({_id:userId})
        return res.status(200).json({
            success:true,
            message:"account deleted successfully",
        })
        
    } catch (error) {
        return res.status(500).json({
            success:flse,
            message:"account delted Unsuccessfully",
        })
    }
}