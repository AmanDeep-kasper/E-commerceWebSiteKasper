// import Title from "../Title";
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import Rating from "@mui/material/Rating";
// import Stack from "@mui/material/Stack";
// import {
//   getProductUrl,
//   getCardImage,
//   getPrices,
//   formatPrice,
// } from "../../utils/homePageUtils";
// import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
// import axiosInstance from "../../api/axiosInstance";

// function TopProducts() {
//   const navigate = useNavigate();
//   const [visibleCount, setVisibleCount] = useState(4); // default = phone
//   const topproduct = useSelector((state) => state.products.products);

//   useEffect(() => {
//     const fetchTopproduct = async () => {
//       try {
//         const res = await axiosInstance.get("/products/all");
//         // console.log("TopProduct:", res.data);
//         setTopProduct(res.data);
//       } catch (error) {
//         console.log("ERROR:", error);
//       }
//     };
//     fetchTopproduct();
//   }, []);

//   const topProducts = topproduct
//     .map((item) => {
//       const avgRating =
//         item.reviews && item.reviews.length > 0
//           ? item.reviews.reduce((sum, r) => sum + r.rating, 0) /
//             item.reviews.length
//           : 0;

//       return { ...item, avgRating }; // Add avgRating to product
//     })
//     .filter((item) => item.avgRating >= 4) // Only products with 4⭐ or more
//     .sort((a, b) => b.avgRating - a.avgRating); // Sort by highest avg rating

//   useEffect(() => {
//     const updateCount = () => {
//       if (window.innerWidth >= 1024) {
//         setVisibleCount(5); // Desktop
//       } else if (window.innerWidth >= 640) {
//         setVisibleCount(6); // Tablet
//       } else {
//         setVisibleCount(4); // Phone
//       }
//     };

//     updateCount(); // Run on mount
//     window.addEventListener("resize", updateCount);

//     return () => window.removeEventListener("resize", updateCount);
//   }, []);

//   return (
//     <div className="px-2 bg-white shadow-sm rounded-lg">
//       <div className="flex items-center">
//         <Title className="md:items-start px-2">Featured Collection</Title>
//         <Link
//           className="whitespace-nowrap text-[#2C87E2] hover:text-blue-950 px-2 text-sm underline cursor-pointer"
//           to={`/products/top-products`}
//         >
//           explore more
//         </Link>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 relative p-4">
//         {topProducts?.slice(0, visibleCount).map((p) => {
//           const key = p.id || p.uuid || p.SKU;
//           // const { base, effective, discountPercent, symbol } = getPrices(p);
//           // const ratingAvg = p?.avgRating;

//           const ratingAvg = p?.avgRating;

//           const v = p?.variants?.[0];
//           const mrp = Number(v?.variantMrp || 0);
//           const sp = Number(v?.variantSellingPrice || 0);

//           // discount from prices (recommended)
//           const discountPercent =
//             mrp > 0 && sp > 0 ? Math.round(((mrp - sp) / mrp) * 100) : 0;

//           // fallback: if backend sends discount explicitly in %
//           const apiDiscount =
//             v?.variantDiscountUnit === "%"
//               ? Number(v?.variantDiscount || 0)
//               : 0;

//           const finalDiscountPercent = discountPercent || apiDiscount;

//           // pick effective/base prices for UI
//           const effective = sp || mrp || 0;
//           const base = mrp || 0;

//           return (
//             <Link
//               key={key}
//               className="bg-white p-2 group border rounded-lg block transition-shadow duration-300"
//               // to={`/product/${p.uuid}`}
//               to={`/product/${p._id}`}
//             >
//               <div className="relative w-full overflow-hidden rounded-md">
//                 <img
//                   className="w-full aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
//                   // src={getCardImage(p)}
//                   src={
//                     p?.variants?.[0]?.variantImage?.[0] ||
//                     p?.images?.[0] ||
//                     "/fallback.png"
//                   }
//                   alt={p.productTittle}
//                   loading="lazy"
//                 />

//                 {ratingAvg > 0 && (
//                   <div className="absolute top-2 right-2 bg-yellow-400 shadow-md text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
//                     <span>{ratingAvg.toFixed(1)} ★</span>
//                   </div>
//                 )}
//               </div>

//               <div className="mt-3">
//                 <h3 className="text-sm font-serif text-gray-800 font-normal line-clamp-1 mb-2">
//                   {p.productTittle}
//                 </h3>

//                 <div className="flex items-center flex-wrap gap-2">
//                   <span className="text-gray-900 font-medium">
//                     {/* {formatPrice(effective)} */}₹{effective || "--"}
//                   </span>

//                   {finalDiscountPercent > 0 && (
//                     <span className="text-[#168408] text-xs">
//                       {finalDiscountPercent}% Off
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex flex-col items-start">
//                   {base > 0 && effective > 0 && base !== effective && (
//                     <span className="text-gray-400 text-xs line-through font-light">
//                       ₹{base}
//                     </span>
//                   )}

