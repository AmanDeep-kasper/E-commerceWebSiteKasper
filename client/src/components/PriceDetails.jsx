import { ArrowRight, BadgeCheck, ChevronDown, Info, ShieldCheck } from "lucide-react";
import { IoCloseCircleOutline } from "react-icons/io5";
import React, { useState } from "react";
import { formatPrice } from "../utils/homePageUtils";
import { Link } from "react-router";
import { motion } from "framer-motion";

function PriceDetails({
  totalItems,
  totalPrice,
  totalDiscount,
  product,
  hasOutOfStock,
  step = "cart",
  canProceed = true,
  handlePlaceOrder,
  buyNowMode,
  goToPayment,
}) {
  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [showPrice, setShowPrice] = useState(false);
  const deliveryLimit = 1000;

  const [showCoupon, setShowCoupon] = useState(false);

  return (
    <div className="w-full lg:w-1/3">
      <div className="bg-white md:rounded-lg shadow-sm p-4 md:p-6 sticky top-20 font-inter">
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-base md:text-lg lg:text-xl font-medium text-gray-800">
              Price Summary
            </h2>
            <button
              onClick={() => setShowPrice(!showPrice)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-expanded={showPrice}
            >
              <ChevronDown
                className={`transform transition-transform duration-300 ${showPrice ? "rotate-180" : "rotate-0"
                  }`}
              />
            </button>
          </div>

          <div className="text-sm sm:text-base">
            {/* Price Breakdown */}
            <motion.div
              initial={false}
              animate={{
                height: showPrice ? "auto" : 0,
                opacity: showPrice ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-4 bg-[#F8F8F8] rounded-lg px-2 py-1">
                {/* Items */}
                <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
                  <span className="text-gray-600 font-medium">
                    Price ({totalItems} {totalItems > 1 ? "items" : "item"})
                  </span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>

                {/* Discount */}
                <div className="flex justify-between">
                  <span className="text-[#00A63E] font-medium">Discount</span>
                  <span className="text-green-600 font-medium">
                    - {formatPrice(totalDiscount)}
                    {/* {console.log(totalDiscount)} */}
                  </span>
                </div>

                {/* Platform Fee */}
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">
                    Platform Fee
                  </span>
                  <span className="font-medium">₹6</span>
                </div>

                {/* Delivery */}
                {/* <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">
                    Delivery Charges
                  </span>
                  <span
                    className={`font-medium ${totalPrice - totalDiscount < deliveryLimit
                      ? "text-gray-800"
                      : "text-green-600"
                      }`}
                  >
                    {totalPrice - totalDiscount < deliveryLimit ? (
                      `₹${deliveryCharge.toFixed(2)}`
                    ) : (
                      <span className="flex items-center gap-1">
                        <BadgeCheck className="w-4 h-4" /> FREE
                      </span>
                    )}
                  </span>
                </div> */}
              </div>
            </motion.div>

            {/* Total Amount */}
            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between text-base sm:text-lg font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>
                {formatPrice(
                  totalPrice -
                  totalDiscount +
                  (totalPrice - totalDiscount < deliveryLimit
                    ? deliveryCharge
                    : 0) +
                  6
                )}
              </span>
            </div>
          </div>

          {/* Savings Info */}
          {/* <div className="mt-6 p-3 bg-[#F8F8F8] rounded-lg flex items-start gap-2">
            <Info className="text-[#1C3753] mt-0.5 flex-shrink-0" size={16} />
            <div>
              <p className="text-[#1C3753] font-medium text-sm sm:text-base">
                You're saving ₹{totalDiscount.toLocaleString("en-IN")} on this
                order!
              </p>
              {totalPrice <= 1000 && (
                <p className="text-green-600 text-xs sm:text-sm mt-1">
                  Free delivery on orders above ₹1000
                </p>
              )}
            </div>
          </div> */}

          {/* <=============------------ Apply Coupon ------------=============> */}
          <div className="flex justify-between items-center mt-5">
            <span className="flex gap-4 items-center"><BadgeCheck />Apply Coupons</span>
            <span className="border border-[#0C0057] px-3 py-2 rounded-md font-medium text-[14px] text-[#0C0057] cursor-pointer" onClick={() => setShowCoupon(!showCoupon)}>
              Apply
            </span>
          </div>

          {/* Payment Security */}
          <div className="mt-2 pt-4 border-t border-gray-200 flex items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-gray-400" size={16} />
              <span>100% secure payments</span>
            </div>
            <div className="my-2">
              {step === "cart" &&
                (hasOutOfStock ? (
                  <p className="text-red-600 text-sm font-medium">
                    Remove or save out-of-stock items to continue checkout
                  </p>
                ) : (
                  <Link
                    to="/checkout/delivery"
                    className="bg-[#1C3753] rounded-lg hover:bg-black text-white md:px-8 md:py-3 px-4 py-2 text-base font-medium transition-colors flex items-center gap-2"
                  >
                    Proceed to Checkout
                  </Link>
                ))}

              {step === "delivery" && canProceed && (
                <button
                  onClick={goToPayment}
                  className="bg-[#1C3753] rounded-lg hover:bg-black text-white md:px-8 md:py-3 px-4 py-2 text-base font-medium transition-colors flex items-center gap-2"
                >
                  Proceed to Checkout
                </button>
              )}

              {step === "payment" && (
                <button
                  onClick={handlePlaceOrder}
                  className="bg-[#1C3753] rounded-lg hover:bg-black text-white md:px-8 md:py-3 px-4 py-2 text-base font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {buyNowMode ? "Buy Now & Pay" : "Place Order"} <ArrowRight size={16}></ArrowRight>
                </button>
              )}
            </div>
          </div>
        </>
      </div>


      {/* <=============------------ Coupon ------------=============> */}

      {showCoupon && (
        <>
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowCard(false);
              }
            }}
          >
            <div
              className="bg-white rounded-xl shadow-lg relative p-4 sm:p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >


              <div className="flex items-center justify-between w-full gap-5">
                <span className="text-[18px] text-[#1c1c1c] font-semibold">
                  Apply Coupon
                </span>
                <button
                  onClick={() => setShowCoupon(!showCoupon)}
                  className="text-xl"
                >
                  <IoCloseCircleOutline size={28} />
                </button>
              </div>

              <div className="mt-4 bg-gradient-to-r from-[#FFFFFF] to-[#B2FF00]/20 p-3 border-b-dashed border-[#727681] rounded-xl">
                <div className="flex justify-between p-2 gap-8 items-center">
                  <span className="text-[#0E101A] text-[16px] font-medium">Earn points on Every 500 Purchase</span>
                  <button className="bg-[#1C3753] text-white px-4 py-2 rounded-md font-medium">Apply</button>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#727681] text-[14px] font-medium">Get points for every ₹500+ purchase.</span>
                  <span className="text-[#727681] text-[14px] font-medium">Reedeem Next Time</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#FFFFFF] to-[#B2FF00]/20 p-3 border-t-dashed border-[#727681] rounded-xl">
              <div className="flex flex-col gap-2">
                <span className="text-[#0E101A] text-[14px] font-medium">• 1 point = ₹50 value during redemption</span>
                <span className="text-[#0E101A] text-[14px] font-medium">• 1 point = Customers can redeem up to 10% of the total invoice valuen</span>
                <span className="text-[#0E101A] text-[14px] font-medium">• 1 point = Minimum invoice value required for redemption: ₹0</span>
              </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PriceDetails;
