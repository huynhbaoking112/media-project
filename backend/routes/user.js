const express=require("express")
const router=express.Router()
const {upload}=require("../index")
const {HandleUpdateUser,HandleDeleteUser,HandleGetUser,HandleFollower,HandleUnFollower,HandleAddFriend,HandleUnFriend} =require("../controllers/user")


//update user //delete user //get a user --- cho nguoừi khác vào trang cá nhân mình
router.route("/").get(HandleGetUser)

router.route("/:id").patch(upload.single("image"),HandleUpdateUser).delete(HandleDeleteUser)
  


//follow a user
router.route("/:id/follower").patch(HandleFollower)

//unfollow a user
router.route("/:id/unfollower").patch(HandleUnFollower)




module.exports=router