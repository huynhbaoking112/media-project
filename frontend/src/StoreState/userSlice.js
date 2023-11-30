import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    user:{},
    allTimeLine:[]
}


export const userSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        login:(state,action)=>{
             state.user=action.payload
        },
        logout:(state)=>{
            state.user={}
        },
        unfollow:(state,action)=>{
            const cutItem=state.user.followins[action.payload]
             state.user.followins = state.user.followins.filter((item)=>item!=cutItem)
        },
        following:(state,action)=>{
            state.user.followins.push(action.payload)
        },
        setAllTimeLine:(state,action)=>{
            state.allTimeLine=action.payload
            state.allTimeLine.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
        },
        sharePost:(state,action)=>{
            state.allTimeLine.unshift(action.payload)
            state.allTimeLine.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
        }
    }
})

export const {login,logout,unfollow,following,setAllTimeLine,sharePost}=userSlice.actions

export default userSlice.reducer