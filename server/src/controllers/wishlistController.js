import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Helper function
const validateProductAndVariant = async (productId, variantId = null) => {
  const product = await Product.findById(productId)
    .select("_id productTittle category variants isActive")
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

  let variantData = null;
  if (variantId) {
    variantData = product.variants.find((v) => v._id.toString() === variantId);
    if (!variantData) {
      throw AppError.notFound("Product variant not found", "NOT_FOUND");
    }
  } else {
    variantData =
      product.variants.find((variant) => variant.isSelected) ||
      product.variants[0];
  }

  return {
    product,
    variantData,
  };
};

// user controllers
export const addProductToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { productId, variantId } = req.body;

  // Validate product and variant existence
  const { product, variantData } = await validateProductAndVariant(
    productId,
    variantId,
  );

  // Find or create wishlist
  let wishlist = await Wishlist.findOne({ user: userId, isActive: true });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      items: [],
      isActive: true,
    });
  }

  // Check if item already exists
  const existingItemIndex = wishlist.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      (variantId ? item.variantId?.toString() === variantId : !item.variantId),
  );

  if (existingItemIndex !== -1) {
    throw AppError.conflict("Product already exists in wishlist", "CONFLICT");
  }

  // Check wishlist limit (optional - prevent abuse)
  const MAX_WISHLIST_ITEMS = 50;
  if (wishlist.items.length >= MAX_WISHLIST_ITEMS) {
    throw AppError.badRequest(
      `Wishlist cannot exceed ${MAX_WISHLIST_ITEMS} items`,
      "WISHLIST_LIMIT_EXCEEDED",
    );
  }

  // Prepare wishlist item data
  const wishlistItem = {
    product: product._id,
    category: product.category,
    productTitle: product.productTittle,
    ...(variantData && {
      variantId: variantData._id,
      variantName: variantData.variantName,
      imageUrl: variantData.variantImage?.[0]?.url,
    }),
  };

  // Add item to wishlist
  wishlist.items.push(wishlistItem);
  await wishlist.save();

  // Get populated wishlist for response
  const populatedWishlist = await Wishlist.findById(wishlist._id)
    .populate({
      path: "items.product",
      select: "_id productTittle slug category stats",
    })
    .lean();

  const addedItem = populatedWishlist.items[populatedWishlist.items.length - 1];

  res.status(200).json({
    success: true,
    message: "Product added to wishlist successfully",
    data: {
      item: addedItem,
      wishlist: populatedWishlist,
    },
  });
});

export const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId, variantId } = req.body;

  const updated = await Wishlist.findOneAndUpdate(
    { user: userId, isActive: true },
    {
      $pull: {
        items: {
          product: productId,
          ...(variantId && { variantId }),
        },
      },
    },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: "Removed from wishlist",
    data: updated,
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { itemId } = req.body;

  const wishlist = await Wishlist.findOne({ user: userId, isActive: true });

  if (!wishlist) {
    throw AppError.notFound("Wishlist not found", "NOT_FOUND");
  }

  const initialLength = wishlist.items.length;

  wishlist.items = wishlist.items.filter(
    (item) => item._id.toString() !== itemId,
  );

  if (wishlist.items.length === initialLength) {
    throw AppError.notFound("Item not found in wishlist", "NOT_FOUND");
  }

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Item removed from wishlist",
    data: wishlist,
  });
});

export const clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  await Wishlist.findOneAndUpdate(
    { user: userId, isActive: true },
    { $set: { items: [] } },
  );

  res.status(200).json({
    success: true,
    message: "Wishlist cleared successfully",
  });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const wishlist = await Wishlist.findOne({ user: userId, isActive: true })
    .populate({
      path: "items.product",
      select: "_id productTittle slug category stats",
      populate: {
        path: "category",
        select: "_id name slug",
      },
    })
    .lean();

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

  res.status(200).json({
    success: true,
    message: "Wishlist retrieved successfully",
    data: wishlist,
  });
});
