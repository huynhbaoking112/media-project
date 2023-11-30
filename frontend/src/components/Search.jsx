import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TheUserSearch from './TheUserSearch'
import ThePostSearch from './ThePostSearch'
import Post from "./Post"
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const Search = () => {
    const location=useLocation()
    const searchQuery = new URLSearchParams(location.search).get('q')
    const [allUser,setAllUser]=useState()
    const [page,setPage]=useState(1)
    const [pagePost,setPagePost]=useState(1)
    const [allPost,setAllPost]=useState()
    const HandlePage=()=>{
        setPage(page+1)
    }
    const HandleLessPage=()=>{
        setPage(1)
    }
    const HandlePagePost=()=>{
        setPagePost(pagePost+1)
    }
    const HandleLessPagePost=()=>{
        setPagePost(1)
    }

    const fetchTheUser=async()=>{
        try {
            const res=await axios.get("http://localhost:8000/api/user?username="+searchQuery+"&page="+page)
            setAllUser(res.data.user)
            toast.success("Success!", { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
            toast.error("Something's wrong, please try again.!", {
                position: toast.POSITION.TOP_RIGHT,
              });
        }
    }
    const fetchThePost=async()=>{
        try {
            const res=await axios.get("http://localhost:8000/api/post/postsearch/q?post="+searchQuery+"&page="+pagePost)
            setAllPost(res.data.allpost)
            
        } catch (error) {
            toast.error("Something's wrong, please try again.!", {
                position: toast.POSITION.TOP_RIGHT,
              });
        }
    }
    useEffect(()=>{
        fetchTheUser()
        fetchThePost()
    },[searchQuery,page,pagePost])

  return (
    <div className='flex flex-col w-full pl-[12px] gap-3 ' >
            <p className='font-medium underline' >User:👤</p>
            {allUser?.map((e,id)=>{
                return <TheUserSearch city={e.city} desc={e.desc} from={e.from} username={e.username} _id={e._id} relationship={e.relationship} profilePicture={e.profilePicture} key={id} />
            })}
      {allUser!=0&&<p className='flex justify-center font-serif rounded-lg border-[1px] border-gray-600 py-1 bg-blue-400 text-gray-600 hover:cursor-pointer hover:text-white duration-300 hover:bg-blue-600' onClick={HandlePage}  >Show more the user</p>}
            {allUser==0&&<p className='font-thin' >No matching users were found! </p>}
           {page>1&& <p className='flex justify-center font-serif rounded-lg border-[1px] border-gray-600 py-1 bg-blue-400 text-gray-600 hover:cursor-pointer hover:text-white duration-300 hover:bg-blue-600' onClick={HandleLessPage}>Shrink</p>}
           <p className='font-medium underline' >Post:📝</p>
            {
                allPost==0?<p>No result with post</p>:allPost?.map((e,id)=>{
                    return <Post  key={id} desc={e?.desc} likes={e?.likes} img={e?.img} userId={e?.userId} createdAt={e?.createdAt} _id={e?._id}  />
                })
            }
            {allPost!=0&&<p className='flex justify-center font-serif rounded-lg border-[1px] border-gray-600 py-1 bg-blue-400 text-gray-600 hover:cursor-pointer hover:text-white duration-300 hover:bg-blue-600' onClick={HandlePagePost}  >Show more the post</p>}
            {pagePost>1&& <p className='flex justify-center font-serif rounded-lg border-[1px] border-gray-600 py-1 bg-blue-400 text-gray-600 hover:cursor-pointer hover:text-white duration-300 hover:bg-blue-600' onClick={HandleLessPagePost}>Shrink</p>}
            <ToastContainer />
    </div>
  )
}

export default Search