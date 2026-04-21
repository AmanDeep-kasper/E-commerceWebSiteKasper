import cron from "node-cron";
import { autoCancelOrdersJob } from "../jobs/markOrderCancel.js";
import { runRewardExpiryJob } from "../jobs/rewardExpiry.js";

// Run daily at 2 AM
cron.schedule("0 2 * * *", async () => {
  try {
    await runRewardExpiryJob();
  } catch (err) {
    console.error("Reward expiry job failed:", err);
  }
});

// every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  await autoCancelOrdersJob();
});

