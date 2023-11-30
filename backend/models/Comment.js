const mongoose=require("mongoose")
const { Schema } = mongoose

const CommentSchema=new mongoose.Schema({
    postId:{
        type:String,
        required:true
    },
    authorPostId:{
        type:String,
        required:true
    },
    authorId:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true,
        min:1
    },
    likes:{
        type:Array,
        default:[]
    },
    replies:[
        {   
            _id:{
                type: Schema.Types.ObjectId,
                 auto: true
            },
            authorId:{
                type:String,
                required:true
            },
            content:{
                type:String,
                required:true,
                min:1
            },
            likes:{
                type:Array,
                default:[]
            },
            createdAt:{
                type:Date,
                default:Date.now()
            },
            updatedAt: {
                type:Date,
                default:Date.now()
            },
        }
    ]
    
},{
    timestamps:true
})


const Comment=mongoose.model("Comment",CommentSchema)
module.exports=Comment