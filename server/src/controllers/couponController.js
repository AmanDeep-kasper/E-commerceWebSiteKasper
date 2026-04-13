import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Cart from "../models/Cart.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// Helper functions
const generateCouponCode = (prefix = "", length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = prefix.toUpperCase();
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Admin controller
export const addCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    maxDiscountAmount,
    minOrderAmount,
    usageLimitTotal,
    usageLimitPerUser,
    applicableCategories,
    applicableProducts,
    startsAt,
    expiresAt,
  } = req.body;

  let couponCode = code;

  if (!couponCode) {
    // Generate unique code
    let isUnique = false;
    let attempts = 0;
    const prefix = discountType === "flat" ? "FLAT" : "PCT";

    while (!isUnique && attempts < 10) {
      couponCode = generateCouponCode(prefix);
      const existing = await Coupon.findOne({ code: couponCode });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw AppError.badRequest(
        "Failed to generate unique coupon code",
        "FAILED_GENERATE_COUPON_CODE",
      );
    }
  } else {
    // Check if provided code already exists
    const existing = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (existing) {
      throw AppError.conflict("Coupon code already exists", "COUPON_EXISTS");
    }
    couponCode = couponCode.toUpperCase();
  }

  // Validate category and product IDs if provided
  if (applicableCategories?.length) {
    const validCategories = await Category.countDocuments({
      _id: { $in: applicableCategories },
      isActive: true,
    });
    if (validCategories !== applicableCategories.length) {
      throw AppError.badRequest(
        "One or more categories are invalid or inactive",
        "INVALID_CATEGORIES",
      );
    }
  }

  if (applicableProducts?.length) {
    const validProducts = await Product.countDocuments({
      _id: { $in: applicableProducts },
      isActive: true,
    });
    if (validProducts !== applicableProducts.length) {
      throw AppError.badRequest(
        "One or more products are invalid or inactive",
        "INVALID_PRODUCTS",
      );
    }
  }

  //   Create coupon
  const coupon = await Coupon.create({
    code: couponCode,
    description,
    discountType,
    discountValue,
    maxDiscountAmount:
      discountType === "percent" ? maxDiscountAmount : undefined,
    minOrderAmount: minOrderAmount || 0,
    usageLimitTotal,
    usageLimitPerUser: usageLimitPerUser || 1,
    applicableCategories: applicableCategories || [],
    applicableProducts: applicableProducts || [],
    startsAt: startsAt || new Date(),
    expiresAt,
    isActive: isActive !== undefined ? isActive : true,
  });

  // Populate references for response
  const populatedCoupon = await Coupon.findById(coupon._id)
    .populate("applicableCategories", "name slug")
    .populate("applicableProducts", "productTittle slug")
    .lean();

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: populatedCoupon,
  });
});

export const getCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId)
    .populate("applicableCategories", "name slug isActive")
    .populate("applicableProducts", "productTittle slug isActive")
    .populate("usedBy.user", "name email")
    .populate("usedBy.orderId", "orderId totalAmount status")
    .lean();

  if (!coupon) {
    throw AppError.notFound("Coupon not found", "NOT_FOUND");
  }

  // Add analytics
  const now = new Date();
  const analytics = {
    status:
      coupon.expiresAt && coupon.expiresAt < now
        ? "expired"
        : coupon.startsAt > now
          ? "upcoming"
          : "active",
    usageRate: coupon.usageLimitTotal
      ? ((coupon.totalUsed / coupon.usageLimitTotal) * 100).toFixed(2) + "%"
      : "Unlimited",
    uniqueUsers: new Set(coupon.usedBy.map((u) => u.user?._id?.toString()))
      .size,
    averageDiscount:
      coupon.usedBy.length > 0
        ? coupon.usedBy.reduce((sum, u) => sum + (u.discountAmount || 0), 0) /
          coupon.usedBy.length
        : 0,
    totalSavingsGiven: coupon.usedBy.reduce(
      (sum, u) => sum + (u.discountAmount || 0),
      0,
    ),
    recentUsage: coupon.usedBy.sort((a, b) => b.usedAt - a.usedAt).slice(0, 5),
  };

  res.status(200).json({
    success: true,
    message: "Coupon fetched successfully",
    data: {
      ...coupon,
      analytics,
    },
  });
});

