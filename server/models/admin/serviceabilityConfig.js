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
      type: String,
      required: true,
      trim: true,
      index: true,
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
  { timestamps: true, versionKey: false }
);

// 🔥 FAST LOOKUP INDEX
serviceabilitySchema.index(
  { value: 1, type: 1, warehouse: 1, isActive: 1 },
  { name: "serviceability_lookup_idx" }
);

// 🔥 UNIQUE (ACTIVE ONLY)
serviceabilitySchema.index(
  { value: 1, type: 1, warehouse: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

const Serviceability = mongoose.model("ServiceabilityConfig", serviceabilitySchema);

export default Serviceability;