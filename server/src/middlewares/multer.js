import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Upload base folder
const uploadBasePath = path.join(__dirname, "../uploads");

// ✅ Ensure folder exists
if (!fs.existsSync(uploadBasePath)) {
  fs.mkdirSync(uploadBasePath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 🔥 dynamic folder (profile / products)
    const folder = req.uploadFolder || "others";

    const finalPath = path.join(uploadBasePath, folder);

    // create folder if not exists
    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath, { recursive: true });
    }

    cb(null, finalPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
      file.originalname,
    )}`;
    cb(null, uniqueName);
  },
});

// ✅ File filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});

// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import sharp from "sharp";
// import ffmpeg from "fluent-ffmpeg";
// import ffmpegPath from "ffmpeg-static";
// import { fileURLToPath } from "url";

// ffmpeg.setFfmpegPath(ffmpegPath);

// // ES module fix
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadBasePath = path.join(__dirname, "../uploads");

// // Ensure base folder
// if (!fs.existsSync(uploadBasePath)) {
//   fs.mkdirSync(uploadBasePath, { recursive: true });
// }

// // ===============================
// // 🔥 STORAGE
// // ===============================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = req.uploadFolder || "others";
//     const typeFolder = file.mimetype.startsWith("video")
//       ? "videos"
//       : "images";

//     const finalPath = path.join(uploadBasePath, typeFolder, folder);

//     if (!fs.existsSync(finalPath)) {
//       fs.mkdirSync(finalPath, { recursive: true });
//     }

//     cb(null, finalPath);
//   },

//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, name);
//   },
// });

// // ===============================
// // 🔥 FILE FILTER
// // ===============================
// const fileFilter = (req, file, cb) => {
//   const allowed = [
//     "image/jpeg",
//     "image/png",
//     "image/webp",
//     "video/mp4",
//     "video/mpeg",
//     "video/quicktime",
//   ];

//   if (allowed.includes(file.mimetype.toLowerCase())) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type"), false);
//   }
// };

// // ===============================
// // 🔥 MULTER INSTANCE
// // ===============================
// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 50 * 1024 * 1024, // 50MB (video support)
//     files: 10,
//   },
// });

// // ===============================
// // 🚀 IMAGE OPTIMIZATION (SHARP)
// // ===============================
// export const optimizeImage = async (filePath) => {
//   const outputPath = filePath.replace(/(\.\w+)$/, "-optimized.webp");

//   await sharp(filePath)
//     .resize(1200) // max width
//     .webp({ quality: 80 })
//     .toFile(outputPath);

//   fs.unlinkSync(filePath); // delete original

//   return outputPath;
// };

// // ===============================
// // 🎥 VIDEO OPTIMIZATION (FFMPEG)
// // ===============================
// export const optimizeVideo = (filePath) => {
//   return new Promise((resolve, reject) => {
//     const outputPath = filePath.replace(/(\.\w+)$/, "-compressed.mp4");

//     ffmpeg(filePath)
//       .outputOptions([
//         "-vcodec libx264",
//         "-crf 28", // compression level
//         "-preset fast",
//       ])
//       .save(outputPath)
//       .on("end", () => {
//         fs.unlinkSync(filePath);
//         resolve(outputPath);
//       })
//       .on("error", reject);
//   });
// };

// ================================
//          HOW TO USE
// ================================
// export const uploadMedia = asyncHandler(async (req, res) => {
//   const files = req.files;

//   const results = [];

//   for (const file of files) {
//     let finalPath = file.path;

//     if (file.mimetype.startsWith("image")) {
//       finalPath = await optimizeImage(file.path);
//     }

//     if (file.mimetype.startsWith("video")) {
//       finalPath = await optimizeVideo(file.path);
//     }

//     results.push({
//       url: finalPath,
//       type: file.mimetype.startsWith("video") ? "video" : "image",
//     });
//   }

//   res.status(200).json({
//     success: true,
//     data: results,
//   });
// });
