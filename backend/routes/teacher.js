import { fetchAssignedSubject } from "../controllers/submissionController/teacher.submission.js";
import { Router } from "express";
import { auth, isTeacher } from "../middlewares/auth.js";
import { getEvaluationBySubmissionId, saveEvaluation, submitEvaluation } from "../controllers/evaluationController/teacher.evaluation.js";

const teacherRoute = Router();

//fetch subject details
teacherRoute.get('/fetch-subject',auth,isTeacher,fetchAssignedSubject)

//evaluate submission
teacherRoute.get('/evaluation-data/:id',auth,isTeacher,getEvaluationBySubmissionId)
teacherRoute.post('/evaluate-submission-save/:id',auth,isTeacher,saveEvaluation)
teacherRoute.post('/evaluate-submission-submit/:id',auth,isTeacher,submitEvaluation)

export default teacherRoute