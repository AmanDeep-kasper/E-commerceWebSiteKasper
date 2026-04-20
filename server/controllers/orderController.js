import crypto from "node:crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Shipping from "../models/admin/ShippingConfig.js";
import Warehouse from "../models/admin/WarehouseConfig.js";
import Payment from "../models/Payment.js";
import Reward from "../models/admin/RewardConfig.js";
import RewardLedger from "../models/RewardLedger.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import env from "../config/env.js";
import razorpay, {
  createRazorpayOrder,
  verifyPaymentSignature,
} from "../service/razorpayService.js";
import mongoose from "mongoose";

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
    cart.grandTotal + shippingCharge + platformFee - discount;

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
    gst: cart.totalGST,
    total: totalBeforeEarning,
    earnedPoints,
  };
};

// const calculateOrderSummary = ({
//   cart,
//   shippingAddress,
//   warehouse,
//   config,
//   rewardConfig,
//   appliedPoints = 0,
//   userAvailablePoints = 0,
// }) => {
//   let shippingCharge = 0;
//   let discount = 0;
//   let earnedPoints = 0;

//   // ======================
//   // 1. SHIPPING
//   // ======================
//   if (shippingAddress?.city && shippingAddress?.state) {
//     shippingCharge = calculateShippingCharge({
//       userCity: shippingAddress.city,
//       userState: shippingAddress.state,
//       warehouseCity: warehouse.address.city,
//       warehouseState: warehouse.address.state,
//       config,
//       cartTotal: cart.subtotal,
//     });
//   }

//   // ======================
//   // 2. PLATFORM FEE
//   // ======================
//   const platformFee = config.platformFee || 0;

//   // ======================
//   // 3. REWARD REDEEM (FIXED)
//   // ======================
//   if (
//     rewardConfig?.isActive &&
//     cart.subtotal >= rewardConfig.minOrderValueForRedeem
//   ) {
//     const maxUsablePoints = Math.min(appliedPoints, userAvailablePoints);

//     // total payable BEFORE discount
//     const payableBase = cart.grandTotal + shippingCharge + platformFee;

//     // 1 point = ₹1
//     discount = Math.min(maxUsablePoints, payableBase);
//   }

//   // ======================
//   // 4. TOTAL
//   // ======================
//   const total = Math.max(
//     0,
//     cart.grandTotal + shippingCharge + platformFee - discount
//   );

//   // ======================
//   // 5. REWARD EARNING (FIXED)
//   // ======================
//   const netAmount = cart.subtotal - discount;

//   if (
//     rewardConfig?.isActive &&
//     netAmount >= rewardConfig.earn.minOrderValue
//   ) {
//     const { PriceForPoints, points } = rewardConfig.earn.rules;

//     if (PriceForPoints > 0 && points > 0) {
//       earnedPoints =
//         Math.floor(netAmount / PriceForPoints) * points;
//     }
//   }

//   return {
//     subtotal: cart.subtotal,
//     shippingCharge,
//     platformFee,
//     discount,
//     gst: cart.totalGST,
//     total,
//     earnedPoints,
//   };
// };

export const checkoutSummary = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { shippingAddress, appliedPoints } = req.body;

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


// export const checkoutSummary = asyncHandler(async (req, res) => {
//   const userId = req.user?.userId;
//   const { shippingAddress, appliedPoints = 0 } = req.body;

//   const [cart, config, warehouse, rewardConfig, user] = await Promise.all([
//     Cart.findOne({ userId, status: "active" }),
//     Shipping.findOne({ isActive: true }).lean(),
//     Warehouse.findOne({ isActive: true }).lean(),
//     Reward.findOne({ isActive: true }).lean(),
//     User.findById(userId).lean(),
//   ]);

//   if (!cart || cart.items.length === 0) {
//     throw AppError.badRequest("Cart is empty", "CART_EMPTY");
//   }

//   // ✅ VALID POINTS (ledger based)
//   const validLedgerPointsAgg = await RewardLedger.aggregate([
//     {
//       $match: {
//         user: user._id,
//         type: "earn",
//         remainingPoints: { $gt: 0 },
//         expiresAt: { $gt: new Date() },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         total: { $sum: "$remainingPoints" },
//       },
//     },
//   ]);

