import { apiConneector } from "../apiConnector";
import { profileEndPoints } from "../api";
import { setUser } from "../../slices/profileSlice";
import { setLoading } from "../../slices/UIslice";
import toast from "react-hot-toast";

export const updateProfileDetail = (data) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const res = await apiConneector("post", profileEndPoints.updatePofile, data);
            if (res?.data?.success) {                
                dispatch(setUser(res?.data?.data))
                toast.success(res?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
        dispatch(setLoading(false));
    };
}