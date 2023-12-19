const Noti=require("../models/Notification")







const HandleGetNoti=async(req,res)=>{
    try {
        const {id}=req.params

        const notificationAll=await Noti.find({
            userId:id
        }).sort({createdAt:-1}).limit(7)



        res.status(200).json({
            status:"Success",
            notificationAll:notificationAll
        })        
    } catch (error) {
        res.status(404).json({
            status:"Fail",
            message:error.message
        })
    }
}


module.exports={HandleGetNoti}