//   const validPoints = validLedgerPointsAgg[0]?.total || 0;

//   // ✅ SAFE POINTS
//   const safeAppliedPoints = Math.min(appliedPoints, validPoints);

//   const summary = calculateOrderSummary({
//     cart,
//     shippingAddress,
//     warehouse,
//     config,
//     rewardConfig,
//     appliedPoints: safeAppliedPoints,
//     userAvailablePoints: validPoints,
//   });

//   res.json({
//     success: true,
//     data: {
//       ...summary,
//       availablePoints: validPoints,
//       appliedPoints: safeAppliedPoints,
//     },
//   });
// });


// export const checkoutSummary = asyncHandler(async (req, res) => {
//   const userId = req.user?.userId;
//   const { shippingAddress, appliedPoints = 0 } = req.body;

//   const [cart, config, warehouse, rewardConfig, user] = await Promise.all([
//     Cart.findOne({ userId, status: "active" }),
//     Shipping.findOne({ isActive: true }).lean(),
//     Warehouse.findOne({ isActive: true }).lean(),
//     Reward.findOne({ isActive: true }).lean(),
//     User.findById(userId).lean(),
//   ]);

//   if (!cart || cart.items.length === 0) {
//     throw AppError.badRequest("Cart is empty", "CART_EMPTY");
//   }

//   if (!config || !warehouse) {
//     throw AppError.internal("Shipping config missing", "CONFIG_ERROR");
//   }

//   // ======================
//   // ✅ REAL AVAILABLE POINTS (LEDGER BASED)
//   // ======================
//   const pointsAgg = await RewardLedger.aggregate([
//     {
//       $match: {
//         user: new mongoose.Types.ObjectId(userId),
//         type: "earn",
//         remainingPoints: { $gt: 0 },
//         expiresAt: { $gt: new Date() },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         total: { $sum: "$remainingPoints" },
//       },
//     },
//   ]);

//   const availablePoints = pointsAgg[0]?.total || 0;

//   // ======================
//   // SUMMARY
//   // ======================
//   const summary = calculateOrderSummary({
//     cart,
//     shippingAddress,
//     warehouse,
//     config,
//     rewardConfig,
//     appliedPoints,
//     userAvailablePoints: availablePoints,
//   });

//   res.json({
//     success: true,
//     data: {
//       ...summary,
//       availablePoints, // ✅ send real usable points
//     },
//   });
// });

export const checkout = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { paymentMethod, shippingAddress, appliedPoints = 0 } = req.body;

  // Only Razorpay supported
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

  const razorpayOrder = await createRazorpayOrder(total, {
    userId,
  });

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

  const payment = await Payment.create({
    order: order._id,
    user: userId,
    amount: total,
    razorpayOrderId: razorpayOrder.id,
    status: "created",
  });

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
        key: env.RAZORPAY_API_KEY,
      },
    },
  });
});


// export const checkout = asyncHandler(async (req, res) => {
//   const userId = req.user?.userId;
//   const { paymentMethod, shippingAddress, appliedPoints = 0 } = req.body;

//   if (paymentMethod !== "razorpay") {
//     throw AppError.badRequest("Only Razorpay supported", "INVALID_PAYMENT");
//   }

//   if (!shippingAddress?.city || !shippingAddress?.state) {
//     throw AppError.badRequest("Address required", "ADDRESS_REQUIRED");
//   }

//   const [cart, config, warehouse, rewardConfig, user] = await Promise.all([
//     Cart.findOne({ userId, status: "active" }),
//     Shipping.findOne({ isActive: true }).lean(),
//     Warehouse.findOne({ isActive: true }).lean(),
//     Reward.findOne({ isActive: true }).lean(),
//     User.findById(userId),
//   ]);

//   if (!cart || cart.items.length === 0) {
//     throw AppError.badRequest("Cart empty", "CART_EMPTY");
//   }

//   if (!config || !warehouse) {
//     throw AppError.internal("Config missing", "CONFIG_ERROR");
//   }

//   // ✅ FETCH VALID POINTS FROM LEDGER
//   const validLedgerPointsAgg = await RewardLedger.aggregate([
//     {
//       $match: {
//         user: user._id,
//         type: "earn",
//         remainingPoints: { $gt: 0 },
//         expiresAt: { $gt: new Date() },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         total: { $sum: "$remainingPoints" },
//       },
//     },
//   ]);

