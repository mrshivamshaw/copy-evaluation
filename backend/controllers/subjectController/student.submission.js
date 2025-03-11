import Submission from "../../models/submission.js";
import Subject from "../../models/subject.js";
import {uploadPdf} from "../../utils/pdfUploader.js";

export const addSubmission = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const file  = req.files.pdf;
        // console.log(req.files.pdf);
        
        if (!file) {
            return res.status(400).json({
                message: "No file found",
                success: false,
            });
        }
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(400).json({
                message: "Subject not found",
                success: false,
            });
        }
        const result = await uploadPdf(file);
        const submission = await Submission.create({
            subjectId,
            studentId: req.user.id,
            pdfLink: result.secure_url,
        });
        return res.status(200).json({
            message: "Submission added successfully",
            success: true,
            data: {
                id: submission._id,
                pdfLink: result.secure_url,
            }
        });
    
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error while adding submission",
        });
        
    }
};
