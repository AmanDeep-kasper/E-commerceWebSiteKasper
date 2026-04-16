import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import {
  getShippingConfig,
  getShippingConfigAdmin,
  upsertShippingConfig,
} from "../../controllers/admin/shippingController.js";

const router = Router();

router.post("/config", authenticate, authorize("admin"), upsertShippingConfig);

router.get("/get-shipping-config", authenticate, getShippingConfig);
router.get(
  "/get-shipping-config-admin",
  authenticate,
  authorize("admin"),
  getShippingConfigAdmin,
);

export default router;
