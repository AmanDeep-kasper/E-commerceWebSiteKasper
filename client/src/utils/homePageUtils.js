export const getProductUrl = (p) =>
  `/products/${encodeURIComponent(p?.category)}`;

// Pick first suitable image (new JSON → legacy fallback)
export const getCardImage = (p) => {
  if (p?.media?.gallery?.length) return p.media.gallery[0]?.src;
  if (p?.variants?.length && p.variants[0]?.images?.length)
    return p.variants[0].images[0];
  if (p?.image?.length) return p.image[0];
  return "/placeholder.jpg";
};

// Compute prices from new JSON; fall back to old fields
export const getPrices = (p) => {
  const base = p?.pricing?.base_price ?? p?.basePrice ?? 0;

  const discountActive = p?.pricing?.discount?.active ?? p?.discountPercent > 0;

  const pct = discountActive
    ? p?.pricing?.discount?.percent ?? p?.discountPercent ?? 0
    : 0;

  const effective = pct > 0 ? Math.round(base * (1 - pct / 100)) : base;

  // Currency
  const currency = p?.pricing?.currency || "INR";
  const symbol = currency === "INR" ? "₹" : "";

  return { base, effective, discountPercent: pct, symbol };
};

export const formatPrice = (price) => {
  return `₹${price.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};


