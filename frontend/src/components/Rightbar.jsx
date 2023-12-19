import React, { useEffect, useRef, useState } from "react";
import anh from "../asset/gift.png";
import quangcao from "../asset/cat.jpg";
import { useSelector } from "react-redux";
import UserOnlineOnHomePage from "./UserOnlineOnHomePage";
import ChatInHome from "./ChatInHome";
import { Link, useNavigate } from "react-router-dom";

import Modal from "react-modal";
import { LuPhoneCall } from "react-icons/lu";
import { FcEndCall } from "react-icons/fc";
import { FcVideoCall } from "react-icons/fc";



const Rightbar = () => {
  const navigate = useNavigate();
  const socket=useSelector((state)=>state.auth.socket)
  const [allUserOnline,setAllUserOnline]=useState([])
  const user=useSelector((state)=>state.auth.user)
  const [userClick,setUserClick]=useState(null)
  const [inforUserCall,setInForUserCall]=useState(false)
  const [called,setCalled]=useState(false)

  const UnUserClick=()=>{
    return setUserClick(null)
  }
  

// console.log(allUserOnline);
// console.log(user);

 useEffect(()=>{
   if(Object.keys(socket).length!=0){
    socket.emit('addUser',user._id)
    socket.on("callUser",({signal,userId,username})=>{
      setInForUserCall({userId,username})
      setCalled(true)
    })
    socket.on('getUsers',(users)=>{
      const allFriendUserOnline=users.filter((e)=>user.friends.includes(e.userId))
        setAllUserOnline(allFriendUserOnline)
    })
   }
 },[socket])

 const HandleClickUser=(e)=>{
  if(userClick){
    setUserClick(null)
  }else{
    setUserClick(e.userId)
  }
  }

  const handleYes=()=>{
    navigate("/replycall/"+inforUserCall?.userId)
}

const handleNo=()=>{
  socket.emit('CancelCall',inforUserCall?.userId)
  setCalled(false)
  setInForUserCall(null)

}
const closeModal=()=>{
  setCalled(false)
}



  return (
    <div className="w-[30%] border-l-[2px] px-1">
     <Modal
                className=" absolute top-[50%] outline-none left-[50%] bottom-[50%] right-[50%] rounded-xl  w-[400px] h-[300px]  translate-x-[-50%] translate-y-[-50%] bg-slate-800"
                isOpen={called}
                onRequestClose={closeModal}
              >
                <div className="flex flex-col justify-center h-full w-full gap-5 rounded-xl px-3 border-[2px] bg-gray-200 shadow-lg shadow-gray-600">
                  <div className="flex justify-center items-center gap-2 text-black">
                    <p className="font-semibold bg-gradient-to-r from-[#00bf8f] to-[#001510] bg-clip-text text-transparent flex items-center gap-2 justify-center">
                      Bạn có cuộc gọi đến từ {inforUserCall?.username} <span className="text-green-600"><LuPhoneCall size={23}/></span>
                    </p>
                  </div>
                  <div className="flex justify-between ">
                    <button
                      onClick={handleYes}
                      className="w-[40%] py-1 rounded-lg border-[1px] bg-gradient-to-r from-[#c2e59c] to-[#64b3f4] hover:text-[20px] text-white hover:cursor-pointer hover:scale-110 duration-300 hover:bg-gradient-to-r  hover:from-[#64b3f4] hover:to-[#c2e59c] flex justify-center items-center gap-2"
                    >
                      Chấp nhận <span><FcVideoCall size={23}/></span>
                    </button>
                    <button
                      onClick={handleNo}
                      className="w-[40%] py-1 rounded-lg border-[1px] bg-gradient-to-r from-[#16BFFD] to-[#CB3066] hover:text-[20px] text-white hover:cursor-pointer hover:scale-110 duration-300 hover:bg-gradient-to-r  hover:from-[#CB3066] hover:to-[#16BFFD] flex justify-center items-center gap-2"
                    >
                      Từ chối <span><FcEndCall size={23}/></span>
                    </button>
                  </div>
                </div>
              </Modal>
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
