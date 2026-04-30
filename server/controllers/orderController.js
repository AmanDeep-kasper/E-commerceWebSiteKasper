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
import { createInvoiceFromOrder } from "../service/invoiceService.js";
import { generateInvoicePDF } from "../service/generateInvoice.js";
import { uploadInvoicePDF, uploadToCloudinary } from "../utils/uploader.js";
import Invoice from "../models/Invoice.js";

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
    mrpTotal: cart.mrpsubtotal,
    totalDiscount: cart.discount,
    subtotal: cart.subtotal,
    totalGST: cart.totalGST,
    shippingCharge,
    platformFee,
    discount,
    total: totalBeforeEarning,
    earnedPoints,
  };
};

// user controllers
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

  if (!config || !warehouse) {
    throw AppError.internal("Shipping config missing", "CONFIG_ERROR");
  }

  // ======================
  // ✅ REAL AVAILABLE POINTS (LEDGER BASED)
  // ======================
  const pointsAgg = await RewardLedger.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: "earn",
        remainingPoints: { $gt: 0 },
        expiresAt: { $gt: new Date() },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$remainingPoints" },
      },
    },
  ]);

  const availablePoints = pointsAgg[0]?.total || 0;

  // ======================
  // SUMMARY
  // ======================
  const summary = calculateOrderSummary({
    cart,
    shippingAddress,
    warehouse,
    config,
    rewardConfig,
    appliedPoints,
    userAvailablePoints: availablePoints,
  });

  res.json({
    success: true,
    data: {
      ...summary,
      availablePoints,
    },
  });
});

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

  // ✅ FETCH VALID POINTS FROM LEDGER
  const validLedgerPointsAgg = await RewardLedger.aggregate([
    {
      $match: {
        user: user._id,
        type: "earn",
        remainingPoints: { $gt: 0 },
        expiresAt: { $gt: new Date() },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$remainingPoints" },
      },
    },
  ]);

  const validPoints = validLedgerPointsAgg[0]?.total || 0;

  const safeAppliedPoints = Math.min(appliedPoints, validPoints);

  if (appliedPoints > validPoints) {
    throw AppError.badRequest("Invalid reward usage", "INVALID_POINTS");
  }

  const summary = calculateOrderSummary({
    cart,
    shippingAddress,
    warehouse,
    config,
    rewardConfig,
    appliedPoints: safeAppliedPoints,
    userAvailablePoints: validPoints,
  });

  const {
    mrpTotal,
    totalDiscount,
    subtotal,
    totalGST,
    shippingCharge,
    platformFee,
    discount,
    total,
    earnedPoints,
  } = summary;

  const razorpayOrder = await createRazorpayOrder(total, { userId });

  const order = await Order.create({
    user: userId,
    items: cart.items,
    shippingAddress,

    paymentMethod,
    paymentStatus: "pending",
    status: "placed",

    mrpTotal,
    totalDiscount,
    platformFee,
    totalGST,
    subtotal,
    shippingCharge,
    discount,
    grandTotal: total,

    reward: {
      usedPoints: discount,
      earnedPoints,
    },
  });

  const payment = await Payment.create({
    order: order._id,
    orderId: order.orderNumber,
    user: userId,
    amount: total,
    razorpayOrderId: razorpayOrder.id,
    status: "created",
  });

  order.payment = payment._id;
  await order.save();

  res.json({
    success: true,
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

  const rewardConfig =
    (await Reward.findOne({ isActive: true }).lean()) || null;

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

  if (razorpayPayment.status !== "captured") {
    throw AppError.badRequest("Payment not captured", "PAYMENT_NOT_CAPTURED");
  }

  if (razorpayPayment.order_id !== razorpayOrderId) {
    throw AppError.badRequest("Order mismatch", "ORDER_MISMATCH");
  }

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) {
    throw AppError.notFound("Payment not found", "PAYMENT_NOT_FOUND");
  }

  // Idempotency check
  if (payment.status === "captured") {
    return res.json({
      success: true,
      message: "Payment already verified",
      data: { orderId: payment.order },
    });
  }

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

  // FIX 2: track whether transaction is still active
  let transactionCommitted = false;

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
    order.status = "placed";
    order.confirmedAt = new Date();

    await order.save({ session });

    // STOCK UPDATE
    for (const item of order.items) {
      const result = await Product.updateOne(
        {
          _id: item.product,
          "variants._id": item.variantId,
          "variants.variantAvailableStock": { $gte: item.quantity },
        },
        {
          $inc: {
            "variants.$.variantAvailableStock": -item.quantity,
            "stats.totalSold": item.quantity,
          },
        },
        { session },
      );

      if (result.modifiedCount === 0) {
        throw AppError.badRequest(
          `Insufficient stock for product ${item.product}`,
          "OUT_OF_STOCK",
        );
      }
    }

    // USER REWARDS UPDATE
    const used = order.reward?.usedPoints || 0;
    const earned = order.reward?.earnedPoints || 0;

    if (used > 0) {
      let remainingToUse = used;

      const ledgerEntries = await RewardLedger.find({
        user: userId,
        type: "earn",
        remainingPoints: { $gt: 0 },
        expiresAt: { $gt: new Date() },
      })
        .sort({ createdAt: 1 })
        .session(session);

      for (const entry of ledgerEntries) {
        if (remainingToUse <= 0) break;
        const deduct = Math.min(entry.remainingPoints, remainingToUse);
        entry.remainingPoints -= deduct;
        remainingToUse -= deduct;
        await entry.save({ session });
      }

      await RewardLedger.create(
        [{ user: userId, type: "redeem", points: used, orderId: order._id }],
        { session },
      );

      await User.updateOne(
        { _id: userId },
        { $inc: { points: -used } },
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
        { $inc: { points: earned } },
        { session },
      );
    }

    await User.updateOne(
      { _id: userId },
      {
        $inc: { totalOrders: 1, totalSpend: order.grandTotal },
        $set: { lastOrderAt: new Date() },
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
    transactionCommitted = true; // FIX: mark committed
    session.endSession();

    // ── CREATE INVOICE (outside transaction — failure won't rollback payment) ──
    let invoice = null;

    try {
      invoice = await createInvoiceFromOrder(order._id);

      const pdfBuffer = await generateInvoicePDF(invoice);

      const safeBuffer = Buffer.isBuffer(pdfBuffer)
        ? pdfBuffer
        : Buffer.from(pdfBuffer);

      if (safeBuffer.length < 1000) {
        throw new Error(`PDF buffer too small: ${safeBuffer.length} bytes`);
      }

      const uploadRes = await uploadInvoicePDF(
        safeBuffer,
        "raw",
        "invoices",
        `invoice-${invoice.invoiceNumber}.pdf`,
      );

      invoice.pdf = {
        publicId: uploadRes.publicId,
        url: uploadRes.url,
      };

      await invoice.save();

      order.invoice = {
        invoiceId: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        invoicePdf: {
          publicId: uploadRes.publicId,
          url: uploadRes.url,
        },
      };
      await order.save();
    } catch (invoiceErr) {
      console.error("Invoice generation failed:", invoiceErr.message);
    }

    // RESPONSE
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        orderId: order.orderNumber,
        invoice: invoice
          ? {
              id: invoice._id,
              invoiceNumber: invoice.invoiceNumber,
              pdfUrl: invoice.pdf?.url || null, // FIX: use outer-scope downloadUrl
            }
          : null,
        shippingAddress: order.shippingAddress,
        placedAt: order.placedAt,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        items: order.items,
        reward: order.reward,
        orderSummary: {
          mrpTotal: order.mrpTotal,
          totalDiscount: order.totalDiscount,
          subtotal: order.subtotal,
          totalGST: order.totalGST,
          shippingCharge: order.shippingCharge,
          platformFee: order.platformFee,
          discount: order.discount,
          grandTotal: order.grandTotal,
        },
      },
    });
  } catch (err) {
    // FIX: only abort if transaction was NOT already committed
    if (!transactionCommitted) {
      await session.abortTransaction();
      session.endSession();
    }
    throw err;
  }
});

