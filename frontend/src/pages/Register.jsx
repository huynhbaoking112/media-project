import React, { useState } from 'react'
import {BiWorld} from "react-icons/bi"
import { Link,Navigate, useNavigate } from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {login} from "../StoreState/userSlice.js"

const Register = () => {
    const dispatch=useDispatch()
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [passwordAgain,setPasswordAgain]=useState("")
    const navigate=useNavigate()

    const handleClick=async(e)=>{
        e.preventDefault()
        try {
            if(password!=passwordAgain) throw new Error("Confirmation password does not match")

            const res= await axios.post("http://localhost:8000/api/auth/register",{
                username:username,
                email:email,
                password:password
            })
            dispatch(login(res.data.user))
            navigate("/")
        } catch (error) {
            console.log(error);
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
        }
    }

  return (
    <div className='w-full h-screen flex 
    ' >
        <div className='w-[50%]  justify-center flex flex-col ml-[100px] gap-5 '>

    
            <p className='text-5xl font-bold text-blue-700 flex gap-3 items-center '>TECHSOCIAL<span className='animate-bounce'>    <BiWorld/></span></p>
            <p className='w-[60%] text-xl font-medium'>Connecting the whole world the world is at your fingertips.</p>
        </div>  
        <div className='w-[50%] flex justify-center items-center' >
            <form onSubmit={handleClick} className='w-[80%] flex flex-col items-center gap-3 py-8 border-[1px] shadow-lg shadow-gray-500 rounded-lg'>
                <input type="text" required
                value={username} onChange={(e)=>{setUsername(e.target.value)}} className='outline-none p-3 font-sans rounded-lg border-[1px] w-[60%] border-gray-500' placeholder='Enter your username'/>
                <input required type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} className='outline-none p-3 font-sans rounded-lg border-[1px] w-[60%] border-gray-500' placeholder='Enter your email'/>
                <input required type="password" minLength={6} value={password} onChange={(e)=>{setPassword(e.target.value)}} className='outline-none p-3 font-sans rounded-lg border-[1px] w-[60%] border-gray-500' placeholder='Enter your password'/>
                <input required type="password" minLength={6} value={passwordAgain} onChange={(e)=>{setPasswordAgain(e.target.value)}}  className='outline-none p-3 font-sans rounded-lg border-[1px] w-[60%] border-gray-500' placeholder='Enter your password again'/>
                <button type="submit" className='w-[60%] rounded-lg bg-blue-500 text-white py-2 font-medium hover:scale-110 duration-300'>
                    REGISTER
                </button>
                <p className='text-blue-500' >Forgot Passoword?</p>
                <Link to="/login" className='hover:cursor-pointer w-[50%] rounded-lg bg-green-500 text-white py-2 font-medium hover:scale-110 duration-300' >
                <p className='flex justify-center items-center '>
                 LOGIN
                </p>
                 </Link>
            </form>
        </div>
        <ToastContainer />
    </div>
  )
}

export default Register