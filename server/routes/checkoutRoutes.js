import express from "express";
import { checkout, verifyPayment } from "../controllers/orderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, checkout);
router.post("/verify-payment", authenticate, verifyPayment);

export default router;
