import React, { useEffect, useState } from 'react'
import anh2 from "../asset/user2.jpg";
import axios from 'axios';

const UserOnlineOnHomePage = ({friend}) => {
    const [userFriend,setUserFriend]=useState()


    const fetchTheFriend=async()=>{
        try {
            const res=await axios.get("http://localhost:8000/api/user?userId="+friend)
           setUserFriend(res.data.user);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchTheFriend()
    },[friend])
    

  return (
    <div className="flex items-center gap-2 mb-[10px] hover:cursor-pointer rounded-lg hover:border-[1px] p-1">
          <div className="flex">
            <img
              src={userFriend?.profilePicture?userFriend?.profilePicture:anh2}
              className="object-cover w-[40px] h-[40px] rounded-full"
            />
            <div className="w-[10px] h-[10px] rounded-full bg-green-600"></div>
          </div>
          <p className="font-semibold">{userFriend?.username}</p>
        </div>
  )
}

export default UserOnlineOnHomePage