const mongoose=require("mongoose")


const PostSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        max:500 ,
        default:null
    },
    img:{
        type:String,
        default:null
    },
    likes:{
        type:Array,
        default:[]
    },
    userShare:{
        type:[{
            userId:{
                type:String,
                required:true
            },
        }],
        default:[]
    }

},{timestamps:true})

const Post=mongoose.model("Post",PostSchema)

module.exports=Post 