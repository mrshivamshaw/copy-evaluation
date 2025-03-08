import { apiConneector } from "../apiConnector";
import { authEndPoints } from "../api";
import { toast } from "react-hot-toast";
import { setToken } from "../../slices/authSlice";
import { setAccountType, setUser } from "../../slices/profileSlice";
import { setLoading } from "../../slices/UIslice";

export const login = (email, password, navigate) => {
  return async (dispatch) => {
      dispatch(setLoading(true));
      try {
          const res = await apiConneector("post", authEndPoints.login, { email, password })
          if(res?.data?.success == true){
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", res.data.user);
            localStorage.setItem("id", res.data.user._id)
            dispatch(setToken(res?.data?.token));
            dispatch(setUser(res?.data?.user));
            dispatch(setAccountType(res?.data?.user?.accountType))
            toast.success("Login Successful");
            dispatch(setLoading(false));
            res?.data?.user?.accountType == "admin" ? navigate('/admin/dashboard') :  res?.data?.user?.accountType == "teacher" ? navigate('/teacher/dashboard') : navigate('/student/dashboard')
            dispatch(setLoading(false));
            return true
          }
          dispatch(setLoading(false));
          toast.error(res?.data?.message);
          return false
      } catch (error) {
          toast.error(error?.response?.data?.message);
          dispatch(setLoading(false));
          return false
    }
  };
};

export const checkToken = async() => {
  
    try {
      const res = await apiConneector("get", authEndPoints.checkToken,null,
        {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      );
      if (res?.data?.success) {
        // toast.success(res?.data?.message);
        // console.log("true");
        return true
      } else {
        toast.error(res?.data?.message);
        // console.log(res);
        return false
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return false
    }
  
}

export const logout = () => {
  return async (dispatch) => {
    try {
      // Make a request to backend logout endpoint
      // No need to specify withCredentials again
      await apiConneector("POST", authEndPoints.logout, null);
      
      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("accountType");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      
      // Update Redux state
      dispatch(setUser(null));
      dispatch(setAccountType(null));
      dispatch(setToken(null));
      
    } catch (error) {
      console.log("Logout error:", error);
      // Still clear client-side data even if server request fails
      localStorage.removeItem("user");
      localStorage.removeItem("accountType");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      
      dispatch(setUser(null));
      dispatch(setAccountType(null));
      dispatch(setToken(null));
    }
  };
};

// export const sendOtp = (email, navigate, changeField) => {
//   return async (dispatch) => {
//     dispatch(setLoading(true));
//     try {
//       const res = await apiConneector("post", authEndPoints.sendOTP, { email });
//       // console.log(res.data);
//       if (res?.data?.success) {
//         dispatch(setSignupData(changeField));
//         navigate("/verify-email");
//         toast.success(res?.data?.message);
//       } else {
//         toast.error(res?.data?.message);
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//     }
//     dispatch(setLoading(false));
//   };
// };

export const signup = (data, navigate) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConneector("post", authEndPoints.signup, {
        ...data,
      });
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        navigate("/login");
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }

    dispatch(setLoading(false));
  };
};
