const mongoose=require("mongoose")
const bcrypt=require("bcrypt")

const UserSchema=new mongoose.Schema({
        username:{
            type:String,
            min:3,
            max:20,
            required:true
        },
        email:{
            type:String,
            required:true,
            max:50,
            unique:true
        },
        password:{
            type:String,
            required:true,
            min:6
        },
        profilePicture:{
            type:String,
            default:""
        },
        coverPicture:{
            type:String,
            default:""
        },
        followers:{
            type:Array,
            default:[]
        },
        followins:{
            type:Array,
            default:[]
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        desc:{
            type:String,
            max:50,
            default:""
        },
        city:{
            type:String,
            max:50,
            default:""
        },
        from:{
            type:String,
            max:50,
            default:""
        },
        relationship:{
            type:Number,
            enum:[1,2,3],
            default:1
        },
        friends:{
            type:Array,
            default:[]
        },
        PostIdShare:{
            type:[{
                postId:{
                    type:String,
                    required:true
                },
                createdAt:{
                    type:Date,
                    default:Date.now()
                }
            }],
            default:[]
        },
        verify:{
            type:Boolean,
            default :false,
        },
        codeverify:{
            type:Number
        },timecode:{
            type:Date,
            default:Date.now()
        },
        newNotification:{
            type:Boolean,
            defaul:false
        }

},{timestamps:true})

UserSchema.statics.findOneConfig=async function({email,password}){
    const user=await User.findOne({email})
    if(!user || !password ||!email) throw new Error("Invalid email or password")
const isMatch=await bcrypt.compare(password,user.password)
if(!isMatch) throw new Error("Invalid email or password")
    return user
}

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    const newpassword=await bcrypt.hash(this.password,10)
    this.password=newpassword
    next()
})

UserSchema.methods.toJSON= function(){
    const user=this
   const userObject=user.toObject()
   delete userObject.password
   return userObject
}


const User=mongoose.model("User",UserSchema)

module.exports=User  