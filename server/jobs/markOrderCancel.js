import Order from "../models/Order.js";

export const autoCancelOrdersJob = async () => {
  try {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000); // 30 min

    const result = await Order.updateMany(
      {
        status: { $in: ["placed", "pending"] },
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
