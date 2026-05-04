import React, { useEffect, useState } from "react";
import PriceDetails from "../components/PriceDetails";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import paytm from "../assets/paytm.svg";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyState from "../components/EmptyState";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { placeOrder } from "../redux/cart/orderSlice";
import { clearCart, resetBuyNow } from "../redux/cart/cartSlice";
import { Banknote, ChevronLeft, PackageCheck, Truck } from "lucide-react";
import Razorpay from "../assets/IconsUsed/Razorpay.png";
import { loadRazorpay } from "../hooks/loadRazorpay";

function Payment() {
  const {
    cartItems = [],
    totalPrice,
    totalItems,
    totalDiscount,
    buyNowMode,
  } = useSelector((s) => s.cart || {});

  // const selectedAddress = useSelector((s) => s.address.selectedAddress);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("upi");
  const [showStripe, setShowStripe] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  // add by aman
  const location = useLocation();
  const selectedAddress =
    location.state?.selectedAddress ||
    useSelector((s) => s.address.selectedAddress);

  const [checkoutSummary, setCheckoutSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [appliedPoints, setAppliedPoints] = useState(0);
  // reword points and config from api
  const [availablePoints, setAvailablePoints] = useState(0);
  const [rewardConfig, setRewardConfig] = useState(null);

  // summery api call to get the latest pricing details based on selected address and applied points. This is called on initial load and also whenever user applies reward points to get updated summary with discounts and taxes.
  const fetchCheckoutSummary = async (points = 0) => {
    try {
      if (!selectedAddress) return;

      setSummaryLoading(true);

      const res = await axiosInstance.post("/order/checkout-summary", {
        shippingAddress: selectedAddress,
        appliedPoints: points,
      });
      setCheckoutSummary(res.data?.data || null);
    } catch (error) {
      console.error("Checkout summary error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load checkout summary",
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAddress) {
      fetchCheckoutSummary(appliedPoints);
    }
  }, [selectedAddress]);

  console.log(checkoutSummary);

  // points
  const fetchAvailablePoints = async () => {
    try {
      const res = await axiosInstance.get("/order/available-points");

      setAvailablePoints(res.data?.data?.availablePoints || 0);
      setRewardConfig(res.data?.data?.reward || null);
    } catch (error) {
      console.error("Points fetch error:", error);
    }
  };

  useEffect(() => {
    fetchAvailablePoints();
  }, []);

  // handleApplyPoints is called from PriceDetails when user applies reward points. It updates the appliedPoints state and refetches the checkout summary with the new points value to get updated pricing details.
  const handleApplyPoints = async (points) => {
    setAppliedPoints(points);
    await fetchCheckoutSummary(points);
  };

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
      price: item.basePrice ?? item.price ?? 0,
      img: item.image || "/default.jpg",
    }));

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
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

  useEffect(() => {
    if (selected === "card") {
      axios
        .post("http://localhost:5000/create-payment-intent", {
          amount: Math.round(totalPrice),
        })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => console.log(err));
    }
  }, [selected, totalPrice]);

  // Auto open Stripe as soon as clientSecret is ready
  // useEffect(() => {
  //   if (selected === "card" && clientSecret) {
  //     setShowStripe(true);
  //   }
  // }, [clientSecret, selected]);

  const processOrder = (orderDetails) => {
    dispatch(placeOrder(orderDetails));
    dispatch(clearCart());

    if (buyNowMode) dispatch(resetBuyNow());

    toast.success("Order placed successfully!");
    navigate("/confirm-order", { state: orderDetails });
  };

  // handleRazorpayPayment test mode

  const handleRazorpayPayment = async (orderDetails) => {
    try {
      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const { data } = await axiosInstance.post("/order", {
        paymentMethod: "razorpay",
        shippingAddress: selectedAddress,
        appliedPoints: appliedPoints || 0,
      });

      const razorpayOrder = data?.data?.razorpay;

      if (!razorpayOrder?.rzOrderId) {
        toast.error("Failed to create Razorpay order");
        return;
      }

      const options = {
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Happy Art Supplies",
        description: "Order Payment",
        order_id: razorpayOrder.rzOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await axiosInstance.post(
              "/order/verify-payment",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            );

            // console.log("verifyRes:", verifyRes.data);

            if (verifyRes.data.success) {
              const confirmedOrder = verifyRes.data.data;
              processOrder({
                ...confirmedOrder,
                backendOrderId: data?.data?.orderId,
                paymentStatus: "Paid",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error(error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: selectedAddress?.fullName || "",
          email: selectedAddress?.email || "",
          contact: selectedAddress?.phone || "",
        },
        theme: {
          color: "#1C3753",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Razorpay payment error:", error);
      toast.error(
        error?.response?.data?.message || "Unable to start Razorpay payment",
      );
    }
  };

  const handlePlaceOrder = async () => {
    const orderDetails = handlePayment();
    if (!orderDetails) return;

    await handleRazorpayPayment(orderDetails);
  };

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

  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] px-0 lg:py-4 bg-gray-50 mt-24">
        <div className="flex flex-col lg:flex-row justify-between md:gap-6">
          <div className="p-4 md:p-6 md:shadow-sm bg-white md:rounded-md w-full lg:w-2/3">
            <div className="text-lg sm:text-xl flex gap-2 items-center font-light text-gray-800 mb-2">
              <Link to="/bag">
                <ChevronLeft className="w-8 h-8" />
              </Link>
              <span className="text-[#1800AC] font-marcellus">
                Payment Options
              </span>
            </div>

            {selectedAddress ? (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-800">
                  {selectedAddress.fullName}{" "}
                  {selectedAddress.addressType && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-md border-[#1C3753] border">
                      {selectedAddress.addressType}
                    </span>
                  )}
                </p>
                <p className="text-gray-600 text-sm">{selectedAddress.email}</p>
                <p className="text-gray-600">
                  {selectedAddress.address},{selectedAddress.country},{" "}
                  {selectedAddress.street}, {selectedAddress.city},{" "}
                  {selectedAddress.state} - {selectedAddress.pinCode}
                </p>
                <button
                  onClick={() => navigate("/checkout/delivery")}
                  className="mt-3 text-sm text-[#006EE1] hover:underline"
                >
                  Change Address
                </button>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                <p>No delivery address selected.</p>
                <button
                  onClick={() => navigate("/checkout/delivery")}
                  className="mt-2 px-4 py-2 bg-[#0C0057] text-white rounded-md text-sm"
                >
                  Add Address
                </button>
              </div>
            )}

            <div className="w-full bg-white rounded-lg flex flex-col gap-4 mt-6">
              {[
                {
                  key: "Razorpay",
                  label: "Razorpay",
                  icon: Razorpay,
                  type: "image",
                },
                // {
                //   key: "cod",
                //   label: "Pay on Delivery",
                //   icon: Banknote,
                //   type: "component",
                // },
              ].map((option) => {
                const Icon = option.icon;

                return (
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
                      />
                    </span>

                    <span className="flex items-center justify-center w-6 h-6">
                      {option.type === "image" ? (
                        <img
                          src={option.icon}
                          alt={option.label}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <Icon className="w-6 h-6 text-gray-700" />
                      )}
                    </span>

                    <p className="text-gray-700">{option.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          
          <PriceDetails
            totalItems={cartItems?.length || totalItems}
            sellingPrice={checkoutSummary?.mrpTotal}
            totalPrice={checkoutSummary?.total || 0}
            totalDiscount={checkoutSummary?.totalDiscount || 0}
            totalGST={checkoutSummary?.totalGST || 0}
            product={cartItems}
            step="payment"
            // handlePlaceOrder={handleRazorpayPayment}
            handlePlaceOrder={handlePlaceOrder}
            buyNowMode={buyNowMode}
            deliveryCharge={checkoutSummary?.shippingCharge || 0}
            PlatformFee={checkoutSummary?.platformFee || 0}
            // reword points data from api to match PriceDetails props
            availablePoints={availablePoints}
            rewardConfig={rewardConfig}
            onApplyPoints={handleApplyPoints}
            appliedPoints={checkoutSummary?.discount || 0}
            showPlaceOrder={selected === "Razorpay"}
            selected={selected}
          />
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Payment;
