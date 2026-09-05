import uploadCloudinary from "../config/cloudenary.js"
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
            participatants: { $all: [senderId, receiverId] }
        })

        let newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message: message,
            image: image
        })

        if(!conversation){
            conversation = await Conversation.create({
                participatants: [senderId, receiverId],
                messages: [newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id)
        }

        await conversation.save()
        return res.status(201).json({message:"Message sent successfully", data: newMessage})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Send message request failed"})
    }
}