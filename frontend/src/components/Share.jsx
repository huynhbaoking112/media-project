import React, { useState } from "react";
import anh from "../asset/user2.jpg";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { sharePost } from "../StoreState/userSlice";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import EmojiPicker from "emoji-picker-react";

const Share = ({ img, userId }) => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("desc", desc);
      formData.append("userId", user._id);
      formData.append("image", file);
      const res = await axios.post("http://localhost:8000/api/post", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      dispatch(sharePost(res.data.post));
      setFile(null)
      setDesc("")
      toast.success("Share post success!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error("Something's wrong, please try again.!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const HandleClose = () => {
    setFile(null);
  };
  return (
    <form
      action="/upload"
      method="post"
      enctype="multipart/form-data"
      onSubmit={HandleSubmit}
      className="flex flex-col w-[full] mt-[15px] shadow-lg shadow-gray-500 rounded-lg p-3"
    >
      <div className="flex gap-3 ">
        <div>
          <Link to={"/userprofile/" + userId}>
            <img
              src={img ? img : anh}
              className="w-[52px] h-[52px] rounded-full object-cover"
            />
          </Link>
        </div>
        <input
          placeholder={"What's in your mind " + user.username}
          className="outline-none w-full"
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
          }}
        />
      </div>
      {file && (
        <div className="relative mt-[5px] w-[100px] h-[100px]">
          <img
            className="object-cover rounded-lg  w-full h-full  "
            src={URL.createObjectURL(file)}
          />
          <p
            className="absolute top-[-7px] rounded-full border-[1px] bg-gray-400 w-[22px] h-[22px] flex justify-center items-center right-[-7px] hover:cursor-pointer hover:text-black text-gray-500"
            onClick={HandleClose}
          >
            X
          </p>
        </div>
      )}
      <hr className="mt-[15px]" />
      <div className="flex items-center mt-3 justify-between">
        <label htmlFor="upfile" className="flex gap-2 hover:cursor-pointer">
          <AddAPhotoIcon className="text-orange-500" />
          <p>Photo or videos</p>
          <input
            accept=".png,.jpeg,.jpg"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
            className="hidden"
            id="upfile"
            type="file"
          />
        </label>
        <div className="flex gap-2">
          <AddLocationAltIcon className="text-green-500" />
          <p>Location</p>
        </div>
        <div className="relative">
          <AddReactionIcon
            className="text-yellow-400 hover:cursor-pointer hover:scale-105 duration-300"
            onClick={() => {
              setOpenEmoji(!openEmoji);
            }}
          />
         {openEmoji&&<div className="absolute  z-10 bottom-[-400px] " >
         <EmojiPicker height="400px" width="300px" onEmojiClick={(e)=>{
          setDesc((a)=>{return a+e.emoji })
         }} />
         </div>
         }
        </div>
        <LocalOfferIcon className="text-blue-500" />
        <button
          type="submit"
          className="bg-blue-400 p-2 rounded-lg hover:bg-blue-500"
        >
          Share
        </button>
      </div>
      <ToastContainer />
    </form>
  );
};

export default Share;
