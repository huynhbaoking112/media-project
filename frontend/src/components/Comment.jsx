import React, { useEffect, useState } from "react";
import anh from "../asset/user2.jpg";
import { HiPaperAirplane } from "react-icons/hi";
import { BiImage } from "react-icons/bi";
import { BsFillEmojiLaughingFill } from "react-icons/bs";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import AllComment from "./AllComment";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";

const Comment = ({ postId, authorPostId,HandleIncrementComment,HandleDecrementComment }) => {
  const [content, setContent] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [allCommentReply, setAllCommentReply] = useState();
  const [openEmoji,setOpenEmoji]=useState(false)

  const fetchTheCommentWithPost = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/comment/post/" + postId
      );
      setAllCommentReply(res.data.allComment);
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    fetchTheCommentWithPost();
  }, []);

  const HandleClick = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/comment/post/" + postId,
        {
          postId,
          authorPostId,
          authorId: user?._id,
          content,
        }
      );
      setAllCommentReply([res.data.comment, ...allCommentReply]);
      HandleIncrementComment()
      setContent("");
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const setAllCommetHandle=(arr)=>{
    return setAllCommentReply(arr)
  }

  return (
    <div className="flex flex-col w-full">
      {/* setphancomment */}
      <div className="flex items-center">
        <img
          className="object-cover rounded-full w-[50px] h-[50px]"
          src={user?.coverPicture === "" ? anh : user?.coverPicture}
        />

        <div className="flex flex-col w-full px-2">
          <input
            type="text"
            className="w-full mx-2 pl-2 py-2 rounded-tr-lg rounded-tl-lg outline-none border-t-[1px] border-l-[1px] border-r-[1px]   "
            onKeyDown={(e) => {
              if (e.code == "Enter") {
                HandleClick();
              }
            }}
            value={content}
            onChange={(e) => {
              setContent(e.target?.value);
            }}
          />
          <div className="flex py-2 justify-between border-b-[1px] border-l-[1px] border-r-[1px] w-full rounded-br-lg rounded-bl-lg mx-2 px-2 ">
            <div className="flex gap-2 items-center ">
              <div className="relative group/image" >
                <p className=" absolute  top-[-20px] left-[-5px]  bg-gray-200 text-gray-400  text-[10px] rounded-lg border-[1px] p-1 hidden group-hover/image:flex" >image </p>
                <BiImage
                  size={24}
                  className="text-green-600  hover:cursor-pointer rounded-full hover:bg-slate-200 p-[2px] "
                />
              </div>
              <div className="relative group/icon" >
              <p className=" absolute  top-[-20px] left-[-5px]  bg-gray-200 text-gray-400  text-[10px] rounded-lg border-[1px] p-1 hidden group-hover/icon:flex" >icon  </p>
             <div className="relative" >
              <BsFillEmojiLaughingFill
                className="text-yellow-500 hover:cursor-pointer rounded-full hover:bg-slate-200 p-[2px]"
                size={20} 
                onClick={()=>{setOpenEmoji(!openEmoji)}}
              />
              {openEmoji&&<div className="absolute bottom-[-300px] z-10" >
                  <EmojiPicker height="300px" width="300px" onEmojiClick={(a)=>{
                    setContent((e)=>{return e+a.emoji})
                  }} />
              </div>}
             </div>
              </div>
            </div>
            <p className="flex items-center rotate-45 justify-center hover:cursor-pointer hover:scale-105 duration-300">
              <HiPaperAirplane
                className="hover:text-blue-400"
                size={20}
                onClick={HandleClick}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col overflow-y-auto max-h-[400px] gap-3 mt-3">
        {allCommentReply?.map((e) => {
          return <AllComment comment={e} key={e._id} setAllCommetHandle={setAllCommetHandle} HandleDecrementComment={HandleDecrementComment} allCommentReply={allCommentReply} />;
        })}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Comment;
