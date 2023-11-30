import axios, { all } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Conversation from "../components/Conversation";
import ChatTag from "../components/ChatTag";
import anh from "../asset/user2.jpg"
import {io} from "socket.io-client"
import FriendOnline from "../components/FriendOnline";



const Messenger = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [allTheConversation, setAllTheConversation] = useState([]);
  const [currentConversation, setCurrentConversation] = useState();
  const [content, setContent] = useState();
  const [allChat, setAllChat] = useState();
  const [friendChat,setFriendChat]=useState()
  const currentRef = useRef();
  const [arrivalMess,setArrivalMess]=useState(null)
  const [allUserOnline,setAllUserOnline]=useState()
  const [searchUser,setSearchUser]=useState("")

  // console.log(allUserOnline);
  //socketio-client
  const socket=useRef()

  useEffect(()=>{
    socket.current=io("ws://localhost:8000")
    socket.current.on("getMess",(e)=>{
      setArrivalMess({
        sender:e.sendUser,
        text:e.text,
        createdAt:Date.now()
      })
    })
  },[])

  useEffect(()=>{
    arrivalMess && currentConversation?.members.includes(arrivalMess.sender)&&setAllChat([...allChat,arrivalMess])
  },[arrivalMess,currentConversation])

  useEffect(()=>{
      socket.current.emit("addUser",user?._id)
      socket.current.on("getUsers",(users)=>{
        const mang= users.filter((e)=>user.friends.includes(e.userId) )
        setAllUserOnline(mang)
      })
  },[user])


//-------------------------------------------------------------//
  const fetchTheconversation = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/conversation/" + user._id
      );
      const sortConver=res.data.conversation.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
      setAllTheConversation(sortConver);
      setCurrentConversation(sortConver[0]);
    } catch (error) {
      // navigate("/error/404");
    }
  };

  
   useEffect(() => {
    fetchTheconversation();
  }, []);

  const fetchTheChat = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/message/" + currentConversation?._id
      );
      const chatNew = res.data.message.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setAllChat(chatNew);
    } catch (error) {
      // navigate("/error/404");
    }
  };

const fetchTheFriend=async()=>{
  try {
    const theFriend=currentConversation?.members.filter((e)=>e!=user._id)
    const Id=theFriend[0]
    const res=await axios.get("http://localhost:8000/api/user?userId="+Id)
    setFriendChat(res.data.user);
  } catch (error) {
    // navigate("/error/404");
    //bi o day
  }
}

  useEffect(() => {
    fetchTheChat();
    fetchTheFriend()
  }, [currentConversation]);

  useEffect(() => {
    currentRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [allChat]);

  const HandleSendMess = async () => {
    try {
      if (!content) {
        return;
      }
      const res = await axios.post("http://localhost:8000/api/message", {
        conversationId: currentConversation._id,
        sender: user._id,
        text: content,
      });

      setAllChat([...allChat,res.data.message]);
      setContent("")
      socket.current.emit('sendMess',{
        sendUser:user?._id,
        receiverId:friendChat?._id,
        text:content
      })
    
    } catch (error) {
      // navigate("/error/404");
    }
  };

  const HandleNewMess=async(e)=>{
    try {
      const {userId}=e
      const index=allTheConversation.findIndex((e)=>e.members.includes(userId))

      if(index!=-1){
        setCurrentConversation(allTheConversation[index])
      }else{
          const res= await axios.post("http://localhost:8000/api/conversation",{
            senderId:user._id,
            receiverId:userId
          })
          setCurrentConversation(res.data.conversation)

      }
    } catch (error) {
      console.log(error);
      //xu li loi
    }
  }

  const HandleSearchUser=()=>{

  }

  return (
    <div className="h-screen w-full flex bg-[#242526] text-white">
      <div className="h-full flex flex-col w-[25%] border-r-[1px] py-[10px] ">
        <div className="flex w-full my-[10px]" >
            <input placeholder="Search the user chat..." className="outline-none h-[35px] w-[70%] rounded-lg bg-transparent border-[1px] px-2 py-1" value={searchUser} onChange={(e)=>{setSearchUser(e.target.value)}} />
            <p className="w-[30%] boder-[1px] bg-cyan-500 flex justify-center items-center rounded-lg hover:scale-105 hover:cursor-pointer duration-300 hover:bg-cyan-600 active:bg-cyan-700" onClick={HandleSearchUser} >Search</p>
        </div>
        <div className="w-full overflow-y-auto max-h-full ">
          {allTheConversation?.map((e) => {
            return (
              <div
                key={e._id}
                onClick={() => {
                  setCurrentConversation(e);
                }}
              >
                <Conversation conversation={e} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-screen w-[50%]  border-r-[1px]">
        <div className=" h-[80%] w-full flex flex-col   ">
        <Link to={"/userprofile/"+friendChat?._id}>
        <div className="flex gap-2 px-2 py-1 items-center border-b-[1px]" > 
          <img className="rounded-full object-cover w-[60px] h-[60px]" src={friendChat?.profilePicture?friendChat?.profilePicture:anh}/>
          <p className="font-medium text-xl" >{friendChat?.username}</p>
        </div>
        </Link>
          <div className="max-h-full overflow-y-auto">
            <div className="w-full h-full px-[15px] py-[20px] flex flex-col ">

              {allChat?.length==0?<p>text something to someone else</p>:allChat?.map((e) => {
                return (
                  <div key={e._id} ref={currentRef}>
                    <ChatTag chat={e} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full h-[20%] flex items-center border-[1px]">
          <textarea
            className="w-[80%] border-[1px] border-white bg-transparent p-2 focus:border-[2px]  "
            rows={4}
            cols={15}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            onKeyDown={(e)=>{
              if(e.code=="Enter"){
                HandleSendMess()
              }
            }}
          />
          <div className="w-[20%] h-full flex items-center justify-center">
            <p
              className="px-3 py-2 rounded-lg border-[1px] hover:cursor-pointer hover:scale-105 duration-300 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600"
              onClick={HandleSendMess}
            >
              Send
            </p>
          </div>
        </div>
      </div>

      <div className="h-screen w-[25%] pt-[30px] px-2">
            <div className="flex flex-col gap-3 max-h-full overflow-y-auto" >
            <p className="text-xl underline">Your friend Online<span className="animate-pulse">❤️</span></p>
           {allUserOnline?.map((e)=>{
              return <div onClick={()=>{HandleNewMess(e)}} >
              <FriendOnline key={e.userId} inforFriend={e}/>
              </div> 
           })}
            </div>
      </div>
    </div>
  );
};

export default Messenger;