export const paymentFailed = asyncHandler(async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, error } = req.body;

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) {
    throw AppError.notFound("Payment not found", "PAYMENT_NOT_FOUND");
  }

  const order = await Order.findById(payment.order);
  if (!order) {
    throw AppError.notFound("Order not found", "ORDER_NOT_FOUND");
  }

  // ✅ Idempotency
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

  order.paymentStatus = "failed";
  order.status = "pending";
  await order.save();

  res.json({
    success: true,
    message: "Payment failed, you can retry",
    data: {
      orderId: order._id,
    },
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { page = 1, limit = 10, search, range, year, sortBy } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const query = { user: userId };

  // search by product name and orderId
  if (search) {
    query.$or = [
      { productTitle: { $regex: search, $options: "i" } },
      { orderNumber: { $regex: search, $options: "i" } },
    ];
  }

  // filter by date like last 30 days, 6 month, and 1 year
  if (range) {
    const today = new Date();
    let fromDate;

    if (range === "30d") {
      fromDate = new Date(today.setDate(today.getDate() - 30));
    }
    if (range === "6m") {
      fromDate = new Date(today.setMonth(today.getMonth() - 6));
    }
    if (range === "1y") {
      fromDate = new Date(today.setFullYear(today.getFullYear() - 1));
    }
    if (fromDate) {
      query.placedAt = { $gte: fromDate };
    }
  }

  // filter by years like - 2025, 2026 etc...
  if (year) {
    const fromDate = new Date(`${year}-01-01`);
    const toDate = new Date(`${year}-12-31`);

    query.placedAt = {
      ...(query.placedAt || {}),
      $gte: fromDate,
      $lte: toDate,
    };
  }

  let sortOptions = { createdAt: -1 };
  if (sortBy === "oldest") sortOptions = { createdAt: 1 };
  if (sortBy === "latest") sortOptions = { createdAt: -1 };
  if (sortBy === "price-high") sortOptions = { grandTotal: -1 };
  if (sortBy === "price-low") sortOptions = { grandTotal: 1 };

  const orders = await Order.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOptions)
    .lean();

  const total = await Order.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    orders,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getUserAvailablePoints = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  // get reward rules
  const reward = await Reward.findOne({ isActive: true }).lean();
  if (!reward) {
    throw AppError.notFound("Reward config not found", "REWARD_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "User points fetched successfully",
    data: {
      availablePoints: user.points,
      reward,
    },
  });
});

