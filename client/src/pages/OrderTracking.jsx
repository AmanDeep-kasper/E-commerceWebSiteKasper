import { useState } from "react";
import AccountSidebar from "../components/AccountSidebar";
import {
  Calendar,
  Check,
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
import { useParams } from "react-router";
// import orders from "../data/orders.json";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { useSelector } from "react-redux";

const steps = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

function OrderTracking() {
  const [active, setActive] = useState(0);
  const { orderId } = useParams();
  const orders = useSelector((state) => state.order.list); // 👈 from Redux
  const order = orders?.find((val) => val.orderId.slice(1) == orderId);
  const [trackOrder, setTrackOrder] = useState(order.orderStatus);

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

  useEffect(() => {
    const status = trackOrder.toLowerCase();
    console.log(status);

    if (
      steps[1].replace(/\s/g, "").toLowerCase() === status.replace(/\s/g, "")
    ) {
      setActive(25);
    } else if (
      steps[2].replace(/\s/g, "").toLowerCase() === status.replace(/\s/g, "")
    ) {
      setActive(50);
    } else if (
      steps[3].replace(/\s/g, "").toLowerCase() === status.replace(/\s/g, "")
    ) {
      setActive(75);
    } else if (
      steps[4].replace(/\s/g, "").toLowerCase() === status.replace(/\s/g, "")
    ) {
      setActive(100);
    } else if (
      steps[0].replace(/\s/g, "").toLowerCase() === status.replace(/\s/g, "")
    ) {
      setActive(1);
    } else setActive(0);
  }, [trackOrder]); // ✅ depends on trackOrder

  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] px-4 py-8 bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="max-lg:hidden">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="w-full">
            {/* Order Tracking Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 ">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
                Order {order.orderId} Tracking
              </h2>

              {/* Progress Tracker */}
              <div className="relative w-full">
                {/* Desktop (horizontal) */}
                <div className="hidden lg:block">
                  {/* Labels */}
                  <div className="flex justify-between mb-4">
                    {[
                      "Order Placed",
                      "Processing",
                      "Shipped",
                      "Out for Delivery",
                      "Delivered",
                    ].map((label, idx) => (
                      <span
                        key={idx}
                        className={`text-sm ${
                          active >= idx * 25
                            ? "text-[#19A971]"
                            : "text-gray-400"
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="relative w-full h-2 bg-gray-200 rounded-full">
                    <motion.div
                      initial={false}
                      animate={{ width: `${active}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-2 bg-gradient-to-r from-[#19A971] to-[#2ECC71] rounded-full"
                    />
                    {[0, 25, 50, 75, 100].map((pos) => (
                      <div
                        key={pos}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                        style={{ left: `${pos}%` }}
                      >
                        <div
                          className={`w-5 h-5 flex items-center justify-center rounded-full ${
                            active >= pos ? "bg-[#19A971]" : "bg-gray-300"
                          }`}
                        >
                          <Check size={12} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile (vertical) */}
                <div className="flex flex-col gap-6 lg:hidden relative pl-6">
                  {[
                    "Order Placed",
                    "Processing",
                    "Shipped",
                    "Out for Delivery",
                    "Delivered",
                  ].map((label, idx) => (
                    <div key={idx} className="relative flex items-center gap-3">
                      {/* Circle */}
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded-full z-10 ${
                          active >= idx * 25 ? "bg-[#19A971]" : "bg-gray-300"
                        }`}
                      >
                        <Check size={12} className="text-white" />
                      </div>

                      {/* Line connector */}
                      {idx < 4 && (
                        <div
                          className={`absolute left-[9px] top-5 w-[2px] h-10 ${
                            active >= (idx + 1) * 25
                              ? "bg-[#19A971]"
                              : "bg-gray-300"
                          }`}
                        />
                      )}

                      {/* Label */}
                      <span
                        className={`text-sm ${
                          active >= idx * 25
                            ? "text-[#19A971]"
                            : "text-gray-400"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Shipping Info */}
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Truck className="text-[#EBB100]" size={18} /> Shipping
                  Information
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Carrier</p>
                    <p className="font-medium">FedEx Ground</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Shipping Address</p>
                    <p className="font-medium">
                      {order.deliveryAddress.street},{" "}
                      {order.deliveryAddress.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tracking Number</p>
                    <p className="font-medium">{order.trackingId}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="text-[#EBB100]" size={18} /> Delivery
                  Estimate
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Estimated Date</p>
                    {/* <p className="font-medium">September 12–14, 2024</p> */}
                    <p className="font-medium">{order.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Status</p>
                    <p className="font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                      {order.orderStatus}
                    </p>
                  </div>
                  {/* <button className="mt-4 w-full flex items-center justify-center py-2 group bg-[#EBB100] hover:bg-[#EBA100] text-white">
                    <MapPin className="mr-2 group-hover:text-white" size={16} />
                    Track Package
                  </button> */}
                </div>
              </div>

              {/* Recent Updates */}
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="text-[#EBB100]" size={18} /> Recent Updates
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#EBB100] mt-1"></div>
                      <div className="w-px h-full bg-gray-300"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.orderStatus}</p>
                      {/* <p className="text-xs text-gray-500">Today, 9:42 AM</p> */}
                      <p className="text-xs mt-1 text-gray-600">
                        Your package is on its way to you
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#EBB100] mt-1"></div>
                      <div className="w-px h-full bg-gray-300"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Departed facility</p>
                      <p className="text-xs text-gray-500">
                        Yesterday, 5:18 PM
                      </p>
                      <p className="text-xs mt-1 text-gray-600">
                        Dallas, TX distribution center
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="p-6 lg:w-1/2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Headset className="text-[#EBB100]" size={20} /> Need Help
                    With Your Order?
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Our customer support team is available 24/7 to assist you
                    with any questions or concerns about your order.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#EBB100]/10 p-2 rounded-full">
                        <MessageCircle className="text-[#EBB100]" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Live Chat</h3>
                        <p className="text-xs text-gray-500">
                          Get instant help from our support team
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-[#EBB100]/10 p-2 rounded-full">
                        <Mail className="text-[#EBB100]" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Email Us</h3>
                        <p className="text-xs text-gray-500">
                          support@lasercutmetal.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-[#EBB100]/10 p-2 rounded-full">
                        <Phone className="text-[#EBB100]" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Call Us</h3>
                        <p className="text-xs text-gray-500">
                          +1 (800) 555-1234
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="mt-6 flex items-center px-4 justify-center py-2.5 group border border-[#EBB100] text-[#EBB100] hover:bg-[#EBB100] hover:text-white transition-colors">
                    <MessageCircleQuestion
                      className="mr-2 group-hover:text-white"
                      size={16}
                    />
                    Contact Support
                  </button>
                </div>

                {/* Map */}
                <div className="lg:w-1/2 h-64 lg:h-auto">
                  <iframe
                    className="w-full h-full"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4192.038583228666!2d77.3822129!3d28.5923125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef91f5153683%3A0x5a196bf40461160d!2siThums%2073%2C%20Noida!5e1!3m2!1sen!2sin!4v1748350042204!5m2!1sen!2sin"
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
