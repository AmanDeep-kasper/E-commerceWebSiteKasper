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
