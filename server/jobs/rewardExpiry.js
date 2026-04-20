import RewardLedger from "../models/RewardLedger.js";
import User from "../models/User.js";

export const runRewardExpiryJob = async () => {
  console.log("Running reward expiry job...");

  const expiredEntries = await RewardLedger.find({
    type: "earn",
    remainingPoints: { $gt: 0 },
    expiresAt: { $lt: new Date() },
  });

  for (const entry of expiredEntries) {
    const userId = entry.user;
    const expiredPoints = entry.remainingPoints;

    // zero remaining
    entry.remainingPoints = 0;
    await entry.save();

    // log expire entry
    await RewardLedger.create({
      user: userId,
      type: "expire",
      points: expiredPoints,
      orderId: entry.orderId,
    });

    // deduct from user
    await User.updateOne({ _id: userId }, { $inc: { points: -expiredPoints } });
  }

  console.log(`Expired entries processed: ${expiredEntries.length}`);
};
