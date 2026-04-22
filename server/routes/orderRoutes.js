import express from "express";
import {
  checkout,
  checkoutSummary,
  getOrders,
  paymentFailed,
  verifyPayment,
} from "../controllers/orderController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, checkout);
router.post("/checkout-summary", authenticate, checkoutSummary);
router.post("/verify-payment", authenticate, verifyPayment);
router.post("/payment-failed", authenticate, paymentFailed);
router.get("/", authenticate, authorize("user"), getOrders);

export default router;
