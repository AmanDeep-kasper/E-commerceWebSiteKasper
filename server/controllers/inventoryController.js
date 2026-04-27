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
    filterBy = "all", // all | low_stock | out_of_stock
  } = req.query;

  const skip = Number(page - 1) * Number(limit);

  // 🔍 SEARCH REGEX (safe)
  const searchRegex = new RegExp(search, "i");

  // 🧠 BASE MATCH
  const matchStage = {
    isActive: true,
  };

  if (category) {
    matchStage.category = new mongoose.Types.ObjectId(category);
  }

  // 🚀 AGGREGATION PIPELINE
  const pipeline = [
    { $match: matchStage },

    // 🔥 UNWIND VARIANTS (IMPORTANT)
    { $unwind: "$variants" },

    // 🔍 SEARCH (title + SKU)
    ...(search
      ? [
          {
            $match: {
              $or: [
                { productTittle: searchRegex },
                { "variants.variantSkuId": searchRegex },
              ],
            },
          },
        ]
      : []),

    // 🎯 STOCK FILTER
    ...(filterBy === "out_of_stock"
      ? [
          {
            $match: {
              "variants.variantAvailableStock": 0,
            },
          },
        ]
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

    // 📦 PROJECT REQUIRED FIELDS ONLY (FAST)
    {
      $project: {
        sku: "$variants.variantSkuId",
        productName: "$productTittle",
        category: "$category",
        
        image: { $arrayElemAt: ["$variants.variantImage.url", 0] },
        sellingPrice: "$variants.variantSellingPrice",
        stock: "$variants.variantAvailableStock",
        lowStock: "$variants.variantLowStockAlertStock",
        createdAt: 1,
      },
    },

    // 🔃 SORT
    {
      $sort:
        sortBy === "price_low"
          ? { sellingPrice: 1 }
          : sortBy === "price_high"
            ? { sellingPrice: -1 }
            : { createdAt: -1 }, // latest
    },

    // 📄 PAGINATION
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
  const product = await Product.findById(productId);

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  const variant = product.variants.id(variantId);
  if (!variant) {
    throw AppError.notFound("Variant not found", "NOT_FOUND");
  }

  // check stock type - inStock or outStock
  if (stockType === "inStock") {
    variant.variantAvailableStock += quantity;
  } else if (stockType === "outStock") {
    variant.variantAvailableStock -= quantity;
  }

  res.status(200).json({
    success: true,
    message: "Stock adjusted successfully",
  });
});