//   const validPoints = validLedgerPointsAgg[0]?.total || 0;

//   const safeAppliedPoints = Math.min(appliedPoints, validPoints);

//   if (appliedPoints > validPoints) {
//     throw AppError.badRequest("Invalid reward usage", "INVALID_POINTS");
//   }

//   const summary = calculateOrderSummary({
//     cart,
//     shippingAddress,
//     warehouse,
//     config,
//     rewardConfig,
//     appliedPoints: safeAppliedPoints,
//     userAvailablePoints: validPoints,
//   });

//   const {
//     subtotal,
//     shippingCharge,
//     platformFee,
//     discount,
//     total,
//     earnedPoints,
//   } = summary;

//   const razorpayOrder = await createRazorpayOrder(total, { userId });

//   const order = await Order.create({
//     user: userId,
//     items: cart.items,
//     shippingAddress,

//     paymentMethod,
//     paymentStatus: "pending",
//     status: "placed",

//     subtotal,
//     totalGST: cart.totalGST,
//     shippingCharge,
//     platformFee,
//     discount,
//     grandTotal: total,

//     reward: {
//       usedPoints: discount,
//       earnedPoints,
//     },
//   });

//   const payment = await Payment.create({
//     order: order._id,
//     user: userId,
//     amount: total,
//     razorpayOrderId: razorpayOrder.id,
//     status: "created",
//   });

//   order.payment = payment._id;
//   await order.save();

//   res.json({
//     success: true,
//     data: {
//       orderId: order._id,
//       razorpay: {
//         rzOrderId: razorpayOrder.id,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         key: env.RAZORPAY_API_KEY,
//       },
//     },
//   });
// });

export const verifyPayment = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const rewardConfig = await Reward.findOne({ isActive: true }).lean();

  // VERIFY SIGNATURE
  const isValid = verifyPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!isValid) {
    throw AppError.badRequest("Invalid signature", "INVALID_SIGNATURE");
  }

  // FETCH FROM RAZORPAY
  let razorpayPayment;

  try {
    razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);
  } catch (err) {
    throw AppError.badRequest(
      err?.error?.description || "Failed to fetch payment",
      "RAZORPAY_FETCH_FAILED",
    );
  }

  // VALIDATE PAYMENT
  if (razorpayPayment.status !== "captured") {
    throw AppError.badRequest("Payment not captured", "PAYMENT_NOT_CAPTURED");
  }

  if (razorpayPayment.order_id !== razorpayOrderId) {
    throw AppError.badRequest("Order mismatch", "ORDER_MISMATCH");
  }

  // FIND PAYMENT (IMPORTANT FIX)
  const payment = await Payment.findOne({
    razorpayOrderId,
  });

  if (!payment) {
    throw AppError.notFound("Payment not found", "PAYMENT_NOT_FOUND");
  }

  // ✅ Idempotency check
  if (payment.status === "captured") {
    return res.json({
      success: true,
      message: "Payment already verified",
      data: { orderId: payment.order },
    });
  }

  // VALIDATE AMOUNT
  if (razorpayPayment.amount !== payment.amount * 100) {
    throw AppError.badRequest("Amount mismatch", "AMOUNT_MISMATCH");
  }

  const order = await Order.findById(payment.order);

  if (!order) {
    throw AppError.notFound("Order not found", "ORDER_NOT_FOUND");
  }

  // START TRANSACTION
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // PAYMENT UPDATE
    payment.status = "captured";
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.isVerified = true;
    payment.capturedAt = new Date();

    payment.method = razorpayPayment.method;
    payment.bank = razorpayPayment.bank || null;
    payment.wallet = razorpayPayment.wallet || null;
    payment.vpa = razorpayPayment.vpa || null;

    payment.card = {
      last4: razorpayPayment.card?.last4 || null,
      network: razorpayPayment.card?.network || null,
      issuer: razorpayPayment.card?.issuer || null,
    };

    payment.razorpayRawResponse = razorpayPayment;

    await payment.save({ session });

    // ORDER UPDATE
    order.paymentStatus = "paid";
    order.status = "confirmed";
    order.confirmedAt = new Date();

    await order.save({ session });

    // USER UPDATE (ATOMIC)
    const used = order.reward?.usedPoints || 0;
    const earned = order.reward?.earnedPoints || 0;

    const used = order.reward?.usedPoints || 0;

    if (used > 0) {
      let remainingToUse = used;

      const ledgerEntries = await RewardLedger.find({
        user: userId,
        type: "earn",
        remainingPoints: { $gt: 0 },
        expiresAt: { $gt: new Date() },
      })
        .sort({ createdAt: 1 }) // FIFO
        .session(session);

      for (const entry of ledgerEntries) {
        if (remainingToUse <= 0) break;

        const deduct = Math.min(entry.remainingPoints, remainingToUse);

        entry.remainingPoints -= deduct;
        remainingToUse -= deduct;

        await entry.save({ session });
      }

      // Create redeem log
      await RewardLedger.create(
        [
          {
            user: userId,
            type: "redeem",
            points: used,
            orderId: order._id,
          },
        ],
        { session },
      );

      // Update user points
      await User.updateOne(
        { _id: userId },
        {
          $inc: {
            points: -used,
          },
        },
        { session },
      );
    }

    if (earned > 0 && rewardConfig) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + rewardConfig.validity);

      await RewardLedger.create(
        [
          {
            user: userId,
            type: "earn",
            points: earned,
            remainingPoints: earned,
            orderId: order._id,
            expiresAt,
          },
        ],
        { session },
      );

      await User.updateOne(
        { _id: userId },
        {
          $inc: {
            points: earned,
          },
        },
        { session },
      );
    }

    await User.updateOne(
      { _id: userId },
      {
        $inc: {
          totalOrders: 1,
          totalSpend: order.grandTotal,
        },
        $set: {
          lastOrderAt: new Date(),
        },
      },
      { session },
    );

    // CART UPDATE
    await Cart.updateOne(
      { userId, status: "active" },
      { status: "checked_out" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    // RESPONSE
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        orderId: order._id,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});


