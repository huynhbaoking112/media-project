import React, { useEffect, useState } from 'react'
import Share from './Share'
import Post from './Post'
import axios from 'axios'
import Sidebar from './Sidebar'
import Rightbar from './Rightbar'
import { useSelector,useDispatch } from 'react-redux'
import { addSocket, setAllTimeLine } from '../StoreState/userSlice'
import { io } from "socket.io-client";



const Feed = () => {
  
  const dispatch=useDispatch()
  const user=useSelector((state)=>state.auth.user)
  const timeline=useSelector((state)=>state.auth.allTimeLine)
  const [err,setErr]=useState(false)

  const fetchDataPost=async()=>{
    try {
       const res=await  axios.post("http://localhost:8000/api/post/allpost/timeline",{
        userId:user._id,
       },{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    dispatch(setAllTimeLine(res.data.data))
 
    } catch (error) {
      setErr(true)
    }
  }

  useEffect(()=>{
    const socket=io("ws://localhost:8000");
    dispatch(addSocket(socket))

    fetchDataPost()
  },[])

  return (
    <div className='w-full flex justify-between pb-5' >
      {/* <div className='' > */}
      <Sidebar />
      {/* </div> */}
                     
    <div className='flex flex-col w-[40%] gap-[35px] ' >
      <Share img={user.profilePicture} userId={user._id}/>
      {timeline.map((thePost,id)=>{
        return <Post key={id} desc={thePost.desc} likes={thePost.likes} img={thePost.img} userId={thePost.userId} createdAt={thePost.createdAt} _id={thePost._id} userShare={thePost.userShare}/>
      })}
    </div>
      <Rightbar />
    </div>
  )
}

export default Feed