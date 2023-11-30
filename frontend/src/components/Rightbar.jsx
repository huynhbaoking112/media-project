import React, { useEffect, useRef, useState } from "react";
import anh from "../asset/gift.png";
import quangcao from "../asset/cat.jpg";
import { useSelector } from "react-redux";
import {io} from "socket.io-client"
import UserOnlineOnHomePage from "./UserOnlineOnHomePage";
import ChatInHome from "./ChatInHome";




const Rightbar = () => {
  const socket=useRef()
  const [allUserOnline,setAllUserOnline]=useState([])
  const user=useSelector((state)=>state.auth.user)
  const [userClick,setUserClick]=useState(null)

  const UnUserClick=()=>{
    return setUserClick(null)
  }
  

// console.log(allUserOnline);
// console.log(user);

 useEffect(()=>{
    socket.current=io("ws://localhost:8000")
    socket.current.emit('addUser',user._id)
    socket.current.on('getUsers',(users)=>{
      const allFriendUserOnline=users.filter((e)=>user.friends.includes(e.userId))
        setAllUserOnline(allFriendUserOnline)
    })
 },[])

 const HandleClickUser=(e)=>{
  if(userClick){
    setUserClick(null)
  }else{
    setUserClick(e.userId)
  }
  }



  return (
    <div className="w-[30%] border-l-[2px] px-1">
    <div className="w-full sticky top-[70px] ">
      <div className=" flex flex-col h-full ">
        <div className="flex items-center gap-2">
          <img src={anh} className="object-cover w-[50px] h-[50px]" />
          <p>
            <span className="font-medium">Pola Foster</span> and{" "}
            <span className="font-medium">3 other friends</span> have a birthday
            today
          </p>
        </div>
        <img
          src={quangcao}
          className="my-[10px]  object-contain w-[full] h-[270px]"
        />
        <div className="relative" >



    <div className="absolute bottom-[-120px]  left-[-390px]" >
    {/* setPhanTinNhan */}
    {userClick&&<ChatInHome UnUserClick={UnUserClick} userId={userClick}/>}
    </div>


        <p className="font-semibold mb-[10px] ">Online Friends</p>
        </div>
          <div className="w-full flex flex-col max-h-[400px] overflow-y-auto" >
          {
            allUserOnline?.map((e)=>{
                return <div key={e.userId} onClick={()=>{HandleClickUser(e)}}>
                <UserOnlineOnHomePage friend={e.userId}  />
                </div> 
            })
          }      
          </div>
      </div>
    </div>
    </div>
  );
};

export default Rightbar;
