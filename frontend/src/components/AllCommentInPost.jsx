import React, { useEffect, useState } from "react";
import anh from "../asset/user2.jpg";
import axios from "axios";
import { format } from "timeago.js";
import { useSelector } from "react-redux";
import like from "../asset/like.png";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import CommentReply from "./CommentReply";
import { IoMdMore } from "react-icons/io";
import { FcProcess } from "react-icons/fc";
import { GiCancel } from "react-icons/gi";
import { HiPaperAirplane } from "react-icons/hi";
import EmojiPicker from "emoji-picker-react";

const AllCommentInPost = ({ handleDecrementComment,comment, allCommentReply, setAllCommetHandle }) => {
    const [thisComment, setThisComment] = useState(comment);
    const curretLoginUser = useSelector((state) => state.auth.user);
    const [authorComment, setAuthorComment] = useState();
    const [isLike, setIsLike] = useState(false);
    const [isOpenReply, setIsOpenReply] = useState(false);
    const [isOpenMore, setIsOpenMore] = useState(false);
    const [isOpenChange, setIsOpenChange] = useState(false);
    const [valueChange, setValueChange] = useState("");
    const [valueReplyComment, setValueReplyComment] = useState("");
  
  
    const fetchUserComment = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/user?userId=" + thisComment?.authorId
        );
        setAuthorComment(res.data.user);
        if (thisComment.likes.includes(curretLoginUser._id)) {
          setIsLike(true);
        } else {
          setIsLike(false);
        }
      } catch (error) {
        //navigate den 404
        console.log(error);
      }
    };
  
    useEffect(() => {
      fetchUserComment();
    }, []);
  
    const HandleOpenReply = () => {
      setIsOpenReply(!isOpenReply);
    };
  
    const setComment = (arr) => {
      return setThisComment(arr);
    };
  
    const HandleDeleteTheComment = async () => {
      try {
        const res = await axios.delete(
          "http://localhost:8000/api/comment/post/comment/" + thisComment._id,
          {
            data: {
              method: "DELETE",
              userId: curretLoginUser._id,
              name: "king",
            },
          }
        );
        const allCM = allCommentReply.filter((e) => e._id != thisComment._id);
  
        setAllCommetHandle(allCM);
        handleDecrementComment()
        setIsOpenMore(false);
      } catch (error) {
        toast.error("Something's wrong, please try again.!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
  
    const HandleChange = () => {
      setIsOpenChange(!isOpenChange);
      setIsOpenMore(!isOpenMore);
    };
  
    const HandleChangeSubmit = async () => {
      try {
        const res = await axios.patch(
          "http://localhost:8000/api/comment/post/comment/" + thisComment?._id,
          {
            userId: curretLoginUser?._id,
            comment: valueChange,
          }
        );
  
        setThisComment({ ...thisComment, content: valueChange });
        setValueChange("");
        setIsOpenChange(false);
      } catch (error) {
        toast.error("Something's wrong, please try again.!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
  
    const HandleLikeComment = async () => {
      try {
        const res = await axios.patch(
          "http://localhost:8000/api/comment/post/comment/" + thisComment?._id,
          { userId: curretLoginUser?._id }
        );
        setThisComment(res.data.commentPost);
        isLike
          ? toast.success("Unlike success.!", {
              position: toast.POSITION.TOP_RIGHT,
            })
          : toast.success("Like success.!", {
              position: toast.POSITION.TOP_RIGHT,
            });
      } catch (error) {
        toast.error("Something's wrong, please try again.!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
  
    const HandleSubmitTheRepComment = async () => {
      try {
        if (!valueReplyComment){
          throw new Error("Something's wrong, please try again.!");
        }
        const res = await axios.post(
          "http://localhost:8000/api/comment/commentreply/" + thisComment?._id,
          {
            authorId: curretLoginUser?._id,
            content: valueReplyComment,
          }
        );
        setThisComment(res.data.comment)
        setValueReplyComment("")
  
      } catch (error) {
        toast.error("Something's wrong, please try again.!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
  
  
    return (
      <div className="flex gap-1  ">
        <img
          className="object-cover w-[40px] h-[40px] rounded-full"
          src={authorComment?.coverPicture ? authorComment?.coverPicture : anh}
        />
        <div className="flex flex-col w-full mx-1    ">
          <div className="flex flex-col border-[1px] rounded-lg p-2 relative ">
            <div className="flex items-center gap-2">
              <p className="font-sans font-bold text-[13px] text-[#E4E6EB]">
                {authorComment?.username}
              </p>
              {thisComment?.authorPostId == thisComment?.authorId && (
                <p className="font-thin rounded-lg text-blue-600  bg-blue-300 px-1">
                  authorPost
                </p>
              )}
              <div className="relative ml-auto text-[#E4E6EB]">
                {(curretLoginUser?._id == thisComment?.authorId ||
                  curretLoginUser?._id == thisComment?.authorPostId) && (
                  <p className=" cursor-pointer">
                    <IoMdMore
                      size={20}
                      onClick={() => {
                        setIsOpenMore(!isOpenMore);
                      }}
                    />
                  </p>
                )}
                {isOpenMore && (
                  <div className="flex flex-col absolute top-[17px] left-[-50px] rounded-lg text-gray-600 bg-gray-200 p-2 ">
                    {curretLoginUser?._id === thisComment?.authorId && (
                      <p
                        className="hover:cursor-pointer  hover:scale-105 duration-300 hover:text-green-500"
                        onClick={HandleChange}
                      >
                        Change
                      </p>
                    )}
                    {(curretLoginUser?._id == thisComment?.authorId ||
                      curretLoginUser?._id == thisComment?.authorPostId) && (
                      <p
                        className="hover:cursor-pointer hover:scale-105 duration-300 hover:text-red-500"
                        onClick={HandleDeleteTheComment}
                      >
                        Delete
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p>{thisComment?.content}</p>
              {isOpenChange && (
                <div className="flex w-full items-center justify-between">
                  <input
                    className="outline-none border-[1px] text-black rounded-lg mt-[3px] px-2 py-1 w-[80%]"
                    placeholder={thisComment?.content}
                    value={valueChange}
                    onChange={(e) => {
                      setValueChange(e.target.value);
                    }}
                  />
                  <FcProcess
                    size={25}
                    className="hover:animate-spin hover:cursor-pointer "
                    onClick={HandleChangeSubmit}
                  />
                  <GiCancel
                    size={25}
                    className="hover:cursor-pointer hover:text-red-500"
                    onClick={() => {
                      setIsOpenChange(false);
                    }}
                  />
                </div>
              )}
            </div>
            {thisComment?.likes.length != 0 && (
              <div className="flex flex-col group/like">
                <img
                  src={like}
                  className="object-cover hover:scale-110 duration-300 hover:cursor-pointer w-[18px] h-[18px] absolute bottom-[0px] right-0"
                />
  
                <p className="group-hover/like:flex text-[15px] text-gray-6 00 px-1 rounded-lg bg-slate-200 hidden absolute bottom-[22px] right-0">
                  {thisComment?.likes.length} like
                </p>
              </div>
            )}
          </div>
  
          <div className="flex gap-2 text-[13px] text-[#B0B3B8] px-2">
            <p>{format(thisComment?.createdAt)}</p>
            <p
              className={
                thisComment?.likes.includes(curretLoginUser?._id)
                  ? "text-blue-500 hover:cursor-pointer hover:underline  hover:scale-105 duration-300"
                  : "text-[#B0B3B8] hover:cursor-pointer hover:underline  hover:scale-105 duration-300"
              }
              onClick={HandleLikeComment}
            >
              {thisComment?.likes.includes(curretLoginUser?._id)
                ? "Đã thích"
                : "Thích"}
            </p>
            <p
              className="hover:cursor-pointer hover:underline hover:scale-105 duration-300 text-[#B0B3B8] "
              onClick={HandleOpenReply}
            >
              reply
            </p>
          </div>
          <div className="w-full ml-[15px] flex flex-col gap-2 mt-1">
            {isOpenReply && (
              <div className="flex w-full items-center gap-3">
                <input
                  className="outline-none px-2 py-1 w-[70%] rounded-lg text-black border-[1px]"
                  placeholder={"Reply " + thisComment?.content + "..."}
                  value={valueReplyComment}
                  onChange={(e) => {
                    setValueReplyComment(e.target.value);
                  }}
                  onKeyDown={(e)=>{
                      if(e.code=="Enter"){
                        HandleSubmitTheRepComment()
                      }
                    }}
                />
                <div className="relative group/air">
                  <HiPaperAirplane
                    size={23}
                    className="rotate-45 hover:scale-105 duration-300 hover:text-blue-500 text-blue-400 hover:cursor-pointer "
                    onClick={HandleSubmitTheRepComment}
                    
                  />
                  <p className="absolute top-[-25px] hidden  group-hover/air:flex border-[1px] rounded-lg bg-gray-400 px-2 py-1 text-gray-100 text-[11px]">
                    SubmitTheReply
                  </p>
                </div>
              </div>
            )}
            {isOpenReply &&
              thisComment?.replies.map((e) => {
                return (
                  <CommentReply
                    key={e._id}
                    setComment={setComment}
                    commentId={thisComment?._id}
                    authorPostId={thisComment?.authorPostId}
                    commentReply={e}
                  />
                );
              })}
          </div>
        </div>
        <ToastContainer />
      </div>
    );
}

export default AllCommentInPost