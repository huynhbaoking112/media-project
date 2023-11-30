import React, { useEffect, useState } from 'react'
import anh from '../asset/user2.jpg'
import axios from 'axios'
import { Link } from 'react-router-dom'


const FriendOnline = ({inforFriend}) => {

  const [theFriend,setTheFriend]=useState()
  useEffect(()=>{
    const fetchTheFriend=async()=>{
      try {
          const res=await axios.get("http://localhost:8000/api/user?userId="+inforFriend.userId) 
          setTheFriend(res.data.user);
      } catch (error) {
        console.log(error);
      }
    } 
    fetchTheFriend()
  },[])

  return (
    <div className='flex w-full items-center hover:cursor-pointer hover:border-[1px] px-1 py-2' >
    <div className='relative flex ' >
        <img src={theFriend?.profilePicture?theFriend?.profilePicture:anh} className='object-cover w-[50px] h-[50px] rounded-full' />
        <p className='w-[15px] h-[15px] bg-green-500 rounded-full'></p>
    </div>
    <p className='font-medium'>{theFriend?.username}</p>
    </div>
  )
}

export default FriendOnline