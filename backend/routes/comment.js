const express=require("express")
const Router=express.Router()
const {HandleDeleteCommentReply,HandlePostComment,handlePatchComment,HandlePatchPostComment,HandleDeletePostComment,HandleGetCommentWithPost,HandlePostCommentReply,HandleCommentReply} =require("../controllers/comment")


//Comment vào một post
Router.route("/post/:postId")
//tạo một comment vào post 
.post(HandlePostComment)
//lay comment cua post
.get(HandleGetCommentWithPost)




// like or unlike comment và sửa comment xóa comment post
Router.route("/post/comment/:commentId").patch(HandlePatchPostComment).delete(HandleDeletePostComment)




//reply một comment (them-, -sua, -xoa, -like, -unlike)
Router.route("/commentreply/:commentId")
.post(HandlePostCommentReply)
.patch(HandleCommentReply)
.delete(HandleDeleteCommentReply)



module.exports=Router

