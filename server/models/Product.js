// models/Product.js
import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    variantId: { type: String, required: true },
    variantSkuId: { type: String, required: true },

    variantColor: { type: String, default: "" },

    variantLength: { type: String, default: "" },
    variantBreadth: { type: String, default: "" },
    variantDimensionunit: { type: String, default: "In" },

    variantWidth: { type: String, default: "" }, // you are using this as WEIGHT value
    variantWidthUnit: { type: String, default: "kg" },

    variantMrp: { type: Number, default: 0 },
    variantCostPrice: { type: Number, default: 0 },
    variantSellingPrice: { type: Number, default: 0 },

    variantDiscount: { type: Number, default: 0 },
    variantDiscountUnit: { type: String, default: "%" },

    variantAvailableStock: { type: Number, default: 0 },
    variantLowStockAlertStock: { type: Number, default: 0 },

    variantImage: { type: [String], default: [] },

    isSelected: { type: Boolean, default: false },
  },
  { _id: false },
);

const ProductSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    route: { type: String, default: "" },

    productTittle: { type: String, required: true }, // frontend key
    description: { type: String, default: "" },
    status: { type: String, default: "ACTIVE" },

    category: { type: String, required: true },
    subcategory: { type: String, default: "" },
    materialType: { type: String, default: "" },
    isFestive: {
      type: Boolean,
      default: false,
    },
    
    // productcolor: { type: String, default: "" },

    // ProductWidthValue: { type: String, default: "" },
    // ProductWidthUnit: { type: String, default: "" },
    // ProductHeightValue: { type: String, default: "" },
    // ProductDimensionUnit: { type: String, default: "" },

    SKU: { type: String, required: true },

    // stockQuantity: { type: Number, default: 0 },
    // ReorderLimit: { type: Number, default: 0 },

    // mrp: { type: Number, default: 0 },
    // costPrice: { type: Number, default: 0 },
    // sellingPrice: { type: Number, default: 0 },

    // discountname: { type: String, default: "" },
    // extradiscountamount: { type: Number, default: 0 },
    // discountPercent: { type: Number, default: 0 },
    // discountAmount: { type: Number, default: 0 },

    // taxPercent: { type: Number, default: 0 },

    // variantlistings: { type: Boolean, default: false }, // frontend key

    // images: { type: [String], default: [] }, // cloudinary urls
    variants: { type: [VariantSchema], default: [] },

    // if you have reviews in your project keep this:
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true },
);

export default mongoose.model("Product", ProductSchema);
