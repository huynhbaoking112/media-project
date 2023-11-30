import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import anh from "../asset/user2.jpg"
import { format } from 'timeago.js';

const Conversation = ({conversation}) => {
    const user=useSelector((state)=>state.auth.user)
    const [userContact,setUserContact]=useState()
    const [newMess,setNewMess]=useState("")
    const [timNewMess,setTimeNewMess]=useState()


    const fetchTheUserWithConversation=async()=>{
        const userWithConversation=conversation?.members.filter((e)=>e!=user._id)
        try {
            const userConversation= await axios.get("http://localhost:8000/api/user?userId="+userWithConversation)
           setUserContact(userConversation.data.user);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchNewContact=async()=>{
        try {
            const res=await axios.get("http://localhost:8000/api/message/"+conversation?._id)
            const contact= res.data.message
            const contactNew=contact.sort((a,b)=> (new Date(b?.createdAt))-new Date(a?.createdAt))
            setNewMess(contactNew[0]?.text.slice(0,10));
            setTimeNewMess(format(contactNew[0]?.createdAt))
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchTheUserWithConversation()
        fetchNewContact()
    },[])

  return (
    <div className=' w-full h-[70px]  hover:cursor-pointer hover:border-[1px] hover:border-white  flex  px-1  gap-2'  >
    <div className='h-full w-[30%] flex justify-center items-center my-auto ' >
        <img src={userContact?.profilePicture?userContact?.profilePicture:anh} className='object-cover  rounded-full h-[60px] w-[60px]' />
    </div>
        <div className='flex flex-col justify-center gap-2 w-full' >
            <p className='font-medium'>{userContact?.username}</p>
            <div className='flex justify-between' >
            <p className='font-thin'>{newMess}...</p>
            <p className='font-thin'>{timNewMess}</p>
            </div>
        </div>
    </div>
  ) 
}

export default Conversation