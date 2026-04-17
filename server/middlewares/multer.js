import multer from "multer";

const storage = multer.memoryStorage();

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];

const fileFilter = (req, file, cb) => {
  const isImage = IMAGE_TYPES.includes(file.mimetype);
  const isVideo = VIDEO_TYPES.includes(file.mimetype);

  if (isImage || isVideo) {
    req.fileType = isImage ? "image" : "video";
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, PNG, WEBP images and MP4/WEBM videos allowed"),
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
