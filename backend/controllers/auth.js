import User from "../models/user.js";
import Profile from '../models/profile.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config as configDotenv } from "dotenv";

configDotenv()


//sign up
export const signup = async (req,res) =>{

    try {
        //fetching all the details requied
        const {
            firstName,
            lastName,
            password,
            confirmPassword,
            email,
            accountType,
            contactNumber,
        } = req.body;
        // console.log(req.body);
        //all fields must be filled
        if(!firstName || !lastName || !password || !confirmPassword || !email || !accountType  ){
            return res.status(401).json({
                success : false,
                message : "Please fill all the feilds"
            })
        }

        //vaildating that the user already exists or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success : false,
                message : "User already exists"
            })
        }

        //check password and confirmPassword
        if(password !== confirmPassword){
            return res.status(401).json({
                success : false,
                message : "password not matched"
            })
        }

        //hash password
        const hashedPassword = bcrypt.hash(password,10)
        const finalPass = (await hashedPassword).toString()

        const user = await User.create({
            firstName,
            lastName,
            email,
            password : finalPass,
            contactNumber,
            accountType,
            image:`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`
        })

        let profileDetails
        if(accountType == "student"){
            profileDetails = await Profile.create({
                semester : req?.body?.semester,
                department : req?.body?.department,
                contactNumber : req?.body?.contactNumber,
                studentId : user?._id
            })
        }

        const updateUser = await User.findOneAndUpdate(
            {_id : user._id},
            {
                $set : {
                    additionalDetails : profileDetails?._id
                }
            },
            {new : true}
        )
        //retur response
        return res.status(200).json({
            success:true,
            message:"user registered successfully",
        })
    } catch (error) {
        console.log("Error while registerinf user : ",error);
        return res.status(500).json({
            success:false,
            message:"user not registered successfully",
            
        })
        
    }
}


export const login = async (req,res) =>{
    try {
        //fetch data
        const {email,password} = req.body;

        //check that filled or not
        if(!email || !password){
            return res.status(400).json({
                message:"Fill the details correctly",
                success:false
            })
        }

        //check that user exist or not
        const user = await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found",
            })
        }

        //check password is correct or not
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                role:user.role
            }

            //create jwt token
            const Token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"3d"
            })

            user.token = Token
            user.password = undefined

            //create cookie and then send response
            const options = {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly:true,
                secure: process.env.NODE_ENV === 'production', // Only secure in production
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            }

            //send cookie
            res.cookie("token",Token,options).status(200).json({
                success : true,
                token:Token,
                user : user,
                message:"User loged in successfully"
            })
        }
        else{
            res.status(500).json({
                success : false,
                message:"password is incorrect",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message:"Error while loging user",
        })
    }
}


//change password
export const changePassword = async (req,res) =>{
    try {
            //get oldpass, newpass, confirmpass
            const {oldPass,newPass,confirmPass,email,user} = req.body


            //check the validation

            //check the last password
            if(user.password !== oldPass){
                return res.status(500).json({
                    success : false,
                    message:"Old password not matched",
                })
            }

            
            //check the newPass and confirmpass
            if(newPass !== confirmPass){
                return res.status(500).json({
                    success : false,
                    message:"Password not matched",
                })
            }

            //upadate pass in db
            const updatedPass = await User.findByIdAndUpdate({_id})

            //send a confirmation mail
            mailSender(email,"Skill Safari","OTP updated successfully")
            //send res 
            res.status(200).json({
                success : true,
                message:"Password updated successfully",
            })
    } catch (error) {
        
    }
}

export const logout = async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        // sameSite: "None",
        // path: "/"
      });
      
      return res.status(200).json({
        success: true,
        message: "Logged out successfully"
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error while logging out"
      });
    }
  };