// admin controllers
export const getOrdersAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, range, sortBy, status } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const query = {};

  // search by product name and orderId
  if (search) {
    query.$or = [
      { productTitle: { $regex: search, $options: "i" } },
      { orderNumber: { $regex: search, $options: "i" } },
    ];
  }

  // filter by date like last 30 days, 6 month, and custom date
  if (range) {
    const today = new Date();
    let fromDate;

    if (range === "30d") {
      fromDate = new Date(today.setDate(today.getDate() - 30));
    }
    if (range === "6m") {
      fromDate = new Date(today.setMonth(today.getMonth() - 6));
    }
    if (fromDate) {
      query.placedAt = { $gte: fromDate };
    }
  }

  let sortOptions = { createdAt: -1 };
  if (sortBy === "oldest") sortOptions = { createdAt: 1 };
  if (sortBy === "latest") sortOptions = { createdAt: -1 };
  if (sortBy === "price-high") sortOptions = { grandTotal: -1 };
  if (sortBy === "price-low") sortOptions = { grandTotal: 1 };

  const statusMap = {
    processing: ["processing", "ready_to_ship"],
  };

  if (status) {
    query.status = statusMap[status] || status;
  }

  const orders = await Order.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOptions)
    .lean();

  const [
    totalOrders,
    newOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    readyToShipOrders,
    cancelledOrders,
    refundedOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: "placed" }),
    Order.countDocuments({ status: "processing" }),
    Order.countDocuments({ status: "shipped" }),
    Order.countDocuments({ status: "delivered" }),
    Order.countDocuments({ status: "ready_to_ship" }),
    Order.countDocuments({ status: "cancelled" }),
    Order.countDocuments({ status: "refunded" }),
  ]);

  const total = await Order.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    orders,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
    stats: {
      totalOrders,
      newOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      readyToShipOrders,
      cancelledOrders,
      refundedOrders,
    },
  });
});

