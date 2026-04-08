import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // Auto-delete after expiry
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Blacklist = mongoose.model("Blacklist", blacklistSchema);
export default Blacklist;
