import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    // EARN CONFIG (SLAB BASED)
    earn: {
      minOrderValue: {
        type: Number,
        default: 0,
      },
      rules: {
        PriceForPoints: {
          type: Number,
          default: 0,
        },
        points: {
          type: Number,
          default: 0,
        },
      },
    },

    // REDEEM CONFIG
    minOrderValueForRedeem: {
      type: Number,
      default: 0,
    },

    // VALIDITY
    validity: {
      type: Number,
      default: 30,
    },

    // CONTROL
    isActive: {
      type: Boolean,
      default: true,
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
