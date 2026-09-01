import express from "express";
import { sendMessage } from "../controller/message.controller";
import isAuth from "../middleware/isAuth.js";
import {upload} from "../middleware/multer.js"
const messageRouter = express.Router();

messageRouter.post("/send/:receiverId",isAuth,upload.single("image"),sendMessage );
// messageRouter.get("/get/:conversationId", );

export default messageRouter;