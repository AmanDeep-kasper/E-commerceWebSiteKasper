import React, { useEffect, useState } from "react";
import { CheckCircle, Truck, Clock, ShoppingBag, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { placeOrder } from "../redux/cart/orderSlice";
import { clearCart } from "../redux/cart/cartSlice";
import { toast } from "react-toastify";
import { formatPrice } from "../utils/homePageUtils";

function ConfirmOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const orderDetails = location.state;
  const state = location.state;

  useEffect(() => {
    if (!orderDetails) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 700); // smooth UX delay

    return () => clearTimeout(timer);
  }, [orderDetails]);

  console.log(state);

  if (loading) {
    return (
      <section className="p-4 md:p-8 bg-gray-50 animate-pulse">
        <div className="bg-white rounded-lg p-6 max-w-5xl m-auto">
          {/* Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-6 w-1/3 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>

          {/* Address */}
          <div className="border p-4 rounded-lg mb-6">
            <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>

          {/* Items */}
          <div className="border p-4 rounded-lg mb-6 space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Box */}
          <div className="border p-4 rounded-lg">
            <div className="h-4 w-1/2 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className=" p-4 md:p-8 bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 max-w-5xl m-auto">
        {/* Success Confirmation */}
        <div className="flex flex-col items-center text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been placed and is being
            processed.
          </p>
          {state?.paymentIntent && (
            <p style={{ marginTop: "20px" }}>
              Payment Reference: {state.paymentIntent}
            </p>
          )}
          <p className="text-gray-500">
            Order ID:{" "}
            <span className="font-semibold">{orderDetails.orderId}</span>
          </p>
        </div>

        {/* Delivery Information */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <Truck className="w-6 h-6 text-[#1C1C1C] mt-1" />
            <div>
              <h2 className="font-medium text-lg mb-1">Delivery Information</h2>
              {/* <p className="text-gray-600">
                Expected delivery:{" "}
                <span className="font-medium">{orderDetails.deliveryDate}</span>
              </p> */}
              <p className="text-gray-600 mt-2">
                Delivered to:{" "}
                <span className="text-black">{`${
                  orderDetails.shippingAddress?.fullName
                } • (+91) ${orderDetails.shippingAddress?.phone}`}</span>
                <br />
                <span>{`${orderDetails.shippingAddress?.address}, ${orderDetails.shippingAddress?.city}, ${orderDetails.shippingAddress?.state}, ${orderDetails.shippingAddress?.pinCode}`}</span>
              </p>
            </div>
          </div>

          {/* <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-[#1C1C1C] mt-1" />
            <div>
              <h2 className="font-semibold text-lg mb-1">Order Status</h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <p className="text-gray-600">Processing</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Order Summary */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Order Summary
          </h2>
          <div className="space-y-3 mb-4">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex items-start gap-4 py-3">
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border bg-gray-50">
                  <img
                    src={item.image.url}
                    alt={item.image.altText || item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  {/* Name + Quantity Row */}
                  <div className="flex items-start justify-between">
                    <div className="text-sm text-[#1C1C1C] font-medium">
                      {item.productTitle}
                    </div>
                  </div>

                  {/* Color + Size */}
                  <div className="mt-1 flex flex-col text-sm text-gray-600">
                    <div>
                      Color:{" "}
                      <span className="text-black">{item.variantColor}</span>
                    </div>
                    <div>
                      Style Name:{" "}
                      <span className="text-black">{item.variantName}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Quantity:{" "}
                      <span className="text-black font-medium">
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="font-medium text-lg mb-2 flex items-center gap-2">
            {" "}
            <Wallet className="w-5 h-5" />
            Payment Information
          </h2>
          <p className="text-gray-600">
            Payment Method:{" "}
            <span className="font-medium text-[#1C1C1C]">
              {orderDetails.paymentMethod}
            </span>
          </p>
          {/* <p className="text-gray-600">
            Payment Status:{" "}
            <span className="font-medium">{orderDetails.paymentStatus}</span>
          </p> */}

          <div className="flex items-center justify-end">
            <div className="bg-gray-100 rounded-xl p-5 w-full max-w-sm">
              {/* Items */}
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Items:</span>
                <span>{formatPrice(orderDetails?.orderSummary?.mrpTotal)}</span>
              </div>

              {/* Discounts */}
              <div className="flex justify-between mb-2 text-green-600">
                <span>Discounts:</span>
                <span>
                  - {formatPrice(orderDetails?.orderSummary?.totalDiscount)}
                </span>
              </div>

              {/* Platform Fee */}
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Platform Fee:</span>
                <span>
                  {formatPrice(orderDetails?.orderSummary?.platformFee)}
                </span>
              </div>

              {/* Delivery Charges */}
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Delivery Charges:</span>
                <span>
                  {formatPrice(orderDetails?.orderSummary?.shippingCharge)}
                </span>
              </div>
              {orderDetails?.orderSummary?.discount > 0 && (
                <div className="flex justify-between mb-3 text-green-600">
                  <span>Applied Points:</span>
                  <span>
                    -{formatPrice(orderDetails?.orderSummary?.discount)}
                  </span>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-300 my-3"></div>

              {/* Total Amount */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  Total Amount
                </span>
                <span className="font-bold text-lg text-gray-900">
                  {formatPrice(orderDetails?.orderSummary?.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-end gap-3">
          <button
            onClick={() => navigate("/home")}
            className="w-full sm:w-auto md:px-8 md:py-3 px-4 py-2 text-sm md:text-base border border-[#212121] rounded-full"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/accounts/order-history")}
            className="w-full sm:w-auto md:px-8 md:py-3 px-4 py-2 text-sm md:text-base bg-[#212121] text-white rounded-full"
          >
            View Orders
          </button>
        </div>
      </div>
    </section>
  );
}

export default ConfirmOrder;
