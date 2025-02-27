import {combineReducers} from '@reduxjs/toolkit'
import authSlice from '../slices/authSlice'
import UIslice from '../slices/UIslice'
import profileSlice from '../slices/profileSlice'


const rootReducer = combineReducers({
    auth : authSlice,
    ui : UIslice,
    profile : profileSlice,
})

export default rootReducer