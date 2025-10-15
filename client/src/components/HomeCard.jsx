import React from "react";
import { Link } from "react-router";
import { getProductUrl, getCardImage, getPrices } from "../utils/homePageUtils";

const HomeCard = ({ product }) => {
  const key = product.id || product.uuid || product.SKU;
  const { base, effective, discountPercent, symbol } = getPrices(product);
  const ratingAvg =
    product.reviews.length || 0 > 0
      ? product?.reviews?.reduce((total, review) => total + review.rating, 0) /
        product.reviews.length
      : "N/A";

  console.log(product);
  return (
    <Link
      key={key}
      className="bg-white p-4 group block transition-shadow duration-300"
      to={getProductUrl(product)}
    >
      <div className="relative w-full overflow-hidden rounded-md">
        <img
          className="w-full aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
          src={getCardImage(product)}
          alt={product.title || product.slug || product.category}
          loading="lazy"
        />

        {typeof ratingAvg === "number" && (
          <div className="absolute top-2 right-2 bg-yellow-400 shadow-md text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
            <span>{Number(ratingAvg).toFixed(1)} ★</span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-serif text-gray-800 font-normal line-clamp-1 mb-2">
          {product.title}
        </h3>

        <div className="flex items-center flex-wrap gap-2">
          <span className="text-gray-900 font-medium">
            {symbol}
            {effective.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>

          {discountPercent > 0 && (
            <>
              <span className="text-gray-400 text-xs line-through font-light">
                {symbol}
                {base.toLocaleString("en-IN")}
              </span>
              <span className="bg-green-700 text-white text-xs px-2 py-0.5 rounded">
                {discountPercent}% Off
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default HomeCard;
