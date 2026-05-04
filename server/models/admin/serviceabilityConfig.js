import mongoose from "mongoose";

const serviceabilitySchema = new mongoose.Schema(
  {
    // 🔑 Rule Type
    type: {
      type: String,
      enum: ["prefix", "exact"],
      required: true,
      index: true,
    },

    // 🔢 Value (e.g. "395" or "395007")
    value: {
      type: String,
      required: true,
      index: true,
    },

    // ✅ Deliverable or Not
    isServiceable: {
      type: Boolean,
      required: true,
      index: true,
    },

    // 🏭 Optional (future multi-warehouse support)
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      default: null,
      index: true,
    },

    // 🟢 Soft delete
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
  ``,
);

// 🔥 Fast lookup (core query index)
serviceabilitySchema.index(
  { value: 1, type: 1, warehouse: 1, isActive: 1 },
  { name: "serviceability_lookup_idx" },
);

// 🔥 Prevent duplicates
serviceabilitySchema.index(
  { value: 1, type: 1, warehouse: 1 },
  { unique: true, partialFilterExpression: { isActive: true } },
);

const ServiceabilityConfig = mongoose.model(
  "ServiceabilityConfig",
  serviceabilitySchema,
);

export default ServiceabilityConfig;
