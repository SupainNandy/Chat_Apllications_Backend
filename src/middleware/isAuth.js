import jwt from "jsonwebtoken"

export const isAuth = async(req,res,next)=>{
    try{
        const token = req.cookies.accessToken
        if(!token){
            return res.status(401).json({message:"Access Token is not found"})
        }
        const verifyToken = await jwt.verify(token,process.env.JWT_SECRET)
        req.userId = verifyToken.userId
        next()
    }catch(err){
        console.log(err)
        res.status(401).json({message:`Middleware error: Unauthorized or Token Expired ${err}`})
    }
}
