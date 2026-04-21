import Order from "../models/Order.js";

export const autoCancelOrdersJob = async () => {
  try {
    const cutoff = new Date(Date.now() - 10 * 60 * 1000); // 10 min

    const result = await Order.updateMany(
      {
        status: "placed",
        paymentStatus: { $in: ["pending", "failed"] },
        createdAt: { $lt: cutoff },
      },
      {
        $set: {
          status: "cancelled",
          cancelledAt: new Date(),
        },
      },
    );

    console.log(`Auto-cancelled orders: ${result.modifiedCount}`);
  } catch (err) {
    console.error("Auto cancel job failed:", err);
  }
};