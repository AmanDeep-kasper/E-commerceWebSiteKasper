import mongoose from "mongoose";

const PolicySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["return_refund", "shipping", "terms", "faq", "about", "privacy"],
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String, // HTML / rich text editor content
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
