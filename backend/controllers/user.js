const User = require("../models/User");
const bcrypt=require("bcrypt")

const HandleUpdateUser=async(req,res,next)=>{
    try {
        const {id}=req.params
        if(id==req.body._id||req.body.isAdmin){
            if(req.body.password){
                const newpassword=await bcrypt.hash(req.body.password,10)
                req.body.password=newpassword
            }
            const user=await User.findByIdAndUpdate(id,req.body,{new:true})
            res.status(200).json({
                status:"Success",
                user
            })
        }else{
            throw new Error("You cannot do this")
        }

    } catch (error) {
        res.status(404).json({
            status:"Fail",
            message:error.message
        })
    }
}

const HandleDeleteUser=async(req,res,next)=>{
    try {
        const {id}=req.params
        if(req.body._id==id || req.body.isAdmin){
            await User.findByIdAndDelete(id)
            res.status(200).json({
                status:"Delete Success"
            })
        }else{
            throw new Error("You cannot do this")
        }
    } catch (error) {
        res.status(404).json({
            status:"Fail",
            message:error.message
        })
    }
}

const HandleGetUser=async(req,res,next)=>{
    console.log(req.query.username);
    console.log(req.query.userId);

    const username=req.query.username
    const userId=req.query.userId
    const regex = new RegExp(username, "i")
    try {
        const user= username?await User.find({username: { $regex: regex }}).select("-updatedAt").limit(req.query.page*3):await User.findById(userId).select("-updatedAt")
        res.status(200).json({
            status:"Success",
            user
        })
    } catch (error) {
        res.status(404).json({
            status:"Fail",
            message:error.message
        })

    }
}

const HandleFollower=async(req,res,next)=>{

    try {
       
        const {id}=req.params
        if(id==req.body._id) throw new Error("You cannot perform this action")
        const user=await User.findById(id)
        if(user.followers.includes(req.body._id)){return res.status(200).json({
            status:"Success",
            message:"Follow success"
        }) }
        await user.updateOne({$push:{followers:req.body._id}})
        const currentUser=await User.findById(req.body._id)
        await currentUser.updateOne({$push:{followins:id}})
        res.status(200).json({
            status:"Success",
            message:"Follow success"
        })
    } catch (error) {
        next(new Error(error.message))
    }
}


const HandleUnFollower=async(req,res,next)=>{
    try {
        const {id}=req.params
        if(id==req.body._id) throw new Error("You cannot perform this action")
        const user=await User.findById(id)
        const currentUser=await User.findById(req.body._id)
        await user.updateOne({$pull:{followers:req.body._id}})
        await currentUser.updateOne({$pull:{followins:id}})
        res.status(200).json({
            status:"Success",
            message:"Unfollow success"
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

const HandleAddFriend=async(req,res,next)=>{
    try {
        const userAdd=await User.findById(req.params.id)
        const currentUser=await User.findById(req.body._id)

        

        console.log(req.params.id);
        console.log(req.body._id);

    } catch (error) {
        next(new Error(error.message))
    }
}

const HandleUnFriend=async(req,res,next)=>{
    try {
        
    } catch (error) {
        next(new Error(error.message))
    }
}


module.exports = { HandleUpdateUser,HandleDeleteUser,HandleGetUser ,HandleFollower,HandleUnFollower,HandleAddFriend,HandleUnFriend};