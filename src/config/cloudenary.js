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

export default uploadCloudinary;