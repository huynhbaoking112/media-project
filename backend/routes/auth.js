const express=require("express")
const router=express.Router()
const {HandleRegister,HandleLogin,HandleVerify,resendToken,HandleGetId} =require("../controllers/auth")

//Register
router.route("/register").post(HandleRegister)
router.route("/login").post(HandleLogin)
router.route("/verify/:id").post(HandleVerify)
router.route("/resendToken/:id").post(resendToken)
router.route("/getIdAccount").post(HandleGetId)

module.exports=router