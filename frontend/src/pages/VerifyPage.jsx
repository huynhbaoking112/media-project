import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {login} from "../StoreState/userSlice.js"



const VerifyPage = () => {

        useEffect(()=>{
                   const  sendMail=async()=>{
                        try {
                                const res=await axios.post("http://localhost:8000/api/auth/resendToken/"+id)
                                toast.success("Token đã gửi vào email thành công!", {
                                        position: toast.POSITION.TOP_RIGHT,
                                      }); 
                
                        } catch (error) {
                                toast.error("Có lỗi xảy ra vui lòng thử lại!", {
                                        position: toast.POSITION.TOP_RIGHT,
                                      }); 
                        }
                   }     
                   sendMail()
        },[])

        const navigate=useNavigate()
        const dispatch=useDispatch()
    const {id}=useParams()
    const [value1,setValue1]=useState("")
    const [value2,setValue2]=useState("")
    const [value3,setValue3]=useState("")
    const [value4,setValue4]=useState("")


    const  HandleSubmit=async(e)=>{
        e.preventDefault()
        try {
                if(!value1||!value2||!value3||!value4){
                        toast.error("Bạn phải điền đầy đủ token gồm 4 số", {
                                position: toast.POSITION.TOP_RIGHT,
                              });
                }
                const token=value1*1000+value2*100+value3*10+value4*1
                const res=await axios.post("http://localhost:8000/api/auth/verify/"+id,{
                        token
                })
                localStorage.setItem('token', res.data.token);
                dispatch(login(res.data.user))
                navigate("/")
        } catch (error) {
                toast.error("Token không đúng hoặc đã hết hạn!", {
                        position: toast.POSITION.TOP_RIGHT,
                      }); 
    }
    }

    const HandleResendToken=async(e)=>{
        e.preventDefault()
        try {
                const res=await axios.post("http://localhost:8000/api/auth/resendToken/"+id)
                toast.success("Refesh token thành công!", {
                        position: toast.POSITION.TOP_RIGHT,
                      }); 

        } catch (error) {
                toast.error("Có lỗi xảy ra vui lòng thử lại!", {
                        position: toast.POSITION.TOP_RIGHT,
                      }); 
        }
    }

  return (
   <div  className='w-full h-screen flex justify-center items-center' >
            <div className='flex flex-col h-[300px] w-[500px] bg-slate-100 rounded-lg  shadow-lg shadow-yellow-600 hover:shadow-xl  hover:shadow-violet-600 duration-300 hover:cursor-pointer' >
                    <p className='flex justify-center items-center text-2xl font-king  bg-gradient-to-r from-[#2196f3] to-[#f44336] bg-clip-text text-transparent animate-bounce'>Xác minh tài  khoản</p>
                    <p className='flex justify-center items-center text-xl font-king  bg-gradient-to-r from-[#16BFFD] to-[#CB3066] bg-clip-text text-transparent'>Mời bạn nhập mã xác minh tài khoản TECHSOCIAL</p>
                    <form onSubmit={HandleSubmit}  className='w-full h-full flex flex-col gap-[40px] justify-center items-center ' >
                            <div className='flex justify-center gap-4'>
                                {value1?<input required type='text' maxLength="1"  className='outline-none border-[2px] border-green-500  w-[40px] h-[50px]  rounded-lg'  style={{textAlign: 'center'}} value={value1} onChange={(e)=>{setValue1(e.target.value)}} />:<input required type='text' maxLength="1"  className='outline-none border-[2px]  w-[40px] h-[50px]  rounded-lg'  value={value1} onChange={(e)=>{setValue1(e.target.value)}}  style={{textAlign: 'center'}} />}
                                {value2?<input  required type='text' maxLength="1"  className='outline-none border-[2px] border-green-500  w-[40px] h-[50px]  rounded-lg'  style={{textAlign: 'center'}} value={value2} onChange={(e)=>{setValue2(e.target.value)}} />:<input required type='text' maxLength="1"  className='outline-none border-[2px]  w-[40px] h-[50px]  rounded-lg'  value={value2} onChange={(e)=>{setValue2(e.target.value)}}  style={{textAlign: 'center'}} />}
                                {value3?<input required type='text' maxLength="1"  className='outline-none border-[2px] border-green-500  w-[40px] h-[50px]  rounded-lg'  style={{textAlign: 'center'}} value={value3} onChange={(e)=>{setValue3(e.target.value)}} />:<input required type='text' maxLength="1"  className='outline-none border-[2px]  w-[40px] h-[50px]  rounded-lg'  value={value3} onChange={(e)=>{setValue3(e.target.value)}}  style={{textAlign: 'center'}} />}
                                {value4?<input required type='text' maxLength="1"  className='outline-none border-[2px] border-green-500  w-[40px] h-[50px]  rounded-lg'  style={{textAlign: 'center'}} value={value4} onChange={(e)=>{setValue4(e.target.value)}} />:<input required type='text' maxLength="1"  className='outline-none border-[2px]  w-[40px] h-[50px]  rounded-lg'  value={value4} onChange={(e)=>{setValue4(e.target.value)}}  style={{textAlign: 'center'}} />}
                            </div>
                            <button type='submit' className='px-3 py-2 rounded-lg text-white bg-gradient-to-r from-[#16BFFD] to-[#CB3066] hover:cursor-pointer hover:scale-110 duration-300'>
                                VERIFY
                            </button>
                    </form>
                    <button onClick={HandleResendToken} className='px-3 py-2 rounded-lg text-white bg-gradient-to-r from-[#16BFFD] to-[#CB3066] hover:cursor-pointer hover:scale-110 duration-300 mx-auto mb-2 w-[40%]'> Gửi lại token</button>
            </div>     
            <ToastContainer/>  
   </div>
  )
}

export default VerifyPage  