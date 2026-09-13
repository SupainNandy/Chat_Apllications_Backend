import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadCloudinary = async (filePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDE_NAME,
      api_key: process.env.CLOUDINARY_API_KEY || process.env.API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET,
    });

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw error;
  }
};

export const deleteFromCloudinary = async (imageUrl) => {
    try {
        if(!imageUrl) return;
        
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDE_NAME,
          api_key: process.env.CLOUDINARY_API_KEY || process.env.API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET,
        });

        const splitUrl = imageUrl.split('/');
        const versionIndex = splitUrl.findIndex(part => part.startsWith('v'));
        if (versionIndex === -1) return; // invalid cloudinary url

        const fileWithExtension = splitUrl.slice(versionIndex + 1).join('/');
        const publicId = fileWithExtension.split('.')[0];
        
        await cloudinary.uploader.destroy(publicId);
        console.log("Deleted image from cloudinary: " + publicId);
    } catch(err) {
        console.log("Error deleting from cloudinary:", err);
    }
}

export default uploadCloudinary;