// export const verifyPayment = asyncHandler(async (req, res) => {
//   const userId = req.user?.userId;
//   const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

//   const rewardConfig = await Reward.findOne({ isActive: true }).lean();

//   const isValid = verifyPaymentSignature({
//     razorpayOrderId,
//     razorpayPaymentId,
//     razorpaySignature,
//   });

//   if (!isValid) throw AppError.badRequest("Invalid signature");

//   const razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);

//   if (razorpayPayment.status !== "captured") {
//     throw AppError.badRequest("Payment not captured");
//   }

//   const payment = await Payment.findOne({ razorpayOrderId });
//   if (!payment) throw AppError.notFound("Payment not found");

//   if (payment.status === "captured") {
//     return res.json({ success: true, data: { orderId: payment.order } });
//   }

//   const order = await Order.findById(payment.order);
//   if (!order) throw AppError.notFound("Order not found");

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // ✅ PAYMENT
//     payment.status = "captured";
//     payment.razorpayPaymentId = razorpayPaymentId;
//     payment.razorpaySignature = razorpaySignature;
//     payment.isVerified = true;
//     payment.capturedAt = new Date();
//     await payment.save({ session });

//     // ✅ ORDER
//     order.paymentStatus = "paid";
//     order.status = "confirmed";
//     await order.save({ session });

//     const used = order.reward?.usedPoints || 0;
//     const earned = order.reward?.earnedPoints || 0;

//     // ======================
//     // REDEEM (FIFO)
//     // ======================
//     if (used > 0) {
//       let remainingToUse = used;

//       const entries = await RewardLedger.find({
//         user: userId,
//         type: "earn",
//         remainingPoints: { $gt: 0 },
//         expiresAt: { $gt: new Date() },
//       })
//         .sort({ createdAt: 1 })
//         .session(session);

//       for (const entry of entries) {
//         if (remainingToUse <= 0) break;

//         const deduct = Math.min(entry.remainingPoints, remainingToUse);
//         entry.remainingPoints -= deduct;
//         remainingToUse -= deduct;

//         await entry.save({ session });
//       }

//       await RewardLedger.create(
//         [
//           {
//             user: userId,
//             type: "redeem",
//             points: used,
//             orderId: order._id,
//           },
//         ],
//         { session },
//       );

