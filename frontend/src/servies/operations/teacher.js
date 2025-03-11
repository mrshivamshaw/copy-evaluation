import { apiConneector } from "../apiConnector";
import { teacherEndpoints } from "../api";
import { setLoading } from "../../slices/UIslice";
import toast from "react-hot-toast";
import { setAssignedSubjectList } from "../../slices/teacherSlice";


export const getAssignedSubjectList = () => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const res = await apiConneector("get", teacherEndpoints?.fetchAssignedSubject);
            if (res?.data?.success) {
                toast.success(res?.data?.message);
                dispatch(setAssignedSubjectList(res?.data?.data));
            }
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
            toast.error("Failed to load subjects");
        } finally {
            dispatch(setLoading(false));
        }
    };
};