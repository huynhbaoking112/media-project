const express=require("express")
const router=express.Router()
const {upload}=require("../index")
const {HandleGetPostSearch,HandleGetAllPostUser,HandleCreatePost,HandleUpdatePost,HandleDeletePost,HandleLikePost,HandleGetPost,HandleGetTimeLine,HandleShareThePost,HandleGetAllSharePost}=require("../controllers/post")
const {HandleToken}=require("../controllers/handleToken")

//create a post
router.route("/").post(upload.single("image"),HandleCreatePost)

//update a post //delete a post //get a post

router.route("/:id").patch(HandleToken,HandleUpdatePost).delete(HandleToken,HandleDeletePost).get(HandleGetPost)
//userId//userId*******************************************************

//shareThePost
router.route("/sharePost/:postid").patch(HandleToken,HandleShareThePost)
//userId*************************************

//LayPostShare
router.route("/getPostShare/:userId").get(HandleGetAllSharePost)

//like a post
router.route("/like/:id").patch(HandleToken,HandleLikePost)
//userId**************************************

//get timeline posts
router.route("/allpost/timeline").post(HandleToken,HandleGetTimeLine)
//userId*************************************

//get post with query
router.route("/postsearch/q/").get(HandleGetPostSearch)

//get all post with user
router.route("/allpost/:id").get(HandleGetAllPostUser)



module.exports=router