import mongoose from "mongoose";

const SubjectSchema = mongoose.Schema({
    name : {
        type : String,
        required: true,
    },
    code : {
        type : String,
        required: true,
    },
    semester : {
        type : Number,
        required: true,
    },
    teacherAssigned: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]
})

export default mongoose.model("Subject",SubjectSchema)