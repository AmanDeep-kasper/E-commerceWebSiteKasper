import mongoose from "mongoose";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getInventory = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "latest",
    category,
    filterBy = "all", // all | low_stock | out_of_stock | in_stock
  } = req.query;

  const skip = Number(page - 1) * Number(limit);
  const searchRegex = new RegExp(search, "i");

  const matchStage = {
    isActive: true,
  };

  const pipeline = [
    { $match: matchStage },

    // UNWIND VARIANTS
    { $unwind: "$variants" },

    // STOCK FILTER
    ...(filterBy === "out_of_stock"
      ? [{ $match: { "variants.variantAvailableStock": 0 } }]
      : filterBy === "low_stock"
        ? [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gt: ["$variants.variantAvailableStock", 0] },
                    {
                      $lte: [
                        "$variants.variantAvailableStock",
                        "$variants.variantLowStockAlertStock",
                      ],
                    },
                  ],
                },
              },
            },
          ]
        : []),

    // CATEGORY LOOKUP (FIX)
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryData",
      },
    },
    {
      $unwind: {
        path: "$categoryData",
        preserveNullAndEmptyArrays: true,
      },
    },

    // CATEGORY FILTER
    ...(category
      ? [
          {
            $match: {
              "categoryData.name": new RegExp(category, "i"), // ✅ filter by name
            },
          },
        ]
      : []),

    // 🔍 SEARCH
    ...(search
      ? [
          {
            $match: {
              $or: [
                { productTittle: searchRegex },
                { "variants.variantSkuId": searchRegex },
                { "categoryData.name": searchRegex },
              ],
            },
          },
        ]
      : []),

    // PROJECT
    {
      $project: {
        sku: "$variants.variantSkuId",
        productName: "$productTittle",

        productId: "$_id",
        variantId: "$variants._id",

        categoryId: "$category",
        categoryName: "$categoryData.name",

        weight: "$variants.variantWeight",
        weightUnit: "$variants.variantWeightUnit",
        varintStyle: "$variants.variantName",
        color: "$variants.variantColor",
        image: { $arrayElemAt: ["$variants.variantImage.url", 0] },
        sellingPrice: "$variants.variantSellingPrice",
        stock: "$variants.variantAvailableStock",
        lowStock: "$variants.variantLowStockAlertStock",
        status: {
          $switch: {
            branches: [
              {
                case: { $lte: ["$variants.variantAvailableStock", 0] },
                then: "out_of_stock",
              },
              {
                case: {
                  $and: [
                    { $gt: ["$variants.variantAvailableStock", 0] },
                    {
                      $lte: [
                        "$variants.variantAvailableStock",
                        "$variants.variantLowStockAlertStock",
                      ],
                    },
                  ],
                },
                then: "low_stock",
              },
            ],
            default: "in_stock",
          },
        },
        createdAt: 1,
      },
    },

    // SORT
    {
      $sort:
        sortBy === "price_low"
          ? { sellingPrice: 1 }
          : sortBy === "price_high"
            ? { sellingPrice: -1 }
            : { createdAt: -1 },
    },

    // PAGINATION
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: Number(limit) }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Product.aggregate(pipeline);

  const data = result[0]?.data || [];
  const total = result[0]?.totalCount[0]?.count || 0;

  res.status(200).json({
    success: true,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / limit),
    data,
  });
});

export const adjustStock = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity, stockType } = req.body;

  const qty = Number(quantity);

  if (!qty || qty <= 0) {
    throw AppError.badRequest("Invalid quantity", "INVALID_QUANTITY");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    throw AppError.notFound("Variant not found", "NOT_FOUND");
  }

  // STOCK LOGIC
  if (stockType === "inStock") {
    variant.variantAvailableStock += qty;
  } else if (stockType === "outStock") {
    if (variant.variantAvailableStock < qty) {
      throw AppError.badRequest("Insufficient stock", "STOCK_LOW");
    }
    variant.variantAvailableStock -= qty;
  } else {
    throw AppError.badRequest("Invalid stock type", "INVALID_TYPE");
  }

  await product.save(); // ✅ MUST

  res.status(200).json({
    success: true,
    message: "Stock adjusted successfully",
    stock: variant.variantAvailableStock,
  });
});
