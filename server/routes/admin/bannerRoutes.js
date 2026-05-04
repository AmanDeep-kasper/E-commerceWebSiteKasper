import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/multer.js";
import {
  deleteBannerItem,
  getActiveBanners,
  getAllBanners,
  updateBannerItem,
  uploadBanner,
} from "../../controllers/admin/bannerController.js";

const router = Router();

router.post(
  "/upload-banner",
  authenticate,
  authorize("admin"),
  upload.array("banner", 8),
  uploadBanner,
);

router.get("/get-all-banners", authenticate, getAllBanners);
router.get("/get-active-banners", getActiveBanners);

router.patch(
  "/update-banner/:bannerId",
  authenticate,
  authorize("admin"),
  upload.array("banner", 8),
  updateBannerItem,
);

router.delete(
  "/delete-banner/:bannerId",
  authenticate,
  authorize("admin"),
  deleteBannerItem,
);

// router.patch(
//   "/toggle-banner/:bannerId",
//   authenticate,
//   authorize("admin"),
//   toggleBannerStatus,
// );

export default router;
