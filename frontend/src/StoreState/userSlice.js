import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    user:{},
    allTimeLine:[],
    socket:{},
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
        },
        addSocket:(state,action)=>{
            state.socket=action.payload
        },
        deletePost:(state,action)=>{
            state.allTimeLine=state.allTimeLine.filter((e)=>e._id!=action.payload)
        },
        chochapnhan:(state,action)=>{
            state.user.waitAcceptUser.push(action.payload)
        },
        huycho:(state,action)=>{
            state.user.waitAcceptUser=state.user.waitAcceptUser.filter((e)=>e!=action.payload)
        },
        chapnhanketban:(state,action)=>{
            state.user.acceptUser=state.user.acceptUser.filter((e)=>e.id!=action.payload)
            state.user.friends.push(action.payload)
        },
        duocchapnhan:(state,action)=>{
            state.user.waitAcceptUser=state.user.waitAcceptUser.filter((e)=>e.id!=action.payload)
            state.user.friends.push(action.payload)
        },
        tuchoiketban:(state,action)=>{
            state.user.acceptUser=state.user.acceptUser.filter((e)=>e.id!=action.payload)
        },
        xulikhongchapnhan:(state,action)=>{
            state.user.waitAcceptUser=  state.user.waitAcceptUser.filter((e)=>e.id!=action.payload)
        }
    }
})

export const {xulikhongchapnhan,tuchoiketban,duocchapnhan,chapnhanketban,huycho,chochapnhan,deletePost,login,logout,unfollow,following,setAllTimeLine,sharePost,addSocket}=userSlice.actions

export default userSlice.reducer