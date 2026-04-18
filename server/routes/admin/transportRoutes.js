import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import {
  addTransporter,
  getTransporters,
} from "../../controllers/admin/transportController.js";

const router = Router();

router.post(
  "/add-transporter",
  authenticate,
  authorize("admin"),
  addTransporter,
);

router.get("/", authenticate, authorize("admin"), getTransporters);

export default router;
