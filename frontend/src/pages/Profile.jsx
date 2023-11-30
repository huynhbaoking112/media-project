import React, { useEffect, useState } from "react";
import background from "../asset/6.jpeg";
import anh from "../asset/user2.jpg";
import Feed from "../components/Feed";
import FriendInUser from "../components/FriendInUser";
import Post from "../components/Post";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaUserFriends } from "react-icons/fa";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdOutlineMobileFriendly } from "react-icons/md";
import { FaRegHandshake } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { unfollow, following } from "../StoreState/userSlice";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import Share from "../components/Share";
import { setAllTimeLine } from "../StoreState/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const [friend, setFriend] = useState(false);
  const [follow, setFollow] = useState(false);
  const params = useParams();
  const [user, setUser] = useState({});
  const [err, setErr] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const currentPost = useSelector((state) => state.auth.allTimeLine);

  const HandleAddFriend = async (e) => {
    e.preventDefault();
  };
  const HandleFollow = async (e) => {
    e.preventDefault();
    try {
      if (follow) {
        const res = await axios.patch(
          "http://localhost:8000/api/user/" + params.userId + "/unfollower",
          {
            _id: currentUser._id,
          }
        );
        dispatch(unfollow(currentUser.followins.indexOf(params.userId)));
        setFollow(false);
        toast.success("UnFollow success!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        const res = await axios.patch(
          "http://localhost:8000/api/user/" + params.userId + "/follower",
          {
            _id: currentUser._id,
          }
        );
        dispatch(following(params.userId));
        setFollow(true);
        toast.success("Follow success!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/post/allpost/" + params.userId
      );
      const resPostShare = await axios.get(
        "http://localhost:8000/api/post/getPostShare/" + params.userId
      );

      dispatch(
        setAllTimeLine([...res.data.allpost, ...resPostShare.data.mang])
      );
      currentUser.followins.includes(params.userId)
        ? setFollow(true)
        : setFollow(false);
      currentUser.friends.includes(params.userId)
        ? setFriend(true)
        : setFriend(false);
    } catch (error) {
      setErr(true);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const resUser = await axios.get(
        "http://localhost:8000/api/user?userId=" + params.userId
      );
      setUser(resUser.data.user);
    } catch (error) {
      setErr(true);
    }
  };
  useEffect(() => {
    fetchUserProfile();
    fetchProfile();
  }, [params.userId]);

  return (
    <div className="flex w-full flex-col ">
      {/* Set phan tren */}
      <div className="w-full relative">
        <img
          className="object-cover w-full h-[150px]"
          src={
            user?.profilePicture != ""
              ? user?.profilePicture
              : "https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D"
          }
        />
        <div>
          <img
            src={user?.coverPicture != "" ? user?.coverPicture : anh}
            className="w-[140px] h-[140px] object-cover rounded-full absolute bottom-[-50%] left-[43%]  "
          />
        </div>
      </div>

      {/*set phan ten */}
      <div className="flex justify-center items-center mt-[85px]">
        <p className="font-bold text-xl">{user?.username}</p>
      </div>
      <div className="flex justify-center items-center my-[15px] ">
        <p>{user?.desc ? user.desc : "Hello my friend"}</p>
      </div>

      {/* Set phan duoi */}
      <div className="flex w-full gap-10 ">
        <div className="w-[65%] mb-[50px] flex flex-col gap-[35px] ">
          {currentUser._id == params.userId && <Share />}
          {currentPost.map((thePost) => {
            return thePost?.userId == user._id ? (
              <Post
                key={thePost._id}
                desc={thePost.desc}
                likes={thePost.likes}
                img={thePost.img}
                userId={thePost.userId}
                createdAt={thePost.createdAt}
                _id={thePost._id}
              />
            ) : (
              <div className="flex flex-col border-[2px] py-3 border-gray-500  rounded-lg gap-2 px-2">
                <div className="flex items-center gap-2">
                <Link to={"/userprofile/"+user?._id}>
                  <img
                    src={user?.profilePicture ? user?.profilePicture : anh}
                    className="object-cover w-[62px] h-[62px] rounded-full"
                  />
                </Link>
                  <div className="flex flex-col">
                  <p className="font-medium ">{user?.username}</p>
                  <p className="text-gray-400">Bài viết đã chia sẻ</p>
                  </div>
                </div>
                <hr/>
                <Post
                  key={thePost._id}
                  desc={thePost.desc}
                  likes={thePost.likes}
                  img={thePost.img}
                  userId={thePost.userId}
                  createdAt={thePost.createdAt}
                  _id={thePost._id}
                />
              </div>
            );
          })}
        </div>

        <div className="w-[35%]">
          <div className="w-full flex flex-col gap-2 sticky top-[70px]">
            {currentUser._id != params.userId && (
              <div className="flex justify-center gap-3 w-full">
                {friend ? (
                  <button className="flex group w-[40%] justify-center items-center gap-2 bg-blue-500 rounded-lg py-2 px-4 text-white font-medium hover:scale-105 duration-300">
                    Friend{" "}
                    <span className="group-hover:animate-bounce">
                      <FaUserFriends />
                    </span>{" "}
                  </button>
                ) : (
                  <button className="flex group w-[40%] justify-center items-center gap-2 bg-blue-500 rounded-lg py-2 px-4 text-white font-medium hover:scale-105 duration-300">
                    AddFriend{" "}
                    <span className="group-hover:animate-bounce">
                      <AiOutlineUsergroupAdd size={20} />
                    </span>{" "}
                  </button>
                )}
                {follow ? (
                  <button
                    onClick={HandleFollow}
                    className="flex group w-[40%] justify-center items-center gap-2 bg-blue-500 rounded-lg py-2 px-4 text-white font-medium hover:scale-105 duration-300"
                  >
                    Following{" "}
                    <span className="group-hover:animate-bounce">
                      <MdOutlineMobileFriendly />
                    </span>{" "}
                  </button>
                ) : (
                  <button
                    className="flex group w-[40%] justify-center items-center gap-2 bg-blue-500 rounded-lg py-2 px-4 text-white font-medium hover:scale-105 duration-300"
                    onClick={HandleFollow}
                  >
                    Follow{" "}
                    <span className="group-hover:animate-bounce">
                      <FaRegHandshake size={20} />
                    </span>
                  </button>
                )}
              </div>
            )}
            <p className="flex justify-center font-medium">USER INFORMATION</p>
            <p className="font-semibold text-gray-600">
              City: <span className="font-thin">{user?.city}</span>
            </p>
            <p className="font-semibold text-gray-600">
              From: <span className="font-thin">{user?.from}</span>
            </p>
            <p className="font-semibold text-gray-600">
              Relationship:{" "}
              <span className="font-thin">
                {user?.relationship === 1
                  ? "Single"
                  : user?.relationship === 2
                  ? "Married"
                  : "complicated relationship"}
              </span>
            </p>

            <p className="flex justify-center font-medium">USER FRIENDS</p>
            <div className=" grid grid-cols-3">
              <FriendInUser />
              <FriendInUser />
              <FriendInUser />
              <FriendInUser />
              <FriendInUser />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
