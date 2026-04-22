import express from "express";
import {
  acceptOrder,
  checkout,
  checkoutSummary,
  deliverOrder,
  getOrderDetails,
  getOrders,
  getOrdersAdmin,
  paymentFailed,
  readyToShip,
  shipOrder,
  verifyPayment,
} from "../controllers/orderController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// user routes
router.post("/", authenticate, checkout);
router.post("/checkout-summary", authenticate, checkoutSummary);
router.post("/verify-payment", authenticate, verifyPayment);
router.post("/payment-failed", authenticate, paymentFailed);
router.get("/", authenticate, authorize("user"), getOrders);

// admin routes
router.get("/admin", authenticate, authorize("admin"), getOrdersAdmin);
router.patch(
  "/admin/:orderId/accept",
  authenticate,
  authorize("admin"),
  acceptOrder,
);
router.patch(
  "/admin/:orderId/ready-to-ship",
  authenticate,
  authorize("admin"),
  readyToShip,
);
router.patch(
  "/admin/:orderId/ship",
  authenticate,
  authorize("admin"),
  shipOrder,
);
router.patch(
  "/admin/:orderId/deliver",
  authenticate,
  authorize("admin"),
  deliverOrder,
);

// common routes
router.get("/:orderId", authenticate, getOrderDetails);

export default router;
