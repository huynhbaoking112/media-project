const mongoose=require("mongoose")

const NotificationSchema=new mongoose.Schema({
    userNameToast:{
        type:String
    },
    userIdToast:{
        type:String
    },
    userId:{
        type:String
    },
    linkBlog:{
        type:String
    },
    message:{
        type:String
    }
},{
    timestamps:true
})


const Noti =mongoose.model('Notification',NotificationSchema)

module.exports=Noti