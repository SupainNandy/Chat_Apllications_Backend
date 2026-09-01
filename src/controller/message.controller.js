import uploadCloudinary from "../config/cloudenary.js"

export const sendMessage = async (req, res) => {
    try{
        let senderId = req.userId
        let receiverId = req.params.receiverId
        let {message} = req.body
        let image = req.file

        if(req.file){
            image = uploadCloudinary(req.file.path)
        }
    }catch(err){
        console.log(err)
    }
}