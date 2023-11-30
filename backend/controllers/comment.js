const Comment = require("../models/Comment");

const HandleGetCommentWithPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const allComments = await Comment.find({ postId });

  const allComment=  allComments.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
    res.status(200).json({
      status: "Success",
      allComment,
    });
  } catch (error) {
    next(new Error(error.message))
  }
};

const HandlePostComment = async (req, res, next) => {
  try {
    const comment = await Comment.create(req.body);
    
    res.status(200).json({
      status: "Success",
      comment,
    });
  } catch (error) {
    next(new Error(error.message))
  }
};

const handlePatchComment = async (req, res, next) => {
  try {
    const newComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { $push: { replies: req.body } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      newComment,
    });
  } catch (error) {
    next(new Error(error.message))
  }
};

// like or unlike comment và sửa comment
const HandlePatchPostComment = async (req, res, next) => {
 
  try {
    const { commentId } = req.params;
    const { comment, userId } = req.body;
    const commentPost = await Comment.findById(commentId);
    if(commentPost.length==0) throw new Error("You can't handle comment");
    //sua comment
    if (comment) {
      if (userId == commentPost.authorId) {
        commentPost.content = comment;
        await commentPost.save();
        return res.status(200).json({
          status: "Success"
        });
      } else {
        throw new Error("You can't handle comment");
      }
    }
    //like or unlike
    else {
      if (commentPost.likes.includes(userId)) {
        commentPost.likes.pop(userId);
        await commentPost.save();
      } else {
        commentPost.likes.push(userId);
        await commentPost.save();
      }
      return res.status(200).json({
        status: "Success",
        commentPost
      });
    }
  } catch (error) {
    next(new Error(error.message))
  }
};

const HandleDeletePostComment = async (req, res, next) => {
  try {
   
    const { commentId } = req.params;
    const { userId } = req.body;
    const comment = await Comment.findById(commentId);
    if (comment.authorId == userId || comment.authorPostId == userId) {
      await Comment.findByIdAndDelete(commentId);
      return res.status(200).json({
        status: "Success",
        message: "Delete success",
      });
    } else {
      
      throw new Error("You can't delete this comment");
    }
  } catch (error) {
    next(new Error(error.message))
  }
};

const HandlePostCommentReply = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId)
    const {authorId,content,_id}=req.body

    if(comment.length==0||!content||!authorId) throw new Error("An error occurred. Please try again!")

    if(_id){
      const index=comment.replies.findIndex((e)=>e._id==_id)
    if(index==-1  ) throw new Error("An error occurred. Please try again!")

    comment.replies.splice(index+1,0,{authorId,content})
    comment.save()

    return res.status(200).json({
      status: "Success",
      comment,
    });
    }else{
      comment.replies.unshift({authorId,content})
      comment.save()

    return res.status(200).json({
      status: "Success",
      comment,
    });
    }
    
  } catch (error) {
    next(new Error(error.message))
  }
};

const HandleCommentReply = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content, userId, _id } = req.body;
    const comment = await Comment.findById(commentId);

    
    if (content) {
      const index = comment.replies.findIndex((e) => e._id == _id);

      if (index == -1 || comment.replies[index].authorId != userId)
        throw new Error("An error occurred. Please try again!");

      comment.replies[index].content = content;

      await comment.save();
      return res.status(200).json({
        status: "Success",
        comment:comment.replies[index],
      });
    } else {
      
      const index = comment.replies.findIndex((e) => e._id == _id);



      if (index == -1) throw new Error("An error occurred. Please try again!");
      if (comment.replies[index].likes.includes(userId)) {
        const index_id = comment.replies[index].likes.indexOf(userId);
        comment.replies[index].likes.splice(index_id, 1);
        await comment.save();
      } else {

        comment.replies[index].likes.push(userId);
        await comment.save();
      }

      return res.status(200).json({
        status: "Success",
        comment,
      });
    }
  } catch (error) {
    next(new Error(error.message))
  }
};

const HandleDeleteCommentReply = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    const { userId, _id } = req.body;

    const arr = comment.replies.filter((e) => e._id == _id);
    if (arr.length == 0 || (arr[0].authorId != userId && comment.authorPostId!=userId))
      throw new Error("An error occurred. Please try again!");

    const index = comment.replies.findIndex((e) => e._id == _id);

    comment.replies.splice(index, 1);
    await comment.save();

    res.status(200).json({
      status: "Success",
      comment,
    });
  } catch (error) {
    next(new Error(error.message))
  }
};

module.exports = {
  HandlePostComment,
  handlePatchComment,
  HandlePatchPostComment,
  HandleDeletePostComment,
  HandleGetCommentWithPost,
  HandlePostCommentReply,
  HandleCommentReply,
  HandleDeleteCommentReply,
};
