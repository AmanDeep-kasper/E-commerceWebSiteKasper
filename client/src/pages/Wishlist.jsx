import AccountSidebar from "../components/AccountSidebar";
import { useEffect, useState } from "react";
import { Heart, HeartIcon, ShoppingCart } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { useDispatch, useSelector } from "react-redux";
import { clearWishlist, removeFromWishlist } from "../redux/cart/wishlistSlice";
import { addToCart } from "../redux/cart/cartSlice";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/homePageUtils";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import axiosInstance from "../api/axiosInstance";
import { setCartFromAPI } from "../redux/cart/cartSlice";
import { setWishlistFromAPI } from "../redux/cart/wishlistSlice";
import { toast } from "react-toastify";

function Wishlist() {
  // const { wishlistItems, totalItems } = useSelector((s) => s.wishlist);
  const [apiWishlist, setApiWishlist] = useState([]);
  const wishlistItems = apiWishlist;
  const totalItems = apiWishlist.length;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const moveToCart = async (item) => {
    try {
      setActionLoadingId(item._id);

      const res = await toast.promise(
        axiosInstance.post("/wishlist/move-to-cart", {
          itemId: item._id,
        }),
        {
          pending: "Moving to cart...",
          success: "Item moved to cart",
          error: {
            render({ data }) {
              return data?.response?.data?.message || "Failed to move item";
            },
          },
        },
      );

      dispatch(setCartFromAPI(res.data.data));
      await fetchWishlist();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveWishlistItem = async (item) => {
    try {
      setActionLoadingId(item._id);

      await toast.promise(
        axiosInstance.delete("/wishlist/remove-item", {
          data: {
            productId: item.product || item.productId || item.uuid,
            variantId: item.variantId,
          },
        }),
        {
          pending: "Removing...",
          success: "Removed from wishlist",
          error: {
            render({ data }) {
              return data?.response?.data?.message || "Failed to remove item";
            },
          },
        },
      );

      await fetchWishlist();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Detect out of stock items
  const outOfStockItems = wishlistItems.filter(
    (item) => (item.stockQuantity ?? 0) <= 0,
  );
  const hasOutOfStock = outOfStockItems.length > 0;

  // get wishlist api
  const fetchWishlist = async () => {
    try {
      const res = await axiosInstance.get("/wishlist");

      const items = res.data?.data?.items || [];

      const formatted = items.map((item) => ({
        _id: item._id,
        product: item.product,
        uuid: item.product,
        variantId: item.variantId,
        title: item.productTitle,
        image: item.image?.url,
        variantName: item.variantName,
        variantColor: item.variantColor,
        variantAttributes: item.variantAttributes,
        basePrice: Number(item.variantAttributes?.mrp || 0),
        discountPercent: Number(item.variantAttributes?.discount || 0),
        stockQuantity: Number(item.variantAvailableStock || 0),
      }));

      setApiWishlist(formatted);

      dispatch(
        setWishlistFromAPI({
          items,
        }),
      );
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleClearWishlist = async () => {
    try {
      await toast.promise(axiosInstance.delete("/wishlist/clear-wishlist"), {
        pending: "Clearing wishlist...",
        success: "Wishlist cleared",
        error: {
          render({ data }) {
            return data?.response?.data?.message || "Failed to clear wishlist";
          },
        },
      });

      setApiWishlist([]);
      dispatch(setWishlistFromAPI({ items: [] }));
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  };

  const moveAllToCart = async () => {
    try {
      const res = await axiosInstance.post("/wishlist/move-to-cart-all");

      dispatch(setCartFromAPI(res.data.data));

      setApiWishlist([]);
      dispatch(
        setWishlistFromAPI({
          items: [],
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-5 w-full bg-white rounded-lg shadow-sm md:border border-gray-200">
      <div className="flex flex-row items-center justify-between p-4 md:p-6 border-b border-gray-200">
        <h1 className="text-lg sm:text-xl font-medium text-gray-800 ">
          Wishlist <span>({totalItems})</span>
        </h1>
        {totalItems > 1 && (
          <button
            className="bg-white text-[#1C3753] border border-[#1C3753] hover:border-opacity-0 hover:bg-red-500 hover:text-white px-3 py-1.5 text-sm font-medium transition-colors rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            Clear All
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyState
          heading="Your Wishlist is Empty"
          description="Save your favorite items here to easily find and purchase them
            later."
          icon={Heart}
          ctaLabel="Discover Products"
          ctaLink="/home"
        />
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {wishlistItems?.map((item) => (
              <div
                key={`${item.uuid}-${item.variantId}`}
                className="p-4 md:p-6 hover:bg-gray-50/50 transition-colors "
              >
                <div className="flex gap-4 items-start sm:items-center">
                  <Link
                    to={`/product/${item.uuid}`}
                    className="sm:w-36 sm:h-36 w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-white"
                  >
                    <img
                      className="sm:w-36 sm:h-36 w-20 h-20 object-contain"
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex-grow flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                    <div className="flex-grow">
                      <Link
                        to={`/product/${item.uuid}`}
                        className="md:text-lg text-sm font-medium text-gray-800 line-clamp-2"
                      >
                        {item.title}
                      </Link>

                      <div>
                        <div className="flex items-center gap-1">
                          {item.variantColor ? (
                            <>
                              <p className="text-[#686868]">Color: </p>
                              <span>{item.variantColor}</span>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {item.variantAttributes?.weight ? (
                            <>
                              <p className="text-[#686868]">Weight: </p>
                              <span>{item.variantAttributes.weight}</span>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {item.variantName ? (
                            <>
                              <p className="text-[#686868]">Style Name: </p>
                              <span>{item.variantName}</span>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="md:text-xl text-base font-semibold text-gray-800">
                          {formatPrice(
                            item.basePrice -
                              (item.discountPercent * item.basePrice) / 100,
                          )}
                        </span>
                        {item.discountPercent > 0 && (
                          <>
                            <span className="text-gray-400 md:text-sm text-xs line-through">
                              {formatPrice(item.basePrice)}
                            </span>
                            <span className="text-green-600 md:text-sm text-sm bg-green-50 px-2 py-0.5 rounded">
                              {item.discountPercent}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-sm text-[#686868]">
                        inclusive of all taxes
                      </span>

                      {/* Out of Stock Label */}
                      {(item.stockQuantity ?? 0) <= 0 && (
                        <p className="text-red-600 text-sm mt-1">
                          Currently Out of Stock
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="bg-[#1C3753] md:px-4 px-2 md:py-1 py-0.5 text-sm text-white border border-[#1C3753] transition-colors whitespace-nowrap shadow-sm hover:shadow-sm rounded-lg disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
                        onClick={() => moveToCart(item)}
                        disabled={
                          (item.stockQuantity ?? 0) <= 0 ||
                          actionLoadingId === item._id
                        }
                      >
                        {(item.stockQuantity ?? 0) <= 0
                          ? "Out of Stock"
                          : actionLoadingId === item._id
                            ? "Please wait..."
                            : "Add to Cart"}
                      </button>

                      <button
                        className="md:px-4 px-2 md:py-1 py-0.5 flex items-center text-sm border border-[#1C3753] text-[#1C3753] gap-2 rounded-lg disabled:opacity-60"
                        onClick={() => handleRemoveWishlistItem(item)}
                        disabled={actionLoadingId === item._id}
                        aria-label="Remove item"
                      >
                        {actionLoadingId === item._id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalItems > 1 && (
            <div className="p-4 border-t border-gray-200 justify-self-end relative group w-max">
              <button
                className={`flex w-max gap-2 items-center md:px-4 md:py-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm sm:w-auto text-center ${
                  hasOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#1C3753] text-white hover:bg-black"
                }`}
                disabled={hasOutOfStock}
                onClick={() => !hasOutOfStock && moveAllToCart()}
              >
                <ShoppingCart size={16} />
                Move All to Cart
              </button>

              {/* Tooltip when disabled */}
              {hasOutOfStock && (
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 text-xs text-white bg-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {outOfStockItems.length} item
                  {outOfStockItems.length > 1 ? "s are" : " is"} out of stock.
                  Remove {outOfStockItems.length > 1 ? "them" : "it"} to move
                  all.
                </div>
              )}
            </div>
          )}
        </>
      )}
      {isModalOpen && (
        <div className="absolute">
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={async () => {
              await handleClearWishlist();
              setIsModalOpen(false);
            }}
            title="Clear Wishlist?"
            description="Are you sure you want to remove all items from your wishlist?"
            confirmText="Yes, Clear"
            cancelText="No"
          />
        </div>
      )}
    </div>
  );
}

export default Wishlist;
