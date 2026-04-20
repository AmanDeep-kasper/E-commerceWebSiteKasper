import { Router } from "express";
import {
  addOrUpdateReward,
  getReward,
  toggleRewardStatus,
} from "../../controllers/admin/rewardController.js";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/createOrUpdate",
  authenticate,
  authorize("admin"),
  addOrUpdateReward,
);

router.get("/", authenticate, authorize("admin"), getReward);

router.patch(
  "/toggle-status",
  authenticate,
  authorize("admin"),
  toggleRewardStatus,
);

export default router;
