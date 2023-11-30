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
app.use(morgan("common"))
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






const io=require("socket.io")(server,{
  cors:{
      origin:"http://localhost:3000"
  }
})
let users=[]

const addUser=(userId,socketId)=>{
    const a=users.findIndex((e)=>e.userId==userId)
    if(a==-1){
        users.push({userId,socketId})
    }else{
        users[a].socketId=socketId
    }
}
const removeUser=(socketId)=>{
     users=users.filter((e)=>e.socketId!=socketId)
    
}

const getUser=(userId)=>{
    return users.find((e)=>userId==e.userId)
}

io.on("connection",(socket)=>{

    // when connect
    // console.log("A user connected");

    //take userId and SocketIo from user
  socket.on('addUser',async(userId)=>{
    try {
      addUser(userId,socket.id)
      const user=await User.findById(userId)
      io.emit("getUsers",users)
    } catch (error) {
      console.log(error);
    }
  })




  //when sendMesse
  socket.on('sendMess',({sendUser,receiverId,text})=>{
    io.to(getUser(receiverId).socketId).emit('getMess',{
        sendUser,
        receiverId,
        text
    })
  })


//when disconnect
  socket.on('disconnect',async()=>{
     try {
      console.log("A user disconnect");
      removeUser(socket.id)
      io.emit("getUsers",users)
     } catch (error) {
      console.log(error);
     }
  })
    
})

//------------------------------------------web socket//


