import { useEffect, useMemo, useState } from "react";
import products from "../../data/products.json";
import { Link, useNavigate } from "react-router";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Title from "../Title";
import Ratings from "../Ratings";
import {
  getProductUrl,
  getCardImage,
  getPrices,
  formatPrice,
} from "../../utils/homePageUtils";
import HomeCard from "../HomeCard";

import axiosInstance from "../../api/axiosInstance";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { getAverageRating } from "../../utils/homePageUtils";

function LatestProducts() {
  const [temp, setTemp] = useState(250);
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const navigate = useNavigate(null);
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

  // function getRandomItems(products, number) {
  //   const shuffled = [...products].sort(() => 0.5 - Math.random());
  //   return shuffled.slice(0, number);
  // }
  // const randomTen = useMemo(() => getRandomItems(products, 10), [products]);

  // const productsBackend = async () => {
  //   axiosInstance.get("")
  // };

  const [latestProduct, setlatestProduct] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products/all");
        //  console.log("PRODUCTS:", res.data);
        setlatestProduct(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  const latestProducts = [...latestProduct].reverse().slice(0, 6);

  function actualPrice(price, discountPercent) {
    return price - (price * discountPercent) / 100;
  }
  function totalRating(ratings) {
    return (
      ratings.reduce((total, rating) => total + rating.rating, 0) /
      ratings.length
    );
  }
  return (
    <div className="relative bg-white px-2 py-4 shadow-sm rounded-lg">
      <div className="flex items-center">
        <Title className="md:items-start px-2">Latest Products</Title>
        <Link
          className="whitespace-nowrap text-[#2C87E2] hover:text-blue-950 px-2 text-sm underline cursor-pointer"
          to={`/products`}
        >
          explore more
        </Link>
      </div>

      {/* Latest Products */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 relative"
        // ref={ref} //grid-flow-col auto-cols-max
      >
        {latestProducts.slice(0, visibleCount)?.map((p) => {
          const key = p.id || p.uuid || p.SKU;
          // const { base, effective, discountPercent, symbol } = getPrices(p);
          const v = p?.variants?.[0] || {};
          const mrp = Number(v?.variantMrp || 0);
          const sell = Number(v?.variantSellingPrice || 0);

          // compute % off from MRP and Selling Price
          const discountPercent =
            mrp > 0 && sell > 0 && sell < mrp
              ? Math.round(((mrp - sell) / mrp) * 100)
              : 0;
          const ratingAvg = getAverageRating(p.reviews);

          return (
            <Link
              key={key}
              className="bg-white p-2 rounded-lg border group/image block transition-shadow duration-300"
              // to={`/product/${p.uuid}`}
              to={`/product/${p._id}`} //mongo id
            >
              <div className="relative w-full overflow-hidden rounded-md">
                <img
                  className="w-full aspect-square object-contain transition-transform duration-300 group-hover/image:scale-110"
                  // src={getCardImage(p)}
                  src={
                    p?.variants?.[0]?.variantImage?.[0] ||
                    p?.images?.[0] ||
                    "/fallback.png"
                  }
                  alt={p.title || p.slug || p.category}
                  loading="lazy"
                />

                {/* {typeof ratingAvg === "number" && (
                  <div className="absolute top-2 right-2 bg-yellow-400 shadow-md text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                    <span>{Number(ratingAvg).toFixed(1)} ★</span>
                  </div>
                )} */}
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-serif text-gray-800 font-normal line-clamp-1 mb-2">
                  {p.productTittle}
                </h3>

                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-gray-900 font-medium">
                    {/* {formatPrice(effective)} */}₹{sell || mrp || "--"}
                  </span>

                  {discountPercent > 0 && (
                    <>
                      <span className="text-[#168408] text-xs">
                        {discountPercent}% Off
                      </span>
                    </>
                  )}
                </div>
                <div className="flex flex-col items-start">
                  {mrp > 0 && discountPercent > 0 && (
                    <span className="text-gray-400 text-xs line-through font-light">
                      ₹{mrp}
                    </span>
                  )}

                  <div className="flex gap-1 ">
                    <Stack spacing={1}>
                      <Rating name="size-small" defaultValue={2} size="small" />
                    </Stack>
                    <span className="text-[12px] text-[#686868]">(345)</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default LatestProducts;
