// ---------------------------
// PRODUCT URL
// ---------------------------
export const getProductUrl = (p) =>
  p?.route || `/product/${encodeURIComponent(p?.uuid)}`;

// ---------------------------
// PRODUCT CARD IMAGE
// ---------------------------
export const getCardImage = (p) => {
  // 1. New structure → main product gallery
  if (p?.media?.gallery?.length) return p.media.gallery[0]?.src;

  // 2. New structure → variants with "variantImage"
  if (p?.variants?.length) {
    for (const v of p.variants) {
      if (v?.variantImage?.length) return v.variantImage[0];
    }
  }

  // 3. Legacy structure → variants with "images"
  if (p?.variants?.length && p.variants[0]?.images?.length)
    return p.variants[0].images[0];

  // 4. Base product images (legacy)
  if (p?.images?.length) return p.images[0];

  // 5. Old fallback
  if (p?.image?.length) return p.image[0];

  // 6. Final fallback
  return "/placeholder.jpg";
};

// ---------------------------
// PRODUCT PRICE CALCULATOR
// ---------------------------
export const getPrices = (p) => {
  const base = p?.pricing?.mrp ?? p?.sellingPrice ?? 0;

  const discountActive =
    p?.pricing?.discount?.active ?? p?.discountPercent > 0;

  const pct = discountActive
    ? p?.pricing?.discount?.percent ?? p?.discountPercent ?? 0
    : 0;

  const effective = pct > 0 ? Math.round(base * (1 - pct / 100)) : base;

  const currency = p?.pricing?.currency || "INR";
  const symbol = currency === "INR" ? "₹" : "";

  return { base, effective, discountPercent: pct, symbol };
};

// ---------------------------
// FORMAT PRICE
// ---------------------------
export const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return "₹0";

  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};


export const getAverageRating = (reviews = []) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;

  const total = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
  return total / reviews.length;
};
