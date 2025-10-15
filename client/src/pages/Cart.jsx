import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import PriceDetails from "../components/PriceDetails";
import DeliveryDetailsDialog from "../components/DeliveryDetailsDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} from "../redux/cart/cartSlice";
import { Link } from "react-router";
import Footer from "../sections/Footer";
import Navbar from "../components/Navbar";
import { addToWishlist } from "../redux/cart/wishlistSlice";
import { formatPrice, getPrices } from "../utils/homePageUtils";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import { twMerge } from "tailwind-merge";

function Cart() {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { cartItems, totalPrice, totalItems, totalDiscount } = useSelector(
    (s) => s.cart
  );
  const dispatch = useDispatch();
  const closeDialog = () => setOpen(false);

  const moveToWishlist = (item) => {
    dispatch(addToWishlist(item));
    dispatch(removeFromCart(item));
  };

  // detect out of stock
  const hasOutOfStock = cartItems.some(
    (item) => !item.stockQuantity || item.stockQuantity <= 0
  );

  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] md:py-4 bg-gray-50">
        <div className="flex flex-col lg:flex-row justify-between lg:gap-6 font-inter">
          {/* Main Cart Content */}
          <div className={`w-full ${totalItems > 0 ? "lg:w-2/3" : "w-full "}`}>
            {/* Cart Items Section */}
            <div className=" bg-white md:rounded-lg shadow-sm">
              <div className="p-4 md:p-6 flex items-center justify-between border-b border-gray-200">
                <h2 className="text-xl font-medium text-gray-800">
                  Cart ({totalItems})
                </h2>
                {cartItems.length > 1 && (
                  <button
                    // onClick={() => dispatch(clearCart())}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 text-sm font-medium transition-colors rounded-md"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                //   <div className="h-[70vh] flex flex-col justify-center items-center text-center px-4">
                //     {/* Icon Circle */}
                //     <div className="mx-auto md:w-28 md:h-28 w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                //       <ShoppingCart className="md:w-14 md:h-14 w-8 h-8 text-amber-400" />
                //     </div>

                //     {/* Heading */}
                //     <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mb-3">
                //       Your Cart is Empty
                //     </h3>

                //     {/* Subtext */}
                //     <p className="text-sm md:text-base text-gray-500 max-w-sm mb-4 md:mb-8">
                //       Looks like you haven’t added anything yet. Browse our
                //       collection and find something you love.
                //     </p>

                //     {/* CTA Button */}
                //     <Link
                //       to="/products"
                //       className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600
                //  text-gray-900 rounded-full md:px-8 md:py-3 px-4 py-2 text-sm md:text-base font-medium transition-all shadow-md hover:shadow-lg"
                //     >
                //       Continue Shopping
                //     </Link>
                //   </div>
                <EmptyState
                  heading="Your Cart is Empty"
                  description="Looks like you haven’t added anything yet. Browse our
                    collection and find something you love."
                  icon={ShoppingCart}
                  ctaLabel="Continue Shopping"
                  ctaLink="/products"
                />
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {cartItems?.map((item) => {
                      const { base, effective } = getPrices(item);
                      const isOutOfStock = item.stockQuantity <= 0;

                      const colorMap = {
                        black: "bg-black",
                        gold: "bg-[#D49A06]",
                        white: "bg-white",
                        silver: "bg-[#C0C0C0]",
                      };

                      return (
                        <div
                          key={`${item.id}-${item.title}`}
                          className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-row md:gap-6 gap-4 ">
                            {/* Image + Qty */}
                            <div className="flex flex-col items-center gap-2">
                              <Link
                                className="sm:w-36 sm:h-36 w-20 h-20 rounded-md overflow-hidden border border-gray-200"
                                to={`/product/${item.uuid}`}
                              >
                                <img
                                  className="sm:w-36 sm:h-36 w-20 h-20 object-contain"
                                  src={item?.image}
                                  alt={item.title}
                                />
                              </Link>

                              {/* Qty Controls */}
                              <div className="flex items-center justify-between w-full px-2 border-[#D49A06] ring-2 ring-[#D49A06]/50 shadow-md p-1 rounded-full transition-all ease-in">
                                <button
                                  onClick={() => dispatch(decreaseQty(item))}
                                  className="w-4 h-4 flex items-center justify-center rounded-full transition-colors"
                                >
                                  {item.quantity === 1 ? <Trash2 /> : <Minus />}
                                </button>
                                <span className="w-6 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => dispatch(increaseQty(item))}
                                  className="w-4 h-4 flex items-center justify-center rounded-full transition-colors"
                                >
                                  <Plus></Plus>
                                </button>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="flex-grow">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <h3 className="md:text-lg text-sm font-medium text-gray-800 line-clamp-2">
                                    {item.title}
                                  </h3>
                                  {isOutOfStock && (
                                    <p className="text-red-600 text-sm mt-1">
                                      Currently Out of Stock
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Price Section */}
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="md:text-xl text-base font-semibold text-gray-800">
                                  {formatPrice(effective)}
                                </span>
                                <span className="text-gray-400 md:text-sm text-xs line-through">
                                  {formatPrice(base)}
                                </span>
                                <span className="text-green-600 md:text-sm text-sm bg-green-50 px-2 py-0.5 rounded">
                                  Save ₹
                                  {(
                                    (item.discountPercent * item.basePrice) /
                                    100
                                  ).toFixed(2)}
                                </span>
                              </div>

                              <div
                                className={twMerge(
                                  "md:w-4 w-3 md:h-4 h-3 ring-2 ring-[#BEBEBE] ring-offset-2 ml-1 my-2 rounded-full transition-all duration-150 ease-in-out",
                                  colorMap[`${item.selectedOptions.color}`]
                                )}
                              />

                              <div className="mt-2 text-xs text-gray-500">
                                Delivery by{" "}
                                {item.deliverBy < 2
                                  ? "Tomorrow"
                                  : `${item.deliverBy} days`}
                              </div>

                              {/* Actions */}
                              <div className="flex mt-2 md:gap-4 gap-2">
                                <button
                                  className="text-xs bg-gray-50 text-gray-500 cursor-pointer border rounded-full border-gray-400 md:px-4 px-1.5 md:py-1 py-0.5"
                                  onClick={() => dispatch(removeFromCart(item))}
                                >
                                  Remove
                                </button>

                                <div
                                  className="text-xs bg-[#eaa600]/5 cursor-pointer rounded-full border border-[#eaa600] text-[#eaa600] hover:bg-[#eaa60011] md:px-4 px-1.5 md:py-1 py-0.5"
                                  onClick={() => moveToWishlist(item)}
                                >
                                  Save for later
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Checkout Section */}
                </>
              )}
            </div>
          </div>

          {/* Price Summary Section */}
          {totalItems > 0 && (
            <PriceDetails
              totalItems={totalItems}
              totalDiscount={totalDiscount}
              totalPrice={totalPrice}
              product={cartItems}
              step="cart"
              hasOutOfStock={hasOutOfStock}
            />
          )}
        </div>

        {isModalOpen && (
          <div className="absolute">
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => {
                dispatch(clearCart());
                setIsModalOpen(false);
              }}
              title="Clear Cart?"
              description="Are you sure you want to remove all products from your cart?"
              confirmText="Yes, Clear"
              cancelText="No"
            />
          </div>
        )}

        {/* Delivery Address Modal */}
        {open && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
              <DeliveryDetailsDialog onClose={closeDialog} />
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default Cart;
