import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/pjpeg",
    "image/x-png",
  ];

  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    console.log(" Blocked:", file.originalname, file.mimetype);
    cb(null, false); // IMPORTANT: don't throw error
  }
};

// Profile Image
export const uploadProfileImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
}).single("profileImage");

// Product Images + Variant Images
export const uploadProductImages = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 200,
    fields: 500,
  },
  fileFilter,
}).any();
