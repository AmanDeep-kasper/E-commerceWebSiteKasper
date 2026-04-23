import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Title from "../Title";
import { FaBagShopping } from "react-icons/fa6";
import { Heart, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCartFromAPI } from "../../redux/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux/cart/wishlistSlice";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

function LatestProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((s) => s.cart);
  const { wishlistItems } = useSelector((s) => s.wishlist);
  const { isAuthenticated } = useSelector((s) => s.user);
  
  const [latestProduct, setLatestProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  // Sync cart from backend
  const syncCartFromBackend = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      if (res.data?.data) {
        dispatch(setCartFromAPI(res.data.data));
      }
    } catch (err) {
      console.error("Cart sync failed:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      syncCartFromBackend();
    }
  }, [isAuthenticated]);

  // Responsive grid count
  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) {
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

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/product/all");
      const productData = res?.data?.data || res?.data?.products || [];
      setLatestProduct(Array.isArray(productData) ? productData : []);
    } catch (error) {
      console.log(error);
      setLatestProduct([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get latest 6 products
  const latestProducts = [...latestProduct].reverse().slice(0, 6);

  // Add to cart handler
  const handleAddToCart = async (product) => {
    const defaultVariant = product.variants?.[0];
    if (!defaultVariant) {
      toast.error("No variant available");
      return;
    }
    
    const variantId = defaultVariant._id;
    const productId = product._id;

    if (!isAuthenticated) {
      dispatch(addToCart({
        uuid: productId,
        variantId: variantId,
        title: product.name || product.productTittle,
        basePrice: defaultVariant.variantMrp || 0,
        effectivePrice: defaultVariant.variantSellingPrice || 0,
        discountPercent: defaultVariant.variantDiscount || 0,
        stockQuantity: defaultVariant.variantAvailableStock || 0,
        image: defaultVariant.variantImage?.[0]?.url || product.image || "/placeholder.png",
        deliverBy: "7-10 business days",
        selectedOptions: {
          color: defaultVariant.variantColor || "Default",
          dimension: "Standard",
        },
      }));
      toast.success("Added to cart!");
      return;
    }

    try {
      const response = await axiosInstance.post("/cart/add-to-cart", {
        productId: productId,
        variantId: variantId,
        quantity: 1,
      });
      dispatch(setCartFromAPI(response.data.data));
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // Wishlist toggle handler
  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const defaultVariant = product.variants?.[0];
    const variantId = defaultVariant?._id;
    const productId = product._id;
    
    const isInWishlist = wishlistItems.some(
      (i) => String(i.uuid || i.product || i.productId) === String(productId) &&
             String(i.variantId) === String(variantId)
    );

    if (!isAuthenticated) {
      if (isInWishlist) {
        dispatch(removeFromWishlist({ uuid: productId, variantId }));
        toast.success("Removed from wishlist");
      } else {
        dispatch(addToWishlist({
          uuid: productId,
          product: productId,
          productId: productId,
          variantId,
          title: product.name || product.productTittle,
          image: defaultVariant?.variantImage?.[0]?.url || product.image || "/placeholder.png",
          basePrice: Number(defaultVariant?.variantMrp || 0),
          discountPercent: Number(defaultVariant?.variantDiscount || 0),
          stockQuantity: Number(defaultVariant?.variantAvailableStock || 0),
          variantName: defaultVariant?.variantName,
          variantColor: defaultVariant?.variantColor,
          variantAttributes: {
            weight: `${defaultVariant?.variantWeight || ""}${defaultVariant?.variantWeightUnit || ""}`,
            mrp: Number(defaultVariant?.variantMrp || 0),
            sellingPrice: Number(defaultVariant?.variantSellingPrice || 0),
            discount: Number(defaultVariant?.variantDiscount || 0),
          },
        }));
        toast.success("Added to wishlist");
      }
      return;
    }

    try {
      if (isInWishlist) {
        await axiosInstance.delete("/wishlist/remove-item", {
          data: { productId: productId, variantId },
        });
        dispatch(removeFromWishlist({ uuid: productId, variantId }));
        toast.success("Removed from wishlist");
      } else {
        await axiosInstance.post("/wishlist/add-to-wishlist", {
          productId: productId,
          variantId,
        });
        dispatch(addToWishlist({
          uuid: productId,
          product: productId,
          productId: productId,
          variantId,
          title: product.name || product.productTittle,
          image: defaultVariant?.variantImage?.[0]?.url || product.image || "/placeholder.png",
          basePrice: Number(defaultVariant?.variantMrp || 0),
          discountPercent: Number(defaultVariant?.variantDiscount || 0),
          stockQuantity: Number(defaultVariant?.variantAvailableStock || 0),
          variantName: defaultVariant?.variantName,
          variantColor: defaultVariant?.variantColor,
          variantAttributes: {
            weight: `${defaultVariant?.variantWeight || ""}${defaultVariant?.variantWeightUnit || ""}`,
            mrp: Number(defaultVariant?.variantMrp || 0),
            sellingPrice: Number(defaultVariant?.variantSellingPrice || 0),
            discount: Number(defaultVariant?.variantDiscount || 0),
          },
        }));
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // Product Card Component
  const ProductCard = ({ product }) => {
    const defaultVariant = product.variants?.[0];
    const variantId = defaultVariant?._id;
    
    const inCart = cartItems.some(
      (i) => String(i.productId || i.uuid) === String(product._id) &&
              String(i.variantId) === String(variantId)
    );

    const productImage = defaultVariant?.variantImage?.[0]?.url || product.image || "/placeholder.png";
    const mrp = defaultVariant?.variantMrp || product.mrp || 0;
    const sellingPrice = defaultVariant?.variantSellingPrice || product.defaultPrice || 0;
    const discountPercent = mrp > 0 && sellingPrice > 0 && mrp !== sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : product.discount || 0;

    const handleAddToCartClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!inCart) {
        await handleAddToCart(product);
      }
    };

    const handleGoToCart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate("/bag");
    };

    return (
      <div className="bg-white p-2 rounded-lg group block transition-shadow duration-300 hover:shadow-lg">
        <Link to={`/product/${product.slug || product._id}`} onClick={(e) => e.stopPropagation()}>
          <div className="relative w-full overflow-hidden rounded-md">
            <button
              type="button"
              className="absolute top-2 right-2 bg-white shadow-md rounded-full p-1.5 z-10 hover:scale-110 transition-transform"
              onClick={(e) => handleWishlistToggle(e, product)}
            >
              <Heart
                className="w-4 h-4"
                fill={wishlistItems.some(
                  (i) => String(i.uuid || i.product || i.productId) === String(product._id) &&
                         String(i.variantId) === String(variantId)
                ) ? "red" : "white"}
                stroke={wishlistItems.some(
                  (i) => String(i.uuid || i.product || i.productId) === String(product._id) &&
                         String(i.variantId) === String(variantId)
                ) ? "red" : "black"}
                strokeWidth={1.5}
              />
            </button>
            <img
              className="w-full aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
              src={productImage}
              alt={product.name || product.productTittle}
              loading="lazy"
              onError={(e) => { e.target.src = "/placeholder.png"; }}
            />
          </div>

          <div className="mt-3">
            <h3 className="text-sm font-serif text-gray-800 font-normal line-clamp-1 mb-2">
              {product.name || product.productTittle || "Product Name"}
            </h3>

            <div className="flex items-center flex-wrap gap-2">
              <span className="text-gray-900 font-medium">
                ₹{sellingPrice || "--"}
              </span>
              {mrp > 0 && sellingPrice > 0 && mrp !== sellingPrice && (
                <span className="text-gray-400 text-xs line-through font-light">
                  ₹{mrp}
                </span>
              )}
              {discountPercent > 0 && (
                <>
                  <div className="border-l border-[#DBDBDB] h-3"></div>
                  <span className="text-[#35C772] text-xs">
                    {Math.round(discountPercent)}% Off
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Button placed OUTSIDE the Link */}
        <button
          className={`w-full rounded-md flex justify-center items-center gap-4 p-2 mt-2 transition-all duration-300 cursor-pointer ${
            inCart
              ? "bg-white border border-[#252525] text-black"
              : "bg-[#252525] border border-[#252525] text-white"
          }`}
          onClick={inCart ? handleGoToCart : handleAddToCartClick}
        >
          {inCart ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span className="text-[12px]">Go to Cart</span>
            </>
          ) : (
            <>
              <FaBagShopping className="w-3 h-3" />
              <span className="text-[12px]">Add To Cart</span>
            </>
          )}
        </button>
      </div>
    );
  };

  // if (loading) {
  //   return (
  //     <div className="lg:px-20 md:px-[60px] px-4 py-[23px] bg-[#EEFDFF] shadow-sm rounded-lg">
  //       <div className="flex justify-center items-center h-64">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C3753] mx-auto"></div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="lg:px-20 md:px-[60px] px-4 py-[23px] relative bg-[#EEFDFF] shadow-sm rounded-lg">
      <div className="flex items-center">
        <Title className="md:items-start px-2 font-marcellus text-[#1800AC]">
          Best Selling Products
        </Title>
        <Link
          className="whitespace-nowrap text-[#2C87E2] hover:text-blue-950 px-2 text-sm underline cursor-pointer"
          to="/products"
        >
          explore more
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 relative">
        {latestProducts.slice(0, visibleCount).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default LatestProducts;
// import { useEffect, useMemo, useState } from "react";
// // import products from "../../data/products.json";
// import { Link, useNavigate } from "react-router-dom";
// import { useRef } from "react";
// // import { ChevronLeft, ChevronRight } from "lucide-react";
// import Title from "../Title";
// import Ratings from "../Ratings";
// import {
//   getProductUrl,
//   getCardImage,
//   getPrices,
//   formatPrice,
// } from "../../utils/homePageUtils";
// import HomeCard from "../HomeCard";

// import axiosInstance from "../../api/axiosInstance";
// import Rating from "@mui/material/Rating";
// import Stack from "@mui/material/Stack";
// import { getAverageRating } from "../../utils/homePageUtils";

// {
//   /* <=========------- icons ------==========> */
// }
// import { FaBagShopping } from "react-icons/fa6";
// import { LuMinus } from "react-icons/lu";
// import { LuPlus } from "react-icons/lu";
// import { Heart } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// function LatestProducts() {
//   const { slugOrId } = useParams();
//   const [Mainproduct, setMainProduct] = useState(null);
//   const [MainProductloading, setMainProductLoading] = useState(true);

//   const fetchProduct = async () => {
//     try {
//       setLoading(true);

//       const res = await axiosInstance.get(
//         `/product/${slugOrId}`, 
//       );

//       setMainProduct(res.data.data);
//     } catch (error) {
//       console.log("Error:", error);
//       setMainProduct(null);
//     } finally {
//       setMainProductLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (slugOrId) {
//       fetchProduct();
//     }
//   }, [slugOrId]);

//   const ref = useRef(null);
//   const navigate = useNavigate(null);
//   const [visibleCount, setVisibleCount] = useState(4);
//   const [addedItems, setAddedItems] = useState({});
//   const { cartItems } = useSelector((s) => s.cart);
//   const { wishlistItems } = useSelector((s) => s.wishlist);

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

//   const [latestProduct, setlatestProduct] = useState([]);

//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get("/product/all");

//       const productData =
//         res?.data?.products || res?.data?.data || res?.data?.product || [];

//       setlatestProduct(Array.isArray(productData) ? productData : []);
//     } catch (error) {
//       console.log(error);
//       setlatestProduct([]);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const latestProducts = [...latestProduct].reverse().slice(0, 6);

//   function actualPrice(price, discountPercent) {
//     return price - (price * discountPercent) / 100;
//   }
//   function totalRating(ratings) {
//     return (
//       ratings.reduce((total, rating) => total + rating.rating, 0) /
//       ratings.length
//     );
//   }

//   {
//     /* <===========----------- Add to Cart ------------==========>*/
//   }
//   const addToCart = (product) => {
//     setAddedItems((prev) => ({
//       ...prev,
//       [product._id]: 1,
//     }));
//   };

//   const increaseQty = (id) => {
//     setAddedItems((prev) => ({
//       ...prev,
//       [id]: (prev[id] || 1) + 1,
//     }));
//   };

//   const decreaseQty = (id) => {
//     setAddedItems((prev) => {
//       const current = prev[id] || 0;
//       const newQty = current - 1;

//       if (newQty <= 0) {
//         const updated = { ...prev };
//         delete updated[id];
//         return updated;
//       }

//       return {
//         ...prev,
//         [id]: newQty,
//       };
//     });
//   };

//   return (
//     <div className="lg:px-20 md:px-[60px] px-4 py-[23px] relative bg-[#EEFDFF] shadow-sm rounded-lg">
//       <div className="flex items-center">
//         <Title className="md:items-start px-2 font-marcellus text-[#1800AC]">
//           Best Selling Products
//         </Title>
//         <Link
//           className="whitespace-nowrap text-[#2C87E2] hover:text-blue-950 px-2 text-sm underline cursor-pointer"
//           to={`/products`}
//         >
//           explore more
//         </Link>
//       </div>

//       {/* Best Selling Products */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 relative">
//         {latestProducts.slice(0, visibleCount)?.map((p) => {
//           // {console.log(p)}
//           const key = p._id || p.uuid || p.SKU;
//           const v = p?.variants?.[0] || {};
//           const mrp = Number(v?.max || 0);
//           const sell = Number(v?.min || 0);
//           const productLink = p.slug || p._id;

//           // compute % off from MRP and Selling Price
//           const discountPercent =
//             mrp > 0 && sell > 0 && sell < mrp
//               ? Math.round(((mrp - sell) / mrp) * 100)
//               : 0;
//           const ratingAvg = getAverageRating(p.reviews);

//           return (
//             <Link
//               key={p._id}
//               className="bg-white p-2 rounded-lg group/image block transition-shadow duration-300"
//               to={`/product/${productLink}`}
//             >
//               <div className="relative w-full overflow-hidden rounded-md">
//                 <img
//                   className="w-full aspect-square object-contain transition-transform duration-300 group-hover/image:scale-110"
//                   src={p.image && p.image}
//                   alt={p.name || p.slug}
//                   loading="lazy"
//                 />
//                 {/* Wishlist Button */}
//                 <button
//                   className="absolute bg-white shadow-md md:shadow-lg md:bg-white group-hover:block active:scale-110 transition-all ease-in-out duration-300 md:p-1 p-1 rounded-full text-xs top-1 right-1 z-30 cursor-default"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();

//                     const isInWishlist = wishlistItems.some(
//                       (i) =>
//                         i.uuid === product.uuid && i.variantId === variantId,
//                     );

//                     if (isInWishlist) {
//                       dispatch(
//                         removeFromWishlist({ uuid: product.uuid, variantId }),
//                       );
//                     } else {
//                       dispatch(
//                         addToWishlist({
//                           uuid: product.uuid,
//                           variantId,
//                           title: product.title,
//                           basePrice: selectedVariant.price,
//                           stockQuantity: selectedVariant.stockQuantity,
//                           discountPercent: product.discountPercent,
//                           image: product.images,
//                           deliverBy: product.deliverBy,
//                           selectedOptions: {
//                             color: selectedVariant.color,
//                             type: selectedVariant.type,
//                             dimension: selectedVariant.dimension,
//                           },
//                         }),
//                       );
//                     }
//                   }}
//                 >
//                   {/* <Heart
//                     className="w-8 h-8 p-1 cursor-pointer"
//                     fill={
//                       wishlistItems.some(
//                         (i) =>
//                           i.uuid === product.uuid && i.variantId === variantId,
//                       )
//                         ? "red"
//                         : "white"
//                     }
//                     stroke={
//                       wishlistItems.some(
//                         (i) =>
//                           i.uuid === product.uuid && i.variantId === variantId,
//                       )
//                         ? "red"
//                         : "black"
//                     }
//                     strokeWidth={1}
//                   /> */}
//                 </button>

//                 {/* {typeof ratingAvg === "number" && (
//                   <div className="absolute top-2 right-2 bg-yellow-400 shadow-md text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
//                     <span>{Number(ratingAvg).toFixed(1)} ★</span>
//                   </div>
//                 )} */}
//               </div>

//               <div className="mt-3">
//                 <h3 className="text-sm font-serif text-gray-800 font-normal line-clamp-1 mb-2">
//                   {p.name || p.slug || "Product Name"}
//                 </h3>

//                 <div className="flex items-center flex-wrap gap-2">
//                   <span className="text-gray-900 font-medium">
//                     ₹{p.defaultPrice || "--"}
//                   </span>

//                   {/* {mrp > 0 && discountPercent > 0 && ( */}
//                   <span className="text-gray-400 text-xs line-through font-light">
//                     ₹{p.mrp}
//                   </span>
//                   {/* )} */}
//                   <div className="border-l border-[#DBDBDB] h-3"></div>
//                   {p.discount > 0 && (
//                     <>
//                       <span className="text-[#35C772] text-xs">
//                         {Math.round(p.discount)}% Off
//                       </span>
//                     </>
//                   )}
//                 </div>
//                 <div className="flex flex-col items-start">
//                   {/* <===========----------- Add to Cart ------------==========>*/}
//                   <div
//                     className={`w-full rounded-md flex justify-center items-center gap-4 p-2 mt-2 transition-all duration-300 ${
//                       addedItems[p._id]
//                         ? "bg-white border border-[#252525]"
//                         : "bg-[#252525] border border-[#252525]"
//                     }`}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();

//                       if (!addedItems[p._id]) {
//                         addToCart(p);
//                       }
//                     }}
//                   >
//                     {addedItems[p._id] > 0 ? (
//                       <div className="w-full flex items-center justify-between text-black">
//                         {/* MINUS */}
//                         <span
//                           className="cursor-pointer"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             decreaseQty(p._id);
//                           }}
//                         >
//                           <LuMinus />
//                         </span>

//                         {/* COUNT */}
//                         <span>{addedItems[p._id]}</span>

//                         {/* PLUS */}
//                         <span
//                           className="cursor-pointer"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             increaseQty(p._id);
//                           }}
//                         >
//                           <LuPlus />
//                         </span>
//                       </div>
//                     ) : (
//                       <>
//                         <span className="text-white text-[12px]">
//                           Add To Cart
//                         </span>
//                         <span className="text-white">
//                           <FaBagShopping />
//                         </span>
//                       </>
//                     )}
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

// export default LatestProducts;
