import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import env from "../config/env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Upload image to Cloudinary and return the result
export const uploadImageToCloudinary = async (filePath, folder = "default") => {
  try {
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      use_filename: true,
      unique_filename: false,
    });

    // Delete local file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      resourceType: result.resource_type,
    };
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

export const deleteImageFromCloudinary = async (
  publicId,
  resourceType = "image",
) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for deletion");
    }
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    throw new Error(`Failed to delete image from Cloudinary: ${error.message}`);
  }
};
