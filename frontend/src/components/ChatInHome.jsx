import React, { useEffect, useRef, useState } from "react";
import anh2 from "../asset/user2.jpg";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdInsertEmoticon } from "react-icons/md";
import { HiPaperAirplane } from "react-icons/hi";
import axios from "axios";
import { useSelector } from "react-redux";
import ChatTag from "./ChatTag";
import EmojiPicker from "emoji-picker-react";
import { Link } from "react-router-dom";
import { FaVideo } from "react-icons/fa";



const ChatInHome = ({ userId ,UnUserClick}) => {
  const [openEmoji, setOpenEmoju] = useState(false);
  const currentChat = useRef();
  const socket =useSelector((state)=>state.auth.socket);
  const currentUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState();
  const [allChat, setAllChat] = useState();
  const [content, setContent] = useState("");
  const [currentConversation, setCurrentConversation] = useState("");
  const [arrivalMess, setArrivalMess] = useState();

  const fetchTheFriendChat = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/user?userId=" + userId
      );
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTheChat = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/conversation/conversation/chat",
        {
          yourId: currentUser._id,
          FriendId: userId,
        }
      );
      
      setAllChat(res.data.message);
      setCurrentConversation(res.data.message[0].conversationId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTheFriendChat();
    fetchTheChat();
  }, [userId]);

  useEffect(() => {
    currentChat?.current?.scrollIntoView({ behavior: "smooth" });
  }, [allChat]);

  useEffect(() => {
    if(Object.keys(socket).length!=0){
      socket.emit("addUser", currentUser._id);
      socket.on("getMess", (Mess) => {
        console.log("king");
        setArrivalMess({
          conversationId: currentConversation,
          createdAt: Date.now(),
          sender: Mess.sendUser,
          text: Mess.text,
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMess && setAllChat([...allChat, arrivalMess]);
  }, [arrivalMess]);

  const HandleSendMess = async () => {
    try {
      if (!content) {
        return;
      }
      const res = await axios.post("http://localhost:8000/api/message", {
        conversationId: currentConversation,
        sender: currentUser._id,
        text: content,
      });
      setAllChat([...allChat, res.data.message]);
      setContent("");
      socket.emit("sendMess", {
        sendUser: currentUser._id,
        receiverId: user._id,
        text: content,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex text-white flex-col gap-2 h-[450px] bg-gray-600 w-[380px] rounded-lg p-2">
      {/* setphandau */}
      <div className="flex items-center gap-2 ">
      <Link to={"/userprofile/"+userId} >
        <img
          src={user?.profilePicture ? user?.profilePicture : anh2}
          className="object-cover rounded-full h-[50px] w-[50px]"
        />
      </Link>
        <p className="text-white font-medium">{user?.username}</p>
       
        <div className=" flex justify-center items-center gap-2 ml-auto mr-[15px] text-gray-300 ">
        <div className="flex items-center hover:cursor-pointer hover:scale-110 duration-300 hover:text-white  " >
        <Link to={"/callUser/"+userId} >
          <FaVideo size={23} />
        </Link>
        </div>
          <IoIosCloseCircleOutline size={25} onClick={()=>{UnUserClick()}} className="hover:cursor-pointer hover:scale-110 duration-300 hover:text-white" />
        </div>
      </div>
      <hr />
      {/* setphantinnhan */}

      <div className="w-full flex flex-col gap-3 h-[315px] max-h-[315px] overflow-y-auto b-black p-2 rounded-lg bg-gray-200">
        {allChat?.map((e) => {
          return (
            <div key={e.createdAt} ref={currentChat}>
              <ChatTag chat={e} />
            </div>
          );
        })}
      </div>
      {/* setphannhantin */}

      <div className="flex w-full items-center relative justify-between">
        {openEmoji && (
          <div className="absolute bottom-[50px]">
            <EmojiPicker
              onEmojiClick={(e) => {
                setContent((a)=>{return a+e.emoji})
              }}
            />
          </div>
        )}
        <input
          className="outline-none rounded-lg px-[8px] py-2 w-[80%] text-black"
          placeholder="Speak words of love..."
          value={content}
          onKeyDown={(e) => {
            if (e.code == "Enter") {
              HandleSendMess();
            }
          }}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <p className="text-xl hover:scale-110 duration-300 hover:cursor-pointer"  onClick={() => {
            setOpenEmoju(!openEmoji);
          }} >🥳</p>
        
        <HiPaperAirplane
          size={25}
          className="text-cyan-500 hover:cursor-pointer hover:rotate-45 duration-300 hover:text-cyan-300"
          onClick={HandleSendMess}
        />
      </div>
    </div>
  );
};

export default ChatInHome;
