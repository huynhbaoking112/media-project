const express=require("express")
const router=express.Router()
const {HandleRegister,HandleLogin} =require("../controllers/auth")

//Register
router.route("/register").post(HandleRegister)
router.route("/login").post(HandleLogin)


module.exports=router