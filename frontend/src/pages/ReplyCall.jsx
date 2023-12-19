import React, { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { IoCall } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useSelector } from "react-redux";


const ReplyCall = () => {
const socket=useSelector((state)=>state.auth.socket)
    const [callSuccess,setCallSuccess]=useState(false)
  const user = useSelector((state) => state.auth.user);
  const [stream, setStream] = useState();
  const { userid } = useParams();
  const navigate = useNavigate();
  const [signalCall, setSignalCall] = useState(null);
 

  const currentCamera = useRef();
  const friendCamera = useRef();
 

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      // setStream(stream);
      // stream.current=stream
      currentCamera.current.srcObject = stream;
      socket.emit("addUser", user._id);
      socket.on("guisignal", (signal) => {
        // setSignalCall(signal);
        const peer = new Peer({ initiator: false, trickle: false, stream });
        
        peer.on("signal", (data) => {
          
          socket.emit("answerCall", { signal: data, userCallId: userid });
        });
        
        peer.on("stream", (stream) => {
          
          friendCamera.current.srcObject = stream;
        });
        
        peer.signal(signal)
        setCallSuccess(true)
      });
      socket.on("end", () => {
        navigate("/");
        friendCamera.current = undefined;
        currentCamera.current=undefined
      });
      
      socket.emit("duasignal", userid);
      
    });
   
  }, []);

  // useEffect(() => {
  //   if (signalCall ) {
   
  //     const peer = new Peer({ initiator: false, trickle: false, stream });

  //     peer.on("signal", (data) => {
   
  //       socket.emit("answerCall", { signal: data, userCallId: userid });
  //     });

  //     peer.on("stream", (stream) => {
      
  //       friendCamera.current.srcObject = stream;
  //     });

  //     peer.signal(signalCall)
  //     setCallSuccess(true)
   
  //   }
  // }, [stream]);


  const HandleEndCall = () => {
    socket.emit("endedCall", { userCall1: userid, userCall2: user._id });
  };



  return (
    <div className="relative h-full w-full bg-black">
      <div className="w-full h-full relative">
        <video ref={currentCamera} className="h-screen w-full " autoPlay  playsInline />
        {/* setphanvideofriend */}
       {callSuccess&& <div className="absolute top-1 left-1">
          <video
            ref={friendCamera}
            className="rounded-md h-[200px] w-[260px] "
            autoPlay
            playsInline
         
          />
        </div>}

        {/* setphantinhnang */}
        <div className='absolute left-[50%] right-[50%] bottom-0'>
            <div className='flex justify-center items-center gap-3'>
            {/* tatmocamera */}
              {/* <div className='p-3 bg-gray-600 hover:opacity-100 hover:cursor-pointer opacity-60 flex justify-center items-center rounded-full '>
                    <FaCamera size={40} className='z-[10] text-white '/>
              </div> */}
              {/* micro */}
              {/* <div className='p-3 bg-gray-600 hover:opacity-100 hover:cursor-pointer opacity-60 flex justify-center items-center rounded-full ' onClick={HandleOnOffMic}>
                   {mic?<FaMicrophone size={40} className='z-[10] text-white '/>:<FaMicrophone size={40} className='z-[10] text-red-500 '/>}
              </div> */}
              {/* dungcuocgoi */}
              <div onClick={HandleEndCall} className='p-3 bg-gray-600  hover:opacity-100 hover:cursor-pointer opacity-60 flex justify-center items-center rounded-full '>
                    <IoCall size={40} className='z-[10] text-white hover:text-red-500 '/>
              </div>
            </div>
            </div>
      </div>
    </div>
  );
};

export default ReplyCall;
