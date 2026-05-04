import multer from "multer";

const storage = multer.memoryStorage();

const FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
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
    fileSize: 5 * 1024 * 1024, // 2MB
    files: 10,
  },
});
