const BASE_URL = "http://localhost:3000/api/v1";
// const BASE_URL = "https://codegyaan2.onrender.com/api/v1";

//authentication endpoints
export const authEndPoints = {
    sendOTP : `${BASE_URL}/auth/sendOTP`,
    login : BASE_URL + "/auth/login",
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