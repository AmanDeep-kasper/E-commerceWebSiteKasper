import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import {
  upsertBusinessDetails,
  getBusinessDetails,
} from "../../controllers/admin/businessController.js";
import { upload } from "../../middlewares/multer.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("logo"),
  upsertBusinessDetails,
);

router.get(
  "/get-business",
  authenticate,
  authorize("admin"),
  getBusinessDetails,
);

export default router;
