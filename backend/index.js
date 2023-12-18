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
    console.log("duasignal");
    const id=await getUser(userid)
    io.to(id).emit('laysignal')
  })


  socket.on('ne',async({signal,userid})=>{
    console.log("ne");
    const id= await getUser(userid)
    io.to(id).emit('guisignal',signal)
  })

  socket.on('endedCall',async({userCall1,userCall2})=>{
    console.log("end");
    const id1=await getUser(userCall1)
    const id2= await getUser(userCall2)
    io.to(id1).to(id2).emit("end")
  })


  socket.on('answerCall',async({signal,userCallId})=>{
   try {
     console.log("chapnhan");
     const SocketUserCallId= await getUser(userCallId)
     console.log(SocketUserCallId);
    io.to(SocketUserCallId).emit('acceptCall',signal)
   } catch (error) {
    console.log("loi tai day");
    console.log(error);
   }
    

  })



    // when connect
    // console.log("A user connected");

    //take userId and SocketIo from user
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
  
    const id=await getUser(receiverId)
    io.to(id).emit('getMess',{
        sendUser,
        receiverId,
        text
    })
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


