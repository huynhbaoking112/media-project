const express=require("express")
const Router=express.Router()
const {HandlePostMessage,HandleGetMessage}=require("../controllers/message")

//add

Router.route("/").post(HandlePostMessage)


//get

Router.route("/:conversationId").get(HandleGetMessage)

module.exports=Router