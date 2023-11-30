import React from 'react'
import "../App.css"
import anh from "../asset/notfound.jpg"
import { useNavigate } from 'react-router-dom'

const Error = () => {

    const navigate=useNavigate()

    const text="NOT-FOUND-404"
    const chars = text.split("");


    const HandleComback=(e)=>{
        e.preventDefault()
        navigate("/")
    }
  return (
   <div className='w-full h-screen flex' >
        <div className='w-[50%] h-screen flex flex-col bg-gradient-to-r from-[#4568DC] to-[#B06AB3] justify-center items-center'>
                <h1 className='text-white font-king2 text-xl from-bottom animate-slide-slow ' >
                {chars.map((char, i) => (
  <span key={char} className={"char hover:text-red-500 hover:cursor-pointer text-white text-4xl font-dat mt-[50px] mb-[50px]"}>
    {char+" "}
  </span>
))}
               </h1>
        </div>
        
        <div className='w-[50%] h-screen flex flex-col items-center justify-center gap-[100PX] '>
                    <img src={anh} className='object-cover w-[220px] h-[220px] rounded-lg hover:cursor-pointer animate-bounce hover:rotate-45 duration-300 ' />
                    <button className='px-3 py-2 rounded-full bg-gradient-to-r hover:scale-105 duration-300 hover:text-gray-500 from-[#24C6DC] to-[#514A9D] text-gray-300 font-king4' onClick={HandleComback}>COME BACK</button>
        </div>
   </div>
  )
}

export default Error