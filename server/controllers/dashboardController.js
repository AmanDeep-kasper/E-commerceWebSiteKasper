import Product from "../models/Product.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// Helper function to get relative time (e.g., "2 hours ago")
const getRelativeTime = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
};

export const kpiCardController = asyncHandler(async (req, res) => {
  const now = new Date();

  // Start = 7 days ago from now
  const startOfLast7Days = new Date(now);
  startOfLast7Days.setDate(now.getDate() - 6); // include today

  startOfLast7Days.setHours(0, 0, 0, 0);

  // End = now
  const endOfLast7Days = new Date(now);

  const [
    revenueAgg,
    weeklyRevenueAgg,
    lastWeekRevenueAgg,

    totalOrders,
    weeklyOrders,
    lastWeekOrders,

    totalProducts,
    totalCustomers,
  ] = await Promise.all([
    // overall revenue
    Payment.aggregate([
      { $match: { status: "captured" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),

    // this week revenue
    Payment.aggregate([
      {
        $match: {
          status: "captured",
          createdAt: { $gte: startOfLast7Days },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),

    // last week revenue
    Payment.aggregate([
      {
        $match: {
          status: "captured",
          createdAt: {
            $gte: startOfLast7Days,
            $lte: endOfLast7Days,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),

    // total orders
    Order.countDocuments(),

    // weekly orders
    Order.countDocuments({
      createdAt: { $gte: startOfLast7Days },
    }),

    // last week orders
    Order.countDocuments({
      createdAt: {
        $gte: startOfLast7Days,
        $lte: endOfLast7Days,
      },
    }),

    // products
    Product.countDocuments({
      isActive: true,
      isDraft: false,
    }),

    // customers
    User.countDocuments({
      role: "user",
      isActive: true,
    }),
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;
  const weeklyRevenue = weeklyRevenueAgg[0]?.total || 0;
  const lastWeekRevenue = lastWeekRevenueAgg[0]?.total || 0;

  const revenueGrowth =
    lastWeekRevenue > 0
      ? (((weeklyRevenue - lastWeekRevenue) / lastWeekRevenue) * 100).toFixed(2)
      : weeklyRevenue > 0
        ? 100
        : 0;

  const orderGrowth =
    lastWeekOrders > 0
      ? (((weeklyOrders - lastWeekOrders) / lastWeekOrders) * 100).toFixed(2)
      : weeklyOrders > 0
        ? 100
        : 0;

  res.status(200).json({
    success: true,
    message: "KPI fetched successfully",
    data: {
      revenue: {
        overall: totalRevenue,
        weekly: weeklyRevenue,
        growth: Number(revenueGrowth),
      },

      orders: {
        overall: totalOrders,
        weekly: weeklyOrders,
        growth: Number(orderGrowth),
      },

      products: {
        overall: totalProducts,
      },

      customers: {
        overall: totalCustomers,
      },
    },
  });
});

export const salesOverviewController = asyncHandler(async (req, res) => {
  const {
    type = "orders", // orders | revenue
    range = "weekly", // weekly | monthly | yearly
  } = req.query;

  if (!["orders", "revenue"].includes(type)) {
    throw AppError.badRequest("Invalid type", "INVALID_TYPE");
  }

  if (!["weekly", "monthly", "yearly"].includes(range)) {
    throw AppError.badRequest("Invalid range", "INVALID_RANGE");
  }

  const Model = type === "orders" ? Order : Payment;

  const match =
    type === "orders"
      ? {}
      : {
          status: "captured",
        };

  let groupStage;
  let labels = [];
  let totalLabel = "";

  // WEEKLY → Mon Tue Wed...
  if (range === "weekly") {
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    totalLabel = type === "orders" ? "Total Order" : "Total Revenue";

    groupStage = {
      _id: {
        $isoDayOfWeek: "$createdAt",
      },
      value: type === "orders" ? { $sum: 1 } : { $sum: "$amount" },
    };
  }

  // MONTHLY → 1 5 10 15 20 25 30
  if (range === "monthly") {
    labels = ["1", "5", "10", "15", "20", "25", "30"];
    totalLabel = type === "orders" ? "Total Order" : "Total Revenue";

    groupStage = {
      _id: {
        $switch: {
          branches: [
            { case: { $lte: [{ $dayOfMonth: "$createdAt" }, 5] }, then: 1 },
            { case: { $lte: [{ $dayOfMonth: "$createdAt" }, 10] }, then: 5 },
            { case: { $lte: [{ $dayOfMonth: "$createdAt" }, 15] }, then: 10 },
            { case: { $lte: [{ $dayOfMonth: "$createdAt" }, 20] }, then: 15 },
            { case: { $lte: [{ $dayOfMonth: "$createdAt" }, 25] }, then: 20 },
            { case: { $lte: [{ $dayOfMonth: "$createdAt" }, 30] }, then: 25 },
          ],
          default: 30,
        },
      },
      value: type === "orders" ? { $sum: 1 } : { $sum: "$amount" },
    };
  }

  // YEARLY → Jan Dec
  if (range === "yearly") {
    labels = [
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

    totalLabel = type === "orders" ? "Total Order" : "Total Revenue";

    groupStage = {
      _id: {
        $month: "$createdAt",
      },
      value: type === "orders" ? { $sum: 1 } : { $sum: "$amount" },
    };
  }

  const [chartAgg, totalAgg] = await Promise.all([
    Model.aggregate([
      { $match: match },
      {
        $group: groupStage,
      },
      {
        $sort: { _id: 1 },
      },
    ]),

    Model.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: type === "orders" ? { $sum: 1 } : { $sum: "$amount" },
        },
      },
    ]),
  ]);

  // fast lookup map
  const chartMap = new Map();
  chartAgg.forEach((item) => {
    chartMap.set(item._id, item.value);
  });

  // frontend-ready chart
  const chartData = labels.map((label, index) => {
    let key;

    if (range === "weekly") key = index + 1;
    if (range === "monthly") key = [1, 5, 10, 15, 20, 25, 30][index];
    if (range === "yearly") key = index + 1;

    return {
      label,
      value: chartMap.get(key) || 0,
    };
  });

  res.status(200).json({
    success: true,
    message: "Sales overview fetched successfully",
    data: {
      type,
      range,
      total: totalAgg[0]?.total || 0,
      totalLabel,
      chart: chartData,
    },
  });
});

export const dashboardSummaryController = asyncHandler(async (req, res) => {
  const now = new Date();

  const startOfLast7Days = new Date(now);
  startOfLast7Days.setDate(now.getDate() - 6);
  startOfLast7Days.setHours(0, 0, 0, 0);

  // const endOfToday = new Date(now);
  // endOfToday.setHours(23, 59, 59, 999);

  const [
    // TOP CATEGORIES
    topCategoriesAgg,

    // ORDER OVERVIEW
    orderOverviewAgg,

    // INVENTORY OVERVIEW
    inventoryAgg,
  ] = await Promise.all([
    // =========================
    // TOP CATEGORIES
    // =========================
    Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "categories",
          localField: "items.category",
          foreignField: "_id",
          as: "category",
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$category.name",
          sales: {
            $sum: "$grandTotal",
          },
        },
      },
      {
        $sort: {
          sales: -1,
        },
      },
      {
        $limit: 3,
      },
    ]),

    // =========================
    // ORDER OVERVIEW
    // =========================
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfLast7Days,
          },
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]),

    // =========================
    // INVENTORY OVERVIEW
    // =========================
    Product.aggregate([
      {
        $match: {
          isActive: true,
          isDraft: false,
        },
      },
      {
        $unwind: "$variants",
      },
      {
        $group: {
          _id: null,

          totalStock: {
            $sum: "$variants.variantAvailableStock",
          },

          inStock: {
            $sum: {
              $cond: [
                {
                  $gt: [
                    "$variants.variantAvailableStock",
                    "$variants.variantLowStockAlertStock",
                  ],
                },
                "$variants.variantAvailableStock",
                0,
              ],
            },
          },

          lowStock: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gt: ["$variants.variantAvailableStock", 0],
                    },
                    {
                      $lte: [
                        "$variants.variantAvailableStock",
                        "$variants.variantLowStockAlertStock",
                      ],
                    },
                  ],
                },
                "$variants.variantAvailableStock",
                0,
              ],
            },
          },

          outOfStock: {
            $sum: {
              $cond: [
                {
                  $eq: ["$variants.variantAvailableStock", 0],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
  ]);

  // =========================
  // FORMAT TOP CATEGORIES
  // =========================
  const totalCategorySales = topCategoriesAgg.reduce(
    (acc, item) => acc + item.sales,
    0,
  );

  const topCategories = {
    totalSales: totalCategorySales,
    categories: topCategoriesAgg.map((item) => ({
      name: item._id,
      sales: item.sales,
      percentage:
        totalCategorySales > 0
          ? Number(((item.sales / totalCategorySales) * 100).toFixed(2))
          : 0,
    })),
  };

  // =========================
  // FORMAT ORDER OVERVIEW
  // =========================
  const orderMap = {
    placed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
  };

  orderOverviewAgg.forEach((item) => {
    if (orderMap[item._id] !== undefined) {
      orderMap[item._id] = item.count;
    }
  });

  const totalOrders =
    orderMap.placed +
    orderMap.processing +
    orderMap.shipped +
    orderMap.delivered;

  const ordersOverview = {
    totalOrders,
    thisWeek: {
      newOrder: orderMap.placed,
      processing: orderMap.processing,
      shipped: orderMap.shipped,
      delivered: orderMap.delivered,
    },
    percentages: {
      newOrder: totalOrders
        ? Number(((orderMap.placed / totalOrders) * 100).toFixed(0))
        : 0,

      processing: totalOrders
        ? Number(((orderMap.processing / totalOrders) * 100).toFixed(0))
        : 0,

      shipped: totalOrders
        ? Number(((orderMap.shipped / totalOrders) * 100).toFixed(0))
        : 0,

      delivered: totalOrders
        ? Number(((orderMap.delivered / totalOrders) * 100).toFixed(0))
        : 0,
    },
  };

  // =========================
  // FORMAT INVENTORY
  // =========================
  const stock = inventoryAgg[0] || {
    totalStock: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  };

  const inventoryOverview = {
    totalStock: stock.totalStock,
    inStock: stock.inStock,
    lowStock: stock.lowStock,
    outOfStock: stock.outOfStock,
  };

  // =========================
  // RESPONSE
  // =========================
  res.status(200).json({
    success: true,
    message: "Dashboard summary fetched successfully",
    data: {
      topCategories,
      ordersOverview,
      inventoryOverview,
    },
  });
});

export const topSellingProducts = asyncHandler(async (req, res) => {
  const {
    range = "weekly", // weekly | monthly | yearly
    page = 1,
    limit = 5,
  } = req.query;

  if (!["weekly", "monthly", "yearly"].includes(range)) {
    throw AppError.badRequest("Invalid range", "INVALID_RANGE");
  }

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.max(Number(limit), 1);
  const skip = (pageNumber - 1) * pageSize;

  // date filter
  const now = new Date();
  let startDate = new Date();

  if (range === "weekly") {
    startDate.setDate(now.getDate() - 7);
  }

  if (range === "monthly") {
    startDate.setMonth(now.getMonth() - 1);
  }

  if (range === "yearly") {
    startDate.setFullYear(now.getFullYear() - 1);
  }

  const matchStage = {
    paymentStatus: "paid",
    createdAt: { $gte: startDate },
  };

  const [products, totalAgg] = await Promise.all([
    Order.aggregate([
      {
        $match: matchStage,
      },

      {
        $unwind: "$items",
      },

      // group product sales
      {
        $group: {
          _id: "$items.product",

          productTitle: {
            $first: "$items.productTitle",
          },

          image: {
            $first: "$items.image.url",
          },

          totalSales: {
            $sum: "$grandTotal",
          },

          totalOrders: {
            $sum: "$items.quantity",
          },
        },
      },

      {
        $sort: {
          totalSales: -1,
        },
      },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: pageSize }],

          meta: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]),

    Order.aggregate([
      {
        $match: matchStage,
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$grandTotal",
          },
          totalUnitsSold: {
            $sum: "$items.quantity",
          },
        },
      },
    ]),
  ]);

  const rows = products[0]?.data || [];
  const total = products[0]?.meta?.[0]?.total || 0;

  res.status(200).json({
    success: true,
    message: "Top selling products fetched successfully",

    data: rows.map((item) => ({
      productId: item._id,
      title: item.productTitle,
      image: item.image || "",
      sales: item.totalSales,
      orders: item.totalOrders,
    })),

    stats: {
      totalRevenue: totalAgg[0]?.totalRevenue || 0,
      totalUnitsSold: totalAgg[0]?.totalUnitsSold || 0,
    },

    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      pages: Math.ceil(total / pageSize),
    },
  });
});

