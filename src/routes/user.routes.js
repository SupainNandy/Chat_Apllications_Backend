import express from "express"
import { login, logout, signup } from "../controller/auth.controller.js"
import { editProfile, getCurrentUser, getOtherUser } from "../controller/user.controller.js"
import { isAuth } from "../middleware/isAuth.js"
import { upload } from "../middleware/multer.js"

const userRouter = express.Router()

//Get user
userRouter.get("/current",isAuth,getCurrentUser)
userRouter.put("/profile",isAuth,upload.single("image"),editProfile)
userRouter.get("/others",isAuth,getOtherUser)



export default userRouter