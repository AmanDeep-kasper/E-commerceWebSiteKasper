import cron from "node-cron";
import { autoCancelOrdersJob } from "../jobs/markOrderCancel.js";
import { runRewardExpiryJob } from "../jobs/rewardExpiry.js";

// every minute
cron.schedule("* * * * *", async () => {
  try {
    await runRewardExpiryJob();
  } catch (err) {
    console.error("Reward expiry job failed:", err);
  }
});

// every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  await autoCancelOrdersJob();
});
