import React, { useEffect } from "react";
import { CheckCircle, Truck, Clock, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { placeOrder } from "../redux/cart/orderSlice";
import { clearCart } from "../redux/cart/cartSlice";
import { toast } from "react-toastify";
import { formatPrice } from "../utils/homePageUtils";

function ConfirmOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state: orderDetails } = useLocation();

  if (!orderDetails) return <>None</>;

  return (
    <section className="h-dvh p-4 md:p-8 bg-gray-50">
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
          <p className="text-gray-500">
            Order ID:{" "}
            <span className="font-semibold">{orderDetails.orderId}</span>
          </p>
        </div>

        {/* Delivery Information */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <Truck className="w-6 h-6 text-[#ecc100] mt-1" />
            <div>
              <h2 className="font-semibold text-lg mb-1">
                Delivery Information
              </h2>
              <p className="text-gray-600">
                Expected delivery:{" "}
                <span className="font-medium">{orderDetails.deliveryDate}</span>
              </p>
              <p className="text-gray-600 mt-2">
                Shipping to:{" "}
                {`${orderDetails.deliveryAddress.fullName}, ${orderDetails.deliveryAddress.street}, ${orderDetails.deliveryAddress.city}, ${orderDetails.deliveryAddress.state} - ${orderDetails.deliveryAddress.pincode}`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-amber-500 mt-1" />
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
              <div key={index} className="flex justify-between pb-2">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3">
            <span className="font-semibold">Total Amount</span>
            <span className="font-bold text-lg">
              {formatPrice(orderDetails.totalAmount)}
            </span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-lg mb-2">Payment Information</h2>
          <p className="text-gray-600">
            Method:{" "}
            <span className="font-medium">{orderDetails.paymentMethod}</span>
          </p>
          <p className="text-gray-600">
            Payment Status:{" "}
            <span className="font-medium">{orderDetails.paymentStatus}</span>
          </p>
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
