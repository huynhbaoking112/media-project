const express=require("express")
const router=express.Router()
const {upload}=require("../index")
const {HandleGetPostSearch,HandleGetAllPostUser,HandleCreatePost,HandleUpdatePost,HandleDeletePost,HandleLikePost,HandleGetPost,HandleGetTimeLine,HandleShareThePost,HandleGetAllSharePost}=require("../controllers/post")
//create a post
router.route("/").post(upload.single("image"),HandleCreatePost)
//update a post //delete a post //get a post

router.route("/:id").patch(HandleUpdatePost).delete(HandleDeletePost).get(HandleGetPost)

//shareThePost
router.route("/sharePost/:postid").patch(HandleShareThePost)

//LayPostShare
router.route("/getPostShare/:userId").get(HandleGetAllSharePost)

//like a post
router.route("/like/:id").patch(HandleLikePost)


//get timeline posts
router.route("/allpost/timeline").post(HandleGetTimeLine)

//get post with query
router.route("/postsearch/q/").get(HandleGetPostSearch)

//get all post with user
router.route("/allpost/:id").get(HandleGetAllPostUser)



module.exports=router