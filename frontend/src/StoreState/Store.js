import { configureStore } from '@reduxjs/toolkit'
import userSliceReducer from "./userSlice"

const store=configureStore({
    reducer:{
        auth:userSliceReducer
    }
})


export default store