import { Router } from "express";
import { auth, isStudent } from "../middlewares/auth.js";
import { fetchSubject } from "../controllers/subjectController/student.subject.js";
import { addSubmission } from "../controllers/subjectController/student.submission.js";
import { getStudentScoresByStudentId } from "../controllers/evaluationController/student.evaluation.js";

const studentRoute = Router();

studentRoute.get('/fetch-subject',auth,isStudent,fetchSubject)
studentRoute.post('/add-submission/:subjectId',auth,isStudent,addSubmission)
studentRoute.post('/add-submission/:subjectId',auth,isStudent,addSubmission)
studentRoute.get('/submission-scores',auth,isStudent,getStudentScoresByStudentId)

export default studentRoute