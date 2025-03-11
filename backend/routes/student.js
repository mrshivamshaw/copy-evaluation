import { Router } from "express";
import { auth, isStudent } from "../middlewares/auth.js";
import { fetchSubject } from "../controllers/subjectController/student.subject.js";
import { addSubmission } from "../controllers/subjectController/student.submission.js";

const studentRoute = Router();

studentRoute.get('/fetch-subject',auth,isStudent,fetchSubject)
studentRoute.post('/add-submission/:subjectId',auth,addSubmission)

export default studentRoute