import crypto from "node:crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Shipping from "../models/admin/ShippingConfig.js";
import Warehouse from "../models/admin/WarehouseConfig.js";
import Payment from "../models/Payment.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import env from "../config/env.js";
import razorpay, {
  createRazorpayOrder,
  verifyPaymentSignature,
} from "../service/razorpayService.js";

// Helper function
const calculateShippingCharge = ({
  userCity,
  userState,
  warehouseCity,
  warehouseState,
  config,
  cartTotal,
}) => {
  if (cartTotal >= config.freeDeliveryAbove) return 0;

  const city = userCity.toLowerCase();
  const state = userState.toLowerCase();

  const whCity = warehouseCity.toLowerCase();
  const whState = warehouseState.toLowerCase();

  if (city === whCity) return config.charges.withinCity;

  if (state === whState) return config.charges.withinState;

  if (config.specialStates.includes(state)) return config.charges.specialRegion;

  if (
    config.metroCities.includes(city) &&
    config.metroCities.includes(whCity)
  ) {
    return config.charges.metroToMetro;
  }

  return config.charges.restOfIndia;
};

export const checkoutSummary = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { shippingAddress } = req.body;

  if (!shippingAddress?.city || !shippingAddress?.state) {
    return res.status(200).json({
      success: true,
      data: {
        shippingCharge: 0,
        message: "Enter city/state to calculate shipping",
      },
    });
  }

  const [cart, config, warehouse] = await Promise.all([
    Cart.findOne({ userId, status: "active" }),
    Shipping.findOne({ isActive: true }).lean(),
    Warehouse.findOne({ isActive: true }).lean(),
  ]);

  if (!cart) throw new Error("Cart not found");

  const shippingCharge = calculateShippingCharge({
    userCity: shippingAddress.city,
    userState: shippingAddress.state,
    warehouseCity: warehouse.address.city,
    warehouseState: warehouse.address.state,
    config,
    cartTotal: cart.subtotal,
  });

  const platformFee = config.platformFee || 0;

  const total = cart.grandTotal + shippingCharge + platformFee;

  res.json({
    success: true,
    data: {
      subtotal: cart.subtotal,
      shippingCharge,
      platformFee,
      total,
    },
  });
});

export const checkout = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { paymentMethod, shippingAddress } = req.body;

  // ✅ Only Razorpay supported
  if (paymentMethod !== "razorpay") {
    throw AppError.badRequest(
      "Only Razorpay is supported currently",
      "INVALID_PAYMENT_METHOD",
    );
  }

  if (!shippingAddress) {
    throw AppError.badRequest(
      "Shipping address is required",
      "ADDRESS_REQUIRED",
    );
  }
  // ⚡ Parallel queries (FAST)
  const [cart, config, warehouse] = await Promise.all([
    Cart.findOne({ userId, status: "active" }),
    Shipping.findOne({ isActive: true }).lean(),
    Warehouse.findOne({ isActive: true }).lean(),
  ]);

  if (!cart || cart.items.length === 0) {
    throw AppError.badRequest("Cart is empty", "CART_EMPTY");
  }

  if (!config || !warehouse) {
    throw AppError.internal("Config missing", "CONFIG_ERROR");
  }

  // ✅ Shipping
  const shippingCharge = calculateShippingCharge({
    userCity: shippingAddress.city,
    userState: shippingAddress.state,
    warehouseCity: warehouse.address.city,
    warehouseState: warehouse.address.state,
    config,
    cartTotal: cart.subtotal,
  });

  const platformFee = config.platformFee || 0;
  const grandTotal = cart.grandTotal + shippingCharge + platformFee;

  if (isNaN(grandTotal)) {
    throw AppError.internal("Invalid total calculation", "TOTAL_ERROR");
  }

  // Razorpay order
  const razorpayOrder = await createRazorpayOrder(grandTotal, {
    userId,
  });

  // ✅ Create ORDER (IMPORTANT FIRST)
  const order = await Order.create({
    user: userId,
    items: cart.items,
    shippingAddress,
    paymentMethod,
    subtotal: cart.subtotal,
    totalGST: cart.totalGST,
    shippingCharge,
    grandTotal,
    paymentStatus: "pending",
    status: "placed",
  });

  // ✅ Create PAYMENT
  const payment = await Payment.create({
    order: order._id,
    user: userId,
    amount: grandTotal,
    razorpayOrderId: razorpayOrder.id,
    status: "created",
  });

  // link payment to order
  order.payment = payment._id;
  await order.save();

  res.status(200).json({
    success: true,
    message: "Payment initiated",
    data: {
      orderId: order._id,
      razorpay: {
        rzOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: env.RAZORPAY_API_KEY, // ✅ correct
      },
    },
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw AppError.badRequest(
      "All payment fields required",
      "PAYMENT_DATA_MISSING",
    );
  }

  // ✅ Verify signature
  const isValid = verifyPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  // ✅ Find payment
  const payment = await Payment.findOne({ razorpayOrderId });

  if (!payment) {
    throw AppError.notFound("Payment not found", "PAYMENT_NOT_FOUND");
  }

  const order = await Order.findById(payment.order);

  if (!order) {
    throw AppError.notFound("Order not found", "ORDER_NOT_FOUND");
  }

  // ❌ PAYMENT FAILED
  if (!isValid) {
    payment.status = "failed";
    payment.failedAt = new Date();

    order.paymentStatus = "failed";
    order.status = "cancelled";
    order.cancelledAt = new Date();

    await payment.save();
    await order.save();

    return res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }

  // ✅ PAYMENT SUCCESS
  payment.status = "captured";
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.isVerified = true;
  payment.capturedAt = new Date();

  order.paymentStatus = "paid";
  order.status = "confirmed";
  order.confirmedAt = new Date();

  await payment.save();
  await order.save();

  // 🧹 Clear cart
  await Cart.updateOne({ userId, status: "active" }, { status: "checked_out" });

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: {
      orderId: order._id,
    },
  });
});