export const getAllOrdersByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const query = { user: userObjectId };

  // 1. ORDERS
  const orders = await Order.find(query)
    .select("orderNumber grandTotal createdAt status")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 })
    .lean();

  // 2. PARALLEL STATS (FAST)
  const [total, cancelled, totalSpendAgg, topCategoryAgg] = await Promise.all([
    Order.countDocuments(query),

    Order.countDocuments({
      user: userObjectId,
      status: "cancelled",
    }),

    // total spend
    Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalSpend: { $sum: "$grandTotal" },
        },
      },
    ]),

    // TOP CATEGORY WITH NAME
    Order.aggregate([
      { $match: query },
      { $unwind: "$items" },

      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      {
        $group: {
          _id: "$category._id",
          name: { $first: "$category.name" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),
  ]);

  // FINAL DATA
  const topCategory =
    topCategoryAgg.length > 0
      ? {
          id: topCategoryAgg[0]._id,
          name: topCategoryAgg[0].name,
        }
      : null;

  const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",

    // clean orders
    data: orders,

    stats: {
      total,
      cancelled,
      totalSpend: totalSpendAgg[0]?.totalSpend || 0,
      topCategory,
      lastOrderDate,
    },

    pagination: {
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const acceptOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw AppError.notFound("Order not found", "NOT_FOUND");
  }
  if (order.status !== "placed") {
    throw AppError.badRequest("Order already accepted", "ALREADY_ACCEPTED");
  }

  order.status = "processing";
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order accepted successfully",
  });
});

export const readyToShip = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { carrier } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw AppError.notFound("Order not found", "NOT_FOUND");
  }

  if (order.status !== "processing") {
    throw AppError.badRequest("Order not accepted yet", "NOT_ACCEPTED");
  }

  if (["ready_to_ship", "shipped", "delivered"].includes(order.status)) {
    throw AppError.badRequest("Order already shipped", "ALREADY_SHIPPED");
  }

  order.status = "ready_to_ship";
  order.tracking = {
    carrier,
  };
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order ready to ship successfully",
  });
});

export const shipOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { carrier, trackingNumber, trackingUrl } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw AppError.notFound("Order not found", "NOT_FOUND");
  }

  if (order.status !== "ready_to_ship") {
    throw AppError.badRequest("Order not ready to ship yet", "NOT_READY");
  }

  if (["shipped", "delivered"].includes(order.status)) {
    throw AppError.badRequest("Order already shipped", "ALREADY_SHIPPED");
  }

  order.tracking = {
    carrier,
    trackingNumber,
    trackingUrl,
  };

  order.status = "shipped";
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order shipped successfully",
  });
});

export const deliverOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw AppError.notFound("Order not found", "NOT_FOUND");
  }

  if (order.status !== "shipped") {
    throw AppError.badRequest("Order not shipped yet", "NOT_SHIPPED");
  }

  if (["delivered"].includes(order.status)) {
    throw AppError.badRequest("Order already delivered", "ALREADY_DELIVERED");
  }

  order.status = "delivered";
  order.deliveredAt = new Date();
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order delivered successfully",
  });
});

