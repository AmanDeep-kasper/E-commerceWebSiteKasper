import { Router } from "express";
import { createServiceability } from "../../controllers/admin/serviceabilityController.js";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/create-serviceability",
  authenticate,
  authorize("admin"),
  createServiceability,
);

export default router;
