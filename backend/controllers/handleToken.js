const User = require("../models/User");
const jwt=require("jsonwebtoken")
const util=require("util")


const HandleToken=async(req,res,next)=>{
try {
    const tokentest=req.headers.authorization
    if(!tokentest){
        const error=new Error("You are not logged in!")
        return next(error)
    }
    if(tokentest.startsWith("Bearer")){
        const token=tokentest.split(" ")[1]
        const decode=await util.promisify(jwt.verify)(token,'shhhhh')
       
        if(req.body.userId!=decode.id ){
            const error=new Error("You cannot do that!")
            return next(error)
        }
    }else{
        const error=new Error("Token invalid!")
        return next(error)
    }   
    next()
} catch (error) {
    next(new Error(error.message))
}
}

module.exports={HandleToken}