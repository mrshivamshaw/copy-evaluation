import mongoose from "mongoose";

const submissionSchema = mongoose.Schema({
    subjectId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subject",
        required : true,
    },
    studentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    pdfLink : {
        type : String,
        required : true
    },
    evaluated : {
        type : String,
        required : true,
        enum : ["pending","completed"],
        default : "pending"
    },
    submissiondate : {
        type : Date,
        default : Date.now
    }
})

export default mongoose.model("Submission",submissionSchema)