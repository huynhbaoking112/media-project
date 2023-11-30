import axios from "axios";
import React, { useEffect, useState } from "react";
import anh from "../asset/user2.jpg";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { HiPaperAirplane } from "react-icons/hi";
import like from "../asset/like.png";
import { IoMdMore } from "react-icons/io";
import { FcProcess } from "react-icons/fc";
import { GiCancel } from "react-icons/gi";
import { format } from "timeago.js";
import EmojiPicker from "emoji-picker-react";

const CommentReply = ({
  commentReply,
  commentId,
  setComment,
  authorPostId,
}) => {
  const curretLoginUser = useSelector((state) => state.auth.user);
  const [theCommentReply, setTheCommentReply] = useState(commentReply);

  const [theUserCommentReply, setTheUserCommentReply] = useState();

  const [openReply, setOpenReply] = useState(false);
  const [reply, setReply] = useState("");

  const [isOpenChangeAndDelete, setIsOpenChangeAndDelete] = useState(false);

  const [isOpenChangeInput, setIsOpenChangeInput] = useState(false);

  const [valueChange, setValueChange] = useState("");

  // console.log(theCommentReply);

  const fetchTheUserComment = async () => {
    try {
      console.log(theCommentReply.authorId);
      const res = await axios.get(
        "http://localhost:8000/api/user?userId=" + theCommentReply.authorId
      );
      setTheUserCommentReply(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTheUserComment();
  }, [theCommentReply]);

  const HandleLike = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/comment/commentreply/" + commentId,
        {
          userId: curretLoginUser._id,
          _id: theCommentReply._id,
        }
      );
      const index = res.data.comment.replies.findIndex(
        (e) => e._id == theCommentReply._id
      );
      setTheCommentReply(res.data.comment.replies[index]);
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const HandleOpenReply = () => {
    setOpenReply(!openReply);
  };

  const HandleReply = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/comment/commentreply/" + commentId,
        {
          authorId: curretLoginUser._id,
          content: reply,
          _id: theCommentReply._id,
        }
      );
      setComment(res.data.comment);
      setReply("");
      setOpenReply(false);
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const HandleDeleteReplyComment = async () => {
    try {
      const res = await axios.delete(
        "http://localhost:8000/api/comment/commentreply/" + commentId,
        {
          data: {
            userId: curretLoginUser?._id,
            _id: theCommentReply?._id,
          },
        }
      );
      setComment(res.data.comment);
      setIsOpenChangeAndDelete(false);
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const HandleClickChange = () => {
    setIsOpenChangeInput(!isOpenChangeInput);
    setIsOpenChangeAndDelete(false);
  };

  const HandleChangeContent = async () => {
    try {
      if (!valueChange) {
        throw new Error("Something's wrong, please try again.!");
      }
      const res = await axios.patch(
        "http://localhost:8000/api/comment/commentreply/" + commentId,
        {
          content: valueChange,
          userId: curretLoginUser._id,
          _id: theCommentReply?._id,
        }
      );
      setTheCommentReply(res.data.comment);
      setIsOpenChangeAndDelete(false);
      setIsOpenChangeInput(false);
      setValueChange("");
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <div className="flex gap-1 w-full">
      <img
        className="object-cover w-[35px] h-[35px] rounded-full"
        src={
          theUserCommentReply?.coverPicture
            ? theUserCommentReply?.coverPicture
            : anh
        }
      />
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-1 border-[1px] rounded-lg w-full px-3 py-3 relative">
          <div className="flex justify-between items-center">
            <p className="font-sans font-medium">
              {theUserCommentReply?.username}
            </p>
            <div className="relative">
              {(curretLoginUser?._id == authorPostId ||
                curretLoginUser?._id == theCommentReply?.authorId) && (
                <IoMdMore
                  className="hover:scale-105 duration-300 cursor-pointer"
                  onClick={() => {
                    setIsOpenChangeAndDelete(!isOpenChangeAndDelete);
                  }}
                />
              )}
              {isOpenChangeAndDelete && (
                <div className="absolute top-0 right-[15px] rounded-lg px-2 py-1 bg-gray-200 gap-2">
                  {curretLoginUser?._id == theCommentReply?.authorId && (
                    <p
                      onClick={HandleClickChange}
                      className="hover:text-green-500 duration-300 hover:cursor-pointer"
                    >
                      Change
                    </p>
                  )}
                  {(curretLoginUser?._id == authorPostId ||
                    curretLoginUser?._id == theCommentReply?.authorId) && (
                    <p
                      className="hover:text-red-500 duration-300 hover:cursor-pointer"
                      onClick={HandleDeleteReplyComment}
                    >
                      Delete
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <p>{theCommentReply?.content}</p>

          {isOpenChangeInput && (
            <div className="flex justify-between items-center">
              <input
                className="outline-none px-2 py-1 w-[80%] border-[1px] rounded-lg"
                placeholder={theCommentReply?.content}
                value={valueChange}
                onChange={(e) => {
                  setValueChange(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.code == "Enter") {
                    HandleChangeContent();
                  }
                }}
              />
              <FcProcess
                onClick={HandleChangeContent}
                className="hover:animate-spin hover:cursor-pointer "
                size={20}
              />
              <GiCancel
                className="hover:cursor-pointer hover:text-red-500"
                size={20}
              />
            </div>
          )}

          {theCommentReply?.likes.length != 0 && (
            <div className="flex flex-col group/like">
              <img
                src={like}
                className="object-cover hover:scale-110 duration-300 hover:cursor-pointer w-[18px] h-[18px] absolute bottom-[0px] right-0"
              />
              <p className="group-hover/like:flex text-[15px] text-gray-6 00 px-1 rounded-lg bg-slate-200 hidden absolute bottom-[22px] right-0">
                {theCommentReply?.likes.length} like
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-3 ml-2 text-[13px] ">
          <p>{format(theCommentReply?.createdAt)}</p>
          <p
            className={
              theCommentReply.likes.includes(curretLoginUser._id)
                ? "text-blue-500 hover:cursor-pointer hover:underline  hover:scale-105 duration-300"
                : "text-gray-600 hover:cursor-pointer hover:underline  hover:scale-105 duration-300"
            }
            onClick={HandleLike}
          >
            {theCommentReply.likes.includes(curretLoginUser._id)
              ? "Đã thích"
              : "Thích"}
          </p>
          <p
            className="hover:cursor-pointer hover:underline hover:scale-105 duration-300 "
            onClick={HandleOpenReply}
          >
            Reply
          </p>
        </div>
        {openReply && (
          <div className="flex w-full gap-2">
            <input
              className="outline-none border-[1px] rounded-lg px-2 py-1 text-black"
              placeholder={"Reply " + theCommentReply?.content + "..."}
              value={reply}
              onChange={(e) => {
                setReply(e.target.value);
              }}
            />
            <div className="flex items-center rotate-45">
              <HiPaperAirplane
                size={20}
                className="hover:cursor-pointer hover:scale-105 duration-300 hover:text-blue-400"
                onClick={HandleReply}
                disabled={reply.length === 0}
              />
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CommentReply;
