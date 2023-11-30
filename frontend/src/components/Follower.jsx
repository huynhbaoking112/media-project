import React, { useEffect, useState } from 'react'
import anh from "../asset/user2.jpg";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Fllower = ({_id}) => {
    const [user,setUser]=useState()
    const fetchUser=async()=>{
        try {
            const res= await axios.get("http://localhost:8000/api/user?userId="+_id)
            setUser(res.data.user)
        } catch (error) {
            setUser({username:"techSocial users"})
        }
   
    }
    useEffect(()=>{
        fetchUser() 
    },[_id])

  return (
    <Link to={"/userprofile/"+_id}  >

    <div className="flex  items-center gap-[10px]">
              <img
                src={user?.profilePicture?user.profilePicture:anh}
                className="object-cover w-[37px] h-[37px] rounded-full"
              />
              <p className='font-medium' >{user?.username}</p>
            </div>
    </Link>
   
  )
}

export default Fllower