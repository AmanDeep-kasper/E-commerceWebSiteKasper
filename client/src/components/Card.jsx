// Card.jsx
import { twMerge } from "tailwind-merge";
import Ratings from "./Ratings";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseQty, increaseQty } from "../redux/cart/cartSlice";
import { useNavigate } from "react-router";
import { Heart, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "../redux/cart/wishlistSlice";
import { formatPrice, getPrices } from "../utils/homePageUtils";

function Card({ cardData = [] }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((c) => c.cart);
  const { wishlistItems } = useSelector((w) => w.wishlist);
  const [loadingIds, setLoadingIds] = useState([]);

  const handleAddToCart = (item, defaultVariant) => {
    // Mark this item as loading
    setLoadingIds((prev) => [...prev, item.uuid]);

    // Prepare variant payload
    const payload = {
      uuid: item.uuid,
      variantId: defaultVariant.variantId,
      title: item.title,
      basePrice: defaultVariant.price,
      discountPercent: item.discountPercent,
      stockQuantity: defaultVariant.stockQuantity,
      image: defaultVariant.images[0],
      deliverBy: item.deliverBy,
      selectedOptions: {
        color: defaultVariant.color,
        type: defaultVariant.type,
        dimension: defaultVariant.dimension,
      },
    };

    // Simulate API delay
    setTimeout(() => {
      dispatch(addToCart(payload)); // ✅ dispatch proper Redux action
      // Remove loading state
      setLoadingIds((prev) => prev.filter((id) => id !== item.uuid));
    }, 200);
  };

  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 grid-cols-2 gap-2 w-full place-content-between overflow-visible">
      {cardData && cardData.length > 0 ? (
        cardData.map((item, index) => {
          const defaultVariant = item.variants?.[0];
          const { base, effective, discountPercent, symbol } = getPrices(item);
          const outOfStock = !item.stockQuantity || item.stockQuantity <= 0;

          const imageUrl = Array.isArray(defaultVariant.images)
            ? defaultVariant.images[0]
            : defaultVariant.image || "/placeholder.png";

          const colorMap = {
            black: "bg-black",
            gold: "bg-[#D49A06]",
            white: "bg-white",
            silver: "bg-[#C0C0C0]",
          };
          // const firstColorClass = item.color?.[0]
          //   ? colorMap[item.color[0]] || "bg-gray-400"
          //   : "";

          const inCart = cartItems.some(
            (i) =>
              i.uuid === item.uuid && i.variantId === defaultVariant.variantId
          );
          const isLoading = loadingIds.includes(item.uuid);
          return (
            <div
              key={item.uuid || index}
              onClick={() =>
                navigate(`/product/${encodeURIComponent(item.uuid)}`)
              }
              className="relative group flex flex-col lg:justify-between items-center bg-white sm:h-[333px] max-sm:h-max overflow-hidden group lg:hover:drop-shadow-md aspect-4/3 object-top cursor-pointer border border-gray-200"
            >
              {/* {cartItems.some(i => i.uuid === item.uuid && i.variantId === item.variantId) && <div className="absolute bg-white/70 px-2 py-1 rounded-full text-xs top-1 left-1 z-20 backdrop-blur-xl h-8 w-8 flex items-center"><ShoppingCart size={16}/></div>} */}

              <button
                className="absolute max-lg:block hidden bg-white shadow-md md:shadow-lg md:bg-white group-hover:block active:scale-110 transition-all ease-in-out duration-300 md:p-2 p-2 rounded-full text-xs top-1 right-1 z-20 cursor-default"
                onClick={(e) => {
                  e.stopPropagation();
                  wishlistItems.some(
                    (i) =>
                      i.uuid === item.uuid &&
                      i.variantId === defaultVariant.variantId
                  )
                    ? dispatch(
                        removeFromWishlist({
                          uuid: item.uuid,
                          variantId: defaultVariant.variantId,
                        })
                      )
                    : dispatch(
                        addToWishlist({
                          uuid: item.uuid,
                          variantId: defaultVariant.variantId,
                          title: item.title,
                          basePrice: defaultVariant.price,
                          discountPercent: item.discountPercent,
                          stockQuantity: defaultVariant.stockQuantity,
                          image: defaultVariant.images[0],
                          deliverBy: item.deliverBy,
                          selectedOptions: {
                            color: defaultVariant.color,
                            type: defaultVariant.type,
                            dimension: defaultVariant.dimension,
                          },
                        })
                      );
                }}
              >
                <Heart
                  className="w-5 h-5  cursor-pointer"
                  fill={
                    wishlistItems.some(
                      (i) =>
                        i.uuid === item.uuid && i.variantId === defaultVariant.variantId
                    )
                      ? "red"
                      : "white"
                  }
                  stroke={
                    wishlistItems.some(
                      (i) =>
                        i.uuid === item.uuid && i.variantId === defaultVariant.variantId
                    )
                      ? "red"
                      : "black"
                  }
                  strokeWidth={1}
                />
              </button>
              <img
                className="lg:min-h-[202px] pt-2 sm:min-w-[207px] sm:min-h-[160px] max-w-40 max-h-40 object-contain lg:group-hover:scale-110 transition duration-300 bg-white"
                src={
                  imageUrl.startsWith("/")
                    ? imageUrl
                    : `http://localhost:5000${imageUrl}`
                }
                alt={item.title || "Product"}
              />

              <div className="p-2 flex flex-col md:gap-[1.5px] w-[100%] gap-[3px] lg:justify-between bg-white min-h-[150px] md:min-h-[178px]  lg:group-hover:-translate-y-12 transition duration-300">
                <p className="text-[14px] w-full line-clamp-1">
                  {item.title || "Untitled Product"}
                </p>

                {item.tags && (
                  <p className="absolute top-2 text-[10px] lg:hidden text-white py-0.5 px-1 bg-[#e99000] rounded-sm w-max">
                    {/* {item.tags.join(", ")} */}
                    {item.tags[0]}
                  </p>
                )}

                {item.reviews && (
                  <div className="lg:hidden flex gap-2 items-center">
                    <Ratings avgRating={item.reviews?.length || 0} />
                    <p className="text-[10px] text-[#383838]">
                      ({item.reviews?.length || "0"})
                    </p>
                  </div>
                )}
                <div>
                  {/* {item.amazonPrice && (
                    <p className="text-[#aa2f1f] text-sm">
                      Amazon Price: {formatPrice(item.amazonPrice)}
                    </p>
                  )} */}
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-gray-900 font-medium tracking-tight">
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

                <p className="text-[10px] lg:hidden ">
                  Delivery in {item.deliverBy || "3-5"} days
                </p>

                {/* {item.color?.[0] && (
                  <div
                    className={twMerge(
                      "w-4 h-4 ring-2 lg:block hidden ring-[#BEBEBE] ring-offset-2 ml-1 rounded-full",
                      firstColorClass
                    )}
                  />
                )} */}

                {/* {item.color?.[0] && (
                  <div className="flex gap-2">
                    {item?.color.map((color) => (
                      <div
                        key={color}
                        className={twMerge(
                          "w-4 h-4 ring-2 lg:block hidden ring-[#BEBEBE] ring-offset-2 ml-1 rounded-full",
                          colorMap[color]
                        )}
                      />
                    ))}
                  </div>
                )} */}
                <div
                  className={twMerge(
                    "w-4 h-4 ring-2 max-xl:hidden ring-[#BEBEBE] ring-offset-2 ml-1 rounded-full",
                    colorMap[`${defaultVariant.color}`]
                  )}
                />

                {/* <div
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigating to details
                    dispatch(addToCart(item));
                  }}
                  className="pt-1 flex w-full justify-center lg:text-[15px] md:text-[12px] text-[10px] text-center whitespace-nowrap"
                >
                  <Button
                    btnClass="flex-1"
                    className="flex-1 py-2 w-full justify-center lg:text-[15px] md:text-[12px] text-[10px] text-center whitespace-nowrap"
                  >
                    Add to Cart
                  </Button>
                </div> */}

                <div className="flex gap-3 justify-center">
                  {outOfStock ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-300 text-xs w-full text-center text-gray-600 rounded-full cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  ) : inCart ? (
                    <div className="flex items-center w-full text-xs justify-between gap-2 px-2 ring-2 ring-[#D49A06]/50 p-1 rounded-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            decreaseQty({
                              uuid: item.uuid,
                              variantId: defaultVariant.variantId,
                            })
                          );
                        }}
                        className="w-6 h-6 flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {cartItems.find(
                          (i) =>
                            i.uuid === item.uuid &&
                            i.variantId === defaultVariant.variantId
                        )?.quantity === 1 ? (
                          <Trash2 size={16} />
                        ) : (
                          <Minus size={16} />
                        )}
                      </button>

                      <span className="w-6 text-center">
                        {cartItems.find(
                          (i) =>
                            i.uuid === item.uuid &&
                            i.variantId === defaultVariant.variantId
                        )?.quantity || 0}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            increaseQty({
                              uuid: item.uuid,
                              variantId: defaultVariant.variantId,
                            })
                          );
                        }}
                        className="w-6 h-6 flex items-center justify-center"
                        disabled={isLoading}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item, defaultVariant);
                      }}
                      disabled={isLoading}
                      className="px-4 py-2 bg-[#ebb100] text-xs w-full text-center text-black rounded-full"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-opacity-30 rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        "Add to Cart"
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
