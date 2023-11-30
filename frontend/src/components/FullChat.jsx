import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ChatTag from './ChatTag';

const FullChat = ({currentConversation}) => {
    const user=useSelector((state)=>state.auth.user)
    const [allChat,setAllChat]=useState()

    const fetchTheChat=async()=>{
        try {
            const res=await axios.get("http://localhost:8000/api/message/"+currentConversation?._id)
            const chatNew=res.data.message.sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt))
            setAllChat(chatNew)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchTheChat()
    },[currentConversation])

  return (
    <div className='w-full h-full px-[15px] py-[20px] flex flex-col ' >
           {
            allChat?.map((e)=>{
                return <ChatTag key={e._id} chat={e} />
            })
           }
    </div>
  )
}

export default FullChat