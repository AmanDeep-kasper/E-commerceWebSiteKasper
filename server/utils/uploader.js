// utils/cloudinaryUpload.js
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (
  fileBuffer,
  resourceType,
  folder,
  originalName = "",
) => {
  return new Promise((resolve, reject) => {
    // clean file name
    const baseName = originalName
      ? originalName.split(".")[0].replace(/\s+/g, "-").toLowerCase()
      : "file";

    const publicId = `${folder}/${baseName}-${Date.now()}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        public_id: publicId,
        chunk_size: 6_000_000,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          resourceType: result.resource_type,
        });
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const deleteFromCloudinary = async (
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
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
};

export const uploadInvoicePDF = async (
  fileBuffer,
  resourceType,
  folder,
  originalName = "",
) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error("File buffer is required"));
    }

    // clean file name
    const baseName = originalName
      ? originalName
          .replace(/\.[^/.]+$/, "")
          .replace(/\s+/g, "-")
          .toLowerCase()
      : "file";

    const publicId = `${folder}/${baseName}-${Date.now()}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        public_id: publicId,
        chunk_size: 6_000_000,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          resourceType: result.resource_type,
          bytes: result.bytes,
        });
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// export const uploadToCloudinary = (
//   fileBuffer,
//   resourceType,
//   folder,
//   originalName = "",
// ) => {
//   return new Promise((resolve, reject) => {
//     if (!fileBuffer) {
//       return reject(new Error("File buffer is required"));
//     }

//     // clean file name
//     const baseName = originalName
//       ? originalName
//           .replace(/\.[^/.]+$/, "")
//           .replace(/\s+/g, "-")
//           .toLowerCase()
//       : "file";

//     const publicId = `${folder}/${baseName}-${Date.now()}`;

//     const stream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: resourceType,
//         public_id: publicId,
//         chunk_size: 6_000_000,
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve({
//           publicId: result.public_id,
//           url: result.secure_url,
//           resourceType: result.resource_type,
//           bytes: result.bytes,
//         });
//       },
//     );

//     streamifier.createReadStream(fileBuffer).pipe(stream);
//   });
// };
