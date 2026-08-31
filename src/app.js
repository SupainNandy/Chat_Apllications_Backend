import express from "express"
import morgan from "morgan"
import cors from 'cors'

import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/api/auth",authRouter)

app.use("/api/user",userRouter)

app.get("/health",(req,res)=>{
    res.send("Hello from express server")
})


export default app