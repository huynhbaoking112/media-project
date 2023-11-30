const express=require("express")
const Router=express.Router()
const {HandlePostConverSation,HandleGetConverSation,HandleGetAllChatWithUser}=require("../controllers/conversation")


 
Router.route("/").post(HandlePostConverSation)

Router.route("/conversation/chat").post(HandleGetAllChatWithUser)

Router.route("/:userId").get(HandleGetConverSation)

module.exports=Router