import React, { useEffect } from "react";
import { CheckCircle, Truck, Clock, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { placeOrder } from "../redux/cart/orderSlice";
import { clearCart } from "../redux/cart/cartSlice";
import { toast } from "react-toastify";
import { formatPrice } from "../utils/homePageUtils";

function ConfirmOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state: orderDetails } = useLocation();
  const { state } = useLocation();

  console.log(state);

  if (!orderDetails) return <>None</>;

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
              <h2 className="font-semibold text-lg mb-1">
                Delivery Information
              </h2>
              {/* <p className="text-gray-600">
                Expected delivery:{" "}
                <span className="font-medium">{orderDetails.deliveryDate}</span>
              </p> */}
              <p className="text-gray-600 mt-2">
                Delivered to:{" "}
                <span className="text-black">{`${orderDetails.shippingAddress?.address}, ${orderDetails.shippingAddress?.city}, ${orderDetails.shippingAddress?.state}, ${orderDetails.shippingAddress?.pinCode}`}</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-[#1C1C1C] mt-1" />
            <div>
              <h2 className="font-semibold text-lg mb-1">Order Status</h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <p className="text-gray-600">Processing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
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
                    <div className="text-sm text-gray-700 font-medium">
                      {item.name}
                    </div>

                    <div className="text-sm text-gray-600">
                      Qty:{" "}
                      <span className="text-black font-medium">
                        {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Color + Size */}
                  <div className="mt-1 text-sm text-gray-600">
                    Color: <span className="text-black">Gold</span> &nbsp; |
                    &nbsp; Size:{" "}
                    <span className="text-black">40X25 Inches</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-lg mb-2">Payment Information</h2>
          <p className="text-gray-600">
            Payment Method::{" "}
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
                <span>{formatPrice(orderDetails.itemsTotal)}</span>
              </div>

              {/* Discounts */}
              <div className="flex justify-between mb-2 text-green-600">
                <span>Discounts:</span>
                <span>- {formatPrice(orderDetails.discount)}</span>
              </div>

              {/* Platform Fee */}
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Platform Fee:</span>
                <span>{formatPrice(orderDetails.platformFee)}</span>
              </div>

              {/* Delivery Charges */}
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Delivery Charges:</span>
                <span>{formatPrice(orderDetails.deliveryFee)}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300 my-3"></div>

              {/* Total Amount */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  Total Amount
                </span>
                <span className="font-bold text-lg text-gray-900">
                  {formatPrice(orderDetails.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-end gap-3">
          <button
            onClick={() => navigate("/")}
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
