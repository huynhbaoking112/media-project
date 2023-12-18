const mongoose=require("mongoose")


const SocketSchemall=new mongoose.Schema({
    userId:{
        type:String,
        // required:true,
    },
    socketId:{
        type:String,
        // required:true,
    }
})

 const SocketInfo=mongoose.model("Socket",SocketSchemall)

 module.exports =SocketInfo