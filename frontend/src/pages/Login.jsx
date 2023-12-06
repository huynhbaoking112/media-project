import axios from "axios";
import React, { useState } from "react";
import { BiWorld } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import {login} from "../StoreState/userSlice.js"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [xacMinh, setXacMinh] = useState(false);
  const dispatch=useDispatch()
  const navigate=useNavigate()

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email: email,
        password: password,
      });

      toast.success("Login success!", { position: toast.POSITION.TOP_RIGHT });
      dispatch(login(res.data.user))
      navigate("/")
    } catch (error) {
      if(error.response.data.message=='cdxm'){
        
        setXacMinh(true)
        return  toast.error("Tài khoản chưa được xác minh!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      toast.error("Email or password is incorrect!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const HandleVerify=async()=>{
      try {
        const res=await axios.post("http://localhost:8000/api/auth/getIdAccount",{
          email
        })
        navigate("/verify/"+res.data.id)
      } catch (error) {
        toast.error("Email không tồn tại!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
  }

  return (
    <div
      className="w-full h-screen flex 
    "
    >
      <div className="w-[50%]  justify-center flex flex-col ml-[100px] gap-5 ">
        <p className="text-5xl font-bold text-blue-700 flex gap-3 items-center ">
          TECHSOCIAL
          <span className="animate-bounce">
            {" "}
            <BiWorld />
          </span>
        </p>
        <p className="w-[60%] text-xl font-medium">
          Connecting the whole world the world is at your fingertips.
        </p>
      </div>

      <div className="w-[50%] flex justify-center items-center">
        <div className="w-[80%] flex flex-col items-center gap-3 py-8 border-[1px] shadow-lg shadow-gray-500 rounded-lg">
          <form
            onSubmit={handleClick}
            className="w-full flex flex-col gap-3 justify-center items-center"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="outline-none p-3  font-sans rounded-lg border-[1px] w-[60%] border-gray-500"
              placeholder="Enter your email"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="outline-none p-3 font-sans rounded-lg border-[1px] w-[60%]  border-gray-500"
              placeholder="Enter your password"
            />
            <button
              type="submit"
              className="w-[60%] rounded-lg bg-blue-500 text-white py-2 font-medium hover:scale-110 duration-300"
            >
              LOGIN
            </button>
          </form>
         {xacMinh&&<p className="text-blue-500 hover:cursor-pointer" onClick={HandleVerify} >Verify Account</p>}
        
            <p className="w-[50%] flex justify-center items-center hover:cursor-pointer rounded-lg bg-green-500 text-white py-2 font-medium hover:scale-110 duration-300">
            <Link to="/register">Create a New Account  </Link>
            </p>
        
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
