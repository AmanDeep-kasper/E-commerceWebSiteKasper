import mongoose from "mongoose";

const userRewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      required: true,
    },

    // UI DISPLAY
    title: {
      type: String,
      required: true,
    },

    // POINTS
    totalPoints: {
      type: Number,
      required: true,
    },

    remainingPoints: {
      type: Number,
      required: true,
    },

    // REDEEM SNAPSHOT (IMPORTANT 🔥)
    pointValue: {
      type: Number,
      required: true,
    },

    maxRedeemPercent: {
      type: Number,
      default: 10,
    },

    minOrderValue: {
      type: Number,
      default: 0,
    },

    // VALIDITY
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    // ⚙️ STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    // TRACKING
    earnedFromOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true, versionKey: false }
);

// INDEX
userRewardSchema.index({ user: 1, isActive: 1, expiresAt: 1 });

const UserReward = mongoose.model("UserReward", userRewardSchema);
export default UserReward;