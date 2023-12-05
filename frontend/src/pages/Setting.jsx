import React, { useState } from 'react'
import { useSelector } from "react-redux";
import anh from "../asset/user2.jpg"
import { FaPencil } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import  {login} from "../StoreState/userSlice"
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const Setting = () => {
    const  dispatch=useDispatch()
    const user=useSelector((state)=>state.auth.user)
    const [city,setCity]=useState(user.city)
    const [des,setDes]=useState(user.desc)
    const [from,setFrom]=useState(user.from)
    const  [email,setEmail]=useState(user.email)
    const [fileAvatar,setFileAvatar]=useState()

    const HandleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("desc", des);
            formData.append("city", city);
            formData.append("from", from);
            formData.append('image',fileAvatar)
            const res = await axios.patch("http://localhost:8000/api/user/"+user._id, formData, {
              headers: {
                "content-type": "multipart/form-data",
              },
            });
           dispatch(login(res.data.user))
           toast.success("Change success!", {
            position: toast.POSITION.TOP_RIGHT,
          });
            
          } catch (error) {
            toast.error("Something's wrong, please try again.!", {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
    }

  return (
    <div className='w-full flex  justify-center  mb-[50px]  pt-[20px]'>
        <form   action="/upload"
      method="post"
      enctype="multipart/form-data"
      onSubmit={HandleSubmit}
         className='w-[70%] flex flex-col items-center gap-2 '>
                <div className='flex justify-center items-center w-full relative'>
                {/* phanpic */}
                        <div className='flex w-full'>
                       <img className='w-full h-[200px]' src={user.coverPicture?user.coverPicture:"https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D"} />
                        <div className='absolute bottom-[2px] right-3   '>

                             {/* <label htmlFor="cover" className='hover:cursor-pointer '>
                                <FaPencil  className='text-white     ' size={25}/>
                                <input accept=".png,.jpeg,.jpg" 
                                 className='hidden' 
                                 type="file" id="cover" 
                                onChange={(e)=>{
                                    setFileCover(e.target.files[0])
                                }}  />
                            </label>  */}
                            
                            

                        </div>
                        </div>

                {/* phanimage */}
                        <div className='absolute top-[150px]'>
                       {fileAvatar? <img className='object-cover w-[130px] h-[130px] rounded-full ' src={URL.createObjectURL(fileAvatar)} />: <img className='object-cover w-[130px] h-[130px] rounded-full ' src={user.profilePicture?user.profilePicture:anh} />}
                        <div className='absolute bottom-0 right-0   '>

                                <label htmlFor='image' className='hover:cursor-pointer'>
                            <IoMdAddCircle className='text-cyan-600 ' size={20}/>
                            <input type='file' id="image" accept='.png,.jpeg,.jpg' className='hidden' onChange={(e)=>{
                                setFileAvatar(e.target.files[0])
                            }} />
                                </label>
                            
                        </div>
                        </div>
                </div>

                {/* setphanten */}
                <div className='flex justify-center items-center mt-[80px]'>
                    <p className='font-medium text-xl'>{user.username}</p>
                </div>
                
                {/* setcacthuoctinh */}
                <div className='flex flex-col gap-8 w-full'>

                <div className='flex w-full pl-[50px] gap-2 border-[3px] p-2'>
                    <p className='font-medium' >City: </p>
                    <input className='outline-none w-full' value={city} onChange={(e)=>{
                        setCity(e.target.value)
                    }} placeholder={user.city?user.city:'Chưa xác định'}/>
                </div>
                <div className='flex w-full pl-[50px] gap-2 border-[3px] p-2'>
                    <p className='font-medium' >Des: </p>
                    <input className='outline-none w-full' value={des} onChange={(e)=>{
                        setDes(e.target.value)
                    }} placeholder={user.des?user.des:'Chưa xác định'}/>
                </div>
                <div className='flex w-full pl-[50px] gap-2 border-[3px] p-2'>
                    <p className='font-medium' >From: </p>
                    <input className='outline-none w-full' value={from} onChange={(e)=>{
                        setFrom(e.target.value)
                    }} placeholder={user.from?user.from:'Chưa xác định'}/>
                </div>
                <div className='flex w-full pl-[50px] gap-2 border-[3px] p-2'>
                    <p className='font-medium' >Email: </p>
                    <input className='outline-none w-full' onChange={(e)=>{
                        setEmail(e.target.value)
                    }} value={email} placeholder={user.email?user.email:'Chưa xác định'}/>
                </div>

                {/* nutsave */}
                <div className='w-full justify-center items-center flex'>
                        <button type='submit' className='px-5 py-2 rounded-lg bg-gradient-to-r from-[#42275a] to-[#734b6d] hover:cursor-pointer hover:scale-110 duration-300 text-white'>
                            SAVE
                        </button>
                </div>
                </div>
        </form>
 <ToastContainer />
      
    </div>
  )
}

export default Setting