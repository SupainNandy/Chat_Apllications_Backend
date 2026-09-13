import express from "express";
import { getMessage, sendMessage, deleteMessage } from "../controller/message.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import {upload} from "../middleware/multer.js"
const messageRouter = express.Router();

messageRouter.post("/send/:receiverId",isAuth,upload.single("image"),sendMessage );
messageRouter.get("/get/:receiverId",isAuth,getMessage);
messageRouter.delete("/delete/:messageId",isAuth,deleteMessage);

export default messageRouter;
