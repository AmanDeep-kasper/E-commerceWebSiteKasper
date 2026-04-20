import crypto from "node:crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Shipping from "../models/admin/ShippingConfig.js";
import Warehouse from "../models/admin/WarehouseConfig.js";
import Payment from "../models/Payment.js";
import Reward from "../models/admin/RewardConfig.js";
import User from "../models/User.js";
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

const calculateOrderSummary = ({
  cart,
  shippingAddress,
  warehouse,
  config,
  rewardConfig,
  appliedPoints = 0,
  userAvailablePoints = 0,
}) => {
  let shippingCharge = 0;
  let discount = 0;
  let earnedPoints = 0;

  // ======================
  // 1. SHIPPING
  // ======================
  if (shippingAddress?.city && shippingAddress?.state) {
    shippingCharge = calculateShippingCharge({
      userCity: shippingAddress.city,
      userState: shippingAddress.state,
      warehouseCity: warehouse.address.city,
      warehouseState: warehouse.address.state,
      config,
      cartTotal: cart.subtotal,
    });
  }

  // ======================
  // 2. PLATFORM FEE
  // ======================
  const platformFee = config.platformFee || 0;

  // ======================
  // 3. REWARD REDEEM
  // ======================
  if (
    rewardConfig &&
    rewardConfig.isActive &&
    cart.subtotal >= rewardConfig.minOrderValueForRedeem
  ) {
    const maxUsablePoints = Math.min(appliedPoints, userAvailablePoints);

    // 1 point = ₹1
    discount = maxUsablePoints;

    // Prevent over discount
    if (discount > cart.subtotal) {
      discount = cart.subtotal;
    }
  }

  // ======================
  // 4. TOTAL BEFORE EARNING
  // ======================
  const totalBeforeEarning =
    cart.subtotal + shippingCharge + platformFee - discount;

  // ======================
  // 5. REWARD EARNING
  // ======================
  if (
    rewardConfig &&
    rewardConfig.isActive &&
    cart.subtotal >= rewardConfig.earn.minOrderValue
  ) {
    const { PriceForPoints, points } = rewardConfig.earn.rules;

    if (PriceForPoints > 0 && points > 0) {
      earnedPoints = Math.floor(cart.subtotal / PriceForPoints) * points;
    }
  }

  return {
    subtotal: cart.subtotal,
    shippingCharge,
    platformFee,
    discount,
    total: totalBeforeEarning,
    earnedPoints,
  };
};

export const checkoutSummary = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { shippingAddress, appliedPoints = 0 } = req.body;

  const [cart, config, warehouse, rewardConfig, user] = await Promise.all([
    Cart.findOne({ userId, status: "active" }),
    Shipping.findOne({ isActive: true }).lean(),
    Warehouse.findOne({ isActive: true }).lean(),
    Reward.findOne({ isActive: true }).lean(),
    User.findById(userId).lean(),
  ]);

  if (!cart || cart.items.length === 0) {
    throw AppError.badRequest("Cart is empty", "CART_EMPTY");
  }

  const summary = calculateOrderSummary({
    cart,
    shippingAddress,
    warehouse,
    config,
    rewardConfig,
    appliedPoints,
    userAvailablePoints: user.points || 0,
  });

  res.json({
    success: true,
    data: summary,
  });
});

export const checkout = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { paymentMethod, shippingAddress, appliedPoints = 0 } = req.body;

  // ✅ Only Razorpay supported
  if (paymentMethod !== "razorpay") {
    throw AppError.badRequest(
      "Only Razorpay is supported currently",
      "INVALID_PAYMENT_METHOD",
    );
  }

  if (!shippingAddress?.city || !shippingAddress?.state) {
    throw AppError.badRequest(
      "Complete shipping address required",
      "ADDRESS_REQUIRED",
    );
  }

  // =========================
  // 1. FETCH DATA
  // =========================
  const [cart, config, warehouse, rewardConfig, user] = await Promise.all([
    Cart.findOne({ userId, status: "active" }),
    Shipping.findOne({ isActive: true }).lean(),
    Warehouse.findOne({ isActive: true }).lean(),
    Reward.findOne({ isActive: true }).lean(),
    User.findById(userId),
  ]);

  if (!cart || cart.items.length === 0) {
    throw AppError.badRequest("Cart is empty", "CART_EMPTY");
  }

  if (!config || !warehouse) {
    throw AppError.internal("Shipping config missing", "CONFIG_ERROR");
  }

  // =========================
  // 2. RE-CALCULATE EVERYTHING
  // =========================
  const summary = calculateOrderSummary({
    cart,
    shippingAddress,
    warehouse,
    config,
    rewardConfig,
    appliedPoints,
    userAvailablePoints: user.points || 0,
  });

  const {
    subtotal,
    shippingCharge,
    platformFee,
    discount,
    total,
    earnedPoints,
  } = summary;

  if (isNaN(total)) {
    throw AppError.internal("Invalid total calculation", "TOTAL_ERROR");
  }

  // =========================
  // 3. CREATE RAZORPAY ORDER
  // =========================
  const razorpayOrder = await createRazorpayOrder(total, {
    userId,
  });

  // =========================
  // 4. CREATE ORDER
  // =========================
  const order = await Order.create({
    user: userId,
    items: cart.items,
    shippingAddress,

    paymentMethod,
    paymentStatus: "pending",
    status: "placed",

    subtotal,
    totalGST: cart.totalGST,
    shippingCharge,
    platformFee,
    discount,
    grandTotal: total,

    reward: {
      usedPoints: discount,
      earnedPoints,
    },
  });

  // =========================
  // 5. CREATE PAYMENT
  // =========================
  const payment = await Payment.create({
    order: order._id,
    user: userId,
    amount: total,
    razorpayOrderId: razorpayOrder.id,
    status: "created",
  });

  order.payment = payment._id;
  await order.save();

  // =========================
  // 6. RESPONSE
  // =========================
  res.status(200).json({
    success: true,
    message: "Payment initiated",
    data: {
      orderId: order._id,
      razorpay: {
        rzOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: env.RAZORPAY_API_KEY,
      },
    },
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

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
  const used = order.reward?.usedPoints || 0;
  const earned = order.reward?.earnedPoints || 0;

  // Deduct first
  user.points -= used;
  // Then add earned
  user.points += earned;

  if (user.points < 0) {
    user.points = 0;
  }
  user.totalOrders += 1;
  user.totalSpend += order.grandTotal;
  user.lastOrderAt = new Date();
  await user.save();

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
