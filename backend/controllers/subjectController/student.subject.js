import Subject from "../../models/subject.js";
import Submission from "../../models/submission.js";
import User from "../../models/user.js";


export const fetchSubject = async(req,res) => {
    try {
        const id = req.user.id;
        if(!id){
            return res.status(400).json({
                message: "Something went wrong",
                success : false
            })
        }

        const student = await User.findById({_id:id}).populate("additionalDetails");
        if(!student){
            return res.status(404).json({
                message: "No student found",
                success : false
            })
        }
        

        //find subject according to student's semester
        const subjects = await Subject.find({semester: student?.additionalDetails?.semester});
        if(subjects.length == 0){
            return res.status(400).json({
                message: "No Subject found",
                success : false
            })
        }

        //make a new array of subjects with submission details
        const allSubject = [];
        for (let i = 0; i < subjects.length; i++) {
            const sub = subjects[i];
            const subId = sub._id;
            const submissionDetails = await Submission.findOne({subjectId: subId, studentId: id});
            const subDetails = {subject : sub, submission:  submissionDetails};
            allSubject.push(subDetails);
        }

        return res.status(200).json({
            data : allSubject.length == 1 ? [allSubject[0]] : allSubject,
            message: "Subjects fetched successfully",
            success : true
        })
    } catch (error) {
        console.log("Error while fetching subjects : ", error);
        return res.status(400).json({
            message: "Error while fetching Subjects",
            success : false
        })
    }
}
