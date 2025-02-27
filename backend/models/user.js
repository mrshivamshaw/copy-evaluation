import mongoose from "mongoose";

const userSchema =  mongoose.Schema({
    firstName : {
        type:String,
        required : true,
        trim : true,
    },
    lastName : {
        type:String,
        required : true,
        trim : true,
    },
    email:{
        type:String,
        required : true,
        trim : true,
    },
    password:{
        type:String,
        required:true,
        trim : true
    },
    gender:{
        type:String,
        enum:["Male","Female","Other"]
    },
    dob:{
        type:Date
    },
    contactNumber:{
        type:Number
    },
    about:{
        type:String
    },
    
    token:{
        type:String
    },
    accountType:{
        type:String,
        required:true,
        enum:["Instructor","Student","Admin"]
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },
    image:{
        type:String,
        required:true
    }
})

export default mongoose.model("User",userSchema)