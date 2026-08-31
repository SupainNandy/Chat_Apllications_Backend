import uploadCloudinary from "../config/cloudenary.js"
import User from "../model/user.model.js"

export const getCurrentUser=async(req,res)=>{
    try{
        const userId = req.userId

        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(400).json({message:"Current user error"})
        }

        return res.status(200).json(user)

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Current user request failed"})
    }
}


export const editProfile = async (req, res) => {
    try {
        // 1. Get the new name from the request body (what the user typed in the frontend form)
        const newName = req.body.name;
        
        // 2. Create an object that holds the updates we want to save in the database
        const updates = { 
            name: newName 
        };

        // 3. Check if the user uploaded a new profile image
        if (req.file) {
            // Upload the new image to Cloudinary and get the secure URL back
            const imageUrl = await uploadCloudinary(req.file.path);
            
            // Add the new image URL to our updates object
            updates.image = imageUrl;
        }

        // 4. Find the user in the database by their ID and update their info
        // { new: true } tells the database to return the updated user (not the old one)
        // .select("-password") ensures we don't accidentally send the password back to the frontend
        const updatedUser = await User.findByIdAndUpdate(
            req.userId, 
            updates, 
            { new: true }
        ).select("-password");

        // 5. If the user wasn't found in the database, return an error
        if (!updatedUser) {
            return res.status(400).json({ message: "User not found" });
        }

        // 6. Send the updated user data back to the frontend on success
        return res.status(200).json({ user: updatedUser });
        
    } catch (err) {
        // If anything goes wrong, log the error and send a 500 server error response
        console.log("Error in editProfile:", err);
        return res.status(500).json({ message: "Profile update failed" });
    }
};

export const getOtherUser = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.userId }
        }).select("-password")

        return res.status(200).json({ users })
    } catch (err) {
        return res.status(500).json({ message: `Get other user error ${err}` })
    }
}