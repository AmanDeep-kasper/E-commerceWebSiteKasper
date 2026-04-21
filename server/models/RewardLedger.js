import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const rewardLedgerSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["earn", "redeem", "expire"],
      required: true,
    },

    points: {
      type: Number,
      required: true,
      min: 0,
    },

    remainingPoints: {
      type: Number,
      min: 0,
    },

    orderId: {
      type: ObjectId,
      ref: "Order",
      index: true,
    },

    expiresAt: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

rewardLedgerSchema.index({ user: 1, type: 1 });
rewardLedgerSchema.index({ user: 1, expiresAt: 1 });
rewardLedgerSchema.index({ user: 1, remainingPoints: 1 });
rewardLedgerSchema.index({ createdAt: 1 });

rewardLedgerSchema.pre("validate", function (next) {
  if (this.type === "earn") {
    if (this.remainingPoints == null) {
      this.remainingPoints = this.points;
    }
  } else {
    this.remainingPoints = undefined;
    this.expiresAt = undefined;
  }
  next();
});

const RewardLedger = mongoose.model("RewardLedger", rewardLedgerSchema);
export default RewardLedger;
