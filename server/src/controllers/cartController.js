import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  calculateDiscount,
  validateCouponApplicability,
} from "../helper/validateCouponAndCalculateDiscount.js";

// Helper function
const findAndValidateVariant = async (
  productId,
  variantId,
  requestedQuantity,
) => {
  const product = await Product.findById(productId)
    .select("productTittle category variants")
    .lean();

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  if (!product.isActive) {
    throw AppError.badRequest(
      "Product is currently unavailable",
      "UNAVAILABLE",
    );
  }

  const variant = product.variants.find((v) => v._id.toString() === variantId);

  if (!variant) {
    throw AppError.notFound("Product variant not found", "NOT_FOUND");
  }

  if (variant.variantAvailableStock < requestedQuantity) {
    throw AppError.badRequest(
      `Only ${variant.variantAvailableStock} units available in stock`,
      "OUT_OF_STOCK",
    );
  }

  return { product, variant };
};

const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await Cart.create({ userId, items: [], status: "active" });
  }

  return cart;
};

const recalculateCartTotals = async (cart) => {
  // Reset computed fields
  let subtotal = 0;
  let totalGST = 0;
  let totalQuantity = 0;

  for (const item of cart.items) {
    const itemBasePrice = item.sellingPrice * item.quantity;
    const itemGST = (itemBasePrice * item.gst) / 100;

    item.itemTotal = itemBasePrice;
    subtotal += itemBasePrice;
    totalGST += itemGST;
    totalQuantity += item.quantity;
  }

  cart.subtotal = parseFloat(subtotal.toFixed(2));
  cart.totalGST = parseFloat(totalGST.toFixed(2));
  cart.totalQuantity = totalQuantity;

  // Reapply coupon if exists
  if (cart.coupon?.couponId) {
    await applyCouponToCart(cart, cart.coupon.code);
  } else {
    cart.couponDiscount = 0;
    cart.grandTotal = parseFloat(
      (cart.subtotal + cart.totalGST + cart.shippingCharge).toFixed(2),
    );
  }

  return cart;
};

const applyCouponToCart = async (cart, couponCode) => {
  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    isActive: true,
    $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
  });

  if (!coupon) {
    throw AppError.notFound("Coupon not found", "NOT_FOUND");
  }

  // Check minimum cart value
  if (cart.subtotal < coupon.minimumCartValue) {
    throw AppError.badRequest(
      `Minimum cart value of ₹${coupon.minimumCartValue} required for this coupon`,
      "INSUFFICIENT_CART_VALUE",
    );
  }

  // Validate coupon applicability
  const { applicable, applicableTotal } = await validateCouponApplicability(
    coupon,
    cart,
  );

  if (!applicable) {
    throw AppError.badRequest(
      "Coupon not applicable to items in cart",
      "NOT_APPLICABLE",
    );
  }

  const discountAmount = calculateDiscount(coupon, applicableTotal);

  cart.coupon = {
    couponId: coupon._id,
    code: coupon.code,
    discountAmount: parseFloat(discountAmount),
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    maxDiscountAmount: coupon.maxDiscountAmount,
    minimumCartValue: coupon.minimumCartValue,
    lockedAt: new Date(),
    lockedUntil: new Date(Date.now() + 5 * 60 * 1000), // 5 min lock
    expiresAt: coupon.expiresAt,
  };

  cart.couponDiscount = parseFloat(discountAmount);
  cart.grandTotal = parseFloat(
    (
      cart.subtotal +
      cart.totalGST +
      cart.shippingCharge -
      cart.couponDiscount
    ).toFixed(2),
  );

  return cart;
};

const validateCartStock = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.product)
      .select("isActive variants")
      .lean();

    if (!product || !product.isActive) {
      throw AppError.notFound(
        `Product "${item.productTitle}" is no longer available`,
        "NOT_FOUND",
      );
    }

    const variant = product.variants.find(
      (v) => v._id.toString() === item.variantId.toString(),
    );

    if (!variant) {
      throw AppError.notFound(
        `Variant for "${item.productTitle}" is no longer available`,
        "NOT_FOUND",
      );
    }

    if (variant.variantAvailableStock < item.quantity) {
      throw AppError(
        `Only ${variant.variantAvailableStock} units of "${item.productTitle}" available`,
        "OUT_OF_STOCK",
      );
    }
  }
};

// user controllers
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { productId, variantId, quantity = 1 } = req.body;

  const { product, variant } = await findAndValidateVariant(
    productId,
    variantId,
    quantity,
  );

  // Find or create active cart
  let cart = await findOrCreateCart(userId);

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.variantId.toString() === variantId,
  );

  if (existingItemIndex > -1) {
    // Update quantity if item exists
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    if (variant.variantAvailableStock < newQuantity) {
      throw AppError.badRequest(
        `Cannot add more. Only ${variant.variantAvailableStock} units available in total`,
        "OUT_OF_STOCK",
      );
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item with snapshot data
    const primaryImage = variant.variantImage?.[0]?.url || "";

    cart.items.push({
      product: product._id,
      variantId: variant._id,
      category: product.category,
      variantSkuId: variant.variantSkuId,
      variantName: variant.variantName,
      variantColor: variant.variantColor,
      productTitle: product.productTittle,
      imageUrl: primaryImage,
      mrp: variant.variantMrp,
      sellingPrice: variant.variantSellingPrice,
      gst: variant.variantGST,
      discount: variant.variantDiscount,
      quantity,
    });
  }

  // Recalculate totals
  await recalculateCartTotals(cart);
  await cart.save();

  // Populate for response
  await cart.populate([
    { path: "items.product", select: "productTittle slug" },
    { path: "coupon.couponId", select: "code discountType discountValue" },
  ]);

  res.status(200).json({
    success: true,
    message: "Item added to cart successfully",
    cart,
  });
});

