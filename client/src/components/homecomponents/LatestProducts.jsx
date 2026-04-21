import { useEffect, useMemo, useState } from "react";
// import products from "../../data/products.json";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
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

{
  /* <=========------- icons ------==========> */
}
import { FaBagShopping } from "react-icons/fa6";
import { LuMinus } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function LatestProducts() {
  const { slugOrId } = useParams();
  const [Mainproduct, setMainProduct] = useState(null);
  const [MainProductloading, setMainProductLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/product/${slugOrId}`, 
      );

      setMainProduct(res.data.data);
    } catch (error) {
      console.log("Error:", error);
      setMainProduct(null);
    } finally {
      setMainProductLoading(false);
    }
  };

  useEffect(() => {
    if (slugOrId) {
      fetchProduct();
    }
  }, [slugOrId]);

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

  const [latestProduct, setlatestProduct] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/product/all");

      const productData =
        res?.data?.products || res?.data?.data || res?.data?.product || [];

      setlatestProduct(Array.isArray(productData) ? productData : []);
    } catch (error) {
      console.log(error);
      setlatestProduct([]);
    }
  };

  useEffect(() => {
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

  {
    /* <===========----------- Add to Cart ------------==========>*/
  }
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
    <div className="lg:px-20 md:px-[60px] px-4 py-[23px] relative bg-[#EEFDFF] shadow-sm rounded-lg">
      <div className="flex items-center">
        <Title className="md:items-start px-2 font-marcellus text-[#1800AC]">
          Best Selling Products
        </Title>
        <Link
          className="whitespace-nowrap text-[#2C87E2] hover:text-blue-950 px-2 text-sm underline cursor-pointer"
          to={`/products`}
        >
          explore more
        </Link>
      </div>

      {/* Best Selling Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 relative">
        {latestProducts.slice(0, visibleCount)?.map((p) => {
          // {console.log(p)}
          const key = p._id || p.uuid || p.SKU;
          const v = p?.variants?.[0] || {};
          const mrp = Number(v?.max || 0);
          const sell = Number(v?.min || 0);
          const productLink = p.slug || p._id;

          // compute % off from MRP and Selling Price
          const discountPercent =
            mrp > 0 && sell > 0 && sell < mrp
              ? Math.round(((mrp - sell) / mrp) * 100)
              : 0;
          const ratingAvg = getAverageRating(p.reviews);

          return (
            <Link
              key={p._id}
              className="bg-white p-2 rounded-lg group/image block transition-shadow duration-300"
              to={`/product/${productLink}`}
            >
              <div className="relative w-full overflow-hidden rounded-md">
                <img
                  className="w-full aspect-square object-contain transition-transform duration-300 group-hover/image:scale-110"
                  src={p.image && p.image}
                  alt={p.name || p.slug}
                  loading="lazy"
                />
                {/* Wishlist Button */}
                <button
                  className="absolute bg-white shadow-md md:shadow-lg md:bg-white group-hover:block active:scale-110 transition-all ease-in-out duration-300 md:p-1 p-1 rounded-full text-xs top-1 right-1 z-30 cursor-default"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const isInWishlist = wishlistItems.some(
                      (i) =>
                        i.uuid === product.uuid && i.variantId === variantId,
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
                  {/* <Heart
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
                  /> */}
                </button>

                {/* {typeof ratingAvg === "number" && (
                  <div className="absolute top-2 right-2 bg-yellow-400 shadow-md text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                    <span>{Number(ratingAvg).toFixed(1)} ★</span>
                  </div>
                )} */}
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-serif text-gray-800 font-normal line-clamp-1 mb-2">
                  {p.name || p.slug || "Product Name"}
                </h3>

                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-gray-900 font-medium">
                    ₹{p.defaultPrice || "--"}
                  </span>

                  {/* {mrp > 0 && discountPercent > 0 && ( */}
                  <span className="text-gray-400 text-xs line-through font-light">
                    ₹{p.mrp}
                  </span>
                  {/* )} */}
                  <div className="border-l border-[#DBDBDB] h-3"></div>
                  {p.discount > 0 && (
                    <>
                      <span className="text-[#35C772] text-xs">
                        {Math.round(p.discount)}% Off
                      </span>
                    </>
                  )}
                </div>
                <div className="flex flex-col items-start">
                  {/* <===========----------- Add to Cart ------------==========>*/}
                  <div
                    className={`w-full rounded-md flex justify-center items-center gap-4 p-2 mt-2 transition-all duration-300 ${
                      addedItems[p._id]
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
                        <span>{addedItems[p._id]}</span>

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
