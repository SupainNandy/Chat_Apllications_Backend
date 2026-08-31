import JWT from "jsonwebtoken"

export const genToken = async(userId)=>{
    try{
        const token = await JWT.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
        return token

    }catch(err){
        console.log("Genrating token error")
    }
}