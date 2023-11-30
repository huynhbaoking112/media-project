import React from 'react'
import anh from "../asset/2.jpeg"

const FriendInUser = () => {
  return (
    <div className='flex flex-col gap-2' >
    <div className='flex justify-center items-center'>

        <img className='object-cover h-[100px] w-[100px] rounded-lg' src={anh} />
    </div>
        <p className='flex justify-center'>John</p>
    </div>
  )
}

export default FriendInUser