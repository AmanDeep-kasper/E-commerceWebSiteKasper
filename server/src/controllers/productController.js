import Product from "../models/Product.js";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

const createSlug = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseJSONField = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const toNumber = (value, fallback = undefined) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
};

const toStringArray = (value) => {
  const parsedValue = parseJSONField(value, value);

  if (Array.isArray(parsedValue)) {
    return parsedValue
      .map((item) => item?.toString().trim())
      .filter(Boolean);
  }

  if (typeof parsedValue === "string") {
    return parsedValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getVariantImageFiles = (files, index) => {
  if (!files) {
    return [];
  }

  if (Array.isArray(files)) {
    return files.filter(
      (file) => file.fieldname === `variantImages_${index}`,
    );
  }

  return files[`variantImages_${index}`] || [];
};

const uploadImages = async (files, folder, fallbackAltText) => {
  if (!files?.length) {
    return [];
  }

  const uploadedImages = await Promise.all(
    files.map(async (file, index) => {
      const uploadedFile = await uploadImageToCloudinary(file.path, folder);

      return {
        url: uploadedFile.url,
        publicId: uploadedFile.publicId,
        altText: fallbackAltText,
        isPrimary: index === 0,
        displayOrder: index,
      };
    }),
  );

  return uploadedImages;
};

const resolveCategoryIds = async ({ categories, category, subcategory }) => {
  const requestedCategories = [
    ...toStringArray(categories),
    ...(category ? [category] : []),
    ...(subcategory ? [subcategory] : []),
  ]
    .map((item) => item.trim())
    .filter(Boolean);

  if (!requestedCategories.length) {
    return [];
  }

  const uniqueRequestedCategories = [...new Set(requestedCategories)];

  const categoryDocs = await Category.find({
    $or: [
      { _id: { $in: uniqueRequestedCategories.filter((item) => item.match(/^[0-9a-fA-F]{24}$/)) } },
      { name: { $in: uniqueRequestedCategories.map((item) => item.toLowerCase()) } },
      { slug: { $in: uniqueRequestedCategories.map(createSlug) } },
    ],
  }).select("_id");

  return [...new Set(categoryDocs.map((doc) => doc._id.toString()))];
};

export const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    productTittle,
    sku,
    SKU,
    slug,
    shortDescription,
    fullDescription,
    description,
    brand,
    categories,
    category,
    subcategory,
    attributes,
    metaTitle,
    metaDescription,
    metaKeywords,
    isActive,
    isFeatured,
    isNew,
    variants,
  } = req.body;

  const productName = (name || productTittle || "").trim();
  const productSku = (sku || SKU || "").trim().toUpperCase();
  const productSlug = createSlug(slug || productName);

  if (!productName) {
    throw AppError.badRequest("Product name is required", "PRODUCT_NAME_REQUIRED");
  }

  if (!productSku) {
    throw AppError.badRequest("Product SKU is required", "PRODUCT_SKU_REQUIRED");
  }

  const parsedVariants = parseJSONField(variants, []);
  if (!Array.isArray(parsedVariants) || !parsedVariants.length) {
    throw AppError.badRequest(
      "At least one product variant is required",
      "PRODUCT_VARIANTS_REQUIRED",
    );
  }

  const [existingSkuProduct, existingSlugProduct] = await Promise.all([
    Product.findOne({ sku: productSku }).select("_id"),
    Product.findOne({ slug: productSlug }).select("_id"),
  ]);

  if (existingSkuProduct) {
    throw AppError.conflict("Product SKU already exists", "PRODUCT_SKU_EXISTS");
  }

  if (existingSlugProduct) {
    throw AppError.conflict("Product slug already exists", "PRODUCT_SLUG_EXISTS");
  }

  const categoryIds = await resolveCategoryIds({ categories, category, subcategory });

  const normalizedVariants = await Promise.all(
    parsedVariants.map(async (variant, index) => {
      const variantSku = (
        variant?.sku ||
        variant?.variantSkuId ||
        variant?.SKU ||
        ""
      )
        .toString()
        .trim()
        .toUpperCase();

      if (!variantSku) {
        throw AppError.badRequest(
          `Variant SKU is required for variant ${index + 1}`,
          "VARIANT_SKU_REQUIRED",
        );
      }

      const mrpPrice = toNumber(variant?.mrpPrice ?? variant?.variantMrp);
      const sellingPrice = toNumber(
        variant?.sellingPrice ?? variant?.variantSellingPrice,
      );

      if (mrpPrice === undefined || sellingPrice === undefined) {
        throw AppError.badRequest(
          `MRP price and selling price are required for variant ${index + 1}`,
          "VARIANT_PRICE_REQUIRED",
        );
      }

      const variantImages = await uploadImages(
        getVariantImageFiles(req.files, index),
        "products/variants",
        `${productName} variant ${index + 1}`,
      );

      return {
        sku: variantSku,
        size:
          variant?.size ||
          [variant?.variantLength, variant?.variantBreadth]
            .filter(Boolean)
            .join(" x ") ||
          undefined,
        color: variant?.color || variant?.variantColor || undefined,
        material: variant?.material || variant?.variantType || brand || undefined,
        weightKg: toNumber(variant?.weightKg ?? variant?.variantWidth),
        dimensions:
          variant?.dimensions ||
          [
            variant?.variantLength,
            variant?.variantBreadth,
            variant?.variantDimensionunit,
          ]
            .filter(Boolean)
            .join(" x ") ||
          undefined,
        mrpPrice,
        sellingPrice,
        discountPercent: toNumber(
          variant?.discountPercent ?? variant?.variantDiscount,
        ),
        stockQuantity: toNumber(
          variant?.stockQuantity ?? variant?.variantAvailableStock,
          0,
        ),
        isDefault: index === 0 || toBoolean(variant?.isDefault, false),
        displayOrder: toNumber(variant?.displayOrder, index),
        images: variantImages,
      };
    }),
  );

  const variantSkus = normalizedVariants.map((variant) => variant.sku);
  const duplicateVariantSkus = variantSkus.filter(
    (skuValue, index) => variantSkus.indexOf(skuValue) !== index,
  );

  if (duplicateVariantSkus.length) {
    throw AppError.conflict(
      "Variant SKUs must be unique within the product",
      "DUPLICATE_VARIANT_SKU",
    );
  }

  const existingVariantProduct = await Product.findOne({
    "variants.sku": { $in: variantSkus },
  }).select("_id");

  if (existingVariantProduct) {
    throw AppError.conflict(
      "One or more variant SKUs already exist",
      "VARIANT_SKU_EXISTS",
    );
  }

  const parsedAttributes = parseJSONField(attributes, []);
  const normalizedAttributes = Array.isArray(parsedAttributes)
    ? parsedAttributes
        .map((attribute, index) => ({
          name: attribute?.name || attribute?.label || undefined,
          value: attribute?.value || undefined,
          displayOrder: toNumber(attribute?.displayOrder, index),
        }))
        .filter((attribute) => attribute.name && attribute.value)
    : [];

  const productPayload = {
    sku: productSku,
    name: productName,
    slug: productSlug,
    shortDescription: shortDescription || description || "",
    fullDescription: fullDescription || description || "",
    brand: brand || undefined,
    categories: categoryIds,
    variants: normalizedVariants,
    attributes: normalizedAttributes,
    metaTitle: metaTitle || productName,
    metaDescription:
      metaDescription ||
      shortDescription ||
      description ||
      undefined,
    metaKeywords: toStringArray(metaKeywords),
    isActive: toBoolean(isActive, true),
    isFeatured: toBoolean(isFeatured, false),
    isNew: toBoolean(isNew, false),
  };

  const product = await Product.create(productPayload);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});
