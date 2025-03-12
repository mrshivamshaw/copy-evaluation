import { getSubjectList } from "./operations/admin";

const BASE_URL = "http://localhost:3000/api/v1";
// const BASE_URL = "https://codegyaan2.onrender.com/api/v1";

//authentication endpoints
export const authEndPoints = {
    sendOTP : `${BASE_URL}/auth/sendOTP`,
    login : BASE_URL + "/auth/login",
    logout : BASE_URL + "/auth/logout",
    signup : `${BASE_URL}/auth/singup`,
    resetPassword : `${BASE_URL}/auth/resetPassword`,
    resetPassToken : `${BASE_URL}/auth/resetPassToken`,
    checkToken : `${BASE_URL}/auth/checkToken`,
}

//user endpoints
export const profileEndPoints = {
    profile : `${BASE_URL}/user/profile`,
    updatePic : `${BASE_URL}/user/updatePic`,
    updatePofile : `${BASE_URL}/user/updateProfile`,
}

//admin endpoints
export const adminEndpoints = {
    addSubject : `${BASE_URL}/admin/add-subject`,
    getSubjectList : `${BASE_URL}/admin/get-subject-list`,
    deleteSubject : `${BASE_URL}/admin/delete-subject`,
    getAssignedSubject : `${BASE_URL}/admin/assign-subject`,
    assignSubject : `${BASE_URL}/admin/assign-subject`,
    deleteAssignSubject : `${BASE_URL}/admin/delete-assign-subject`,
}

//teacher endpoints
export const teacherEndpoints = {
    fetchAssignedSubject : `${BASE_URL}/teacher/fetch-subject`,
    getEvaluationData : `${BASE_URL}/teacher/evaluation-data/`,
    saveEvaluation : `${BASE_URL}/teacher/evaluate-submission-save/`,
    submitEvaluation : `${BASE_URL}/teacher/evaluate-submission-submit/`,
}

//student endpoints
export const studentEndpoints = {
    fetchSubject : `${BASE_URL}/student/fetch-subject`,
    addSubmission : `${BASE_URL}/student/add-submission/`,
    getScores: `${BASE_URL}/student/submission-scores`,
}