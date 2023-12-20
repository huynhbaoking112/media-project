import React, { useEffect, useState } from 'react'
import anh from "../asset/user2.jpg"
import axios from 'axios'

const FriendInUser = ({idFriend}) => {
  const [infor,setInfor]=useState()

  const fetchTheUser=async()=>{
    try {
      const res=await axios.get("http://localhost:8000/api/user?userId="+idFriend)
      setInfor(res.data.user)   
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    fetchTheUser()
  },[])

  return (
    <div className='flex flex-col gap-2' >
    <div className='flex justify-center items-center'>

        <img className='object-cover h-[100px] w-[100px] rounded-lg' src={infor?.profilePicture?infor?.profilePicture:anh} />
    </div>
        <p className='flex justify-center'>{infor?.username}</p>
    </div>
  )
}

export default FriendInUser