export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  let cart = await Cart.findOne({ userId, status: "active" }).populate([
    { path: "items.product", select: "productTittle slug isActive" },
    {
      path: "coupon.couponId",
      select:
        "code discountType discountValue maxDiscountAmount minimumCartValue expiresAt isActive",
    },
  ]);

  if (!cart) {
    cart = await Cart.create({ userId, items: [], status: "active" });
  }

  // Check if any items have become unavailable
  const unavailableItems = [];
  const availableItems = [];

  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      unavailableItems.push(item._id);
    } else {
      availableItems.push(item);
    }
  }

  // Remove unavailable items
  if (unavailableItems.length > 0) {
    cart.items = cart.items.filter(
      (item) => !unavailableItems.includes(item._id),
    );
    await recalculateCartTotals(cart);
    await cart.save();
  }

  // Check stock levels and add warnings
  const stockWarnings = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.product)
      .select("variants")
      .lean();
    const variant = product?.variants.find(
      (v) => v._id.toString() === item.variantId.toString(),
    );

    if (variant && variant.variantAvailableStock < item.quantity) {
      stockWarnings.push({
        itemId: item._id,
        productTitle: item.productTitle,
        availableStock: variant.variantAvailableStock,
        requestedQuantity: item.quantity,
      });
    }
  }

  res.status(200).json({
    success: true,
    message: "Cart retrieved successfully",
    data: {
      cart,
      warning: stockWarnings.length > 0 ? stockWarnings : null,
    },
  });
});

export const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { itemId, quantity } = req.body;

  const cart = await Cart.findOne({ userId, status: "active" });

  if (!cart) {
    throw AppError.notFound("Cart not found", "NOT_FOUND");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId,
  );

  if (itemIndex === -1) {
    throw AppError.notFound("Item not found in cart", "NOT_FOUND");
  }

  const cartItem = cart.items[itemIndex];

  // Validate stock for new quantity
  const { variant } = await findAndValidateVariant(
    cartItem.product.toString(),
    cartItem.variantId.toString(),
    quantity,
  );

  if (quantity === 0) {
    // Remove item if quantity is 0
    cart.items.splice(itemIndex, 1);
  } else {
    if (variant.variantAvailableStock < quantity) {
      throw AppError.badRequest(
        `Only ${variant.variantAvailableStock} units available in stock`,
        "OUT_OF_STOCK",
      );
    }
    cart.items[itemIndex].quantity = quantity;
  }

  await recalculateCartTotals(cart);
  await cart.save();

  await cart.populate([
    { path: "items.product", select: "productTittle slug" },
    { path: "coupon.couponId", select: "code discountType discountValue" },
  ]);

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    cart,
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ userId, status: "active" });

  if (!cart) {
    throw AppError.notFound("Cart not found", "NOT_FOUND");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId,
  );

  if (itemIndex === -1) {
    throw new AppError("Item not found in cart", 404);
  }

  cart.items.splice(itemIndex, 1);

  await recalculateCartTotals(cart);
  await cart.save();

  await cart.populate([
    { path: "items.product", select: "productTittle slug" },
    { path: "coupon.couponId", select: "code discountType discountValue" },
  ]);

  res.status(200).json({
    success: true,
    message: "Item removed from cart successfully",
    cart,
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const cart = await Cart.findOne({ userId, status: "active" });

  if (!cart) {
    throw AppError.notFound("Cart not found", "NOT_FOUND");
  }

  cart.items = [];
  cart.coupon = undefined;
  cart.couponDiscount = 0;
  cart.subtotal = 0;
  cart.totalGST = 0;
  cart.totalQuantity = 0;
  cart.grandTotal = 0;
  cart.shippingCharge = 0;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    cart,
  });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { couponCode } = req.body;

  const cart = await Cart.findOne({ userId, status: "active" });

  if (!cart || cart.items.length === 0) {
    throw AppError.badRequest("Cart is empty", "EMPTY_CART");
  }

  await validateCartStock(cart.items);
  await applyCouponToCart(cart, couponCode);
  await cart.save();

  await cart.populate([
    { path: "items.product", select: "productTittle slug" },
    { path: "coupon.couponId", select: "code discountType discountValue" },
  ]);

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    cart,
  });
});

export const removeCoupon = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const cart = await Cart.findOne({ userId, status: "active" });

  if (!cart) {
    throw AppError.notFound("Cart not found", "NOT_FOUND");
  }

  cart.coupon = null;
  cart.couponDiscount = 0;

  await recalculateCartTotals(cart);
  await cart.save();

  await cart.populate([
    { path: "items.product", select: "productTittle slug" },
  ]);

  res.status(200).json({
    success: true,
    message: "Coupon removed successfully",
    cart,
  });
});
