import React, { useEffect, useState } from 'react'
import anh from "../asset/user2.jpg"
import { MdOutlineMobileFriendly } from 'react-icons/md'
import { FaRegHandshake, FaUserFriends } from 'react-icons/fa'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { unfollow,following } from '../StoreState/userSlice'
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const TheUserSearch = ({city, desc, from, username, _id,relationship,profilePicture}) => {
    const user=useSelector((state)=>state.auth.user)
    const [follow,setFollow]=useState(false)
    const [friend,setFriend]=useState(false)
    const dispatch=useDispatch()

    const HandleFollow=async(e)=>{
        e.preventDefault()
        try {
            if(follow){
                const res=await axios.patch("http://localhost:8000/api/user/"+_id+"/unfollower",{
                    _id:user._id
                })
                dispatch(unfollow(user.followins.indexOf(_id)))
                setFollow(false)
                toast.success("UnFollow success!", { position: toast.POSITION.TOP_RIGHT });
            }else{
                const res=await axios.patch("http://localhost:8000/api/user/"+_id+"/follower",{
                    _id:user._id
                })
                dispatch(following(_id))
                setFollow(true)
                toast.success("Follow success!", { position: toast.POSITION.TOP_RIGHT });
            }
        } catch (error) {
            toast.error("Something's wrong, please try again.!", {
                position: toast.POSITION.TOP_RIGHT,
              });              
        }
    }
    useEffect(()=>{
        if(user.followins.includes(_id)){setFollow(true)}
    },[])
  return (
    <Link to={"/userprofile/"+_id} >

    <div className='flex items-center border-[1px] border-green-600 bg-gray-100 hover:bg-gray-200 hover:scale-105 duration-300 hover:cursor-pointer hover:border-yellow-500 rounded-lg p-2' >
        
            <span>
                <img src={profilePicture?profilePicture:anh} className='object-cover w-[75px] h-[75px] rounded-full'  />
            </span>
            <div className='flex flex-col ml-4' >
                <p className='font-medium' >{username}</p>
                <p className='font-thin' >{from?"from: "+from:city?"city: "+city:desc?"desc: "+desc:relationship==1?"Single":relationship==2?"Married":"complicated relationship"}</p>
            </div>
            {
                user._id!=_id?<div className='flex flex-col ml-auto gap-1 '>
            {friend?<button className="flex group  justify-center items-center gap-2 bg-blue-500 rounded-lg py-2 px-4 text-white font-medium hover:scale-105 duration-300" >Friend <span className="group-hover:animate-bounce" ><FaUserFriends/></span>  </button>:<button className="flex group  justify-center items-center gap-2 bg-blue-500 rounded-lg py-2 px-4 text-white font-medium hover:scale-105 duration-300" >AddFriend <span className="group-hover:animate-bounce" ><AiOutlineUsergroupAdd size={20} /></span>  </button>}
                { follow?<button onClick={HandleFollow} className="flex group  justify-center items-center gap-2 bg-blue-500 rounded-lg py-2 px-4 text-white font-medium hover:scale-105 duration-300 z-1" >Following <span className="group-hover:animate-bounce" ><MdOutlineMobileFriendly/></span>  </button>:<button className="flex group justify-center items-center gap-2 bg-blue-500 rounded-lg py-2 px-4 text-white font-medium hover:scale-105 duration-300 z-1" 
                  onClick={HandleFollow} >Follow <span className="group-hover:animate-bounce" ><FaRegHandshake size={20} /></span></button>}

            </div>:<p className='ml-auto mr-[50px] font-semibold' >You</p>
            }

            </div>
            <ToastContainer />
    </Link>
  )
}

export default TheUserSearch