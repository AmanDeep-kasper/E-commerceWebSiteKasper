import Title from "../Title";
// import products from "../../data/products.json";
import { Link } from "react-router-dom";
import {
  getProductUrl,
  getCardImage,
  getPrices,
  formatPrice,
} from "../../utils/homePageUtils";
import { useEffect, useState } from "react";
import { Anvil } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

const DiwaliProducts = () => {
  const [visibleCount, setVisibleCount] = useState(4); // default = phone
  const [diwaliProduct, setdiwaliProducts] = useState([]);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products/all");
        // console.log("PRODUCTS", res.data);
        setdiwaliProducts(res.data);
      } catch (error) {
        console.log("ERROR IN FETCH THE DATA", error);
      }
    };
    fetchProducts();
  }, []);

  // Sample product data
  // const diwaliProducts = diwaliProduct.filter((p) => p.isFestive === true);

  const getProductHref = (p) => `/product/${p._id}`; // your route uses mongo id

  const getImage = (p) =>
    p?.variants?.[0]?.variantImage?.[0] || p?.images?.[0] || "/fallback.png";

  const getMrp = (p) => Number(p?.variants?.[0]?.variantMrp) || 0;
  const getSelling = (p) => Number(p?.variants?.[0]?.variantSellingPrice) || 0;

  // discount from backend (looks like percent in your sample)
  const getDiscountPercent = (p) => {
    const d = Number(p?.variants?.[0]?.variantDiscount) || 0;

    // If your API sometimes sends 0-1 (like 0.2), convert to percent
    if (d > 0 && d <= 1) return Math.round(d * 100);

    return Math.round(d);
  };

  // safer: if discount not present, calculate it from MRP vs Selling
  const getComputedDiscountPercent = (p) => {
    const mrp = getMrp(p);
    const selling = getSelling(p);
    if (mrp > 0 && selling > 0 && mrp > selling) {
      return Math.round(((mrp - selling) / mrp) * 100);
    }
    return 0;
  };

  const formatINR = (n) => (n ? `₹${Number(n).toLocaleString("en-IN")}` : "--");

  return (
    <div className="lg:px-20 md:px-[60px] px-4 py-[23px] bg-white shadow-sm rounded-lg">
      {/*Header */}
      <div className=" mx-auto text-start mb-12">
        <div className="flex justify-center mb-4">
          {/* <div className="w-12 h-1 bg-[#eaa100]"></div> */}
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-800 mb-3">
          {/* Illuminate Your{" "} */}
          <span className="font-serif  text-[#000000]">Festive Occasions</span>
        </h1>
        {/* <p className="text-gray-600 md:text-lg text-sm">
          Elegant golden accents for your festive celebrations
        </p> */}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 relative">
        {/* {diwaliProducts?.slice(0, visibleCount).map((p) => {
          const key = p._id || p.uuid || p.SKU;

          const mrp = getMrp(p);
          const selling = getSelling(p);

          // prefer backend discount, fallback to computed
          const discountPercent =
            getDiscountPercent(p) || getComputedDiscountPercent(p);

          // average rating from reviews array
          const ratingAvg =
            Array.isArray(p?.reviews) && p.reviews.length
              ? p.reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
                p.reviews.length
              : 0;

          return (
            <Link
              key={key}
              className="bg-white rounded-lg border  p-2 group block transition-shadow duration-300"
              to={getProductHref(p)}
            >
              <div className="relative w-full overflow-hidden rounded-md group">
                <img
                  className="w-full aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
                  src={getImage(p)}
                  alt={p.productTittle || p.category || "Product"}
                  loading="lazy"
                />

                {ratingAvg > 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-400 shadow-md text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                    <span>{ratingAvg.toFixed(1)} ★</span>
                  </div>
                )}
                {/* <div className="group-hover:bg-amber-600 duration-300 text-black absolute top-0 h-full shadow-none group-hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)] text-4xl flex items-center justify-center md:font-bold font-medium py-0.5 px-8 w-full text-center transition-all ease-in-out">
                  <span className="translate-y-40 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in z-50">
                    {discountPercent}% Off
                  </span>
                </div>

                <div className="bg-transparent absolute bottom-[2px] right-[2px] h-full text-4xl flex items-center justify-center text-gray-100 md:font-bold font-medium py-0.5 px-8 w-full text-center transition-all ease-in-out shadow-[inset_0_-4px_10px_rgba(0,0,0,0.4)]">
                  <span className="translate-y-40 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in z-50">
                    {discountPercent}% Off
                  </span>
                </div> */}

                {/* <div className="bg-[#eaa600] shadow-[0_4px_10px_rgba(0,0,0,0.4)] text-xs lg:text-sm text-gray-100 md:font-bold font-medium py-0.5 px-8 absolute top-4 -left-8 md:top-4 md:-left-8 -rotate-[44deg] w-max text-center transition-all ease-in-out">
                  {discountPercent}% Off
                </div> */}
              {/* </div>

              <div className="mt-3">
                <h3 className="lg:text-xl md:text-base text-sm text-center font-serif text-gray-800 font-normal line-clamp-1 mb-2">
                  {p.productTittle}
                </h3>

                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-gray-900 font-medium">
                    {formatINR(selling || mrp)}
                  </span>

                  {discountPercent > 0 && (
                    <span className="text-[#168408] text-xs">
                      {discountPercent}% Off
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start">
                  {mrp > 0 && (
                    <span className="text-gray-400 text-xs line-through font-light">
                      {formatINR(mrp)}
                    </span>
                  )}
                  <div className="flex gap-1 ">
                    <Stack spacing={1}>
                      <Rating
                        name="size-small"
                        value={ratingAvg || 0}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                    </Stack>
                    <span className="text-[12px] text-[#686868]">
                      ({Array.isArray(p?.reviews) ? p.reviews.length : 0})
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })} */} 
      </div>
    </div>
  );
};

export default DiwaliProducts;
