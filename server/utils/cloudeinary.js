import { v2 as cloudinary } from "cloudinary";
import fs, { linkSync } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded succes full
    console.log("file is uploded succesfully", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locall seved temp file as the uplode operation got failed
    return null;
  }
};

console.log(uploadOnCloudinary);

export { uploadOnCloudinary };