//       await User.updateOne(
//         { _id: userId },
//         { $inc: { points: -used } },
//         { session },
//       );
//     }

//     // ======================
//     // EARN
//     // ======================
//     if (earned > 0 && rewardConfig) {
//       const expiresAt = new Date();
//       expiresAt.setDate(expiresAt.getDate() + rewardConfig.validity);

//       await RewardLedger.create(
//         [
//           {
//             user: userId,
//             type: "earn",
//             points: earned,
//             remainingPoints: earned,
//             expiresAt,
//             orderId: order._id,
//           },
//         ],
//         { session },
//       );

//       await User.updateOne(
//         { _id: userId },
//         { $inc: { points: earned } },
//         { session },
//       );
//     }

//     // ✅ USER META
//     await User.updateOne(
//       { _id: userId },
//       {
//         $inc: { totalOrders: 1, totalSpend: order.grandTotal },
//         $set: { lastOrderAt: new Date() },
//       },
//       { session },
//     );

//     await Cart.updateOne(
//       { userId, status: "active" },
//       { status: "checked_out" },
//       { session },
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.json({ success: true, data: { orderId: order._id } });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     throw err;
//   }
// });

// export const verifyPayment = asyncHandler(async (req, res) => {
//   const userId = req.user?.userId;
//   const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

//   if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
//     throw AppError.badRequest("Missing payment data", "INVALID_REQUEST");
//   }

//   // ✅ Signature verify
//   const isValid = verifyPaymentSignature({
//     razorpayOrderId,
//     razorpayPaymentId,
//     razorpaySignature,
//   });

//   if (!isValid) {
//     throw AppError.badRequest("Invalid signature", "INVALID_SIGNATURE");
//   }

//   // ✅ Fetch payment from Razorpay
//   let razorpayPayment;
//   try {
//     razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);
//   } catch (err) {
//     throw AppError.badRequest(
//       err?.error?.description || "Failed to fetch payment",
//       "RAZORPAY_FETCH_FAILED",
//     );
//   }

//   if (razorpayPayment.status !== "captured") {
//     throw AppError.badRequest("Payment not captured", "PAYMENT_NOT_CAPTURED");
//   }

//   if (razorpayPayment.order_id !== razorpayOrderId) {
//     throw AppError.badRequest("Order mismatch", "ORDER_MISMATCH");
//   }

//   // ✅ Find payment
//   const payment = await Payment.findOne({ razorpayOrderId });

//   if (!payment) {
//     throw AppError.notFound("Payment not found", "PAYMENT_NOT_FOUND");
//   }

//   // ✅ Idempotency
//   if (payment.status === "captured" && payment.isVerified) {
//     return res.json({
//       success: true,
//       message: "Already verified",
//       data: { orderId: payment.order },
//     });
//   }

//   if (razorpayPayment.amount !== payment.amount * 100) {
//     throw AppError.badRequest("Amount mismatch", "AMOUNT_MISMATCH");
//   }

//   const order = await Order.findById(payment.order);
//   if (!order) {
//     throw AppError.notFound("Order not found", "ORDER_NOT_FOUND");
//   }

//   const rewardConfig = await Reward.findOne({ isActive: true }).lean();

//   const used = order.reward?.usedPoints || 0;
//   const earned = order.reward?.earnedPoints || 0;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // ================= PAYMENT =================
//     payment.status = "captured";
//     payment.isVerified = true;
//     payment.razorpayPaymentId = razorpayPaymentId;
//     payment.razorpaySignature = razorpaySignature;
//     payment.capturedAt = new Date();
//     payment.method = razorpayPayment.method;
//     payment.bank = razorpayPayment.bank || null;
//     payment.wallet = razorpayPayment.wallet || null;
//     payment.vpa = razorpayPayment.vpa || null;

//     await payment.save({ session });

//     // ================= ORDER =================
//     order.paymentStatus = "paid";
//     order.status = "confirmed";
//     order.confirmedAt = new Date();
//     await order.save({ session });

//     // ================= REDEEM =================
//     if (used > 0) {
//       const totalAvailable = await RewardLedger.aggregate([
//         {
//           $match: {
//             user: new mongoose.Types.ObjectId(userId),
//             type: "earn",
//             remainingPoints: { $gt: 0 },
//             expiresAt: { $gt: new Date() },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             total: { $sum: "$remainingPoints" },
//           },
//         },
//       ]).session(session);

