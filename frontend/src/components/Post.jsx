import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import anh from "../asset/user2.jpg";
import anh3 from "../asset/like.png";
import anh4 from "../asset/heart.png";
import axios from "axios";

import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import { AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import Comment from "./Comment";
import AllComment from "./AllComment";
import { FaComments } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import Modal from "react-modal";
import { FcShare } from "react-icons/fc";

const Post = ({ desc, likes, img, userId, createdAt, _id, userShare }) => {
  const userCurrent = useSelector((state) => state.auth.user);
  const [like, setLike] = useState(likes.length);
  const [isLike, setIsLike] = useState(false);
  const [err, setErr] = useState(false);
  const [user, setUser] = useState(null);
  const [allCommentReply, setAllCommentReply] = useState();
  const [openComment, setOpenComment] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [countShare, setCountShare] = useState(userShare?.length);

  const HandleIncrementComment = () => {
    setAllCommentReply((e) => e + 1);
  };
  const HandleDecrementComment = () => {
    setAllCommentReply((e) => e - 1);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const handleYes = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/post/sharePost/" + _id,
        {
          userId: userCurrent._id,
        }
      );
      toast.success("Share post success!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setCountShare(countShare + 1);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };
  const handleNo = () => {
    closeModal();
  };

  const fetchTheCommentWithPost = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/comment/post/" + _id
      );
      setAllCommentReply(res.data.allComment.length);
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const fetchTheUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/user?" + "userId=" + userId
      );
      setUser(res.data.user);
      if (likes.includes(userCurrent._id)) {
        setIsLike(true);
      }
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  useEffect(() => {
    fetchTheUser();
    fetchTheCommentWithPost();
  }, []);

  const HandleLike = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/post/like/" + _id,
        {
          userId: userCurrent._id,
        }
      );
      setLike(isLike ? like - 1 : like + 1);

      setIsLike(!isLike);
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const HandleOpenComment = () => {
    setOpenComment(!openComment);
  };

  return (
    <div className="flex flex-col rounded-lg shadow-lg shadow-gray-600 p-3 gap-3 ">
      <div className="flex items-center ">
        <Link to={"/userprofile/" + userId}>
          <img
            src={user?.coverPicture === "" ? anh : user?.coverPicture}
            className="object-cover rounded-full w-[50px] h-[50px]"
          />
        </Link>
        <div className="flex flex-col ml-[8px]">
          <Link to={"/userprofile/" + _id}>
            <p className="  font-medium">{user?.username}</p>
          </Link>
          <p className="font-thin">{format(createdAt)}</p>
        </div>
        <MoreVertIcon className="ml-auto" />
      </div>
      {desc && <p className="hover:cursor-pointer">{desc}</p>}
      {img && (
        <Link to={"/post/" + _id}>
          <img
            src={img}
            className="object-fill w-full h-[300px] hover:cursor-pointer"
          />
        </Link>
      )}
      <div className="flex items-center gap-3 justify-between">
        {/* <img src={anh3} onClick={HandleLike} className='object-cover hover:cursor-pointer  hover:scale-125 duration-300 w-[25px] h-[25px] mr-[5px]'/> */}
        <div className="flex gap-3 w-[33%] hover:cursor-pointer hover:scale-105  duration-300 hover:border-[1px] p-2 rounded-lg hover:border-gray-500">
          <span
            onClick={HandleLike}
            className="hover:scale-125 duration-300 hover:cursor-pointer"
          >
            {isLike ? <FcLike size={23} /> : <AiOutlineHeart size={23} />}
          </span>
          <p className="font-thin">{like} people like it</p>
        </div>

        <p
          className="font-thin flex items-center justify-center w-[33%] gap-1  hover:cursor-pointer hover:scale-105  duration-300 hover:border-[1px] p-2 rounded-lg hover:border-gray-500"
          onClick={HandleOpenComment}
        >
          {allCommentReply}
          {" comment"}
          <FaComments
            className="text-green-600 hover:text-green-700 active:text-green-800"
            size={25}
          />
        </p>
        {userCurrent?._id != user?._id && (
          <div className="flex items-center justify-center w-[33%] gap-1 hover:cursor-pointer hover:scale-105  duration-300 hover:border-[1px] p-2 rounded-lg hover:border-gray-500">
            <p className="font-thin">{countShare} Share</p>
            <div>
              <FaShare
                size={25}
                className="text-blue-600 hover:text-gblue-700 active:text-blue-800 w-[80%]"
                onClick={() => {
                  setIsOpenModal(true);
                }}
              />
              <Modal
                className="absolute top-[50%] outline-none left-[50%] bottom-[50%] right-[50%] rounded-xl  w-[400px] h-[300px]  translate-x-[-50%] translate-y-[-50%]"
                isOpen={isOpenModal}
                onRequestClose={closeModal}
              >
                <div className="flex flex-col justify-center h-full w-full gap-5 rounded-xl px-3 border-[2px] bg-slate-50 shadow-lg shadow-gray-600">
                  <div className="flex justify-center items-center gap-2 text-black">
                    <p className="font-semibold bg-gradient-to-r from-[#00bf8f] to-[#001510] bg-clip-text text-transparent">
                      Bạn có chắc chắn muốn chia sẻ bài viết này{" "}
                    </p>
                    <FcShare
                      size={23}
                      className="text-red-500 animate-bounce"
                    />
                  </div>
                  <div className="flex justify-between ">
                    <button
                      onClick={handleYes}
                      className="w-[40%] py-1 rounded-lg border-[1px] bg-gradient-to-r from-[#c2e59c] to-[#64b3f4] hover:text-[20px] text-white hover:cursor-pointer hover:scale-110 duration-300 hover:bg-gradient-to-r  hover:from-[#64b3f4] hover:to-[#c2e59c]"
                    >
                      Yes
                    </button>
                    <button
                      onClick={handleNo}
                      className="w-[40%] py-1 rounded-lg border-[1px] bg-gradient-to-r from-[#16BFFD] to-[#CB3066] hover:text-[20px] text-white hover:cursor-pointer hover:scale-110 duration-300 hover:bg-gradient-to-r  hover:from-[#CB3066] hover:to-[#16BFFD]"
                    >
                      No
                    </button>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        )}
      </div>

      {/* setPhanUserComment */}
      {openComment && (
        <Comment
          postId={_id}
          HandleIncrementComment={HandleIncrementComment}
          authorPostId={userId}
          HandleDecrementComment={HandleDecrementComment}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default Post;
