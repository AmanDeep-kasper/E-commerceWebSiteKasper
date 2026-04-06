import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { addProduct } from "../controllers/productController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/admin/add-product", authenticate, authorize("admin"), addProduct);

export default router;
