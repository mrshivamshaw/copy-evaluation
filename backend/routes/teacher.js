import { fetchAssignedSubject } from "../controllers/submissionController/teacher.submission.js";
import { Router } from "express";
import { auth, isTeacher } from "../middlewares/auth.js";

const teacherRoute = Router();

teacherRoute.get('/fetch-subject',auth,isTeacher,fetchAssignedSubject)

export default teacherRoute