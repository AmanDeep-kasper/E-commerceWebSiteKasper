import mongoose from "mongoose";

const PolicySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["return_refund", "shipping", "terms", "about", "privacy"],
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String, // HTML rich text editor content
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Policy = mongoose.model("Policy", PolicySchema);

export default Policy;
