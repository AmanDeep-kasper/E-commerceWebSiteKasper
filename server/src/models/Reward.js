import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Reward name is required"],
  },
  amount: {
    type: Number,
    required: [true, "Reward amount is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  minPurchase: {
    type: Number,
    required: [true, "Reward min purchase amount is required"],
  },
  deadline: {
    type: Date,
    required: [true, "Reward deadline is required"],
  },
  redeemPoints: {
    type: Number,
    required: [true, "Reward redeem points is required"],
  },
  redeemPercent: {
    type: Number,
    required: [true, "Reward redeem percent is required"],
  },
  redeemAmount: {
    type: Number,
    required: [true, "Reward redeem amount is required"],
  },
},{timestamps: true});

const Reward = mongoose.model("Reward", rewardSchema);

export default Reward;