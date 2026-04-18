import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import {
  addTransporter,
  getTransporterDetails,
  getTransporters,
  toggleTransporter,
  updateTransporter,
} from "../../controllers/admin/transportController.js";

const router = Router();

router.post(
  "/add-transporter",
  authenticate,
  authorize("admin"),
  addTransporter,
);

router.get("/", authenticate, authorize("admin"), getTransporters);

router.get(
  "/details/:transporterId",
  authenticate,
  authorize("admin"),
  getTransporterDetails,
);

router.patch(
  "/toggle/:transporterId",
  authenticate,
  authorize("admin"),
  toggleTransporter,
);

router.put(
  "/update-transporter/:transporterId",
  authenticate,
  authorize("admin"),
  updateTransporter,
);

export default router;
