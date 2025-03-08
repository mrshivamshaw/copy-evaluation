import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    subjectList : [],
    assignedSubjectList : []
}

const adminSlice = createSlice({
    initialState,
    name : "admin",
    reducers : {
        setSubjectList(state,action){
            state.subjectList = action.payload
                
        },
        setAssignedSubjectList(state,action){
            state.assignedSubjectList = action.payload
        },
    }
})

export const {setAssignedSubjectList,setSubjectList} = adminSlice.actions
export default adminSlice.reducer