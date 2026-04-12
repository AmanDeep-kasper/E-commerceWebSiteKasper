import Product from "../models/Product.js";

export const calculateDiscount = (coupon, applicableTotal = null) => {
  const baseAmount = applicableTotal;
  let discountAmount = 0;

  if (coupon.discountType === "flat") {
    discountAmount = coupon.discountValue;
  } else {
    discountAmount = (baseAmount * coupon.discountValue) / 100;
  }

  if (coupon.maxDiscountAmount && coupon.maxDiscountAmount < discountAmount) {
    discountAmount = coupon.maxDiscountAmount;
  }

  return parseFloat(discountAmount).toFixed(2);
};

export const validateCouponApplicability = async (coupon, cartItems) => {
  const applicableProducts = coupon.applicableProducts.map((p) => p.toString());
  const applicableCategories = coupon.applicableCategories.map((c) =>
    c.toString(),
  );

  // If no restrictions, applicable to all
  if (applicableProducts.length === 0 && applicableCategories.length === 0) {
    return { applicable: true, applicableItems: cartItems };
  }

  const applicableItems = [];
  const nonApplicableItems = [];

  for (const item of cartItems) {
    const product = await Product.findById(item.productId)
      .select("category")
      .lean();

    if (!product) continue;

    const isProductApplicable = applicableProducts.includes(
      item.productId.toString(),
    );
    const isCategoryApplicable = applicableCategories.includes(
      product.category.toString(),
    );

    if (isProductApplicable || isCategoryApplicable) {
      applicableItems.push(item);
    } else {
      nonApplicableItems.push(item);
    }
  }

  return {
    applicable: applicableItems.length > 0,
    applicableItems,
    nonApplicableItems,
    applicableTotal: applicableItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ),
  };
};
