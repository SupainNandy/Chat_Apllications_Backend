import mongoose from "mongoose";

export async function connectDB(){
    try{
        const db = process.env.MONGODB_URL

        await mongoose.connect(db)
        console.log("Databse connection success")
        
    }catch(err){
        console.log("Database connection error")
        res.status(500).json({message:"Database connection error"})
    }
}