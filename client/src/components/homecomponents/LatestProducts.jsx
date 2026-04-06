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

{/* <=========------- icons ------==========> */ }
import { FaBagShopping } from "react-icons/fa6";
import { LuMinus } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";

function LatestProducts() {
  const [temp, setTemp] = useState(250);
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const navigate = useNavigate(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [addedItems, setAddedItems] = useState({});
  const { cartItems } = useSelector((s) => s.cart);
  const { wishlistItems } = useSelector((s) => s.wishlist);

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

  {/* <===========----------- Add to Cart ------------==========>*/ }
  const addToCart = (product) => {
    setAddedItems((prev) => ({
      ...prev,
      [product._id]: 1,
    }));
  };

  const increaseQty = (id) => {
    setAddedItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseQty = (id) => {
    setAddedItems((prev) => {
      const current = prev[id] || 0;
      const newQty = current - 1;

      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }

      return {
        ...prev,
        [id]: newQty,
      };
    });
  };


  return (
    <div className="lg:px-20 md:px-[60px] px-4 py-[23px] relative bg-white  shadow-sm rounded-lg">
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
                {/* Wishlist Button */}
                <button
                  className="absolute bg-white shadow-md md:shadow-lg md:bg-white group-hover:block active:scale-110 transition-all ease-in-out duration-300 md:p-1 p-1 rounded-full text-xs top-1 right-1 z-30 cursor-default"
                  onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                    const isInWishlist = wishlistItems.some(
                      (i) => i.uuid === product.uuid && i.variantId === variantId,
                    );

                    if (isInWishlist) {
                      dispatch(
                        removeFromWishlist({ uuid: product.uuid, variantId }),
                      );
                    } else {
                      dispatch(
                        addToWishlist({
                          uuid: product.uuid,
                          variantId,
                          title: product.title,
                          basePrice: selectedVariant.price,
                          stockQuantity: selectedVariant.stockQuantity,
                          discountPercent: product.discountPercent,
                          image: product.images,
                          deliverBy: product.deliverBy,
                          selectedOptions: {
                            color: selectedVariant.color,
                            type: selectedVariant.type,
                            dimension: selectedVariant.dimension,
                          },
                        }),
                      );
                    }
                  }}
                >
                  <Heart
                    className="w-8 h-8 p-1 cursor-pointer"
                    fill={
                      wishlistItems.some(
                        (i) =>
                          i.uuid === product.uuid && i.variantId === variantId,
                      )
                        ? "red"
                        : "white"
                    }
                    stroke={
                      wishlistItems.some(
                        (i) =>
                          i.uuid === product.uuid && i.variantId === variantId,
                      )
                        ? "red"
                        : "black"
                    }
                    strokeWidth={1}
                  />
                </button>

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

                  {/* <div className="flex gap-1 ">
                    <Stack spacing={1}>
                      <Rating name="size-small" defaultValue={2} size="small" />
                    </Stack>
                    <span className="text-[12px] text-[#686868]">(345)</span>
                  </div> */}



                  {/* <===========----------- Add to Cart ------------==========>*/}
                  <div
                    className={`w-full rounded-md flex justify-center items-center gap-4 p-2 mt-2 transition-all duration-300 ${addedItems[p._id]
                      ? "bg-white border border-[#252525]"
                      : "bg-[#252525] border border-[#252525]"
                      }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (!addedItems[p._id]) {
                        addToCart(p);
                      }
                    }}
                  >
                    {addedItems[p._id] > 0 ? (
                      <div className="w-full flex items-center justify-between text-black">

                        {/* MINUS */}
                        <span
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            decreaseQty(p._id);
                          }}
                        >
                          <LuMinus />
                        </span>

                        {/* COUNT */}
                        <span>
                          {addedItems[p._id]}
                        </span>

                        {/* PLUS */}
                        <span
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            increaseQty(p._id);
                          }}
                        >
                          <LuPlus />
                        </span>

                      </div>
                    ) : (
                      <>
                        <span className="text-white text-[12px]">
                          Add To Cart
                        </span>
                        <span className="text-white">
                          <FaBagShopping />
                        </span>
                      </>
                    )}
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
