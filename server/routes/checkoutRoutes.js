import express from "express";
import {
  checkout,
  checkoutSummary,
  verifyPayment,
} from "../controllers/orderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, checkout);
router.post("/checkout-summary", authenticate, checkoutSummary);
router.post("/verify-payment", authenticate, verifyPayment);

export default router;
