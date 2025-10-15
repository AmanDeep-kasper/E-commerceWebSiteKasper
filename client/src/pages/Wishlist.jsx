import AccountSidebar from "../components/AccountSidebar";
import { useState } from "react";
import { Heart, HeartIcon, ShoppingCart } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { useDispatch, useSelector } from "react-redux";
import { clearWishlist, removeFromWishlist } from "../redux/cart/wishlistSlice";
import { addToCart } from "../redux/cart/cartSlice";
import { Link } from "react-router";
import { formatPrice } from "../utils/homePageUtils";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";

function Wishlist() {
  const { wishlistItems, totalItems } = useSelector((s) => s.wishlist);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const moveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item));
  };

  const moveAllToCart = (wishlistItems) => {
    wishlistItems.forEach((item) => {
      dispatch(addToCart(item));
    });
    dispatch(clearWishlist());
  };

  // ✅ Detect out of stock items
  const outOfStockItems = wishlistItems.filter(
    (item) => (item.stockQuantity ?? 0) <= 0
  );
  const hasOutOfStock = outOfStockItems.length > 0;

  return (
    <div className="w-full bg-white rounded-lg shadow-sm md:border border-gray-200">
      <div className="flex flex-row items-center justify-between p-4 md:p-6 border-b border-gray-200">
        <h1 className="text-lg sm:text-xl font-medium text-gray-800 ">
          Wishlist <span>({totalItems})</span>
        </h1>
        {totalItems > 1 && (
          <button
            className="bg-white text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 text-sm font-medium transition-colors rounded-md"
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
          ctaLink="/products"
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
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="md:text-xl text-base font-semibold text-gray-800">
                          {formatPrice(
                            item.basePrice -
                              (item.discountPercent * item.basePrice) / 100
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

                      {/* Out of Stock Label */}
                      {(item.stockQuantity ?? 0) <= 0 && (
                        <p className="text-red-600 text-sm mt-1">
                          Currently Out of Stock
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="bg-[#ebb100] md:px-4 px-2 md:py-1 py-0.5 text-sm border border-[#ebb100] transition-colors whitespace-nowrap shadow-sm hover:shadow-sm rounded-full disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
                        onClick={() => moveToCart(item)}
                        disabled={(item.stockQuantity ?? 0) <= 0}
                      >
                        {(item.stockQuantity ?? 0) <= 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </button>

                      <button
                        className="md:px-4 px-2 md:py-1 py-0.5 flex items-center text-sm border border-gray-400 text-gray-500 gap-2 rounded-full"
                        onClick={() => dispatch(removeFromWishlist(item))}
                        aria-label="Remove item"
                      >
                        Remove
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
                className={`flex w-max gap-2 items-center md:px-8 md:py-3 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm sm:w-auto text-center ${
                  hasOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#212121] text-white hover:bg-black"
                }`}
                disabled={hasOutOfStock}
                onClick={() => !hasOutOfStock && moveAllToCart(wishlistItems)}
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
            onConfirm={() => {
              dispatch(clearWishlist());
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
