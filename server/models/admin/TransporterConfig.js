import mongoose from "mongoose";

const transporterSchema = new mongoose.Schema(
  {
    transporterName: {
      type: String,
      required: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      trim: true,
    },

    trackingUrl: {
      type: String,
      required: true,
    },

    activeShipment: {
      type: Number,
      default: 0,
    },

    contactDetails: {
      PersonName: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        match: [/^[6-9]\d{9}$/, "Please provide a valid phone number"],
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Transporter = mongoose.model("Transporter", transporterSchema);
export default Transporter;
