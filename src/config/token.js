import JWT from "jsonwebtoken"

export const genAccessToken = async(userId)=>{
    try{
        const token = await JWT.sign({userId},process.env.JWT_SECRET,{expiresIn:"15m"})
        return token
    }catch(err){
        console.log("Generating access token error", err)
    }
}

export const genRefreshToken = async(userId)=>{
    try{
        const token = await JWT.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
        return token
    }catch(err){
        console.log("Generating refresh token error", err)
    }
}
