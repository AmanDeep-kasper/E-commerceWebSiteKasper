import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// 🔥 HELPER (OPTIMIZED)
const validateProductAndVariant = async (productId, variantId) => {
  const product = await Product.findById(productId)
    .select("_id productTittle category variants isActive")
    .lean();

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  if (!product.isActive) {
    throw AppError.badRequest("Product unavailable", "UNAVAILABLE");
  }

  let variant =
    product.variants.find((v) => v._id.toString() === variantId) ||
    product.variants.find((v) => v.isSelected) ||
    product.variants[0];

  if (!variant) {
    throw AppError.notFound("Variant not found", "NOT_FOUND");
  }

  return { product, variant };
};

// ADD TO CART
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId, variantId, quantity = 1 } = req.body;

  // 1. Validate product + variant
  const { product, variant } = await validateProductAndVariant(
    productId,
    variantId,
  );

  // 2. Stock check
  if (variant.variantAvailableStock < quantity) {
    throw AppError.badRequest(
      `Only ${variant.variantAvailableStock} items available`,
      "OUT_OF_STOCK",
    );
  }

  // PREPARE SNAPSHOT
  const newItem = {
    product: product._id,
    variantId: variant._id,
    variantSkuId: variant.variantSkuId,

    category: product.category,

    productTitle: product.productTittle,
    variantName: variant.variantName,
    variantColor: variant.variantColor,

    variantAttributes: {
      weight: `${variant.variantWeight}${variant.variantWeightUnit}`,
    },

    image: {
      url: variant.variantImage?.[0]?.url || "",
      altText: variant.variantName || "",
    },

    mrp: variant.variantMrp,
    sellingPrice: variant.variantSellingPrice,
    gst: variant.variantGST,
    discount: variant.variantDiscount,

    quantity,
  };

  // TRY UPDATE EXISTING ITEM (FAST PATH)
  let cart = await Cart.findOneAndUpdate(
    {
      userId,
      status: "active",
      "items.product": productId,
      "items.variantId": variant._id,
    },
    {
      $inc: { "items.$.quantity": quantity },
    },
    {
      new: true,
    },
  );

  // IF ITEM NOT EXISTS → PUSH NEW
  if (!cart) {
    cart = await Cart.findOneAndUpdate(
      { userId, status: "active" },
      {
        $push: { items: newItem },
        $setOnInsert: { userId },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  // REFETCH MINIMAL CART (LEAN)
  cart = await Cart.findById(cart._id);

  // REVALIDATE STOCK (IMPORTANT)
  const item = cart.items.find(
    (i) =>
      i.product.toString() === productId &&
      i.variantId.toString() === variant._id.toString(),
  );

  if (item.quantity > variant.variantAvailableStock) {
    throw AppError.badRequest(
      `Only ${variant.variantAvailableStock} items available`,
      "OUT_OF_STOCK",
    );
  }

  // RECALCULATE
  cart.recalculate();
  await cart.save();

  // RESPONSE
  res.status(200).json({
    success: true,
    message: "Item added to cart",
    data: {
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      subtotal: cart.subtotal,
      totalGST: cart.totalGST,
      grandTotal: cart.grandTotal,
    },
  });
});

export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Fetch cart (lean + projection)
  let cart = await Cart.findOne(
    { userId, status: "active" },
    {
      items: 1,
      totalQuantity: 1,
      subtotal: 1,
      totalGST: 1,
      grandTotal: 1,
      shipping: 1,
      reward: 1,
    },
  ).lean();

  // If no cart → return empty (no DB create needed)
  if (!cart) {
    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: {
        items: [],
        totalQuantity: 0,
        subtotal: 0,
        totalGST: 0,
        grandTotal: 0,
      },
    });
  }

  // BULK FETCH PRODUCTS (ONE QUERY)
  const productIds = cart.items.map((item) => item.product);

  const products = await Product.find(
    { _id: { $in: productIds } },
    { _id: 1, isActive: 1, variants: 1 },
  ).lean();

  const productMap = new Map();
  products.forEach((p) => productMap.set(p._id.toString(), p));

  // PROCESS ITEMS (NO EXTRA DB CALLS)
  const validItems = [];
  const stockWarnings = [];

  for (const item of cart.items) {
    const product = productMap.get(item.product.toString());

    // Remove inactive product
    if (!product || !product.isActive) continue;

    const variant = product.variants.find(
      (v) => v._id.toString() === item.variantId.toString(),
    );

    if (!variant) continue;

    // Stock warning
    if (variant.variantAvailableStock < item.quantity) {
      stockWarnings.push({
        itemId: item._id,
        productTitle: item.productTitle,
        availableStock: variant.variantAvailableStock,
        requestedQuantity: item.quantity,
      });
    }

    validItems.push(item);
  }

  // CLEAN CART IF NEEDED
  if (validItems.length !== cart.items.length) {
    await Cart.updateOne({ userId }, { $set: { items: validItems } });
  }

  // RESPONSE
  res.status(200).json({
    success: true,
    message: "Cart retrieved successfully",
    data: {
      ...cart,
      items: validItems,
      warning: stockWarnings.length ? stockWarnings : null,
    },
  });
});

