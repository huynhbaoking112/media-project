import React, { useState } from "react";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatIcon from "@mui/icons-material/Chat";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import GroupIcon from "@mui/icons-material/Group";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SchoolIcon from "@mui/icons-material/School";
import Fllower from "./Follower";
import { useSelector } from "react-redux";
import {IoMdArrowRoundUp,IoMdArrowRoundForward} from "react-icons/io"



const Sidebar = () => {
  const user=useSelector((state)=>state.auth.user)
  const [showMore,setShowMore]=useState(false)

  const HandleMore=(e)=>{
    e.preventDefault()
    setShowMore(!showMore)
  }

  return (
    <div className="w-[25%] border-r-2 ">
    <div className="w-full sticky top-[70px] max-h-screen overflow-auto   ">
      <div id="king" className="p-7  ">
        <div className="flex flex-col gap-2  ">
          <ul className="flex flex-col gap-[20px]">
            <li className="flex items-center gap-3 text-blue-500 hover:scale-105 duration-300 hover:cursor-pointer">
              <RssFeedIcon />
              <p className="font-serif" >Feed</p>
            </li>
            <li className="flex items-center gap-3 text-green-600 hover:scale-105 duration-300 hover:cursor-pointer">
              <ChatIcon />
              <p className="font-serif" >Chats</p>
            </li>
            <li className="flex items-center gap-3 text-red-500 hover:scale-105 duration-300 hover:cursor-pointer">
              <PlayCircleIcon />
              <p className="font-serif" >Videos</p>
            </li>
            <li className="flex items-center gap-3 text-blue-600 hover:scale-105 duration-300 hover:cursor-pointer">
              <GroupIcon />
              <p className="font-serif" >Groups</p>
            </li>
            <li className="flex items-center gap-3 text-gray-600 hover:scale-105 duration-300 hover:cursor-pointer">
              <CollectionsBookmarkIcon />
              <p className="font-serif" >Bookmarks</p>
            </li>
            <li className="flex items-center gap-3 text-purple-600 hover:scale-105 duration-300 hover:cursor-pointer">
              <HelpOutlineIcon />
              <p className="font-serif" >Questions</p>
            </li>
            <li className="flex items-center gap-3 hover:scale-105 duration-300 hover:cursor-pointer">
              <WorkOutlineIcon />
              <p className="font-serif" >Jobs</p>
            </li>
            <li className="flex items-center gap-3 text-yellow-900 hover:scale-105 duration-300 hover:cursor-pointer">
              <EventAvailableIcon />
              <p className="font-serif" >Events</p>
            </li>
            {showMore&&<li className="flex items-center gap-3 text-blue-950 hover:scale-105 duration-300 hover:cursor-pointer">
              <SchoolIcon />
              <p className="font-serif" >Courses</p>
            </li>}
          </ul>
          <button onClick={HandleMore} className="bg-gray-400 rounded-lg py-1  w-[60%] my-4 bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white">
           { showMore?<span className="flex justify-center"><IoMdArrowRoundUp size={23}/></span>:<span className="flex justify-center items-center group font-medium gap-2 " >Showmore<IoMdArrowRoundForward className="group-hover:rotate-90 duration-300" size={23}/></span>}
          </button>
          <hr />
          <div className="flex flex-col gap-[20px]  ">
          <p className="font-medium underline ">Following <span className="animate-pulse">❤️</span></p>
           {user.followins.map((e,id)=>{
            return <Fllower  key={id} _id={e}  />
           })}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Sidebar;
