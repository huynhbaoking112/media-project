const User = require("../models/User");

const HandleRegister = async (req,res,next) => {
  try {
    const user= await User.create(req.body)
    res.status(201).json({
        status:"Success",
        user
    })



  } catch (error) {
    next(new Error(error.message))
  }
};


const HandleLogin=async(req,res,next)=>{ 
    try {
        const {email,password}=req.body
        const user=await User.findOneConfig({email,password})
        res.status(200).json({
            status:"Success",
            user
        })
    
    } catch (error) {
        next(new Error(error.message))
    }
}

module.exports = { HandleRegister,HandleLogin };