export const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { itemId, action } = req.body;

  if (!itemId || !["inc", "dec"].includes(action)) {
    throw AppError.badRequest("Invalid request");
  }

  // GET CART (LIGHTWEIGHT)
  const cart = await Cart.findOne({ userId, status: "active" }, { items: 1 });

  if (!cart) {
    throw AppError.notFound("Cart not found", "NOT_FOUND");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw AppError.notFound("Item not found in cart", "NOT_FOUND");
  }

  let newQuantity = item.quantity;

  // DECREMENT
  if (action === "dec") {
    newQuantity -= 1;

    // ❗ remove if goes to 0
    if (newQuantity <= 0) {
      await Cart.updateOne({ userId }, { $pull: { items: { _id: itemId } } });

      const updatedCart = await Cart.findOne(
        { userId },
        {
          items: 1,
          totalQuantity: 1,
          subtotal: 1,
          totalGST: 1,
          grandTotal: 1,
        },
      );

      updatedCart.recalculate();
      await updatedCart.save();

      return res.status(200).json({
        success: true,
        message: "Item removed",
        data: updatedCart,
      });
    }
  }

  // INCREMENT (WITH STOCK CHECK)
  if (action === "inc") {
    newQuantity += 1;

    const product = await Product.findById(item.product)
      .select("variants")
      .lean();

    const variant = product?.variants.find(
      (v) => v._id.toString() === item.variantId.toString(),
    );

    if (!variant) {
      throw AppError.notFound("Variant not found");
    }

    if (variant.variantAvailableStock < newQuantity) {
      throw AppError.badRequest(
        `Only ${variant.variantAvailableStock} available`,
        "OUT_OF_STOCK",
      );
    }
  }

  // UPDATE QUANTITY
  await Cart.updateOne(
    { userId, "items._id": itemId },
    {
      $set: { "items.$.quantity": newQuantity },
    },
  );

  // REFETCH + RECALCULATE
  const updatedCart = await Cart.findOne({ userId, status: "active" });

  updatedCart.recalculate();
  await updatedCart.save();

  // RESPONSE
  res.status(200).json({
    success: true,
    message: "Cart updated",
    data: {
      items: updatedCart.items,
      totalQuantity: updatedCart.totalQuantity,
      subtotal: updatedCart.subtotal,
      totalGST: updatedCart.totalGST,
      grandTotal: updatedCart.grandTotal,
    },
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { itemId } = req.params;

  // REMOVE ITEM (ATOMIC FAST)
  const result = await Cart.updateOne(
    {
      userId,
      status: "active",
      "items._id": itemId,
    },
    {
      $pull: { items: { _id: itemId } },
    },
  );

  // item not found case
  if (result.modifiedCount === 0) {
    throw AppError.notFound("Item not found in cart", "NOT_FOUND");
  }

  // REFETCH MINIMAL CART
  const cart = await Cart.findOne({ userId, status: "active" });

  if (!cart) {
    throw AppError.notFound("Cart not found", "NOT_FOUND");
  }

  // RECALCULATE (MANDATORY)
  cart.recalculate();
  await cart.save();

  // RESPONSE (LIGHTWEIGHT)
  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: {
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      subtotal: cart.subtotal,
      totalGST: cart.totalGST,
      grandTotal: cart.grandTotal,
    },
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  // ATOMIC RESET (FASTEST)
  const updated = await Cart.findOneAndUpdate(
    { userId, status: "active" },
    {
      $set: {
        items: [],
        totalQuantity: 0,
        subtotal: 0,
        totalGST: 0,
        grandTotal: 0,
        "reward.usedPoints": 0,
        "reward.discount": 0,
        "shipping.charge": 0,
      },
    },
    {
      new: true,
      projection: {
        items: 1,
        totalQuantity: 1,
        subtotal: 1,
        totalGST: 1,
        grandTotal: 1,
      },
    },
  ).lean();

  // If cart not found → return empty state (no error needed)
  if (!updated) {
    return res.status(200).json({
      success: true,
      message: "Cart already empty",
      data: {
        items: [],
        totalQuantity: 0,
        subtotal: 0,
        totalGST: 0,
        grandTotal: 0,
      },
    });
  }

  // RESPONSE
  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    data: updated,
  });
});
