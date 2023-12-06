const User = require("../models/User");
const nodemailer = require('nodemailer');


const HandleRegister = async (req,res,next) => {

  try {

    const exist=await User.findOne({email:req.body.email})
   if(exist){
    return next(new Error("Tai khoan da ton  tai"))
   }
  
    const user= await User.create(req.body)
    

    res.status(201).json({
        status:"Success",
        userId:user._id
    })



  } catch (error) {
    next(new Error(error.message))
  }
};


const HandleLogin=async(req,res,next)=>{ 
    try {
        const {email,password}=req.body
        const user=await User.findOneConfig({email,password})
        if(!user.verify){
         return next(new Error("cdxm"))
        }
        res.status(200).json({
            status:"Success",
            user
        })
    
    } catch (error) {
        next(new Error(error.message))
    }
}



const  HandleVerify=async(req,res,next)=>{
  try {
    const  {id}=req.params
    const {token}=req.body
    const  user=await User.findById(id)
    if(token!=user.codeverify){
      return next(new Error("Token của bạn không đúng!"))
    }else{
      const time=new Date().getTime()
      const timeLast=user.timecode.getTime()+5*60*1000
      if(time>timeLast){
        return  next(new Error("Token của bạn đã hết hạn!"))
      }else{
          user.verify=true
          await user.save()
        res.status(200).json({
          status:"Success",
          user,
          message:"Verify success"
        })
      }
    }
  } catch (error) {
    next(new Error(error.message))
  }
}


const resendToken=async(req,res,next)=>{
    try {
      const  {id}=req.params
      const so=Math.floor(Math.random()*10000)  
      const  user=await User.findById(id)
    user.codeverify=so
    user.timecode=Date.now();
    await user.save()
    //gui  email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "n22dccn146@student.ptithcm.edu.vn",
        pass: "n22dccn146#200804"
      }
    })
    const mailOptions = {
      from: 'BaoKing <n22dccn146@student.ptithcm.edu.vn>',
      to:user.email,
      subject: 'Account Authentication', 
      text: 'Mã  code xác thực tài  khoản của bạn là '+so+" lưu ý mã code chỉ có hiệu lực trong vòng 5 phút."
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return next(new Error(error.message))
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).json({
      status:"Success"
    })

    } catch (error) {
      next(new Error(error.message))
    } 
}

const HandleGetId=async(req,res,next)=>{
  try {
    const {email}=req.body
    const user=await User.findOne({email})
    if(!user){
      return  next(new Error("Email không tồn tại"))
    }
    res.status(200).json({
      status:"Success",
      id:user._id
    })
  } catch (error) {
    next(new Error(error.message))
  }
}

module.exports = { HandleRegister,HandleLogin,HandleVerify,resendToken,HandleGetId };
