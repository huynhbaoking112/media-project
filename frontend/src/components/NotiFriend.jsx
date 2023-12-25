import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { chapnhanketban,tuchoiketban } from '../StoreState/userSlice'
import axios from 'axios'
import anh from "../asset/user2.jpg"
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom'

const NotiFriend = ({id,HandleSetOpenFriend}) => {
    const currentUser=useSelector((state)=>state.auth.user)
    const socket=useSelector((state)=>state.auth.socket)
    const dispatch=useDispatch()
    const [user,setUser]=useState()
    const navigate=useNavigate()

    const fetchUser=async()=>{
        try {
            const res=await axios.get("http://localhost:8000/api/user?userId=" + id)
            setUser(res.data.user)
        } catch (error) {
            console.log(error);
        }
    }

    const HandleNotAccept=()=>{
        //xu li ca nhan
        dispatch(tuchoiketban(user?._id))
        HandleSetOpenFriend(false)
        //xu li database
        socket.emit("khongchapnhan",{userId:currentUser._id,friendId:user?._id})
        //xu li friend
    }

    const HandleAccept=()=>{
        socket.emit("chapnhanketban",{userId:currentUser._id,userFriendId:user?._id})
        dispatch(chapnhanketban(user?._id))
        HandleSetOpenFriend(false)
        toast.success("Kết bạn thành công!", { position: toast.POSITION.TOP_RIGHT });
       navigate("/userprofile/"+user?._id)
    }

    useEffect(()=>{
        fetchUser()
    },[])
  return (
    <div className='h-full items-center flex bg-slate-300 w-full '>
        <div className='ml-2 ' >
            <img className='w-[60px] h-[60px] object-cover rounded-full ' src={user?.profilePicture?user?.profilePicture:anh} />
        </div>
        <div className='w-full flex gap-2 h-full py-2 pl-[15px] flex-col' >
            <p><span className='font-[600]'>{user?.username}</span> muốn kết bạn🙋‍♂️</p>
            <div className='flex w-full items-center justify-start gap-1' >
            <div className='rounded-sm bg-gray-600 text-white px-2 py-[2px] hover:cursor-pointer hover:scale-105 duration-300' onClick={HandleAccept} >Chấp nhận </div>
            <div className='rounded-sm bg-gray-600 text-white px-2 py-[2px] hover:cursor-pointer hover:scale-105 duration-300' onClick={HandleNotAccept} >Từ chối</div>
            </div>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default NotiFriend