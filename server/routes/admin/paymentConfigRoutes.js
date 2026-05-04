import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import {
  addPaymentGateway,
  deletePaymentGateway,
  getActivePaymentGateway,
  getAllPaymentGateways,
  setActivePaymentGateway,
  updatePaymentGateway,
} from "../../controllers/admin/paymentController.js";

const router = Router();

router.post(
  "/add-payment-gateway",
  authenticate,
  authorize("admin"),
  addPaymentGateway,
);

router.get("/", authenticate, authorize("admin"), getAllPaymentGateways);
router.get("/active", getActivePaymentGateway);

router.put(
  "/:PaymentConfigId",
  authenticate,
  authorize("admin"),
  updatePaymentGateway,
);

router.patch(
  "/:PaymentConfigId/activate",
  authenticate,
  authorize("admin"),
  setActivePaymentGateway,
);

router.delete(
  "/:PaymentConfigId",
  authenticate,
  authorize("admin"),
  deletePaymentGateway,
);

export default router;
