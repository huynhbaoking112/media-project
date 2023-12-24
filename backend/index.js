const express=require("express")
const app=express()
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const helmet=require("helmet")
const morgan=require("morgan")
const cors=require("cors")
const multer=require("multer")



const upload = multer({
    // Định nghĩa đường dẫn lưu trữ file upload
    storage: multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, "./uploads");
      },
      filename: function(req, file, cb) {
        const filename=Date.now()+file.originalname
        req.body.img="http://localhost:8000/"+filename
        cb(null,filename);
      },
    }),
  });

module.exports={upload}



app.use(cors({origin:"http://localhost:3000"}))
app.use(express.static("./uploads"))
//config env
dotenv.config()
//import router user
const userRouter=require("./routes/user")
const authRouter=require("./routes/auth")
const postRouter=require("./routes/post")
const commentRouter=require("./routes/comment")
const ConversationRouter=require("./routes/conversations")
const MessageRouter=require("./routes/messages")
const NotiRouter=require("./routes/notification")

//connect db with mongoose
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("DB connect success");
})


//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(helmet())
// app.use(morgan("common"))
//middleware router
app.use("/api/notification",NotiRouter)
app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/post",postRouter)
app.use("/api/comment",commentRouter)
app.use("/api/conversation",ConversationRouter)
app.use("/api/message",MessageRouter)
app.use((err,req,res,next)=>{
  res.status(404).json({
    status:"Fail",
    message:err.message
  })
})

const server=app.listen(8000,()=>{
    console.log("Server is running!");
})








//web socket
const User=require("./models/User")
const SocketInfo=require("./models/Socket")
const Noti =require("./models/Notification")

const io=require("socket.io")(server,{
  cors:{
      origin:"http://localhost:3000"
  }
})
// let users=[]


const addUser=async(userId,socketId)=>{
  try {
    // const a=users.findIndex((e)=>e.userId==userId)
    // if(a==-1){
    //     users.push({userId,socketId})
    // }else{
    //     users[a].socketId=socketId
    // }
    const user=await SocketInfo.findOne({userId})
    console.log(user);
    if(!user){
      await SocketInfo.create({userId,socketId})
    }else{
      user.socketId=socketId,
      await user.save()
    }

  } catch (error) {
    console.log(error);
  }
}
const removeUser=async(socketId)=>{
    //  users=users.filter((e)=>e.socketId!=socketId)
  try {
    await SocketInfo.findOneAndDelete({socketId})
  } catch (error) {
    console.log(error);
  }
   
    
}

const getUser=async(userId)=>{
  // for(let element of users){
  //   if(element.userId==userIds){
  //     return element.socketId
  //   }
  // }
    try {
      const user=await SocketInfo.findOne({userId})
      return user.socketId
    } catch (error) {
      console.log(error);
    }
}

io.on("connection",(socket)=>{


  socket.on('callUser',async({userId,friendId})=>{
        try {   
          const SocketFriendId=await getUser(friendId)
          console.log("----------");
          console.log(SocketFriendId);
          console.log("----------");
          const userCall=await User.findById(userId)
           io.to(SocketFriendId).emit('callUser',({userId,username:userCall.username}))
        } catch (error) {
          console.log(error);
        }

  })

  socket.on("CancelCall",async(id)=>{
    const socketid= await getUser(id)
    io.to(socketid).emit("cancel")
  })

  socket.on('duasignal', async(userid)=>{
    const id=await getUser(userid)
    io.to(id).emit('laysignal')
  })


  socket.on('ne',async({signal,userid})=>{
    const id= await getUser(userid)
    io.to(id).emit('guisignal',signal)
  })

  socket.on('endedCall',async({userCall1,userCall2})=>{
    const id1=await getUser(userCall1)
    const id2= await getUser(userCall2)
    io.to(id1).to(id2).emit("end")
  })


  socket.on('answerCall',async({signal,userCallId})=>{
   try {
     const SocketUserCallId= await getUser(userCallId)
    io.to(SocketUserCallId).emit('acceptCall',signal)
   } catch (error) {
    console.log(error);
   }
  })



  socket.on('likePost',async({userFriendId,userId,userName,linkBlog,message})=>{
    try {
      const socketinfor=await SocketInfo.findOne({userId:userFriendId})
      
      const user=await User.findById(userFriendId)
      user.newNotification=true
      await user.save()

      await Noti.create({
        userNameToast:userName,
        userIdToast:userId,
        userId:userFriendId,
        linkBlog:linkBlog,
        message:message
      })
      
      
      if(socketinfor){          
        io.to(socketinfor.socketId).emit("newToast")
      }else{
        return
      }


    } catch (error) {
      console.log(error);
    }
  })


  socket.on('daxem',async()=>{
   try {
    const socketinfo=await SocketInfo.findOne({socketId:socket.id})

    const user=await User.findById(socketinfo.userId)

    user.newNotification=false 
    await user.save()

   } catch (error) {
    console.log(error);
   }
  })



  
  socket.on('addUser',async(userId)=>{
    try {
      await addUser(userId,socket.id)
      const users=await SocketInfo.find()
      console.log(users);
      io.emit("getUsers",users)
    } catch (error) {
      console.log(error);
    }
  })


  


  //when sendMesse
  socket.on('sendMess',async({sendUser,receiverId,text})=>{
    const user=await User.findById(receiverId)
    user.newMess=true
    await user.save()

    const id=await getUser(receiverId)
    io.to(id).emit('getMess',{
      sendUser,
      receiverId,
      text
    })
    
    io.to(id).emit('haveNewMess')
  })

  socket.on('danhan',async({userId})=>{
    const user=await User.findById(userId)
    user.newMess=false
    await user.save()
  })


//when disconnect
  socket.on('disconnect',async()=>{
     try {
      console.log("A user disconnect");
      await removeUser(socket.id)
      const users=await SocketInfo.find()
      io.emit("getUsers",users)
     } catch (error) {
      console.log(error);
     }
  })
    
})

//------------------------------------------web socket//


