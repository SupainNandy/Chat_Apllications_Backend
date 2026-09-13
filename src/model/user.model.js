import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,

    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        unique:true,
    }
    ,
    password:{
        type:String,
        default:""
    },
    refreshToken:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:""
    }
},{
    timestamps:true,
    versionKey:false
})


const User = mongoose.model("User",userSchema)

export default User