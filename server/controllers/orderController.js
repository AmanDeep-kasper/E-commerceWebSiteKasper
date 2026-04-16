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
import razorpay, { createRazorpayOrder } from "../service/razorpayService.js";

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
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_API_KEY, // ✅ correct
      },
    },
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const isValid = verifyPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!isValid) {
    throw AppError.badRequest("Invalid signature", "INVALID_SIGNATURE");
  }

  // ✅ Payment find
  const payment = await Payment.findOne({ razorpayOrderId });

  if (!payment) {
    throw AppError.notFound("Payment not found", "NOT_FOUND");
  }

  // ✅ Update payment
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = "captured";
  payment.isVerified = true;
  payment.capturedAt = new Date();

  await payment.save();

  // ✅ Update order
  const order = await Order.findById(payment.order);

  order.paymentStatus = "paid";
  order.status = "confirmed";
  order.confirmedAt = new Date();

  await order.save();

  // ✅ Clear cart
  await Cart.updateOne(
    { userId: order.user, status: "active" },
    { $set: { status: "checked_out" } },
  );

  res.status(200).json({
    success: true,
    message: "Payment verified",
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

  // ✅ Get cart (lightweight)
  const cart = await Cart.findOne({ userId, status: "active" }).lean();

  if (!cart || cart.items.length === 0) {
    throw AppError.badRequest("Cart is empty", "CART_EMPTY");
  }

  // ✅ Get shipping config
  const config = await Shipping.findOne({ isActive: true }).lean();

  if (!config) {
    throw AppError.notFound("Shipping config not found", "CONFIG_NOT_FOUND");
  }

  // ✅ Get warehouse (single for now)
  const warehouse = await Warehouse.findOne({ isActive: true }).lean();

  if (!warehouse) {
    throw AppError.notFound("Warehouse not found", "WAREHOUSE_NOT_FOUND");
  }

  // ✅ Calculate shipping
  const shippingCharge = calculateShippingCharge({
    userCity: shippingAddress.city,
    userState: shippingAddress.state,
    warehouseCity: warehouse.address.city,
    warehouseState: warehouse.address.state,
    config,
    cartTotal: cart.subtotal,
  });

  // ✅ Final totals
  const platformFee = config.platformFee || 0;
  const additionalCharges = config.additionalCharges || 0;

  const grandTotal = cart.grandTotal + shippingCharge + platformFee;

  // ❗ Safety (no NaN)
  if (isNaN(grandTotal)) {
    throw AppError.internal("Invalid total calculation", "TOTAL_ERROR");
  }

  if (paymentMethod === "razorpay") {
    const razorpayOrder = await createRazorpayOrder(grandTotal);

    const order = await Order.create({
      user: userId,
      orderNumber: `ORD-${Date.now()}`,
      items: cart.items,
      shippingAddress,
      paymentMethod,
      subtotal: cart.subtotal,
      totalGST: cart.totalGST,
      shippingCharge,
      grandTotal,
      payment: razorpayOrder.id,
      paymentStatus: "pending",
      status: "cancelled",
    });

    // create payment
    const payment = await Payment.create({
      order: order._id,
      user: userId,
      amount: grandTotal,
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(200).json({
      success: true,
      message: "Payment initiated",
      orderId: order._id,
      razorpay: {
        razorpayId: razorpayOrder.id,
        currency: razorpayOrder.currency,
        amount: razorpayOrder.amount,
        key: env.RAZORPAY_API_SECRET,
        receipt: razorpayOrder.receipt,
      },
    });
  }

  res.status(400).json({
    success: false,
    message: "Invalid payment method",
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  if (razorpaySignature !== expectedSignature) {
    throw AppError.badRequest("Invalid signature", "INVALID_SIGNATURE");
  }

  const cart = await Cart.findOne({ userId, status: "active" }).lean();

  if (!cart || cart.items.length === 0) {
    throw AppError.badRequest("Cart is empty", "CART_EMPTY");
  }

  const order = await Order.findOne({});
});