export const getPayments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    range,
    fromDate,
    toDate,
    method,
    status,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  let query = {};

  // 🔍 SEARCH
  if (search) {
    query.$or = [
      { razorpayPaymentId: { $regex: search, $options: "i" } },
      { razorpayOrderId: { $regex: search, $options: "i" } },
    ];
  }

  // 📅 DATE FILTER
  if (range || (fromDate && toDate)) {
    let start, end;
    const today = new Date();

    if (range === "7d") {
      start = new Date();
      start.setDate(today.getDate() - 7);
    }

    if (range === "30d") {
      start = new Date();
      start.setDate(today.getDate() - 30);
    }

    if (range === "today") {
      start = new Date();
      start.setHours(0, 0, 0, 0);
    }

    if (fromDate && toDate) {
      start = new Date(fromDate);
      end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
    }

    if (start) {
      query.createdAt = {
        $gte: start,
        ...(end && { $lte: end }),
      };
    }
  }

  // 💳 METHOD FILTER
  if (method) query.method = method;

  // 📊 STATUS FILTER
  if (status) query.status = status;

  // ⚡ PARALLEL QUERIES
  const [payments, total, revenueAgg, weekly, monthly, yearly] =
    await Promise.all([
      Payment.find(query)
        .select("-razorpayRawResponse")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .lean(),

      Payment.countDocuments(query),

      // 💰 TOTAL REVENUE
      Payment.aggregate([
        { $match: { ...query, status: "captured" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // 📊 WEEKLY
      Payment.aggregate([
        { $match: { ...query, status: "captured" } },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            total: { $sum: "$amount" },
          },
        },
      ]),

      // 📊 MONTHLY (SMART BUCKET FIX ✅)
      Payment.aggregate([
        { $match: { ...query, status: "captured" } },

        {
          $addFields: {
            day: { $dayOfMonth: "$createdAt" },
          },
        },

        {
          $addFields: {
            bucket: {
              $switch: {
                branches: [
                  { case: { $lte: ["$day", 5] }, then: 1 },
                  { case: { $lte: ["$day", 10] }, then: 5 },
                  { case: { $lte: ["$day", 15] }, then: 10 },
                  { case: { $lte: ["$day", 20] }, then: 15 },
                  { case: { $lte: ["$day", 25] }, then: 20 },
                  { case: { $lte: ["$day", 30] }, then: 25 },
                ],
                default: 30,
              },
            },
          },
        },

        {
          $group: {
            _id: "$bucket",
            total: { $sum: "$amount" },
          },
        },
      ]),

      // 📊 YEARLY
      Payment.aggregate([
        { $match: { ...query, status: "captured" } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

  // 🧠 FORMAT

  const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weeklyData = daysMap.map((day, i) => {
    const found = weekly.find((d) => d._id === i + 1);
    return { day, revenue: found ? found.total : 0 };
  });

  const bucketRanges = [1, 5, 10, 15, 20, 25, 30];

  const monthlyData = bucketRanges.map((day) => {
    const found = monthly.find((d) => d._id === day);
    return {
      day,
      revenue: found ? found.total : 0,
    };
  });

  const monthsMap = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const yearlyData = monthsMap.map((m, i) => {
    const found = yearly.find((d) => d._id === i + 1);
    return { month: m, revenue: found ? found.total : 0 };
  });

  const order = await Order.find({ _id: { $in: payments.map((p) => p.order) } })
    .select("paymentStatus orderNumber grandTotal paymentMethod createdAt")
    .lean();

  const revenue = revenueAgg[0]?.total || 0;

  // ✅ TABLE FORMAT (IMPORTANT FIX)
  const formattedPayments = payments.map((p) => ({
    orderId:
      order.find((o) => o._id.toString() === p.order?.toString())
        ?.orderNumber || "N/A",
    paymentId: p.razorpayPaymentId || "N/A",
    date: p.createdAt,
    method: p.order?.paymentMethod || p.method,

    // ✅ FROM ORDER (FIXED)
    status:
      order.find((o) => o._id.toString() === p.order?.toString())
        ?.paymentStatus || p.status,

    // ✅ FROM ORDER (FIXED)
    amount: p.order?.grandTotal || p.amount,
  }));

  res.status(200).json({
    success: true,
    message: "Payments fetched successfully",
    payments: formattedPayments,
    stats: {
      totalRevenue: revenueAgg[0]?.total || 0,
      weekly: weeklyData,
      monthly: monthlyData,
      yearly: yearlyData,
    },
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// common controllers
export const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).lean();

  if (!order) {
    throw AppError.notFound("Order not found", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Order details fetched successfully",
    order,
  });
});

export const getOrderInvoiceDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const invoice = await Invoice.findOne({ orderId }).lean();

  if (!invoice) {
    throw AppError.notFound("Invoice not found", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Invoice details fetched successfully",
    invoice,
  });
});
