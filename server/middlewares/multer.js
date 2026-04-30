import multer from "multer";

const storage = multer.memoryStorage();

const FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "video/mp4",
  "video/webm",
  "application/pdf",
];

const fileFilter = (req, file, cb) => {
  if (FILE_TYPES.includes(file.mimetype)) {
    if (file.mimetype.startsWith("image/")) req.fileType = "image";
    else if (file.mimetype.startsWith("video/")) req.fileType = "video";
    else if (file.mimetype === "application/pdf") req.fileType = "raw";

    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, WEBP images, MP4/WEBM videos, and PDF files allowed",
      ),
      false,
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB
    files: 10,
  },
});

// import multer from "multer";

// const storage = multer.memoryStorage();

// const IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
// const VIDEO_TYPES = ["video/mp4", "video/webm"];

// const fileFilter = (req, file, cb) => {
//   const isImage = IMAGE_TYPES.includes(file.mimetype);
//   const isVideo = VIDEO_TYPES.includes(file.mimetype);

//   if (isImage || isVideo) {
//     req.fileType = isImage ? "image" : "video";
//     cb(null, true);
//   } else {
//     cb(
//       new Error("Only JPG, PNG, WEBP images and MP4/WEBM videos allowed"),
//       false,
//     );
//   }
// };

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 30 * 1024 * 1024, // 30MB
//     files: 10,
//   },
// });
