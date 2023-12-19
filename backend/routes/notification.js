const express=require("express")
const { HandleGetNoti } = require("../controllers/noti")

const Router=express.Router()




Router.route('/:id').get(HandleGetNoti)




module.exports=Router
