import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    // EARN CONFIG
    earn: {
      minOrderValue: {
        type: Number,
        default: 0,
      },
      rule: {
        amount: {
          type: Number,
          required: true,
          // ₹100 = 1 point OR 5%
        },

        points: {
          type: Number,
          required: true,
        },
      },
    },

    // REDEEM CONFIG
    redeem: {
      points: {
        type: Number,
        required: true,
      },
      pointValue: {
        type: Number,
        required: true, // 1 point = ₹X
      },

      maxRedeemPercent: {
        type: Number,
        default: 10,
      },

      minOrderValueForRedeem: {
        type: Number,
        default: 0,
      },
    },

    // VALIDITY
    validity: {
      startDate: Date,
      endDate: Date,

      expiryDays: Number,
      // e.g. points expire in 30 days after earning
    },

    // CONTROL
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Reward = mongoose.model("Reward", rewardSchema);
export default Reward;
