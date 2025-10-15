import React, { useEffect, useState } from "react";
import PriceDetails from "../components/PriceDetails";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import upi from "../assets/upi.png";
import googlePay from "../assets/googlePay.svg";
import phonePe from "../assets/phonepe.svg";
import paytm from "../assets/paytm.svg";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import EmptyState from "../components/EmptyState";

// 👉 import cart actions
import { placeOrder } from "../redux/cart/orderSlice";
import { clearCart, resetBuyNow } from "../redux/cart/cartSlice";
import { PackageCheck, Truck } from "lucide-react";

function Payment() {
  const {
    cartItems = [],
    totalPrice,
    totalItems,
    totalDiscount,
    buyNowMode,
  } = useSelector((s) => s.cart || {});

  const selectedAddress = useSelector((s) => s.address.selectedAddress);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("upi");

  function generateOrderId() {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `#ORD-${datePart}-${randomPart}`;
  }

  const handlePayment = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address first");
      return null;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("No items found in cart to place order");
      return null;
    }

    const orderId = generateOrderId();
    const orderDate = new Date().toISOString();
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const items = cartItems.map((item) => ({
      productId: item.id || item.uuid,
      name: item.title || "Untitled Product",
      quantity: item.quantity || 1,
      price: item.basePrice ?? item.price ?? 0, // ✅ safe fallback
      img: item.image || "/default.jpg",
    }));

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const userId = "USR-1001"; // TODO: fetch from user slice

    return {
      orderId,
      userId,
      orderDate,
      items,
      totalAmount: total,
      paymentMethod: selected,
      paymentStatus: selected === "cod" ? "Pending" : "Paid",
      deliveryAddress: selectedAddress,
      deliveryDate: deliveryDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      orderStatus: "Processing",
      trackingId: `TRK${Math.random().toString().slice(2, 12)}IN`,
    };
  };

  const handlePlaceOrder = () => {
    const orderDetails = handlePayment();
    if (!orderDetails) return;

    // Save order
    dispatch(placeOrder(orderDetails));

    // Clear cart + reset BuyNow
    dispatch(clearCart());
    if (buyNowMode) dispatch(resetBuyNow());

    toast.success("Order placed successfully!");

    // Navigate to confirmation
    navigate("/confirm-order", { state: orderDetails });
  };
  // useEffect(() => {
  //   if (cartItems.length === 0) {
  //     navigate("/bag", { replace: true });
  //   } else if (!selectedAddress) {
  //     navigate("/checkout/delivery", { replace: true });
  //   }
  // }, [cartItems, selectedAddress, navigate]);

  // ✅ If no cart items, show empty message
  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <EmptyState
          heading="No Items for Checkout"
          description="Looks like your cart is empty. Add items to your cart to proceed to
            checkout."
          icon={Truck}
          ctaLabel="Continue Shopping"
          ctaLink="/products"
        />

        <Footer />
      </>
    );
  }

  // ✅ Main return
  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] px-0 lg:py-4 bg-gray-50">
        <div className="flex flex-col lg:flex-row justify-between md:gap-6">
          {/* Delivery Address Section */}
          <div className="p-4 md:p-6 md:shadow-sm bg-white md:rounded-md w-full lg:w-2/3">
            <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>

            {selectedAddress ? (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-800">
                  {selectedAddress.fullName}
                </p>
                <p className="text-gray-600 text-sm">{selectedAddress.email}</p>
                <p className="text-gray-600 text-sm">
                  {selectedAddress.street}, {selectedAddress.city},{" "}
                  {selectedAddress.state} - {selectedAddress.pincode}
                </p>
                <button
                  onClick={() => navigate("/checkout/delivery")}
                  className="mt-3 text-sm text-amber-600 hover:underline"
                >
                  Change Address
                </button>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                <p>No delivery address selected.</p>
                <button
                  onClick={() => navigate("/checkout/delivery")}
                  className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 text-sm"
                >
                  Add Address
                </button>
              </div>
            )}

            {/* Left side - Payment Methods */}
            <div className="w-full bg-white rounded-lg flex flex-col gap-4 mt-6">
              {/* UPI Option */}
              <div
                onClick={() => setSelected("upi")}
                className={`p-5 flex gap-4 items-start border-2 rounded-lg cursor-pointer transition-colors ${
                  selected === "upi"
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-gray-200 hover:border-blue-500/70 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`min-w-5 min-h-5 ${
                    selected === "upi" ? "border-blue-500" : "border-gray-300"
                  } border-2 !rounded-full mt-1 bg-white flex items-center justify-center`}
                >
                  <span
                    className={`!w-3 !h-3 rounded-full ${
                      selected === "upi" ? "bg-blue-500" : "bg-transparent"
                    }`}
                  ></span>
                </span>
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex gap-3 items-center">
                    <img className="w-auto h-6" src={upi} alt="UPI Logo" />
                    <span className="font-semibold text-gray-800">
                      UPI Payment
                    </span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <img className="w-6 h-6" src={googlePay} alt="Google Pay" />
                    <img className="w-6 h-6" src={phonePe} alt="PhonePe" />
                    <img className="w-6 h-6" src={paytm} alt="Paytm" />
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g. name@upi)"
                      className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                      disabled={selected !== "upi"}
                    />
                  </div>
                </div>
              </div>

              {/* Other Payment Options */}
              {[
                { key: "card", label: "Credit/Debit/ATM Card", icon: "💳" },
                { key: "netbanking", label: "Net Banking", icon: "🏦" },
                { key: "emi", label: "EMI (Easy Installments)", icon: "🔢" },
                { key: "cod", label: "Cash On Delivery (COD)", icon: "📦" },
              ].map((option) => (
                <div
                  key={option.key}
                  onClick={() => setSelected(option.key)}
                  className={`p-4 flex gap-4 items-center border-2 rounded-lg cursor-pointer transition-colors ${
                    selected === option.key
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-gray-200 hover:border-blue-500/70 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                      selected === option.key
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full ${
                        selected === option.key
                          ? "bg-blue-500"
                          : "bg-transparent"
                      }`}
                    ></span>
                  </span>
                  <span className="text-lg">{option.icon}</span>
                  <p className="text-gray-700">{option.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Price Details */}
          <PriceDetails
            totalItems={totalItems}
            totalDiscount={totalDiscount}
            totalPrice={totalPrice}
            product={cartItems}
            step="payment"
            handlePlaceOrder={handlePlaceOrder}
            buyNowMode={buyNowMode}
          />
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Payment;
