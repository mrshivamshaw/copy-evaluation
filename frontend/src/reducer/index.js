import {combineReducers} from '@reduxjs/toolkit'
import authSlice from '../slices/authSlice'
import UIslice from '../slices/UIslice'
import profileSlice from '../slices/profileSlice'
import adminSlice from '../slices/adminSlice'


const rootReducer = combineReducers({
    auth : authSlice,
    ui : UIslice,
    profile : profileSlice,
    admin : adminSlice
})

export default rootReducer