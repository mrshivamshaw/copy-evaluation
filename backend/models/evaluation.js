import mongoose, { mongo } from "mongoose";

const EvaluationSchema = mongoose.Schema({
    // Teacher who is conducting the evaluation
    evaluatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Total marks obtained
    totalMarks: {
        type: Number,
        default: 0,
        min: 0
    },

    //evaluated for
    evaluatedFor: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },

    // Maximum possible marks
    maxMarks: {
        type: Number,
        required: true
    },

     // Dynamic questions structure
    questions: [{
        questionNum: {
        type: Number,
        required: true
        },
        marks: {
        type: Number,
        default: 0,
        min: 0
        },
        maxMarks: {
        type: Number,
        required: true
        },
        isAttempted: {
        type: Boolean,
        default: false
        }
    }],

    // Metadata about the evaluation process
    metadata: {
        startTime: {
        type: Date,
        default: Date.now
        },
        submissionTime: Date,
        guidelines: String,
        currentPage: {
        type: Number,
        default: 1
        },
        totalPages: {
        type: Number,
        required: true
        }
    },
})

export default mongoose.model("Evaluation",EvaluationSchema)