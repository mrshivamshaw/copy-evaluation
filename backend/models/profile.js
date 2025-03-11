import mongoose from "mongoose";

const ProfileSchema = mongoose.Schema({
    semester:{
        type:Number,
        required:true,
        min:1,
        max:8,
        default:1
    },
    studentId : {
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
        
    },
    contactNumber:{
        type:String,
        // requied:true,
        trim:true
    }
})

export default mongoose.model("Profile",ProfileSchema)