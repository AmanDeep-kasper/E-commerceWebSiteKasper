import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import {
  createBusinessDetails,
  getBusinessDetails,
  updateBusinessDetails,
} from "../../controllers/admin/businessController.js";
import { upload } from "../../middlewares/multer.js";

const router = Router();

router.post(
  "/create-business",
  authenticate,
  authorize("admin"),
  upload.single("logo"),
  createBusinessDetails,
);

router.put(
  "/update-business",
  authenticate,
  authorize("admin"),
  upload.single("logo"),
  updateBusinessDetails,
);

router.get(
  "/get-business",
  authenticate,
  authorize("admin"),
  getBusinessDetails,
);

export default router;
