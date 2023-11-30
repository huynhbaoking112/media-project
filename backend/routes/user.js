const express=require("express")
const router=express.Router()
const {HandleUpdateUser,HandleDeleteUser,HandleGetUser,HandleFollower,HandleUnFollower,HandleAddFriend,HandleUnFriend} =require("../controllers/user")


//update user //delete user //get a user --- cho nguoừi khác vào trang cá nhân mình
router.route("/").get(HandleGetUser)

router.route("/:id").patch(HandleUpdateUser).delete(HandleDeleteUser)
  


//follow a user
router.route("/:id/follower").patch(HandleFollower)

//unfollow a user
router.route("/:id/unfollower").patch(HandleUnFollower)

//addfriend
router.route("/:id/addfriend").patch(HandleAddFriend)
//unfriend      
router.route("/:id/unfriend").patch(HandleUnFriend)


module.exports=router