export const getAllCoupons = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    isActive,
    sort = "-createdAt",
    discountType,
  } = req.query;

  const query = {};

  // Filters
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  if (discountType) {
    query.discountType = discountType;
  }

  if (search) {
    query.code = { $regex: search, $options: "i" };
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute query with pagination
  const [coupons, total] = await Promise.all([
    Coupon.find(query)
      .populate("applicableCategories", "name slug")
      .populate("applicableProducts", "productTittle slug")
      .populate("usedBy.user", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Coupon.countDocuments(query),
  ]);

  // Add computed fields
  const enrichedCoupons = coupons.map((coupon) => {
    const now = new Date();
    const isExpired = coupon.expiresAt && coupon.expiresAt < now;
    const isNotStarted = coupon.startsAt > now;
    const usagePercentage = coupon.usageLimitTotal
      ? ((coupon.totalUsed / coupon.usageLimitTotal) * 100).toFixed(2)
      : null;

    return {
      ...coupon,
      status: isExpired ? "expired" : isNotStarted ? "upcoming" : "active",
      usagePercentage,
      uniqueUsers: new Set(coupon.usedBy.map((u) => u.user?._id?.toString()))
        .size,
    };
  });

  res.status(200).json({
    success: true,
    message: "Coupons fetched successfully",
    coupons: enrichedCoupons,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;
  const updates = req.body;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw AppError.notFound("Coupon not found", "NOT_FOUND");
  }

  // Prevent updating critical fields if coupon has been used
  const restrictedFields = ["code", "discountType"];
  if (coupon.totalUsed > 0) {
    restrictedFields.forEach((field) => {
      if (updates[field] && updates[field] !== coupon[field]) {
        throw AppError.badRequest("Coupon has been used", "COUPON_USED");
      }
    });
  }

  // Validate references if updated
  if (updates.applicableCategories?.length) {
    const validCategories = await Category.countDocuments({
      _id: { $in: updates.applicableCategories },
      isActive: true,
    });
    if (validCategories !== updates.applicableCategories.length) {
      throw AppError.badRequest(
        "One or more categories are invalid or inactive",
        "INVALID_CATEGORIES",
      );
    }
  }

  if (updates.applicableProducts?.length) {
    const validProducts = await Product.countDocuments({
      _id: { $in: updates.applicableProducts },
      isActive: true,
    });
    if (validProducts !== updates.applicableProducts.length) {
      throw AppError.badRequest(
        "One or more products are invalid or inactive",
        "INVALID_PRODUCTS",
      );
    }
  }

  // Apply updates
  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) {
      coupon[key] = updates[key];
    }
  });

  // Ensure percent coupons don't have maxDiscountAmount removed
  if (coupon.discountType === "flat") {
    coupon.maxDiscountAmount = undefined;
  }

  await coupon.save();

  const updatedCoupon = await Coupon.findById(id)
    .populate("applicableCategories", "name slug")
    .populate("applicableProducts", "productTittle slug")
    .lean();

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    data: updatedCoupon,
  });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw AppError.notFound("Coupon not found", "NOT_FOUND");
  }

  coupon.isActive = false;
  await coupon.save();

  res.status(200).json({
    success: true,
    message: "Coupon deactivated successfully",
    data: coupon,
  });
});

export const hardDeleteCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw AppError.notFound("Coupon not found", "NOT_FOUND");
  }

  // Prevent deletion if coupon has been used
  if (coupon.totalUsed > 0) {
    throw AppError.badRequest("Coupon has been used", "COUPON_USED");
  }

  await coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: "Coupon permanently deleted successfully",
  });
});

export const toggleCouponStatus = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw AppError.notFound("Coupon not found", "NOT_FOUND");
  }

  coupon.isActive = !coupon.isActive;
  await coupon.save();

  res.status(200).json({
    success: true,
    message: `Coupon ${coupon.isActive ? "activated" : "deactivated"} successfully`,
  });
});

export const getCouponAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate) {
    dateFilter.createdAt = { $gte: new Date(startDate) };
  }
  if (endDate) {
    dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(endDate) };
  }

  const now = new Date();

  const analytics = await Coupon.aggregate([
    { $match: dateFilter },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalCoupons: { $sum: 1 },
              activeCoupons: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$isActive", true] },
                        {
                          $or: [
                            { $gt: ["$expiresAt", now] },
                            { $eq: ["$expiresAt", null] },
                          ],
                        },
                        { $lte: ["$startsAt", now] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              expiredCoupons: {
                $sum: {
                  $cond: [{ $lt: ["$expiresAt", now] }, 1, 0],
                },
              },
              totalUsed: { $sum: "$totalUsed" },
              avgDiscountValue: { $avg: "$discountValue" },
            },
          },
        ],
        byType: [
          {
            $group: {
              _id: "$discountType",
              count: { $sum: 1 },
              totalUsed: { $sum: "$totalUsed" },
              avgDiscountValue: { $avg: "$discountValue" },
            },
          },
        ],
        topPerforming: [
          { $sort: { totalUsed: -1 } },
          { $limit: 10 },
          {
            $project: {
              code: 1,
              totalUsed: 1,
              discountType: 1,
              discountValue: 1,
              isActive: 1,
            },
          },
        ],
        expiringSoon: [
          {
            $match: {
              isActive: true,
              expiresAt: {
                $gt: now,
                $lt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
              },
            },
          },
          {
            $project: {
              code: 1,
              expiresAt: 1,
              daysRemaining: {
                $ceil: {
                  $divide: [
                    { $subtract: ["$expiresAt", now] },
                    1000 * 60 * 60 * 24,
                  ],
                },
              },
            },
          },
          { $sort: { daysRemaining: 1 } },
        ],
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Coupon analytics fetched successfully",
    data: analytics[0],
  });
});
