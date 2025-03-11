import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    evaluatedSubjectList: [],
    assignedSubjectList: [],
};

const teacherSlice = createSlice({
    initialState,
    name: "teacher",
    reducers: {
        setEvaluatedSubjectList(state, action) {
            state.evaluatedSubjectList = action.payload;
            console.log(state.evaluatedSubjectList);
            
        },
        setAssignedSubjectList(state, action) {
            state.assignedSubjectList = action.payload;
        },
    },
});

export const {setEvaluatedSubjectList,setAssignedSubjectList} = teacherSlice.actions
export default teacherSlice.reducer