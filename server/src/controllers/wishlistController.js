import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/Cart.js";

// HELPER (OPTIMIZED)
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

  let variantData;

  if (variantId) {
    variantData = product.variants.find((v) => v._id.toString() === variantId);
  } else {
    variantData =
      product.variants.find((v) => v.isSelected) || product.variants[0];
  }

  if (!variantData) {
    throw AppError.notFound("Variant not found", "NOT_FOUND");
  }

  return { product, variantData };
};

// ADD TO WISHLIST
export const addProductToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId, variantId } = req.body;

  // 1. Validate
  const { product, variantData } = await validateProductAndVariant(
    productId,
    variantId,
  );

  // 2. Find wishlist (lean + projection for speed)
  let wishlist = await Wishlist.findOne({ user: userId })
    .select("_id items")
    .lean();

  // 3. Duplicate check (FAST)
  if (wishlist) {
    const exists = wishlist.items.some(
      (item) =>
        item.product.toString() === productId &&
        item.variantId.toString() === variantData._id.toString(),
    );

    if (exists) {
      throw AppError.conflict("Already in wishlist", "ALREADY_EXISTS");
    }

    // Limit check
    if (wishlist.items.length >= 50) {
      throw AppError.badRequest("Wishlist limit reached", "LIMIT_EXCEEDED");
    }
  }

  // 🔥 PREPARE SNAPSHOT
  const newItem = {
    product: product._id,
    category: product.category,

    variantId: variantData._id,
    variantSkuId: variantData.variantSkuId,

    productTitle: product.productTittle,
    variantName: variantData.variantName,
    variantColor: variantData.variantColor,

    variantAttributes: {
      weight: `${variantData.variantWeight}${variantData.variantWeightUnit}`,
      mrp: variantData.variantMrp,
      sellingPrice: variantData.variantSellingPrice,
      discount: variantData.variantDiscount,
    },

    image: {
      url: variantData.variantImage?.[0]?.url || "",
      altText: variantData.variantName || "",
    },
  };

  // ATOMIC UPSERT (FASTEST)
  const updatedWishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    {
      $push: { items: newItem },
      $setOnInsert: { user: userId },
    },
    {
      new: true,
      upsert: true,
      projection: { items: 1 },
    },
  ).lean();

  // RESPONSE (LIGHTWEIGHT)
  res.status(200).json({
    success: true,
    message: "Added to wishlist",
    data: updatedWishlist,
  });
});

export const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId, variantId } = req.body;

  const updated = await Wishlist.findOneAndUpdate(
    { user: userId },
    {
      $pull: {
        items: {
          product: productId,
          variantId: variantId,
        },
      },
    },
    {
      new: true,
      projection: { items: 1 },
    },
  ).lean();

  if (!updated) {
    throw AppError.notFound("Wishlist not found");
  }

  res.status(200).json({
    success: true,
    message: "Removed from wishlist",
    data: {
      items: updated.items,
    },
  });
});

export const clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const updated = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $set: { items: [] } },
    {
      new: true,
      projection: { items: 1 },
    },
  ).lean();

  // Optional: if wishlist doesn't exist
  if (!updated) {
    return res.status(200).json({
      success: true,
      message: "Wishlist already empty",
      data: { items: [] },
    });
  }

  res.status(200).json({
    success: true,
    message: "Wishlist cleared successfully",
    data: {
      items: updated.items,
    },
  });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const wishlist = await Wishlist.findOne(
    { user: userId },
    {
      items: 1,
      user: 1,
      isActive: 1,
      updatedAt: 1,
    },
  ).lean();

  // If not exists → lightweight response
  if (!wishlist) {
    return res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      data: {
        user: userId,
        items: [],
        isActive: true,
      },
    });
  }

  // Optional: sort latest first (UX improvement)
  wishlist.items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

  res.status(200).json({
    success: true,
    message: "Wishlist retrieved successfully",
    data: wishlist,
  });
});

