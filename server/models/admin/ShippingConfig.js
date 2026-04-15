import mongoose from "mongoose";

const ShippingConfigSchema = new mongoose.Schema(
  {
    // CHARGES
    charges: {
      withinCity: { type: Number, default: 0 }, // Zone A
      withinState: { type: Number, default: 0 }, // Zone B
      metroToMetro: { type: Number, default: 0 }, // Zone C
      restOfIndia: { type: Number, default: 0 }, // Zone D
      specialRegion: { type: Number, default: 0 }, // Zone E
    },

    // CONFIGURATION
    metroCities: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    specialStates: [
      {
        type: String, // northeast + j&k etc
        lowercase: true,
        trim: true,
      },
    ],

    // RULE SETTINGS
    freeDeliveryAbove: {
      type: Number,
      default: 0,
    },

    platformFee: {
      type: Number,
      default: 0,
    },

    additionalCharges: {
      type: Number,
      default: 0,
    },

    // FLAGS
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const ShippingConfig = mongoose.model("ShippingConfig", ShippingConfigSchema);

export default ShippingConfig;
