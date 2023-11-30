import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import anh from "../asset/user2.jpg"
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';

const ChatTag = ({chat}) => {

    const user=useSelector((state)=>state.auth.user)
    const [theSender,setTheSender]=useState()
    const fetchTheSender=async()=>{
        try {
            const res=await axios.get("http://localhost:8000/api/user?userId="+chat?.sender)
            setTheSender(res.data.user);
         
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchTheSender()
      
    },[chat])

  return (
    <div >
        {
            user?._id==chat?.sender?<div className='flex gap-2 my-3  '  >
                <Link to={"/userprofile/"+theSender?._id} >
                <img src={theSender?.profilePicture?theSender?.profilePicture:anh} className="object-cover w-[50px] h-[50px] rounded-full " />
                </Link>
                <div className='flex flex-col gap-2 rounded-lg p-2 min-w-[110px] border-[1px] bg-blue-500 group/create ' >
                <p className='font-medium' >{theSender?.username}</p>
                <p  className='text-[20px]' >{chat?.text}</p>
                <p className='hidden group-hover/create:flex hover:cursor-pointer'>{format(chat?.createdAt)}</p>
                </div>
            </div>:<div className='flex gap-2  my-3  ' >
                <div className='flex flex-col ml-auto gap-2 min-w-[110px]    rounded-lg p-2 border-[1px] bg-gray-500 group/create' >
                <p className='font-medium ' >{theSender?.username}</p>
                <p  className='text-[20px]' >{chat.text}</p>
                <p className='hidden group-hover/create:flex hover:cursor-pointer'>{format(chat?.createdAt)}</p>
                </div>
                <Link to={"/userprofile/"+theSender?._id} >
                <img src={theSender?.profilePicture?theSender?.profilePicture:anh} className="object-cover w-[50px] h-[50px] rounded-full " />
                </Link>
            </div>
        }
    </div>
  )
}

export default ChatTag