export const moveToCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { itemId } = req.body;

  // GET WISHLIST ITEM (LIGHTWEIGHT)
  const wishlist = await Wishlist.findOne(
    { user: userId },
    { items: 1 },
  ).lean();

  if (!wishlist) {
    throw AppError.notFound("Wishlist not found", "NOT_FOUND");
  }

  const item = wishlist.items.find((i) => i._id.toString() === itemId);

  if (!item) {
    throw AppError.notFound("Item not found in wishlist", "NOT_FOUND");
  }

  // VALIDATE PRODUCT + VARIANT
  const product = await Product.findById(item.product)
    .select("variants isActive")
    .lean();

  if (!product || !product.isActive) {
    throw AppError.badRequest("Product unavailable", "UNAVAILABLE");
  }

  const variant = product.variants.find(
    (v) => v._id.toString() === item.variantId.toString(),
  );

  if (!variant) {
    throw AppError.badRequest("Variant not found", "NOT_FOUND");
  }

  if (variant.variantAvailableStock < 1) {
    throw AppError.badRequest("Out of stock", "OUT_OF_STOCK");
  }

  // PREPARE CART SNAPSHOT
  const newItem = {
    product: item.product,
    variantId: item.variantId,
    variantSkuId: variant.variantSkuId,

    category: item.category,

    productTitle: item.productTitle,
    variantName: item.variantName,
    variantColor: item.variantColor,

    variantAttributes: item.variantAttributes || {},

    image: item.image || {},

    mrp: variant.variantMrp,
    sellingPrice: variant.variantSellingPrice,
    gst: variant.variantGST,
    discount: variant.variantDiscount,

    quantity: 1,
  };

  // TRY UPDATE EXISTING CART ITEM
  let cart = await Cart.findOneAndUpdate(
    {
      userId,
      status: "active",
      "items.product": item.product,
      "items.variantId": item.variantId,
    },
    {
      $inc: { "items.$.quantity": 1 },
    },
    { new: true },
  );

  // IF NOT EXISTS → ADD NEW
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

  // REMOVE FROM WISHLIST (ATOMIC)
  await Wishlist.updateOne(
    { user: userId },
    { $pull: { items: { _id: itemId } } },
  );

  // REFETCH + RECALCULATE
  cart = await Cart.findById(cart._id);

  cart.recalculate();
  await cart.save();

  // RESPONSE
  res.status(200).json({
    success: true,
    message: "Item moved to cart",
    data: {
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      subtotal: cart.subtotal,
      totalGST: cart.totalGST,
      grandTotal: cart.grandTotal,
    },
  });
});

export const moveToCartAll = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // 1. GET WISHLIST
  const wishlist = await Wishlist.findOne(
    { user: userId },
    { items: 1 },
  ).lean();

  if (!wishlist || wishlist.items.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Wishlist is empty",
      data: { items: [] },
    });
  }

  const wishlistItems = wishlist.items;

  // 2. GET CART (LIGHT)
  let cart = await Cart.findOne({ userId, status: "active" }, { items: 1 });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  // 3. CREATE MAP FOR FAST LOOKUP
  const cartMap = new Map();

  cart.items.forEach((item, index) => {
    const key = `${item.product.toString()}_${item.variantId.toString()}`;
    cartMap.set(key, index);
  });

  // 4. FETCH PRODUCTS (ONE QUERY)
  const productIds = wishlistItems.map((i) => i.product);

  const products = await Product.find(
    { _id: { $in: productIds }, isActive: true },
    { _id: 1, variants: 1 },
  ).lean();

  const productMap = new Map();
  products.forEach((p) => productMap.set(p._id.toString(), p));

  // 5. PROCESS ITEMS
  for (const item of wishlistItems) {
    const product = productMap.get(item.product.toString());
    if (!product) continue;

    const variant = product.variants.find(
      (v) => v._id.toString() === item.variantId.toString(),
    );

    if (!variant) continue;
    if (variant.variantAvailableStock < 1) continue;

    const key = `${item.product}_${item.variantId}`;

    // ✅ EXISTING → INCREMENT
    if (cartMap.has(key)) {
      const index = cartMap.get(key);
      cart.items[index].quantity += 1;
    } else {
      // ✅ NEW ITEM → PUSH
      cart.items.push({
        product: item.product,
        variantId: item.variantId,
        variantSkuId: variant.variantSkuId,

        category: item.category,

        productTitle: item.productTitle,
        variantName: item.variantName,
        variantColor: item.variantColor,

        variantAttributes: item.variantAttributes || {},

        image: item.image || {},

        mrp: variant.variantMrp,
        sellingPrice: variant.variantSellingPrice,
        gst: variant.variantGST,
        discount: variant.variantDiscount,

        quantity: 1,
      });
    }
  }

  // 6. CLEAR WISHLIST
  await Wishlist.updateOne({ user: userId }, { $set: { items: [] } });

  // 7. RECALCULATE ONCE
  cart.recalculate();
  await cart.save();

  // 8. RESPONSE
  res.status(200).json({
    success: true,
    message: "All items moved to cart",
    data: {
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      subtotal: cart.subtotal,
      totalGST: cart.totalGST,
      grandTotal: cart.grandTotal,
    },
  });
});
