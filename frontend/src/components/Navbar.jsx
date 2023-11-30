import React, { useState } from "react";
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
const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const [searchValue,setSearchValue]=useState("")
  const [openMenu, setOpenMenu] = useState(false);
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

  return (
    <div className="bg-blue-500 h-[60px] flex items-center justify-between px-4 fixed top-0 w-full  z-50 ">
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
          <ChatIcon className="text-white hover:cursor-pointer" />
          </Link>
          <div className="rounded-full absolute top-[-15px] right-[-12px]  bg-red-500 w-[20px] h-[20px] flex items-center justify-center">
            <span className="text-white">1</span>
          </div>
        </div>
        <div className="relative">
          <NotificationsActiveIcon className="text-white hover:cursor-pointer" />
          <div className="rounded-full absolute top-[-15px] right-[-12px]  bg-red-500 w-[20px] h-[20px] flex items-center justify-center">
            <span className="text-white">1</span>
          </div>
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
                <p className="hover:text-white hover:scale-105 duration-300 hover:cursor-pointer">Setting</p>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
