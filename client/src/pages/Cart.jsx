import { ChevronLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import PriceDetails from "../components/PriceDetails";
import DeliveryDetailsDialog from "../components/DeliveryDetailsDialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} from "../redux/cart/cartSlice";
import { Link } from "react-router-dom";
import Footer from "../sections/Footer";
import Navbar from "../components/Navbar";
import { addToWishlist } from "../redux/cart/wishlistSlice";
import { formatPrice, getPrices } from "../utils/homePageUtils";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import { twMerge } from "tailwind-merge";
import Ratings from "../components/Ratings";
import axiosInstance from "../api/axiosInstance";

function Cart() {
  const [cart, setCart] = useState(null);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { cartItems, totalPrice, totalItems, totalDiscount } = useSelector(
    (s) => s.cart,
  );

  const dispatch = useDispatch();
  const closeDialog = () => setOpen(false);

  const moveToWishlist = (item) => {
    dispatch(addToWishlist(item));
    dispatch(removeFromCart(item));
  };

  // detect out of stock
  const hasOutOfStock = cart?.items?.some(
    (item) => !item.stockQuantity || item.quantity > item.stockQuantity,
  );

  const fetchCartItem = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      await setCart(res.data?.data);
      console.log(res);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCartItem();
  }, []);

  const handleClearCart = async () => {
    try {
      axiosInstance.delete("/cart/clear-cart"); // or your API route

      setCart({
        items: [],
        totalQuantity: 0,
        grandTotal: 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQty = async (itemId, action) => {
    try {
      const res = await axiosInstance.patch("/cart/update-item", {
        itemId,
        action,
      });

      setCart(res.data.data); // update UI with fresh cart
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] md:py-4 bg-gray-50 mt-24">
        <div className="flex flex-col lg:flex-row justify-between lg:gap-6 font-inter">
          {/* Main Cart Content */}
          <div className={`w-full ${totalItems > 0 ? "lg:w-2/3" : "w-full "}`}>
            {/* Cart Items Section */}
            <div className=" bg-white md:rounded-lg shadow-sm">
              <div className="p-4 md:p-6 flex items-center justify-between border-b border-gray-200">
                <div className="text-xl font-medium flex items-center gap-2 text-gray-800">
                  <Link to="/home">
                    {" "}
                    <ChevronLeft className="w-7 h-7" />
                  </Link>{" "}
                  <span className="font-marcellus text-[#1800AC]">
                    Shopping Cart ({cart?.totalQuantity || 0})
                  </span>
                </div>
                {cart?.items?.length > 1 && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 text-sm font-medium transition-colors rounded-md"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {!cart || cart.items.length === 0 ? (
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
                    {cart?.items?.map((item) => {
                      const base = Number(item.mrp);
                      const effective = Number(item.sellingPrice);
                      const isOutOfStock = item.variantAvailableStock <= 0;

                      return (
                        <div
                          key={item._id}
                          className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-row md:gap-6 gap-4 ">
                            {/* Image + Qty */}
                            <div className="flex flex-col  items-center gap-2">
                              <Link
                                className="sm:w-36 sm:h-36 w-20 h-20 rounded-md overflow-hidden border border-gray-200"
                                to={`/product/${item.uuid}`}
                              >
                                <img
                                  className="sm:w-36 sm:h-36 w-20 h-20 object-contain"
                                  src={item?.image?.url}
                                  alt={item.productTitle}
                                />
                              </Link>
                            </div>

                            {/* Details */}
                            <div className="flex-grow">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <h3 className="md:text-lg text-sm font-medium text-[#1C1C1C] line-clamp-2">
                                    {item.productTitle} soon
                                  </h3>

                                  {/* <div className="flex flex-col text-sm">
                                    <div className="text-[#686868]">
                                      Color:{" "}
                                      <span className="text-black">
                                        {item?.selectedOptions?.color || "N/A"}
                                      </span>
                                    </div>
                                    <div className="text-[#686868]">
                                      Size:{" "}
                                      <span className="text-black">
                                        {item?.selectedOptions?.dimension ||
                                          "N/A"}
                                      </span>
                                    </div>
                                  </div> */}

                                  {/* <div className=" border-gray-200 pb-2 flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                      <span className="text-2xl font-semibold text-gray-900">
                                        {avgRating ?? "—"}
                                      </span>
                                      <span className="text-gray-500 text-sm">
                                        /5
                                      </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <Ratings
                                        size={20}

                                      />
                                      <span className="text-sm text-gray-500">
                                        <span>Based on </span>
                                      
                                      </span>
                                    </div>
                                  </div> */}

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
                                <span className="text-[#686868] md:text-sm text-xs line-through">
                                  {formatPrice(base)}
                                </span>
                                {/* <span className="text-green-600 md:text-sm text-sm ">
                                 
                                  {(
                                    ( item.basePrice - item.discountPercent) /
                                   
                                    (item.basePrice) *100
                                  ).toFixed(2)} Off
                                </span> */}
                                <span className="text-green-600 text-sm">
                                  {Math.round(
                                    ((item.mrp - item.discount) / item.mrp) *
                                      100,
                                  )}
                                  % Off
                                </span>
                              </div>

                              {/* <div
                                className={twMerge(
                                  "md:w-4 w-3 md:h-4 h-3 ring-2 ring-[#BEBEBE] ring-offset-2 ml-1 my-2 rounded-full transition-all duration-150 ease-in-out",
                                  colorMap[item.selectedOptions?.color] ||
                                    "bg-gray-200",
                                )}
                              /> */}

                              <div className="mt-2 text-xs text-gray-500 mb-4">
                                inclusive of all taxes
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-4">
                                  {/* Qty Controls */}

                                  <div className="flex items-center gap-2">
                                    {item.variantAttributes?.weight ? (
                                      <div className="flex w-[106px] items-center justify-center px-2 border border-[#B6AAFF]  py-1 rounded-lg">
                                        <span className="text-[#1800AC]">
                                          {item.variantAttributes?.weight}
                                        </span>
                                      </div>
                                    ) : (
                                      "N/A"
                                    )}
                                    {item.variantColor ? (
                                      <div className="flex w-[106px] items-center justify-center px-2 border border-[#B6AAFF]  py-1 rounded-lg">
                                        <span className="text-[#1800AC]">
                                          {item?.variantColor}
                                        </span>
                                      </div>
                                    ) : (
                                      "N/A"
                                    )}

                                    {item.variantName ? (
                                      <div className="flex w-[106px] items-center justify-center px-2 border border-[#B6AAFF]  py-1 rounded-lg">
                                        <span className="text-[#1800AC]">
                                          {item.variantName}
                                        </span>
                                      </div>
                                    ) : (
                                      "N/A"
                                    )}
                                  </div>
                                  <div className="flex w-[106px] items-center justify-between px-2 border-[#E8E8E8] ring-1 ring-[#E8E8E8] p-1 rounded-md transition-all ease-in">
                                    <button
                                      onClick={() =>
                                        handleUpdateQty(item._id, "dec")
                                      }
                                      className="w-4 h-4 flex items-center justify-center rounded-lg transition-colors"
                                    >
                                      {item.quantity === 1 ? (
                                       <Minus />
                                      ) : (
                                        <Minus />
                                      )}
                                    </button>
                                    <span className="w-6 text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleUpdateQty(item._id, "inc")
                                      }
                                      className="w-4 h-4 flex items-center justify-center rounded-lg"
                                    >
                                      <Plus></Plus>
                                    </button>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex md:gap-4 gap-2 font-medium">
                                  <button
                                    className="text-sm text-[#0C0057] cursor-pointer md:px-1 px-1.5 md:py-1 py-0.5"
                                    onClick={() =>
                                      dispatch(removeFromCart(item))
                                    }
                                  >
                                    Remove
                                  </button>
                                  <div>|</div>

                                  <div
                                    className="text-sm cursor-pointer rounded-full  text-[#0C0057]  md:px-1 px-1 md:py-1 py-0.5"
                                    onClick={() => moveToWishlist(item)}
                                  >
                                    Save for later
                                  </div>
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

          {/* 
           Section */}
          {cart?.totalQuantity > 0 && (
            <PriceDetails
              totalItems={cart?.totalQuantity}
              totalDiscount={totalDiscount}
              totalPrice={cart?.grandTotal}
              product={cart?.items}
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
              onConfirm={async () => {
                await handleClearCart();
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
