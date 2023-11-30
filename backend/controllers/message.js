const Message=require("../models/Message")

const HandlePostMessage=async(req,res,next)=>{
    try {
        const message=await Message.create(req.body)
        res.status(200).json({
            status:"Success",
            message
        })
    } catch (error) {
        next(new Error(error.message))
    }
}


const HandleGetMessage=async(req,res,next)=>{
    try {
        const {conversationId}=req.params
        
        const message=await Message.find({conversationId})
        res.status(200).json({
            status:"Success",
            message
        })
    } catch (error) {
        next(new Error(error.message))
    }
}




module.exports={HandlePostMessage,HandleGetMessage}