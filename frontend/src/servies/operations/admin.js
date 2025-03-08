import { apiConneector } from "../apiConnector";
import { adminEndpoints } from "../api";
import { setAssignedSubjectList, setSubjectList } from "../../slices/adminSlice";
import { setLoading } from "../../slices/UIslice";
import toast from "react-hot-toast";

export const getSubjectList = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConneector("get", adminEndpoints?.getSubjectList);
      if (res?.data?.success) {
        dispatch(setSubjectList(res?.data?.data)); // Assuming API returns { success: true, subjects: [...] }
      }
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      toast.error("Failed to load subjects");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const addSubject = (data) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConneector("post", adminEndpoints.addSubject, data);
      if (res?.data?.success) {
        dispatch(setSubjectList(res?.data?.data)); // Update list with new subject
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add subject");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deleteSubject = (id) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConneector("delete", adminEndpoints.deleteSubject+"/" + id);
      if (res?.data?.success) {
        dispatch(setSubjectList(res?.data?.subjects)); // Update list without deleted subject
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete subject");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const assignSubject = (data) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConneector("post", adminEndpoints.assignSubject, data);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        dispatch(setAssignedSubjectList(res?.data?.data));
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to assign subject");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const unassignSubject = (data) => {
  console.log(data);
  
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConneector("post", adminEndpoints.deleteAssignSubject, data);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        dispatch(setAssignedSubjectList(res?.data?.data));
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to unassign subject");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getAssignedSubjectList = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConneector("get", adminEndpoints?.getAssignedSubject);
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