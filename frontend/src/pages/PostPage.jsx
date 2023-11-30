import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import anh from "../asset/user2.jpg";
import { format } from "timeago.js";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import like from "../asset/heart.png";
import { BiSolidMessageRounded } from "react-icons/bi";
import { FcLike } from "react-icons/fc";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Comment from "../components/Comment";
import CommentInPostPage from "../components/CommentInPostPage";

const PostPage = () => {
  const navigate = useNavigate();
  const userCurrent = useSelector((state) => state.auth.user);
  const [userPost, setUserPost] = useState(null);
  const [postPage, setPostPage] = useState();
  const { postid } = useParams();
  const [isLike, setLike] = useState(false);
  const [numLike, setNumLike] = useState();
  const [openComment, setOpenComment] = useState(false);
  const [allCommentReply, setAllCommentReply] = useState();

  const handleIncrementComment=()=>{
      setAllCommentReply((e)=>e+1)
  }
  const handleDecrementComment=()=>{
      setAllCommentReply((e)=>e-1)
  }

  const fetchTheCommentWithPost = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/comment/post/" + postid
      );
      setAllCommentReply(res.data.allComment.length);
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const HandleLike = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/post/like/" + postPage._id,
        {
          userId: userPost._id,
        }
      );
      if (isLike) {
        setNumLike(numLike - 1);
      } else {
        setNumLike(numLike + 1);
      }
      setLike(!isLike);
      isLike
        ? toast.success("UnLike Success", {
            position: toast.POSITION.TOP_RIGHT,
          })
        : toast.success("Like Success", { position: toast.POSITION.TOP_RIGHT });
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const fetchThePost = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/post/" + postid);
      const resUser = await axios.get(
        "http://localhost:8000/api/user?" + "userId=" + res.data.post.userId
      );
      setUserPost(resUser.data.user);
      setPostPage(res.data.post);
      setNumLike(res.data.post.likes.length);
      if (res.data.post.likes.includes(resUser.data.user._id)) {
        setLike(true);
      } else {
        setLike(false);
      }
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    fetchThePost();
    fetchTheCommentWithPost();
  }, [postid]);
  return (
    <div className="w-full h-screen flex">
      <div
        className="absolute top-[15px] left-[15px] text-white flex"
        onClick={() => {
          navigate(-1);
        }}
      >
        <p className="rounded-full bg-transparent text-2xl hover:bg-gray-400 duration-300 hover:cursor-pointer w-[38px] h-[38px] flex justify-center items-center">
          X
        </p>
      </div>
      {/* setanh */}
      <div className="w-[65%] h-screen bg-[black]">
        <img
          src={postPage?.img}
          className="object-fill w-[60%] h-full mx-auto"
        />
      </div>
      {/* setProfile */}
      <div className="flex flex-col w-[35%] h-screen bg-[#242526] pt-[50px] px-[10px] text-white ">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Link to={"/userprofile/" + userPost?._id}>
              <img
                src={userPost?.coverPicture ? userPost?.coverPicture : anh}
                className="object-cover w-[45px] h-[45px] rounded-full"
              />
            </Link>
            <div className="flex flex-col justify-center ">
              <Link to={"/userprofile/" + userPost?._id}>
                <p className="font-sans font-bold">{userPost?.username}</p>
              </Link>
              <p className="font-thin text-[#A0A3A7] ">
                {format(postPage?.createdAt)}
              </p>
            </div>
          </div>
          <MoreVertIcon />
        </div>

        <p className="mt-[10px] mb-[30px]">{postPage?.desc}</p>
        <div className="flex justify-between items-center mx-[15px] mb-[10px] ">
          <div className="flex gap-1 justify-center items-center">
            <img src={like} className="object-cover w-[20px] h-[20px]" />
            <p className="font-thin text-[#A0A3A7] ">{numLike}</p>
          </div>
          <div className="flex items-center">
            <p className="text-[#A0A3A7]">{allCommentReply}</p>
            <BiSolidMessageRounded
              size={20}
              className="text-[#A0A3A7] hover:cursor-pointer"
            />
          </div>
        </div>

        <hr className="text-[#A0A3A7]" />

        <div className="flex w-full py-1">
          <div
            className="w-[50%] flex justify-center items-center hover:bg-gray-800 rounded-lg py-1 hover:cursor-pointer "
            onClick={HandleLike}
          >
            {isLike ? <FcLike size={28} /> : <AiOutlineHeart size={28} />}
            <p>Like</p>
          </div>
          <div
            onClick={() => {
              setOpenComment(!openComment);
            }}
            className="w-[50%] flex justify-center items-center hover:bg-gray-800 rounded-lg py-1 hover:cursor-pointer "
          >
            <BiMessageRounded size={28} />
            <p>Comment</p>
          </div>
        </div>
        <hr className="text-[#A0A3A7]" />

        <div className="max-h-full overflow-y-auto">
          <CommentInPostPage
            postId={postid}
            authorPostId={userPost?._id}
            openComment={openComment}
            handleIncrementComment={handleIncrementComment}
            handleDecrementComment={handleDecrementComment}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PostPage;