//                   <div className="flex gap-1 ">
//                     <Stack spacing={1}>
//                       {/* <Rating name="size-small" defaultValue={2} size="small" /> */}
//                       <Rating name="size-small" value={ratingAvg} readOnly precision={0.5} size="small" />
//                     </Stack>
//                    <span className="text-[12px] text-[#686868]">({p?.reviews?.length || 0})</span>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default TopProducts;

//////////////////////////
import Title from "../Title";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FaBagShopping } from "react-icons/fa6";
import { addToCart } from "../../redux/cart/cartSlice";

function TopProducts() {
  const [visibleCount, setVisibleCount] = useState(4);
  const [topproduct, setTopProduct] = useState([]);
  const [addedItems, setAddedItems] = useState({});

  // useEffect(() => {
  //   const fetchTopproduct = async () => {
  //     try {
  //       const res = await axiosInstance.get("/products/all");
  //       // console.log("API response:", res.data);

  //       // supports both array and object response
  //       if (Array.isArray(res.data)) {
  //         setTopProduct(res.data);
  //       } else if (Array.isArray(res.data?.products)) {
  //         setTopProduct(res.data.products);
  //       } else {
  //         setTopProduct([]);
  //       }
  //     } catch (error) {
  //       console.log("ERROR:", error);
  //       setTopProduct([]);
  //     }
  //   };

  //   fetchTopproduct();
  // }, []);

  const topProducts = useMemo(() => {
    return (
      (topproduct || [])
        .map((item) => {
          const avgRating =
            item.reviews && item.reviews.length > 0
              ? item.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                item.reviews.length
              : 0;

          return { ...item, avgRating };
        })
        // remove this filter if you want products to show even without reviews
        // .filter((item) => item.avgRating >= 4)
        .sort((a, b) => b.avgRating - a.avgRating)
    );
  }, [topproduct]);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1280) {
        setVisibleCount(5);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(6);
      } else {
        setVisibleCount(4);
      }
    };

    updateCount();
    window.addEventListener("resize", updateCount);

    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return (
    <div className="lg:px-20 md:px-[60px] px-4 py-[23px]  bg-white shadow-sm rounded-lg">
      <div className="flex items-center">
        <Title className="md:items-start px-2">Featured Collection</Title>
        <Link
          className="whitespace-nowrap text-[#2C87E2] hover:text-blue-950 px-2 text-sm underline cursor-pointer"
          to="/products/top-products"
          // to="/products"
        >
          explore more
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 relative p-4">
        {topProducts?.length > 0 ? (
          topProducts.slice(0, visibleCount).map((p) => {
            const key = p._id || p.id || p.uuid || p.SKU;
            const ratingAvg = p?.avgRating || 0;

            const v = p?.variants?.[0];
            const mrp = Number(v?.variantMrp || 0);
            const sp = Number(v?.variantSellingPrice || 0);

            const discountPercent =
              mrp > 0 && sp > 0 ? Math.round(((mrp - sp) / mrp) * 100) : 0;

            const apiDiscount =
              v?.variantDiscountUnit === "%"
                ? Number(v?.variantDiscount || 0)
                : 0;

            const finalDiscountPercent = discountPercent || apiDiscount;
            const effective = sp || mrp || 0;
            const base = mrp || 0;

            return (
              <Link
                key={key}
                className="bg-white p-2 group  rounded-lg block transition-shadow duration-300"
                to={`/product/${p._id}`}
              >
                <div className="relative w-full overflow-hidden rounded-md">
                  <img
                    className="w-full aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
                    src={
                      p?.variants?.[0]?.variantImage?.[0] ||
                      p?.images?.[0] ||
                      "/fallback.png"
                    }
                    alt={p.productTittle}
                    loading="lazy"
                  />

                  {ratingAvg > 0 && (
                    <div className="absolute top-2 right-2 bg-yellow-400 shadow-md text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                      <span>{ratingAvg.toFixed(1)} ★</span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-serif text-gray-800 font-normal line-clamp-1 mb-2">
                    {p.productTittle}
                  </h3>

                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-gray-900 font-medium">
                      ₹{effective || "--"}
                    </span>
                    {base > 0 && effective > 0 && base !== effective && (
                      <span className="text-gray-400 text-xs line-through font-light">
                        ₹{base}
                      </span>
                    )}
                    <div className="border-l border-[#DBDBDB] h-3"></div>
                    {finalDiscountPercent > 0 && (
                      <span className="text-[#168408] text-xs ">
                        {finalDiscountPercent}% Off
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-start">
                    {/* <div className="flex gap-1">
                      <Stack spacing={1}>
                        <Rating
                          name="size-small"
                          value={ratingAvg}
                          readOnly
                          precision={0.5}
                          size="small"
                        />
                      </Stack>
                      <span className="text-[12px] text-[#686868]">
                        ({p?.reviews?.length || 0})
                      </span>
                    </div> */}
                  </div>
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
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}

export default TopProducts;
