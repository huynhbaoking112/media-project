import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SearchIcon from "@mui/icons-material/Search";
import anh from "../asset/user2.jpg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../StoreState/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Navbar = () => {
  const socket=useSelector((state)=>state.auth.socket)
  const user = useSelector((state) => state.auth.user);
  const [searchValue,setSearchValue]=useState("")
  const [openMenu, setOpenMenu] = useState(false);
  const [newNoti,setNewNoti]=useState(user?.newNotification)
  const [openNoti,setOpenNoti]=useState(false)
  const [allNoti,setAllNoti]=useState([])
  const [newMess,setNewMess]=useState(user?.newMess)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const HandleLogOut=()=>{
    dispatch(logout())
    setOpenMenu(false)
  }
  const HandleProfile=()=>{
    navigate("/userprofile/"+user._id)
    setOpenMenu(false)
  }

  const HandleSearch=()=>{
    if(!searchValue){
      return
    }
    navigate("/top?q="+searchValue)
    setSearchValue("")
  }
  const HandleSetting=()=>{
    navigate("/setting")
    setOpenMenu(false)
  }

  const HandleNoti=async()=>{
    setNewNoti(false)
    setOpenNoti(!openNoti)

    socket.emit("daxem")

    const res=await axios.get("http://localhost:8000/api/notification/"+user._id)
    
   
    setAllNoti(res.data.notificationAll)


  }

  useEffect(()=>{
    if(Object.keys(socket).length!=0){
      socket.on('newToast',()=>{
        setNewNoti(true)
      })
      socket.on('haveNewMess',()=>{
          setNewMess(true)
      })
    }
  },[socket])

  const HandleMess=async()=>{
    setNewMess(false)
    socket.emit('danhan',{userId:user._id})
  }


  return (
    <div className="bg-gray-900 h-[60px] flex items-center justify-between px-4 fixed top-0 w-full  z-50 ">
      <div className="">
        <p className="font-bold text-2xl bg-gradient-to-r from-[#ffe259] to-[#ffa751] text-transparent bg-clip-text hover:cursor-pointer font-king ">
          <Link to="/">TECHSOCIAL</Link>
        </p>
      </div>
      <div className="flex gap-4 ">
        <div className="bg-white rounded-full px-4  flex items-center gap-2">
          <span onClick={HandleSearch}><SearchIcon  className="hover:cursor-pointer" /></span>
          <input
            className="outline-none w-[400px] py-[2px] my-[2px]"
            placeholder="Search for friend, post or video"
            value={searchValue}
            onChange={(e)=>{setSearchValue(e.target.value)}}
            onKeyDown={(e)=>{
              if(e.code=='Enter'){
                HandleSearch()
              }
            }}
          />
        </div>
        <p className="text-white hover:cursor-pointer text-lg">
          <Link to="/">Homepage</Link>
        </p>
        <p className="text-white hover:cursor-pointer text-lg">
          <Link to={"/userprofile/" + user._id}>Timeline</Link>
        </p>
      </div>
      <div className="flex items-center gap-[20px]">
        <div className="relative">
          <PersonIcon className="text-white hover:cursor-pointer" />
         <div className="rounded-full absolute top-[-15px] right-[-12px]  bg-red-500 w-[20px] h-[20px] flex items-center justify-center">
            <span className="text-white">1</span>
          </div>
        </div>
        <div className="relative">
          <Link to="/messenger" >
          <div onClick={HandleMess} >
          <ChatIcon className="text-white hover:cursor-pointer" />
          </div>
          </Link>
          {newMess&&<div className="rounded-full absolute top-[-15px] right-[-12px]  bg-red-500 w-[20px] h-[20px] flex items-center justify-center">
            <span className="text-white">1</span>
          </div>}
        </div>
        <div className="relative" onClick={HandleNoti} >
          <NotificationsActiveIcon className="text-white hover:cursor-pointer" />
          {newNoti&&<div className="rounded-full absolute top-[-15px] right-[-12px]  bg-red-500 w-[20px] h-[20px] flex items-center justify-center">
            <span className="text-white">1</span>
          </div>}
          { openNoti&&<div className="flex flex-col bg-slate-100 border-[1px] border-black w-[350px] absolute top-7 right-0 h-[300px]" >
              <div className="h-full w-full overflow-y-auto flex flex-col gap-2" >

            {allNoti.map((e)=>{
              return   <Link key={e._id} to={e.linkBlog}>
              <div className="flex border-y-[1px] hover:scale-105 duration-300  text-black justify-center items-center h-[50px] border-neutral-500" >
                        {e.message}
              </div>
              </Link>
            })}
              

              </div>
          </div>}
        </div>

        <div className="w-[32px] h-[32px] ml-[40px] relative">
          <span onClick={()=>{setOpenMenu(!openMenu)}} >
            <img
              src={user.profilePicture ? user.profilePicture : anh}
              className="w-full h-full object-cover rounded-full hover:cursor-pointer"
            />
          </span>
          {openMenu&&<div className="absolute bg-gray-500 rounded-lg py-2  px-3 text-gray-200  right-0" >
                <p className="hover:text-white hover:scale-105 duration-300 hover:cursor-pointer" onClick={HandleLogOut} >Logout</p>
                <p className="hover:text-white hover:scale-105 duration-300 hover:cursor-pointer" onClick={HandleProfile} >YourProfile</p>
                <p className="hover:text-white hover:scale-105 duration-300 hover:cursor-pointer" onClick={HandleSetting}>Setting</p>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
