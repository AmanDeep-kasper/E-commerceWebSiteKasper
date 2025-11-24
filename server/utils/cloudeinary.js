import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload the file cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("file is uploded succesfully", response.url);
    // file has been uploaded succes full

    fs.unlinkSync(localFilePath); // remove local temp file
    return response.secure_url; // return CLOUDINARY URL
    
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the local seved temp file as the uplode operation got failed
    return null;
  }
};

console.log(uploadOnCloudinary);

// export { uploadOnCloudinary };
