import express from "express"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app } from "../socket/socket.js"

app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL || (origin, callback) => callback(null, true), // Fallback to allowing all origins if not specified, but allowing an explicit frontend URL
    credentials: true,
}))

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/message",messageRouter)

app.get("/health",(req,res)=>{
    res.send("Hello from express server")
})

app.get("/", (req,res)=>{
    res.send("Root endpoint: Server is running")
})

export default app
