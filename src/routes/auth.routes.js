import express from "express"
import { login, logout, signup } from "../controller/auth.controller.js"

const authRouter = express.Router()

//Get user
// userRouter.get("/")

//Signup User
authRouter.post("/create",signup)

//Login User
authRouter.post('/login',login)

//Logout
authRouter.post('/logout',logout)






export default authRouter