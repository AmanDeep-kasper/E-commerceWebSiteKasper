import crypto from "node:crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Shipping from "../models/admin/ShippingConfig.js";
import Warehouse from "../models/admin/WarehouseConfig.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// Helper function
const calculateShippingCharge = ({
  userCity,
  userState,
  warehouseCity,
  warehouseState,
  config,
  cartTotal,
}) => {
  // ✅ Free delivery
  if (cartTotal >= config.freeDeliveryAbove) {
    return 0;
  }

  const city = userCity.toLowerCase();
  const state = userState.toLowerCase();

  const warehouseCityLc = warehouseCity.toLowerCase();
  const warehouseStateLc = warehouseState.toLowerCase();

  // ✅ Same city
  if (city === warehouseCityLc) {
    return config.charges.withinCity;
  }

  // ✅ Same state
  if (state === warehouseStateLc) {
    return config.charges.withinState;
  }

  // ✅ Special states (Northeast etc.)
  if (config.specialStates.includes(state)) {
    return config.charges.specialRegion;
  }

  // ✅ Metro to Metro
  if (
    config.metroCities.includes(city) &&
    config.metroCities.includes(warehouseCityLc)
  ) {
    return config.charges.metroToMetro;
  }

  // ✅ Rest of India
  return config.charges.restOfIndia;
};

// export const checkout = asyncHandler(async (req, res) => {
//   const userId = req.user?.userId;
//   const { paymentMethod, shippingAddress } = req.body;

//   if (!paymentMethod || !shippingAddress) {
//     throw AppError.badRequest(
//       "Payment method and shipping address is required",
//       "ALL_FIELDS_REQUIRED",
//     );
//   }

//   const cart = await Cart.findOne({ userId, status: "active" });

//   if (!cart || cart.items.length === 0) {
//     throw AppError.badRequest("Cart is empty", "CART_EMPTY");
//   }

//   // calculate shipping charge by zones
//   let shippingCharge = 0;
// });


export const checkout = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { paymentMethod, shippingAddress } = req.body;

  // ✅ Only Razorpay supported
  if (paymentMethod !== "razorpay") {
    throw AppError.badRequest(
      "Only Razorpay is supported currently",
      "INVALID_PAYMENT_METHOD"
    );
  }

  if (!shippingAddress) {
    throw AppError.badRequest(
      "Shipping address is required",
      "ADDRESS_REQUIRED"
    );
  }

  // ✅ Get cart (lightweight)
  const cart = await Cart.findOne(
    { userId, status: "active" },
    { items: 1, subtotal: 1, totalGST: 1 }
  ).lean();

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

  const grandTotal =
    cart.subtotal +
    cart.totalGST +
    shippingCharge +
    platformFee +
    additionalCharges;

  // ❗ Safety (no NaN)
  if (isNaN(grandTotal)) {
    throw AppError.internal("Invalid total calculation", "TOTAL_ERROR");
  }

  // ✅ Create order (simplified)
  const order = await Order.create({
    userId,
    items: cart.items,
    shippingAddress,
    paymentMethod,
    pricing: {
      subtotal: cart.subtotal,
      gst: cart.totalGST,
      shippingCharge,
      platformFee,
      additionalCharges,
      grandTotal,
    },
    status: "pending",
  });

  res.status(200).json({
    success: true,
    message: "Checkout successful",
    data: {
      orderId: order._id,
      pricing: order.pricing,
    },
  });
});