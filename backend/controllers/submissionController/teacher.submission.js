import Subject from "../../models/subject.js";
import User from '../../models/user.js'
import Submission from "../../models/submission.js";
import Evaluation from "../../models/evaluation.js";

export const fetchAssignedSubject = async(req,res) => {
    try {
        const id = req.user.id;
        if(!id){
            return res.status(400).json({
                message: "Something went wrong",
                success : false
            })
        }

        const techer = await User.findById({_id:id});
        if(!techer){
            return res.status(404).json({
                message: "No teacher found",
                success : false
            })
        }

        //find subjects in which the teacher is assigned and include teacher assigned
        const subjectAssigned = await Subject.find({ teacherAssigned: { $in: [id] } }).select("-teacherAssigned"); // Exclude teacherAssigned field;
        // console.log(subjectAssigned);
        
        if(subjectAssigned.length == 0){
            return res.status(400).json({
                message: "No Subject Assigned",
                success : false
            })
        }

        const allSubject = await Promise.all(
            subjectAssigned.map(async (sub) => {
                const allStudent = await Submission.find({ subjectId: sub?._id })
                    .populate("studentId") // Populate student details
                    .lean(); // Convert Mongoose objects to plain JSON
        
                // Fetch evaluations for all submissions in this subject
                const submissionIds = allStudent.map((sub) => sub._id);
                const evaluations = await Evaluation.find({ submissionId: { $in: submissionIds } }).lean();
                
                // Attach evaluation status inside studentId
                const updatedSubmissions = allStudent.map((submission) => {
                    const evaluation = evaluations.find((e) => String(e.submissionId) === String(submission._id));
                    return {
                        ...submission,
                        studentId: {
                            ...submission.studentId,
                            evaluated: evaluation ? evaluation : "pending", // Mark as 'completed' if evaluation exists
                        },
                    };
                });
        
                return { ...sub.toObject(), submission: updatedSubmissions };
            })
        );
        

        // console.log(allSubject);
        
        
        return res.status(200).json({
            message : "Subject fetched successfully",
            success: true,
            data : allSubject
        })
    } catch (error) {
        console.log("Error while fetching subject : ", error);
        return res.status(400).json({
            message: "Error while fetching subject",
            success : false
        })
    }
}



// export const fetchAssignedSubjectAndSubmissionEvaluated = async(req,res) => {
//     try {
//         const id = req.user.id;
//         if(!id){
//             return res.status(400).json({
//                 message: "Something went wrong",
//                 success : false
//             })
//         }

//         const techer = await User.findById({_id:id});
//         if(!techer){
//             return res.status(400).json({
//                 message: "No teacher found",
//                 success : false
//             })
//         }

//         //find subject in which the teacher is assigned
//         const subjectAssigned = await Subject.find({ teacherAssigned: { $in: [id] } });

//         if(subjectAssigned.length == 0){
//             return res.status(400).json({
//                 message: "No Subject Assigned",
//                 success : false
//             })
//         }

//         // Fetch submissions for each subject
//         const allSubject = (
//             await Promise.all(
//                 subjectAssigned.map(async (sub) => {
//                     const allStudent = await Submission.find({ subjectId: sub._id, evaluated: "completed" }).populate(
//                         "studentId"
//                     );
//                     if (allStudent.length === 0) return null;
//                     return { ...sub.toObject(), submission: allStudent }; // Convert to object & add submissions
//                 })
//             )
//         ).filter((sub) => sub !== null); // Remove null values
        
//         return res.status(200).json({
//             message : "Subject fetched successfully",
//             success: true,
//             data : allSubject
//         })
//     } catch (error) {
//         console.log("Error while fetching subject : ", error);
//         return res.status(400).json({
//             message: "Error while fetching subject",
//             success : false
//         })
//     }
// }