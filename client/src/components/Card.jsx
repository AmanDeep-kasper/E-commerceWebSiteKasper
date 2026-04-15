// Card.jsx
import { twMerge } from "tailwind-merge";
import Ratings from "./Ratings";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseQty, increaseQty } from "../redux/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "../redux/cart/wishlistSlice";
import { formatPrice, getPrices } from "../utils/homePageUtils";
import { FaBagShopping } from "react-icons/fa6";

function Card({ cardData = [] }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((c) => c.cart);
  const { wishlistItems } = useSelector((w) => w.wishlist);
  const [loadingIds, setLoadingIds] = useState([]);

  const calcAvgRating = (reviews = []) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;

    const total = reviews.reduce((sum, r) => sum + Number(r?.rating || 0), 0);
    return total / reviews.length;
  };

  //helper function to get product id
  const getProductId = (item) => {
    return item._id || item.uuid || item.id;
  }

  // helper to get product name
  const getProductName = (item) => {
    return item.name || item.productTittle || item.title || "United Product";
  }

  // helper to get product image
  const getProductImage = (item) => {
    if(item.image && item.image.startsWith("http")) {
      return item.image;
    }
    if(item.variants?.[0]?.variantImage?.[0]?.url) {
      return item.variants[0].variantImage[0]?.url;
    }
    return "/placeholder.png";
  }

  // helper to get default variant
  const getDefaultVariant = (item) => {
    if(item.variants && item.variants.length > 0) {
      const selected = item.variants.find((v) => v.isSelected);
      return selected || item.variants[0];
    }
    return null;
  }

  // const handleAddToCart = (item, defaultVariant) => {
  //   // Mark this item as loading
  //   setLoadingIds((prev) => [...prev, item.uuid]);

  //   // Prepare variant payload
  //   const payload = {
  //     uuid: item.uuid,
  //     variantId: defaultVariant.variantId,

  //     // ✅ FIX TITLE
  //     title: item.productTittle || item.title || "Untitled Product",

  //     basePrice: defaultVariant.variantMrp || defaultVariant.price,
  //     effectivePrice:
  //       defaultVariant.variantSellingPrice || defaultVariant.price,

  //     discountPercent:
  //       defaultVariant.variantDiscount || item.discountPercent || 0,

  //     stockQuantity:
  //       defaultVariant.variantAvailableStock ||
  //       defaultVariant.variantQuantity ||
  //       0,

  //     image:
  //       defaultVariant?.variantImage?.[0] ||
  //       defaultVariant?.images?.[0] ||
  //       item?.images?.[0] ||
  //       "/placeholder.png",

  //     deliverBy: item.deliverBy,

  //     // ✅ FIX SELECTED OPTIONS
  //     selectedOptions: {
  //       color: defaultVariant.variantColor || defaultVariant.color || "N/A",

  //       dimension:
  //         `${defaultVariant.variantLength || ""}X${
  //           defaultVariant.variantBreadth || ""
  //         } ${defaultVariant.variantDimensionunit || ""}`.trim() || "N/A",
  //     },
  //   };

  //   // Simulate API delay
  //   setTimeout(() => {
  //     dispatch(addToCart(payload)); // ✅ dispatch proper Redux action
  //     // Remove loading state
  //     setLoadingIds((prev) => prev.filter((id) => id !== item.uuid));
  //   }, 200);
  // };

   const handleAddToCart = (item) => {
    const productId = getProductId(item);
    const defaultVariant = getDefaultVariant(item);
    
    if (!defaultVariant) {
      console.error("No variant available for product:", item);
      return;
    }

    setLoadingIds((prev) => [...prev, productId]);

    const payload = {
      uuid: productId,
      variantId: defaultVariant._id || defaultVariant.variantId,
      title: getProductName(item),
      basePrice: defaultVariant.variantMrp || item.mrp || 0,
      effectivePrice: defaultVariant.variantSellingPrice || item.defaultPrice || 0,
      discountPercent: defaultVariant.variantDiscount || item.discount || 0,
      stockQuantity: defaultVariant.variantAvailableStock || 10,
      image: getProductImage(item),
      deliverBy: item.deliverBy || "7-10 business days",
      selectedOptions: {
        color: defaultVariant.variantColor || "Default",
        dimension: defaultVariant.variantWeight ? 
          `${defaultVariant.variantWeight} ${defaultVariant.variantWeightUnit}` : 
          "Standard",
      },
    };

    setTimeout(() => {
      dispatch(addToCart(payload));
      setLoadingIds((prev) => prev.filter((id) => id !== productId));
    }, 200);
  };


  // const getSafeImage = (variant, product) => {
  //   let img = null;

  //   // 1. Variant-level image
  //   if (variant?.variantImage?.length > 0) {
  //     img = variant.variantImage[0];
  //   }

  //   // 2. Product-level images
  //   if (!img && product?.images?.length > 0) {
  //     img = product.images[0];
  //   }

  //   // 3. Final fallback
  //   return img || "/placeholder.png";
  // };

  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 grid-cols-2 gap-2 w-full place-content-between overflow-visible">
      {cardData && cardData.length > 0 ? (
        cardData.map((item, index) => {
         const productId = getProductId(item);
          const productName = getProductName(item);
          const productImage = getProductImage(item);
          const defaultVariant = getDefaultVariant(item);
          // console.log(defaultVariant)
          // const { base, effective, discountPercent, symbol } = getPrices(item);
          // // console.log(item)
          // const variantStock = defaultVariant?.variantAvailableStock ?? 0;
          // // console.log(variantStock)

          // const outOfStock = variantStock <= 0;

          // // console.log(item);

          // const imageUrl = getSafeImage(defaultVariant, item);

          // const colorMap = {
          //   black: "bg-black",
          //   gold: "bg-[#D49A06]",
          //   white: "bg-white",
          //   silver: "bg-[#C0C0C0]",
          // };
          // // const firstColorClass = item.color?.[0]
          // //   ? colorMap[item.color[0]] || "bg-gray-400"
          // //   : "";

          // const inCart = cartItems.some(
          //   (i) =>
          //     i.uuid === item.uuid && i.variantId === defaultVariant.variantId,
          // );
          // const isLoading = loadingIds.includes(item.uuid);

          const effectivePrice = item.defaultPrice || defaultVariant?.variantSellingPrice || 0;
          const basePrice = item.mrp || defaultVariant?.variantMrp || 0;
          const discountPercent = item.discount || defaultVariant?.variantDiscount || 0;
          
          const variantStock = defaultVariant?.variantAvailableStock ?? 10;
          const outOfStock = variantStock <= 0;
          
          const inCart = cartItems.some(
            (i) => i.uuid === productId && i.variantId === defaultVariant?._id
          );
          const isLoading = loadingIds.includes(productId);
          const inWishlist = wishlistItems.some(
            (i) => i.uuid === productId && i.variantId === defaultVariant?._id
          );


          return (
            <div
              key={productId || index}
              onClick={() => navigate(`/product/${item.slug || productId}`)}

              className="relative group flex flex-col lg:justify-between items-center bg-white rounded-lg sm:h-[333px] lg:h-[333px] max-sm:h-max overflow-hidden group lg:hover:drop-shadow-md aspect-4/3 object-top cursor-pointer border border-gray-200"
            >
              {/* {cartItems.some(i => i.uuid === item.uuid && i.variantId === item.variantId) && <div className="absolute bg-white/70 px-2 py-1 rounded-full text-xs top-1 left-1 z-20 backdrop-blur-xl h-8 w-8 flex items-center"><ShoppingCart size={16}/></div>} */}

              {/* <button
                className="absolute max-lg:block hidden bg-white shadow-md md:shadow-lg md:bg-white group-hover:block active:scale-110 transition-all ease-in-out duration-300 md:p-2 p-2 rounded-full text-xs top-1 right-1 z-20 cursor-default"
                onClick={(e) => {
                  e.stopPropagation();
                  wishlistItems.some(
                    (i) =>
                      i.uuid === item.uuid &&
                      i.variantId === defaultVariant.variantId,
                  )
                    ? dispatch(
                        removeFromWishlist({
                          uuid: item.uuid,
                          variantId: defaultVariant.variantId,
                        }),
                      )
                    : dispatch(
                        addToWishlist({
                          uuid: item.uuid,
                          variantId: defaultVariant.variantId,
                          title: item.title,
                          basePrice: defaultVariant.price,
                          discountPercent: item.discountPercent,
                          stockQuantity: defaultVariant.variantQuantity,
                          image:
                            defaultVariant?.variantImage?.[0] ||
                            item.images?.[0],
                          deliverBy: item.deliverBy,
                          selectedOptions: {
                            color: defaultVariant.color,
                            type: defaultVariant.type,
                            dimension: defaultVariant.dimension,
                          },
                        }),
                      );
                }}
              >
                <Heart
                  className="w-5 h-5  cursor-pointer"
                  fill={
                    wishlistItems.some(
                      (i) =>
                        i.uuid === item.uuid &&
                        i.variantId === defaultVariant.variantId,
                    )
                      ? "red"
                      : "white"
                  }
                  stroke={
                    wishlistItems.some(
                      (i) =>
                        i.uuid === item.uuid &&
                        i.variantId === defaultVariant.variantId,
                    )
                      ? "red"
                      : "black"
                  }
                  strokeWidth={1}
                />
              </button> */}
              <button
                className="absolute max-lg:block hidden bg-white shadow-md md:shadow-lg md:bg-white group-hover:block active:scale-110 transition-all ease-in-out duration-300 md:p-2 p-2 rounded-full text-xs top-1 right-1 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  if (inWishlist) {
                    dispatch(removeFromWishlist({
                      uuid: productId,
                      variantId: defaultVariant?._id,
                    }));
                  } else {
                    dispatch(addToWishlist({
                      uuid: productId,
                      variantId: defaultVariant?._id,
                      title: productName,
                      basePrice: basePrice,
                      discountPercent: discountPercent,
                      stockQuantity: variantStock,
                      image: productImage,
                      deliverBy: item.deliverBy || "7-10 business days",
                      selectedOptions: {
                        color: defaultVariant?.variantColor || "Default",
                        type: defaultVariant?.variantName || "Standard",
                        dimension: defaultVariant?.variantWeight ? 
                          `${defaultVariant.variantWeight} ${defaultVariant.variantWeightUnit}` : 
                          "Standard",
                      },
                    }));
                  }
                }}
              >
                <Heart
                  className="w-5 h-5 cursor-pointer"
                  fill={inWishlist ? "red" : "white"}
                  stroke={inWishlist ? "red" : "black"}
                  strokeWidth={1}
                />
              </button>

              <img
                className="lg:min-h-[202px] pt-2 sm:min-w-[207px] sm:min-h-[160px] max-w-40 max-h-40 object-contain lg:group-hover:scale-110 transition duration-300 bg-white"
                src={productImage}
                alt={productName}
              />

              {/* <div className="p-2 flex flex-col gap-1.5 w-full bg-white min-h-[150px] md:min-h-[173px] lg:justify-between lg:group-hover:-translate-y-12 transition-transform duration-300"> */}
              <div className="p-2 flex flex-col gap-1.5 w-full bg-white min-h-[150px] md:min-h-[113px] lg:justify-between transition-transform duration-300">
                <div className="flex items-center flex-wrap gap-2">
                  <p className="text-sm w-full line-clamp-1 overflow-hidden text-ellipsis">
                    {productName || "Untitled Product"}
                  </p>
                  <span className="text-gray-900 font-medium text-lg tracking-tight">
                    {formatPrice(effectivePrice)}
                  </span>
{basePrice > effectivePrice && (
  <>
                  <span className="text-gray-400 text-xs line-through font-light">
                    {formatPrice(basePrice)}
                  </span>
                  <div className="border-l border-[#DBDBDB] h-3"></div>
                  </>
)}

                  {discountPercent > 0 && (
                    <div>
                      <span className="text-[#168408] text-sm">
                        {Math.round(discountPercent)}% Off
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-center">
                  {outOfStock ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-300 text-xs w-full text-center text-gray-600 rounded-full cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  ) : inCart ? (
                    <div className="flex items-center w-full text-xs justify-between gap-2 px-2 ring-2 ring-[#1C3753]/50 p-1 rounded-md">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            decreaseQty({
                              uuid: productId,
                              variantId: defaultVariant?._id,
                            }),
                          );
                        }}
                        className="w-6 h-6 flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {cartItems.find(
                          (i) =>
                            i.uuid === productId &&
                            i.variantId === defaultVariant?._id,
                        )?.quantity === 1 ? (
                          <Trash2 size={16} />
                        ) : (
                          <Minus size={16} />
                        )}
                      </button>

                      <span className="w-6 text-center">
                        {cartItems.find(
                          (i) =>
                            i.uuid === productId &&
                            i.variantId === defaultVariant?._id,
                        )?.quantity || 0}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            increaseQty({
                              uuid: productId,
                              variantId: defaultVariant?._id,
                            }),
                          );
                        }}
                        className="w-6 h-6 flex items-center justify-center"
                        disabled={
                          isLoading ||
                          cartItems.find(
                            (i) =>
                              i.uuid === productId &&
                              i.variantId === defaultVariant?._id,
                          )?.quantity >= variantStock
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      disabled={isLoading}
                      className="px-4 py-2 bg-[#252525] text-xs w-full text-center rounded text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-opacity-30 rounded-md animate-spin"></div>
                          <span>Adding...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-4">
                          <p>Add to Cart</p>
                          <span className="text-white">
                            <FaBagShopping />
                          </span>
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full text-center">
          No Products Available
        </h1>
      )}
    </div>
  );
}

export default Card;
