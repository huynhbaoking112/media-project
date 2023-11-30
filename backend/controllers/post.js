const Post=require("../models/Post")
const User = require("../models/User")

const HandleCreatePost=async(req,res,next)=>{
    try {
        const post=await Post.create(req.body)
        res.status(200).json({
            status:"Success",
            post
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

const HandleUpdatePost=async(req,res,next)=>{
    try {
        const {id}=req.params
        const post=await Post.findById(id)
        if(post.userId!=req.body.userId) throw new Error("You cannot perform this action")
        const postUpdate=await Post.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json({
            status:"Success",
            postUpdate
        })


    } catch (error) {
        next(new Error(error.message))
    }
}

const HandleDeletePost=async(req,res,next)=>{
    try {
        const {id}=req.params
        const post=await Post.findById(id)
        if(post.userId!=req.body.userId) throw new Error("You cannot perform this action")
        const postDelete=await Post.findByIdAndDelete(id)
        res.status(200).json({
            status:"Success"
        })

    } catch (error) {
        next(new Error(error.message))
    }
}

const HandleLikePost=async(req,res,next)=>{
    try {
        const post=await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            post.likes.push(req.body.userId)
            await post.save()
           return  res.status(200).json({
                status:"Success",
                message:"LikeSuccess"
            })
        }else{
        await post.updateOne({$pull:{likes:req.body.userId}},{new:true})
           return  res.status(200).json({
                status:"Success",
                message:"UnlikeSuccess"
            })
        }
       
    } catch (error) {
        next(new Error(error.message))
    }
}

const HandleGetPost=async(req,res,next)=>{
    try {
        const post=await Post.findById(req.params.id)
        if(!post) throw new Error("Post not exists")
        res.status(200).json({
            status:"Success",
            post
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

const HandleGetTimeLine=async(req,res,next)=>{
    try {
        const currentUser=await User.findById(req.body.userId)
        const currentUserPost=await Post.find({userId:req.body.userId})
        const followinUser=await Post.find({userId:{$in:currentUser.followins}})
       res.status(200).json({
        status:"Success",
        data:currentUserPost.concat(...followinUser)
       })
    } catch (error) {
        next(new Error(error.message))
    }
}

const HandleGetAllPostUser=async(req,res,next)=>{
    try {
        const allpost=await Post.find({userId:req.params.id})
        res.status(200).json({
            status:"Success",
            allpost
        })

    } catch (error) {
        next(new Error(error.message))
    }
}


const HandleGetPostSearch=async(req,res,next)=>{
    try {
        const postfind=req.query.post
        const pagePost=req.query.pagePost
        const regex = new RegExp(postfind, "i")
        const allpost= await Post.find({desc:{ $regex: regex }}).limit(pagePost*3)
        res.status(200).json({
            status:"Success",
            allpost
        })
    } catch (error) {
        next(new Error(error.message))
    }
}

const HandleShareThePost=async(req,res,next)=>{
    try {
        
        const {postid}=req.params
        const {userId}=req.body
        const user=await User.findByIdAndUpdate(userId,{$push:{
            PostIdShare:{postId:postid}
        }},{new:true})
        const post=await Post.findByIdAndUpdate(postid,{$push:{
            userShare:{userId:userId}
        }},{new:true})
        res.status(200).json({
            status:"Success",
            message:"Share the post success"
        })
    } catch (error) {
        res.status(404).json({
            statusL:"Fail",
            message:error.message
        })
    }
}

const HandleGetAllSharePost=async(req,res,next)=>{
    try {
        const {userId}=req.params
        const user=await User.findById(userId)
        const mang=[]

        for(const e of user.PostIdShare){
            const posts=await Post.findById(e.postId)
            const post={...posts.toJSON(),createdAt:Date.now()}
             mang.push(post)
        }

      
        res.status(200).json({
            status:"Success",
            mang
        })
    } catch (error) {
        res.status(404).json({
            statusL:"Fail",
            message:error.message
        })
    }
}

module.exports={HandleGetPostSearch,HandleGetAllPostUser,HandleCreatePost,HandleUpdatePost,HandleDeletePost,HandleLikePost,HandleGetPost,HandleGetTimeLine,HandleShareThePost,HandleGetAllSharePost}