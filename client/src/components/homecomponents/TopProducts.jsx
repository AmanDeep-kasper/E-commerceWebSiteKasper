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
import { Link, useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FaBagShopping } from "react-icons/fa6";
import {useDispatch} from "react-redux";
import { addToCart, decreaseQty, increaseQty } from "../../redux/cart/cartSlice";
import { LuMinus, LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";

function TopProducts() {
  const dispatch = useDispatch();
  const [visibleCount, setVisibleCount] = useState(4);
     const [collections, setCollections] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
  const [topproduct, setTopProduct] = useState([]);
  const [addedItems, setAddedItems] = useState({});

  const MIN_PRODUCTS = 4; // Minimum products to show
  const MAX_PRODUCTS = 5; // Maximum products to show
  const MAX_COLLECTIONS = 4;

    // Fetch collection products
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                setLoading(true);
                // Use the public endpoint for users
                const response = await axiosInstance.get(`/collection/get-all-collections`);
                console.log("Collections response:", response.data);
                
                let collectionsData = [];
                if (response.data?.success && response.data?.data?.collections) {
                    collectionsData = response.data.data.collections;
                } else if (Array.isArray(response.data)) {
                    collectionsData = response.data;
                } else if (response.data?.collections) {
                    collectionsData = response.data.collections;
                }

                // filter: only active collections with at least Min products 
                const validCollections = collectionsData.filter(c => c.isActive  === true && c.products?.length >= MIN_PRODUCTS).slice(0, MAX_COLLECTIONS);
                setCollections(validCollections);
            } catch (error) {
                console.error("Error fetching collections:", error);
                toast.error("Failed to load products");
                setCollections([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCollections();
    }, []);

     // Calculate average rating for each product
    // const productsWithRating = useMemo(() => {
    //     return (products || []).map((item) => {
    //         const avgRating = item.reviews && item.reviews.length > 0
    //             ? item.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / item.reviews.length
    //             : 0;
    //         return { ...item, avgRating };
    //     });
    // }, [products]);

    // // Responsive grid count
    // useEffect(() => {
    //     const updateCount = () => {
    //         if (window.innerWidth >= 1280) {
    //             setVisibleCount(5);
    //         } else if (window.innerWidth >= 640) {
    //             setVisibleCount(6);
    //         } else {
    //             setVisibleCount(4);
    //         }
    //     };
        
    //     updateCount();
    //     window.addEventListener("resize", updateCount);
    //     return () => window.removeEventListener("resize", updateCount);
    // }, []);

    // Add to cart handler
    const handleAddToCart = (product) => {
        const defaultVariant = product.variants?.[0];
        if (!defaultVariant) {
            toast.error("No variant available");
            return;
        }
        
        dispatch(addToCart({
            uuid: product._id,
            variantId: defaultVariant._id,
            title: product.productTittle,
            basePrice: defaultVariant.variantMrp || 0,
            effectivePrice: defaultVariant.variantSellingPrice || 0,
            discountPercent: defaultVariant.variantDiscount || 0,
            stockQuantity: defaultVariant.variantAvailableStock || 0,
            image: defaultVariant.variantImage?.[0]?.url || "/placeholder.png",
            deliverBy: "7-10 business days",
            selectedOptions: {
                color: defaultVariant.variantColor || "Default",
                dimension: "Standard",
            },
        }));
        
        setAddedItems(prev => ({ ...prev, [product._id]: 1 }));
        toast.success("Added to cart!");
    };

    const increaseQty = (id) => {
        setAddedItems((prev) => ({
            ...prev,
            [id]: (prev[id] || 1) + 1,
        }));
        // Also update Redux cart
        dispatch(increaseQty({ uuid: id }));
    };

    const decreaseQty = (id) => {
        setAddedItems((prev) => {
            const current = prev[id] || 0;
            if (current <= 1) {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            }
            return { ...prev, [id]: current - 1 };
        });
        dispatch(decreaseQty({ uuid: id }));
    };

      // Product Card Component
  const ProductCard = ({ product }) => {
    const defaultVariant = product.variants?.[0];
    const productImage = defaultVariant?.variantImage?.[0]?.url || product.image || "/placeholder.png";
    const mrp = defaultVariant?.variantMrp || 0;
    const sellingPrice = defaultVariant?.variantSellingPrice || 0;
    const discountPercent = mrp > 0 && sellingPrice > 0 
      ? Math.round(((mrp - sellingPrice) / mrp) * 100) 
      : 0;

    return (
      <Link
        key={product._id}
        className="bg-white p-2 group rounded-lg block transition-shadow duration-300 hover:shadow-lg"
        to={`/product/${product.slug || product._id}`}
      >
        <div className="relative w-full overflow-hidden rounded-md">
          <img
            className="w-full aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
            src={productImage}
            alt={product.productTittle}
            loading="lazy"
            onError={(e) => { e.target.src = "/placeholder.png"; }}
          />
          {/* {ratingAvg > 0 && (
            <div className="absolute top-2 right-2 bg-yellow-400 shadow-md text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
              <span>{ratingAvg.toFixed(1)} ★</span>
            </div>
          )} */}
        </div>

        <div className="mt-3">
          <h3 className="text-sm font-serif text-gray-800 font-normal line-clamp-1 mb-2">
            {product.productTittle}
          </h3>

          <div className="flex items-center flex-wrap gap-2">
            <span className="text-gray-900 font-medium">
              ₹{sellingPrice || mrp || "--"}
            </span>
            {mrp > 0 && sellingPrice > 0 && mrp !== sellingPrice && (
              <span className="text-gray-400 text-xs line-through font-light">
                ₹{mrp}
              </span>
            )}
            {discountPercent > 0 && (
              <>
                <div className="border-l border-[#DBDBDB] h-3"></div>
                <span className="text-[#168408] text-xs">
                  {discountPercent}% Off
                </span>
              </>
            )}
          </div>

          <div
            className={`w-full rounded-md flex justify-center items-center gap-4 p-2 mt-2 transition-all duration-300 cursor-pointer ${
              addedItems[product._id]
                ? "bg-white border border-[#252525]"
                : "bg-[#252525] border border-[#252525]"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!addedItems[product._id]) {
                handleAddToCart(product);
              }
            }}
          >
            {addedItems[product._id] > 0 ? (
              <div className="w-full flex items-center justify-between text-black">
                <span
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    decreaseQty(product._id);
                  }}
                >
                  <LuMinus />
                </span>
                <span>{addedItems[product._id]}</span>
                <span
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    increaseQty(product._id);
                  }}
                >
                  <LuPlus />
                </span>
              </div>
            ) : (
              <>
                <span className="text-white text-[12px]">Add To Cart</span>
                <span className="text-white"><FaBagShopping /></span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  };

    // Loading state
    if (loading) {
        return (
            <div className="lg:px-20 md:px-[60px] px-4 py-[23px] bg-white shadow-sm rounded-lg">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C3753] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }
 return (
    <div className="lg:px-20 md:px-[60px] px-4 py-[23px] bg-white shadow-sm rounded-lg">
      {/* Main Header */}
      <div className="flex items-center mb-6">
        <Title className="md:items-start px-2">
          Featured Collection
        </Title>
        <Link
          className="whitespace-nowrap text-[#2C87E2] hover:text-blue-950 px-2 text-sm underline cursor-pointer"
          to="/products/top-products"
        >
          explore more
        </Link>
      </div>

      {/* Loop through each collection */}
      {collections.map((collection) => (
        <div key={collection._id} className="mb-12 last:mb-0">
          {/* Collection Name Header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {collection.collectionName}
            </h2>
            {collection.products?.length > MAX_PRODUCTS && (
              <Link
                className="text-[#2C87E2] hover:text-blue-950 text-sm underline cursor-pointer"
                to={`/collection/${collection._id}/products`}
              >
                View All ({collection.products.length})
              </Link>
            )}
          </div>

          {/* Products Grid - 5 columns for max 5 products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 p-4">
            {collection.products.slice(0, MAX_PRODUCTS).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


export default TopProducts;
