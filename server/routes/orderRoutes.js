import express from "express";
import {
  checkout,
  checkoutSummary,
  paymentFailed,
  verifyPayment,
} from "../controllers/orderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, checkout);
router.post("/checkout-summary", authenticate, checkoutSummary);
router.post("/verify-payment", authenticate, verifyPayment);
router.post("/payment-failed", authenticate, paymentFailed)

export default router;
