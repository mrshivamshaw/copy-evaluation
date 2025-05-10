import {Router} from 'express'
import { auth, isAdmin } from '../middlewares/auth.js';
import { addSubject, assignTeacherToSubject, deleteSubject, fetchAssingedTeacher, fetchSubjectListForAdmin, removeAssignedTecher, suggestTeacherEmail } from '../controllers/subjectController/admin.subject.js';

const adminRoute = Router();

adminRoute.post('/add-subject',auth,isAdmin,addSubject)
adminRoute.get('/get-subject-list',auth,isAdmin,fetchSubjectListForAdmin)
adminRoute.delete('/delete-subject/:id',auth,isAdmin,deleteSubject)
adminRoute.post('/assign-subject',auth,isAdmin,assignTeacherToSubject)
adminRoute.get('/assign-subject',auth,isAdmin,fetchAssingedTeacher)
adminRoute.post('/delete-assign-subject',auth,isAdmin,removeAssignedTecher)
adminRoute.post('/get-emails',auth,isAdmin,suggestTeacherEmail)


export default adminRoute