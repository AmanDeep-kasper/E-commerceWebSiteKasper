import AccountSidebar from "../components/AccountSidebar";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buyNow } from "../redux/cart/cartSlice";
import OrderFilter from "../components/OrderFilter";
import { ListFilter, Package } from "lucide-react";
import EmptyState from "../components/EmptyState";
import axiosInstance from "../api/axiosInstance";

function OrderHistory() {
  const orders = useSelector((s) => s.order.list); //  from Redux
  const [param, setParam] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [order, setOrder] = useState([]);
  const [status, setStatus] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      let filtered = [...order];

      if (status.trim()) {
        filtered = filtered.filter((o) =>
          o.orderStatus.toLowerCase().includes(status.toLowerCase()),
        );
      }

      if (time) {
        const now = new Date();

        if (time === "last30Days") {
          filtered = filtered.filter((o) => {
            const orderDate = new Date(o.orderDate);
            const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
            return diffDays <= 30;
          });
        }
      }

      if (param.trim()) {
        filtered = filtered.filter((o) =>
          o.items.some((item) =>
            item.name.toLowerCase().includes(param.toLowerCase()),
          ),
        );
      }

      setOrder(filtered);
    }, 300);

    return () => clearTimeout(handler);
  }, [param, status, time]);

  // fetch the latest orders on component mount
  const handleOrder = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/order");
      // console.log("fetchOrders response:", res.data);
      setOrder(res.data.orders.reverse());
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleOrder();
  }, []);

  console.log(order);

  return (
    <div className="w-full mt-5">
      <div className="md:mb-6 relative flex flex-row justify-between items-center border border-gray-200 bg-white md:rounded-lg p-3 gap-3 sm:gap-4">
        <div>
          <p className="text-lg font-semibold">Your Orders</p>
          <span className="text-sm text-[#686868]">Manage your Orders</span>
        </div>
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center w-fit sm:w-auto px-3 py-2 bg-gray-50 border rounded-md focus-within:ring-2 focus-within:ring-[#212121] transition-all">
            <Search className="text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your orders..."
              className="outline-none bg-transparent w-fit ml-2 text-gray-700 placeholder-[#686868] text-xs sm:text-sm"
              value={param}
              onChange={(e) => setParam(e.target.value)}
            />
          </div>

          {/* Filter Button - Desktop */}
          <div>
            <div className="flex items-center gap-2 justify-end w-full">
              <button
                className="flex items-center justify-center py-2 px-5 text-xs sm:text-sm bg-[#1800AC] rounded-full text-white"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <ListFilter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>

            {isFilterOpen && (
              <div className="absolute top-16 z-30 right-0 w-64 max-w-[90vw]">
                <OrderFilter
                  setStatus={setStatus}
                  status={status}
                  setTime={setTime}
                  time={time}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Cards */}
      <div className="flex flex-col gap-6 rounded-md">
        {order.length === 0 ? (
          <EmptyState
            heading="No Orders Yet"
            description="You haven’t placed any orders yet. Start shopping to see your
              orders here."
            icon={Package}
            ctaLabel="Start Shopping"
            ctaLink="/products"
          />
        ) : (
          order.map((order, index) => {
            return (
              <div
                key={index}
                className="bg-white md:rounded-lg md:shadow-sm text-xs sm:text-sm md:text-base"
              >
                {/* Order Header */}
                <div className="flex flex-wrap sm:flex-row justify-between gap-3 bg-[#F0EEFF] sm:gap-0 items-start sm:items-center px-4 sm:px-6 py-4 border-b">
                  <div>
                    <span className="text-gray-500 block">Order Placed</span>
                    <p className="font-medium">{formatDate(order.placedAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Total</span>
                    <p className="font-medium">
                      ₹{order.grandTotal.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">
                      {order.orderNumber}
                    </span>
                    <p className="text-green-600 font-medium capitalize">
                      {order.status}
                    </p>
                  </div>
                  <div className="flex items-end flex-col justify-end max-sm:w-full">
                    <Link
                      className="border border-[#0C0057] text-[#0C0057] w-[50%] bg-white text-center mb-1 px-3 py-1 rounded-md text-xs sm:text-sm"
                      to={`/accounts/order-detail/${order._id}`}
                    >
                      Order Details
                    </Link>
                    <div className="flex items-center gap-4 text-[#0C0057]">
                      <p
                        onClick={() =>
                          navigate(
                            `/order-history/${order?._id?.slice(1) || ""}`,
                          )
                        }
                        className="cursor-pointer"
                      >
                        Track Order
                      </p>
                      |<p className="cursor-pointer">Download Invoice</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  {(expanded ? order.items : order.items.slice(0, 3)).map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col-reverse sm:flex-row justify-between gap-4 mb-6 last:mb-0"
                      >
                        {/* Product Info */}
                        <div className="flex flex-row gap-4">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border border-gray-200">
                            <img
                              className="w-full h-full object-cover"
                              src={item?.image?.url}
                              alt={item?.image?.altText}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm sm:text-base">
                              {item.productTitle}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Color:{" "}
                              {item.variantColor ? item.variantColor : ""}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Style Name:{" "}
                              {item.variantName ? item.variantName : ""}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Quantity: {item.quantity ? item.quantity : ""}
                            </p>
                            {/* <button className="mt-2 text-[#212121] text-xs flex items-center gap-1">
                              <StarIcon className="w-4 h-4 text-[#ebb100]" />
                              Rate & Review
                            </button> */}
                          </div>
                        </div>

                        {/* Status & Actions → show only once per order (on first item) */}
                        {idx === 0 && (
                          <div className="text-right text-xs sm:text-sm">
                            {/* <div className="flex items-center justify-end gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  order.orderStatus === "Delivered"
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                                }`}
                              ></div>
                              <p className="capitalize">{order.orderStatus}</p>
                            </div> */}
                            {/* <p className="text-gray-500 mt-1">
                              {order.orderStatus === "Delivered"
                                ? `Delivered on ${formatDate(
                                    order.deliveryDate,
                                  )}`
                                : `Expected by ${formatDate(
                                    order.deliveryDate,
                                  )}`}
                            </p> */}
                            {/* <p className="mt-2">Quantity: {item.quantity}</p> */}
                            {/* <button
                              className="mt-3 text-blue-600 hover:underline text-xs sm:text-sm"
                              onClick={() =>
                                navigate(
                                  `/order-history/${order.orderId.slice(1)}`,
                                )
                              }
                            >
                              Track Package
                            </button> */}
                          </div>
                        )}
                      </div>
                    ),
                  )}

                  {/* Show More / Less Button */}
                  {order.items.length > 3 && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-blue-600 hover:underline text-xs sm:text-sm"
                    >
                      {expanded
                        ? "Show Less"
                        : `Show All (${order.items.length}) Items`}
                    </button>
                  )}

                  {/* Footer Buttons */}
                  {/* {order.orderStatus === "Delivered" && <div className="mt-6 pt-6 border-t border-gray-200 flex flex-row gap-3 sm:gap-4 justify-end">
                    <button className="w-full sm:w-auto px-6 py-2 border border-[#212121] rounded-full text-xs sm:text-sm">
                      Return/Replace
                    </button>
                    <button
                      className="w-full sm:w-auto px-6 py-2 bg-[#212121] text-white rounded-full text-xs sm:text-sm"
                      // onClick={() => handleBuyNow(order.items)}
                    >
                      Buy Again
                    </button>
                  </div>} */}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Icons
function Search({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function FilterIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StarIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default OrderHistory;
