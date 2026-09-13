import { getReceiverSocketId, io } from "../../socket/socket.js"
import uploadCloudinary, { deleteFromCloudinary } from "../config/cloudenary.js"
import Conversation from "../model/conversation.model.js"
import Message from "../model/message.model.js"

export const sendMessage = async (req, res) => {
    try{
        let senderId = req.userId
        let receiverId = req.params.receiverId
        let {message} = req.body
        let image = req.file

        if(req.file){
            image =await uploadCloudinary(req.file.path)
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        let newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message: message,
            image: image
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: [newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id)
        }

        await conversation.save()
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        return res.status(201).json({message:"Message sent successfully", data: newMessage})

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Send message request failed", error: err.message, stack: err.stack})
    }
}

export const getMessage = async(req,res)=>{
    try {
        let sender = req.userId
        let {receiverId} = req.params
        let conversation = await Conversation.findOne({
            participants: {$all:[sender,receiverId]}
        }).populate("messages")

        if(!conversation){
            return res.status(200).json({message:"No conversation found",data:[]})
        }
        return res.status(200).json(conversation?.messages)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Get message request failed"})
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const senderId = req.userId;

        const message = await Message.findById(messageId);
        if(!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        

        // 1. Delete image from cloudinary if it exists
        if (message.image) {
            await deleteFromCloudinary(message.image);
        }

        // 2. Delete message from database
        await Message.findByIdAndDelete(messageId);

                // 3. Find conversation and notify receiver via socket before deleting from conversation
        const conversation = await Conversation.findOne({ messages: messageId });
        if (conversation) {
            const receiverId = conversation.participants.find(p => p.toString() !== senderId.toString());
            if (receiverId) {
                const receiverSocketId = getReceiverSocketId(receiverId.toString());
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("messageDeleted", messageId);
                }
            }
        }

        // 4. Remove message reference from Conversation
        await Conversation.updateMany(
            { messages: messageId },
            { $pull: { messages: messageId } }
        );

        return res.status(200).json({ message: "Message deleted successfully", messageId });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Delete message request failed", error: err.message });
    }
}



