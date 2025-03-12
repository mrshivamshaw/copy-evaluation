import submission from "../../models/submission.js";
import subject from "../../models/subject.js";
import evaluation from "../../models/evaluation.js";


export const getStudentScoresByStudentId = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Find the evaluation where the student is the studentId 
        const scores = await evaluation
            .find({ evaluatedFor: studentId }, { submissionId: 1, totalMarks: 1, maxMarks: 1, metadata : 1 })
            .populate({
                path: "submissionId",
                populate: [
                { path: "subjectId" }  // Populate subject details
                ]
            });


        return res.status(200).json({
            success: true,
            message : "Scores fetched successfully",
            scores
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message : "Scores fetched unsuccessfully",
        });
    }
}