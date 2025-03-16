import Evaluation from "../../models/evaluation.js";
import Submission from "../../models/submission.js";
import mongoose from "mongoose";
import { uploadPdf } from "../../utils/pdfUploader.js";

// Get evaluation details by submission ID
export const getEvaluationBySubmissionId = async (req, res) => {
  try {
    const { id } = req.params;

    // // Validate ID format
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid submission ID format" });
    // }

    // Find submission first to check if it exists
    const submission = await Submission.findById(id).populate("subjectId").populate("studentId");
    
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Find evaluation for this submission
    const evaluation = await Evaluation.findOne({ submissionId: id });
    
    if (!evaluation) {
      // If no evaluation exists, return submission data with default values
      const subject = submission.subjectId._id;
      
      return res.status(200).json({
        isNewEvaluation: true,
        submission,
        subject,
        evaluation: {
          sections: [
            {
              id: "1",
              name: "Section 1",
              questions: [
                { id: "1.1", number: "I", marks: "", maxMarks: "1", notAttempted: false },
                { id: "1.2", number: "II", marks: "", maxMarks: "1", notAttempted: false },
                { id: "1.3", number: "III", marks: "", maxMarks: "1", notAttempted: false },
              ],
            },
          ],
          totalMarks: 0,
          maxMarks: 3,
          metadata: {
            currentPage: 1,
            totalPages: 22, // Default value, should be determined based on the PDF
            startTime: new Date(),
          }
        }
      });
    }

    // Format the questions data to match frontend expectations
    const formattedSections = formatQuestionsToSections(evaluation.questions);
    
    // Return the existing evaluation data
    return res.status(200).json({
      isNewEvaluation: false,
      submission,
      evaluation: {
        ...evaluation._doc,
        sections: formattedSections,
      }
    });

  } catch (error) {
    console.error("Error fetching evaluation:", error);
    return res.status(500).json({ message: "Server error while fetching evaluation", error: error.message });
  }
};

// Helper function to convert the database question format to frontend section format
const formatQuestionsToSections = (questions) => {
  const sections = {};
  
  // Group questions by their section (derived from questionNum)
  questions.forEach(q => {
    // Extract section number (e.g., for question 1.2, section is 1)
    const questionParts = String(q.questionNum).split('.');
    const sectionId = questionParts[0];
    const questionNumber = questionParts.length > 1 ? questionParts[1] : q.questionNum;
    
    if (!sections[sectionId]) {
      sections[sectionId] = {
        id: sectionId,
        name: `Section ${sectionId}`,
        questions: []
      };
    }
    
    sections[sectionId].questions.push({
      id: String(q.questionNum),
      number: questionNumber,
      marks: String(q.marks),
      maxMarks: String(q.maxMarks),
      notAttempted: !q.isAttempted
    });
  });
  
  // Convert to array and sort by section ID
  return Object.values(sections).sort((a, b) => Number(a.id) - Number(b.id));
};

// Helper function to convert frontend section format to database question format
const formatSectionsToQuestions = (sections) => {
  if (!Array.isArray(sections)) {
    try {
      sections = JSON.parse(sections);
    } catch (e) {
      console.error("Invalid sections data:", sections);
      return []; // Return an empty array to prevent crashes
    }
  }

  return sections.flatMap(section =>
    section.questions.map(q => ({
      questionNum: parseFloat(q.id),
      marks: q.notAttempted ? 0 : Number(q.marks) || 0,
      maxMarks: Number(q.maxMarks) || 1,
      isAttempted: !q.notAttempted
    }))
  );
};


// Save evaluation (partial save)
export const saveEvaluation = async (req, res) => {
  try {
    const { id } = req.params; // submissionId
    const { sections, totalMarks, maxMarks, currentPage } = req.body;
    const teacherId = req.user.id; // Assuming authentication middleware sets req.user
    
    // Validate submission ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid submission ID format" });
    }
    
    // Find the submission
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    
    // Convert sections to questions format for database
    const questions = formatSectionsToQuestions(sections);
    
    // Check if evaluation already exists
    let evaluation = await Evaluation.findOne({ submissionId: id });
    
    if (evaluation) {
      // Update existing evaluation
      evaluation.questions = questions;
      evaluation.totalMarks = Number(totalMarks);
      evaluation.maxMarks = Number(maxMarks);
      evaluation.metadata.currentPage = currentPage;
      
      await evaluation.save();
    } else {
      // Create new evaluation
      evaluation = new Evaluation({
        evaluatedBy: teacherId,
        submissionId: id,
        evaluatedFor: submission.studentId,
        totalMarks: Number(totalMarks),
        maxMarks: Number(maxMarks),
        questions,
        metadata: {
          startTime: new Date(),
          currentPage,
          totalPages: 22 // Should be determined by the PDF
        }
      });
      
      await evaluation.save();
    }
    
    return res.status(200).json({ 
      message: "Evaluation saved successfully", 
      evaluationId: evaluation._id 
    });
    
  } catch (error) {
    console.error("Error saving evaluation:", error);
    return res.status(500).json({ message: "Server error while saving evaluation", error: error.message });
  }
};

// Submit final evaluation
export const submitEvaluation = async (req, res) => {
  try {
    const { id } = req.params; // submissionId
    const { sections, totalMarks, maxMarks } = req.body;
    // console.log(req.body);
    
    const pdfFile = req.files.pdf;
    // console.log(req.files.pdf);
    
    const teacherId = req.user.id; // Assuming authentication middleware sets req.user
    
    // Validate submission ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid submission ID format" });
    }
    
    // Find the submission
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    const result = await uploadPdf(pdfFile);
    submission.pdfLink = result.secure_url;
    await submission.save();
    // Convert sections to questions format for database
    const questions = formatSectionsToQuestions(sections);
    
    // Check if evaluation already exists
    let evaluation = await Evaluation.findOne({ submissionId: id });
    
    if (evaluation) {
      // Update existing evaluation
      evaluation.questions = questions;
      evaluation.totalMarks = Number(totalMarks);
      evaluation.maxMarks = Number(maxMarks);
      evaluation.metadata.submissionTime = new Date();
      
      await evaluation.save();
    } else {
      // Create new evaluation
      evaluation = new Evaluation({
        evaluatedBy: teacherId,
        submissionId: id,
        evaluatedFor: submission.studentId,
        totalMarks: Number(totalMarks),
        maxMarks: Number(maxMarks),
        questions,
        metadata: {
          startTime: new Date(),
          submissionTime: new Date(),
          totalPages: 22 // Should be determined by the PDF
        }
      });
      
      await evaluation.save();
    }
    
    // Update submission status to "completed"
    submission.evaluated = "completed";
    await submission.save();
    
    return res.status(200).json({ 
      message: "Evaluation submitted successfully", 
      evaluationId: evaluation._id 
    });
    
  } catch (error) {
    console.error("Error submitting evaluation:", error);
    return res.status(500).json({ message: "Server error while submitting evaluation", error: error.message });
  }
};