//       const availablePoints = totalAvailable[0]?.total || 0;

//       if (used > availablePoints) {
//         throw AppError.badRequest(
//           "Insufficient reward points",
//           "INSUFFICIENT_POINTS",
//         );
//       }

//       let remainingToUse = used;

//       const ledgerEntries = await RewardLedger.find({
//         user: userId,
//         type: "earn",
//         remainingPoints: { $gt: 0 },
//         expiresAt: { $gt: new Date() },
//       })
//         .sort({ expiresAt: 1, createdAt: 1 }) // expiry first
//         .session(session);

//       for (const entry of ledgerEntries) {
//         if (remainingToUse <= 0) break;

//         const deduct = Math.min(entry.remainingPoints, remainingToUse);

//         entry.remainingPoints -= deduct;
//         remainingToUse -= deduct;

//         await entry.save({ session });
//       }

//       // Idempotency for redeem
//       const existingRedeem = await RewardLedger.findOne({
//         orderId: order._id,
//         type: "redeem",
//       }).session(session);

//       if (!existingRedeem) {
//         await RewardLedger.create(
//           [
//             {
//               user: userId,
//               type: "redeem",
//               points: used,
//               orderId: order._id,
//             },
//           ],
//           { session },
//         );
//       }
//     }

//     // ================= EARN =================
//     if (earned > 0 && rewardConfig) {
//       const expiresAt = new Date(
//         Date.now() + rewardConfig.validity * 24 * 60 * 60 * 1000,
//       );

//       const existingEarn = await RewardLedger.findOne({
//         orderId: order._id,
//         type: "earn",
//       }).session(session);

//       if (!existingEarn) {
//         await RewardLedger.create(
//           [
//             {
//               user: userId,
//               type: "earn",
//               points: earned,
//               remainingPoints: earned,
//               orderId: order._id,
//               expiresAt,
//             },
//           ],
//           { session },
//         );
//       }
//     }

//     // ================= USER UPDATE =================
//     let pointsDelta = 0;
//     if (used > 0) pointsDelta -= used;
//     if (earned > 0) pointsDelta += earned;

//     await User.updateOne(
//       { _id: userId },
//       {
//         $inc: {
//           points: pointsDelta,
//           totalOrders: 1,
//           totalSpend: order.grandTotal,
//         },
//         $set: {
//           lastOrderAt: new Date(),
//         },
//       },
//       { session },
//     );

//     // ================= CART =================
//     await Cart.updateOne(
//       { userId, status: "active" },
//       { status: "checked_out" },
//       { session },
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.json({
//       success: true,
//       message: "Payment verified successfully",
//       data: { orderId: order._id },
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     throw err;
//   }
// });

export const paymentFailed = asyncHandler(async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, error } = req.body;

  // ✅ Find order using razorpayOrderId
  const payment = await Payment.findOne({ razorpayOrderId });

  if (!payment) {
    throw AppError.notFound("Payment not found", "PAYMENT_NOT_FOUND");
  }

  const order = await Order.findById(payment.order);

  if (!order) {
    throw AppError.notFound("Order not found", "ORDER_NOT_FOUND");
  }

  // ✅ Idempotency (avoid duplicate updates)
  if (
    payment.status === "failed" &&
    payment.razorpayPaymentId === razorpayPaymentId
  ) {
    return res.json({
      success: true,
      message: "Already recorded",
    });
  }

  // =========================
  // UPDATE PAYMENT
  // =========================
  payment.status = "failed";
  payment.failedAt = new Date();
  payment.razorpayPaymentId = razorpayPaymentId;

  payment.errorCode = error?.code || null;
  payment.errorDescription = error?.description || null;
  payment.errorSource = error?.source || null;
  payment.errorReason = error?.reason || null;

  payment.razorpayRawResponse = error || null;

  await payment.save();

  // Instead:
  order.paymentStatus = "failed";
  order.status = "cancelled";
  order.cancelledAt = new Date();

  await order.save();

  res.json({
    success: true,
    message: "Payment failed please retry...",
  });
});
