import { Router } from "express";
import {
  checkServiceability,
  createServiceability,
  getAllServiceability,
  toggleServiceability,
  updateServiceability,
} from "../../controllers/admin/serviceabilityController.js";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/create-serviceability",
  authenticate,
  authorize("admin"),
  createServiceability,
);

router.post("/check", checkServiceability);

router.get("/", authenticate, authorize("admin"), getAllServiceability);

router.patch("/:serviceabilityId", authenticate, authorize("admin"), updateServiceability);

router.patch(
  "/toggle/:serviceabilityId",
  authenticate,
  authorize("admin"),
  toggleServiceability,
);

export default router;
