import mongoose from "mongoose";

const serviceabilitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["prefix", "exact"],
      required: true,
      index: true,
    },

    value: {
      type: Number,
      required: true,
      unique: true,
    },

    isServiceable: {
      type: Boolean,
      required: true,
      index: true,
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      default: null,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

serviceabilitySchema.index({ value: 1, type: 1, warehouse: 1, isActive: 1 });

const ServiceabilityConfig = mongoose.model(
  "ServiceabilityConfig",
  serviceabilitySchema,
);

export default ServiceabilityConfig;
