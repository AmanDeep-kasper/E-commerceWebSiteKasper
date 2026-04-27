import { useState } from "react";
import AccountSidebar from "../components/AccountSidebar";
import {
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  Headset,
  Mail,
  MessageCircle,
  MessageCircleQuestion,
  Phone,
  Truck,
} from "lucide-react";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";

const steps = [
  { key: "placed", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function OrderTracking() {
  const [active, setActive] = useState(0);
  const { orderId } = useParams();
  const [trackOrder, setTrackOrder] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/order/${orderId}`);
        setOrder(res.data.order);
        setTrackOrder(res.data.order.status);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!trackOrder) return;

    const currentIndex = steps.findIndex(
      (step) => step.key === trackOrder.toLowerCase(),
    );

    if (trackOrder.toLowerCase() === "cancelled") {
      setActive(-1);
      return;
    }

    if (currentIndex === -1) {
      setActive(0);
      return;
    }

    const progress = (currentIndex / (steps.length - 1)) * 100;
    setActive(progress);
  }, [trackOrder]);

  console.log(order);

  useEffect(() => {
    if (trackOrder === "Order Placed") {
      const timer = setTimeout(() => {
        setTrackOrder("Processing");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [trackOrder]);

  // ❗ AFTER all hooks → conditional rendering
  if (!order) {
    return (
      <>
        <Navbar />
        <section className="flex items-center justify-center min-h-[50vh]">
          <h2 className="text-lg sm:text-xl text-red-600 font-semibold h-[80vh]">
            Order not found for ID: {orderId}
          </h2>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] px-4 py-8 bg-white">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="max-lg:hidden">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="w-full mt-14">
            {/* Order Tracking Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 ">
              <h2 className="text-lg flex flex-col space-y-2  sm:text-xl fontd-semibold text-gray-800 mb-6 text-center sm:text-left border-b border-gray-200 pb-4">
                <span className="flex items-center font-semibold gap-2">
                  {" "}
                  <Link to="/accounts/order-history">
                    {" "}
                    <ChevronLeft className="w-6 h-6" />{" "}
                  </Link>{" "}
                  Track Order
                </span>
                <div>
                  <span className="text-sm">
                    {" "}
                    Order placed -{" "}
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                  </span>
                  <span className="text-sm">| </span>
                  <span className="text-sm">{order.orderNumber}</span>
                </div>
              </h2>
              {/* <div className="mb-2">
                <span className="text-sm font-medium">Order Status</span>
              </div> */}

              {/* Progress Tracker */}
              <div className="relative w-full">
                {/* Desktop (horizontal) */}
                <div className="hidden lg:block">
                  {/* Labels */}
                  <div className="flex justify-between mb-4">
                    {steps.map((step, idx) => (
                      <span
                        key={idx}
                        className={`text-sm ${
                          active >= idx * (100 / (steps.length - 1))
                            ? "text-[#0A63E]"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="relative w-full h-2 bg-gray-200 rounded-full">
                    <motion.div
                      initial={false}
                      animate={{ width: `${active}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-2 rounded-full ${
                        active === -1
                          ? "bg-red-500" // cancelled
                          : "bg-gradient-to-r from-[#00A63E] to-[#00A63E]"
                      }`}
                    />
                    {steps.map((_, idx) => {
                      const pos = (idx / (steps.length - 1)) * 100;

                      return (
                        <div
                          key={idx}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                          style={{ left: `${pos}%` }}
                        >
                          <div
                            className={`w-5 h-5 flex items-center justify-center rounded-full ${
                              active === -1
                                ? "bg-red-500"
                                : active >= pos
                                  ? "bg-[#19A971]"
                                  : "bg-gray-300"
                            }`}
                          >
                            <Check size={12} className="text-white" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile (vertical) */}
                <div className="flex flex-col gap-6 lg:hidden relative pl-6">
                  {steps.map((step, idx) => {
                    const progress = (idx / (steps.length - 1)) * 100;

                    return (
                      <div
                        key={step.key}
                        className="relative flex items-center gap-3"
                      >
                        <div
                          className={`w-5 h-5 rounded-full ${
                            active >= progress ? "bg-[#19A971]" : "bg-gray-300"
                          }`}
                        />

                        {idx < steps.length - 1 && (
                          <div
                            className={`absolute left-[9px] top-5 w-[2px] h-10 ${
                              active >= ((idx + 1) / (steps.length - 1)) * 100
                                ? "bg-[#19A971]"
                                : "bg-gray-300"
                            }`}
                          />
                        )}

                        <span
                          className={`text-sm ${
                            active >= progress
                              ? "text-[#19A971]"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Shipping Info */}
              <div className="bg-[#F6F8F9] p-5 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Truck className="text-[#1C3753]" size={18} /> Shipping
                  Information
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Carrier:</p>
                    <p className="font-medium">{order?.tracking?.carrier || "soon available"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Shipping Address</p>
                    <p className="font-medium">
                      {order?.shippingAddress?.address}
                      {order?.shippingAddress?.street},{" "}
                      {order?.shippingAddress?.city},
                      {order?.shippingAddress?.state},
                      {order?.shippingAddress?.pinCode}
                    </p>
                  </div>
                  {/* <div>
                    <p className="text-gray-500">Tracking Number</p>
                    <p className="font-medium">{order.trackingId}</p>
                  </div> */}
                </div>
              </div>

              {/* Delivery Estimate */}
              {/* <div className="bg-[#F6F8F9] p-5 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="text-[#1C3753]" size={18} /> Delivery
                  Estimate
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Estimated Date</p>
                    <p className="font-medium">September 12–14, 2024</p>
                    <p className="font-medium">{order.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Status</p>
                    <p
                      className={`font-medium flex items-center gap-1 ${
                        order.status === "Cancelled" ? "text-red-500" : ""
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#1C3753] animate-pulse"></span>
                      {order.status}
                    </p>
                  </div>
                  <button className="mt-4 w-full flex items-center justify-center py-2 group bg-[#EBB100] hover:bg-[#EBA100] text-white">
                    <MapPin className="mr-2 group-hover:text-white" size={16} />
                    Track Package
                  </button>
                </div>
              </div> */}

              {/* Recent Updates */}
              <div className="bg-[#F6F8F9] p-5 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  Track Order
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    {/* <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#EBB100] mt-1"></div>
                      <div className="w-px h-full bg-gray-300"></div>
                    </div> */}
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Tracking Link:
                      </p>
                      {/* <p className="text-xs text-gray-500">Today, 9:42 AM</p> */}
                      <a
                        href={
                          order.tracking?.trackingUrl ||
                          ""
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs mt-1 text-blue-600"
                      >
                        {order.tracking?.trackingUrl ||
                          "soon available"}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {/* <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#EBB100] mt-1"></div>
                      <div className="w-px h-full bg-gray-300"></div>
                    </div> */}
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Tracking No.:{" "}
                      </p>
                      <p className="text-xs ">
                        {order?.tracking?.trackingNumber || "soon available"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        *Please click this link and paste it in your browser and
                        then paste this tracking number to track your order.
                      </p>
                      {/* <p className="text-xs mt-1 text-gray-600">
                        Dallas, TX distribution center
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="p-6 lg:w-1/2">
                  <h2 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
                    Need Help With Your Order?
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Our customer support team is available 24/7 to assist you
                    with any questions or concerns about your order.
                  </p>

                  <div className="space-y-4">
                    {/* <div className="flex items-start gap-3">
                      <div className="bg-[#EBB100]/10 p-2 rounded-full">
                        <MessageCircle className="text-[#EBB100]" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Live Chat</h3>
                        <p className="text-xs text-gray-500">
                          Get instant help from our support team
                        </p>
                      </div>
                    </div> */}

                    <div className="flex items-start gap-3">
                      <div className="bg-[#F6F8F9]/10 p-2 rounded-full">
                        <Mail className="text-[#1C3753]" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Email Us</h3>
                        <p className="text-xs text-gray-500">
                          happyartsupplies@gmail.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-[#F6F8F9]/10 p-2 rounded-full">
                        <Phone className="text-[#1C3753]" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Call Us</h3>
                        <p className="text-xs text-gray-500">
                          (+91) 98868 94723
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* <button  className="mt-6 flex items-center px-4 justify-center py-2.5 rounded-xl group border border-[#1C3753] text-[#1C3753] hover:bg-[#1C3753] hover:text-white transition-colors">
                    <Headset
                      className="mr-2 group-hover:text-white"
                      size={16}
                    />
                    Contact Support
                  </button> */}
                </div>

                {/* Map */}
                <div className="lg:w-1/2 h-64 lg:h-auto">
                  <iframe
                    className="w-full h-full"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3887.0217826101434!2d77.6578157!3d13.0342848!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae10c942e33ce1%3A0xc15ab53a3914eb10!2sUnited%E2%80%99s%20Crossandra!5e0!3m2!1sen!2sin!4v1777034300221!5m2!1sen!2sin"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ border: 0 }}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </>
  );
}

export default OrderTracking;