export const recentActivitiesController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.max(Number(limit), 1);
  const skip = (pageNumber - 1) * pageSize;

  const [orders, customers, stockAlerts] = await Promise.all([
    // NEW ORDERS
    Order.find({})
      .select("orderNumber shippingAddress.fullName createdAt")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),

    // NEW CUSTOMERS
    User.find({
      role: "user",
    })
      .select("name createdAt")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),

    // STOCK ALERTS
    Product.aggregate([
      {
        $match: {
          isActive: true,
          isDraft: false,
        },
      },
      {
        $unwind: "$variants",
      },
      {
        $match: {
          $expr: {
            $lte: [
              "$variants.variantAvailableStock",
              "$variants.variantLowStockAlertStock",
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          title: "$productTittle",
          image: {
            $ifNull: [
              {
                $arrayElemAt: ["$variants.variantImage.url", 0],
              },
              "",
            ],
          },
          stock: "$variants.variantAvailableStock",
          createdAt: "$updatedAt",
          timeAgo: getRelativeTime("$updatedAt"),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 20,
      },
    ]),
  ]);

  // FORMAT ORDERS
  const orderActivities = orders.map((order) => ({
    type: "new_order",
    title: "New Order",
    description: `Order #${order.orderNumber} placed by ${order.shippingAddress?.fullName || "Customer"}`,
    createdAt: order.createdAt,
    timeAgo: getRelativeTime(order.createdAt),
    meta: {
      orderId: order._id,
    },
  }));

  // FORMAT CUSTOMERS
  const customerActivities = customers.map((user) => ({
    type: "new_customer",
    title: "New Customer",
    description: `Account created by ${user.name}`,
    createdAt: user.createdAt,
    timeAgo: getRelativeTime(user.createdAt),
    meta: {
      userId: user._id,
    },
  }));

  // FORMAT STOCK
  const stockActivities = stockAlerts.map((item) => ({
    type: item.stock === 0 ? "out_of_stock" : "low_stock",
    title: item.stock === 0 ? "Out of Stock" : "Low Stock",
    description: item.title,
    createdAt: item.createdAt,
    timeAgo: getRelativeTime(item.createdAt),
    meta: {
      productId: item.productId,
      stock: item.stock,
      image: item.image,
    },
  }));

  // COMBINE + SORT
  const activities = [
    ...orderActivities,
    ...customerActivities,
    ...stockActivities,
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = activities.length;

  const paginated = activities.slice(skip, skip + pageSize);

  res.status(200).json({
    success: true,
    message: "Recent activities fetched successfully",
    data: paginated,
    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      pages: Math.ceil(total / pageSize),
    },
  });
});

export const recentOrdersController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 7 } = req.query;

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.max(Number(limit), 1);
  const skip = (pageNumber - 1) * pageSize;

  // fast parallel query
  const [orders, total] = await Promise.all([
    Order.find({
      paymentStatus: "paid",
    })
      .select("orderNumber grandTotal createdAt items.productTitle items.image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),

    Order.countDocuments({
      paymentStatus: "paid",
    }),
  ]);

  const formatted = orders.map((order) => {
    const firstItem = order.items?.[0];

    return {
      _id: order._id,
      orderNumber: order.orderNumber,
      title: firstItem?.productTitle || "Product",
      image: firstItem?.image?.url || "",
      amount: order.grandTotal,
      createdAt: order.createdAt,
      timeAgo: getRelativeTime(order.createdAt),
    };
  });

  res.status(200).json({
    success: true,
    message: "Recent orders fetched successfully",
    data: formatted,
    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      pages: Math.ceil(total / pageSize),
    },
  });
});
