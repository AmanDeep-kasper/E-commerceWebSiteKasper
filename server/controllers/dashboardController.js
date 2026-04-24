import Product from "../models/Product.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// export const kpiCardController = asyncHandler(async (req, res) => {
//     // calculate total revenue, total orderds, total products, and total customer
//     const [totalRevenue, totalOrders, totalProducts, totalCustomers] = await Promise.all([
//         Payment.aggregate([
//             {

//             }
//         ])
//     ])


// });
