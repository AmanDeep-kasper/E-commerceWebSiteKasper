import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    // ✅ EARN CONFIG (SLAB BASED)
    earn: {
      minOrderValue: {
        type: Number,
        default: 0,
      },

      rules: [
        {
          minOrder: {
            type: Number,
            required: true,
          },
          points: {
            type: Number,
            required: true,
          },
        },
      ],
    },

    // ✅ REDEEM CONFIG
    redeem: {
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

    // ✅ VALIDITY
    validity: {
      startDate: Date,
      endDate: Date,
      expiryDays: Number,
    },

    // ✅ CONTROL
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

rewardSchema.index(
  { isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } },
);

const Reward = mongoose.model("Reward", rewardSchema);
export default Reward;
