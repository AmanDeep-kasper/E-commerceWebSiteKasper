import topRated1 from "../../assets/TR1.png";
import topRated2 from "../../assets/TR2.png";
import topRated3 from "../../assets/TR3.png";
import topRated4 from "../../assets/TR4.png";
import Button from "../Button";
import Tilt from "react-parallax-tilt";
import Title from "../Title";
import products from "../../data/products.json";
import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import Ratings from "../Ratings";
import {
  getProductUrl,
  getCardImage,
  getPrices,
  formatPrice,
} from "../../utils/homePageUtils";
import { useEffect, useState } from "react";

// const topProducts = [
//   {
//     name: "Butterfly Blooms",
//     description: "Floral Collection",
//     img: topRated1,
//   },
//   {
//     name: "Mother Tree of Life",
//     description: "Nature & Spirituality",
//     img: topRated2,
//   },
//   {
//     name: "Adiyogi Grace",
//     description: "Spiritual Awakening",
//     img: topRated3,
//   },
//   {
//     name: "Lotus Chakra Meditative Panel",
//     description: "Wellness & Balance",
//     img: topRated4,
//   },
// ];
const topProducts = products
  .map((item) => {
    const avgRating =
      item.reviews && item.reviews.length > 0
        ? item.reviews.reduce((sum, r) => sum + r.rating, 0) /
          item.reviews.length
        : 0;

    return { ...item, avgRating }; // Add avgRating to product
  })
  .filter((item) => item.avgRating >= 4) // Only products with 4⭐ or more
  .sort((a, b) => b.avgRating - a.avgRating); // Sort by highest avg rating

function TopProducts() {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(4); // default = phone

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(5); // Desktop
      } else if (window.innerWidth >= 640) {
        setVisibleCount(6); // Tablet
      } else {
        setVisibleCount(4); // Phone
      }
    };

    updateCount(); // Run on mount
    window.addEventListener("resize", updateCount);

    return () => window.removeEventListener("resize", updateCount);
  }, []);
  return (
    <div className="px-2 bg-white border border-gray-200">
      <div className="flex items-center">
        <Title className="md:items-start px-2">Top Products</Title>
        <Link
          className="whitespace-nowrap text-blue-800 hover:text-blue-950 px-2 text-sm underline cursor-pointer"
          to={`/products/top-products`}
        >
          explore more
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 relative">
        {topProducts?.slice(0, visibleCount).map((p) => {
          const key = p.id || p.uuid || p.SKU;
          const { base, effective, discountPercent, symbol } = getPrices(p);
          const ratingAvg = p?.rating?.average;

          return (
            <Link
              key={key}
              className="bg-white p-4 group block transition-shadow duration-300"
              to={`/product/${p.uuid}`}
            >
              <div className="relative w-full overflow-hidden rounded-md">
                <img
                  className="w-full aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
                  src={getCardImage(p)}
                  alt={p.title || p.slug || p.category}
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
                  {p.title}
                </h3>

                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-gray-900 font-medium">
                    {formatPrice(effective)}
                  </span>

                  {discountPercent > 0 && (
                    <>
                      <span className="text-gray-400 text-xs line-through font-light">
                        {formatPrice(base)}
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
        })}
      </div>
    </div>
  );
}

export default TopProducts;
