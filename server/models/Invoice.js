import mongoose from "mongoose";

// ITEM SNAPSHOT
const InvoiceItemSchema = new mongoose.Schema(
  {
    orderItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
    },

    hsnCode: {
      type: String,
      required: true,
      trim: true,
    },

    productTitle: {
      type: String,
      required: true,
      trim: true,
    },

    variantName: {
      type: String,
      default: "",
      trim: true,
    },

    variantColor: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      url: String,
      altText: String,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    taxableAmount: {
      type: Number,
      required: true,
    },

    gstRate: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },

    cgstRate: Number,
    sgstRate: Number,
    igstRate: Number,

    cgstAmount: Number,
    sgstAmount: Number,
    igstAmount: Number,

    totalTax: {
      type: Number,
      required: true,
    },

    lineTotal: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "refunded"],
      default: "active",
      index: true,
    },
  },
  { _id: false },
);

// ADDRESS SNAPSHOT
const AddressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    email: String,

    addressLine1: String,
    addressLine2: String,

    city: String,
    state: String,
    stateCode: String,
    pinCode: String,

    country: {
      type: String,
      default: "India",
    },

    gstin: String,
  },
  { _id: false },
);

// MAIN
const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    orderNumber: {
      type: String,
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      index: true,
    },

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessSetting",
      index: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentMethod: {
      type: String,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
      index: true,
    },

    status: {
      type: String,
      enum: ["issued", "cancelled", "refunded"],
      default: "issued",
      index: true,
    },

    seller: AddressSchema,
    buyer: AddressSchema,
    shippingFrom: AddressSchema,

    items: {
      type: [InvoiceItemSchema],
      required: true,
    },

    summary: {
      mrpTotal: Number,
      subtotal: Number,
      discount: Number,
      shippingCharge: Number,

      cgst: Number,
      sgst: Number,
      igst: Number,

      totalTax: Number,

      grandTotal: {
        type: Number,
        required: true,
      },

      amountInWords: {
        type: String,
        required: true,
      },
    },

    taxType: {
      type: String,
      enum: ["CGST_SGST", "IGST"],
      required: true,
      index: true,
    },

    notes: {
      type: String,
      default: "",
    },

    pdf: {
      url: String,
      publicId: String,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/* ========= INDEXES ========= */

InvoiceSchema.index({ customerId: 1, createdAt: -1 });
InvoiceSchema.index({ orderNumber: 1 });
InvoiceSchema.index({ paymentStatus: 1, createdAt: -1 });
InvoiceSchema.index({ taxType: 1, issuedAt: -1 });
InvoiceSchema.index({ warehouseId: 1, issuedAt: -1 });
InvoiceSchema.index({ "buyer.stateCode": 1, issuedAt: -1 });
InvoiceSchema.index({ "items.hsnCode": 1 });
InvoiceSchema.index({ "items.sku": 1 });
InvoiceSchema.index({ status: 1, issuedAt: -1 });

InvoiceSchema.pre("save", async function (next) {
  if (!this.isNew || this.invoiceNumber) return next();

  try {
    const date = new Date();

    const dateStr =
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0");

    const count = await mongoose.model("Invoice").countDocuments();

    this.invoiceNumber = `INV-${dateStr}-${String(count + 1).padStart(4, "0")}`;

    next();
  } catch (error) {
    next(error);
  }
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
