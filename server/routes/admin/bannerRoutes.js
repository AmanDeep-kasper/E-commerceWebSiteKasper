import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/multer.js";
import {
  deleteBanner,
  getActiveBanners,
  getAllBanners,
  updateBanner,
  uploadBanner,
} from "../../controllers/admin/bannerController.js";

const router = Router();

router.post(
  "/upload-banner",
  authenticate,
  authorize("admin"),
  upload.single("banner"),
  uploadBanner,
);

router.put(
  "/update-banner/:bannerId",
  authenticate,
  authorize("admin"),
  upload.single("banner"),
  updateBanner,
);

router.get("/get-all-banners", authenticate, authorize("admin"), getAllBanners);

router.delete(
  "/delete-banner/:bannerId",
  authenticate,
  authorize("admin"),
  deleteBanner,
);

// user routes
router.get("/get-banners", getActiveBanners);

export default router;
