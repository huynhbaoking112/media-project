const Conversation=require("../models/Conversation")
const Message=require("../models/Message")


const HandlePostConverSation=async(req,res,next)=>{
    try {
        const conversation=await Conversation.create({members:[req.body.senderId,req.body.receiverId]})
        res.status(200).json({
            status:"Success",
            conversation
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

const HandleGetConverSation=async(req,res,next)=>{
    try {
        
        const {userId}=req.params
        const conversation=await Conversation.find({members:{$in:[userId]}})
        res.status(200).json({
            status:"Success",
            conversation
        })

    } catch (error) {
        next(new Error(error.message))
    }
}


const HandleGetAllChatWithUser=async(req,res,next)=>{
    try {
        const {yourId,FriendId}=req.body
        if(!yourId || !FriendId){
            throw new Error("Something happened please try again!")
        }
        const conversation=await Conversation.find({members:{$all:[yourId,FriendId]}})
        if(!conversation[0]){
            return res.status(200).json({
                status:"Success",
                message:[]
            })
        }
        const message=await Message.find({conversationId:conversation[0]._id})
        res.status(200).json({
            status:"Success",
            message          
        })

    } catch (error) {
        next(new Error(error.message))
    }
}

module.exports={HandlePostConverSation,HandleGetConverSation,HandleGetAllChatWithUser}