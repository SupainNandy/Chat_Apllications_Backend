import jwt from "jsonwebtoken"


export const isAuth =async(req,res,next)=>{
    try{
        const token = req.cookies.token
        if(!token){
            return res.status(400).json({message:"Token is not found"})
        }
        const verifyToken = await jwt.verify(token,process.env.JWT_SECRET)

        req.userId = verifyToken.userId

        next()

    }catch(err){
        console.log(err)
        res.status(500).json({message:`Milddleware error ${err}`})
    }
}