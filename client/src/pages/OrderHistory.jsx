// import AccountSidebar from "../components/AccountSidebar";
// import img from "../assets/Art3.jpg";
// import OrderFilter from "../components/OrderFilter";
// import orders from "../data/orders.json";
// import { useNavigate } from "react-router";
// import Navbar from "../components/Navbar";
// import Footer from "../sections/Footer";
// import { useEffect, useState } from "react";

// function OrderHistory() {
//   // const order = {
//   //   orderId: "#ORD-20250816001",
//   //   userId: "USR-1001",
//   //   orderDate: "2025-08-01T12:45:00Z",
//   //   items: [
//   //     {
//   //       productId: "P-101",
//   //       name: "Laser Cut Butterfly Wall Art",
//   //       quantity: 1,
//   //       price: 1499,
//   //       img: "/images/products/butterfly.png"
//   //     }
//   //   ],
//   //   totalAmount: 1499,
//   //   paymentMethod: "UPI",
//   //   paymentStatus: "Paid",
//   //   deliveryAddress: {
//   //     name: "Abhishek Pal",
//   //     mobile: "9876543210",
//   //     addressLine1: "123 Main Street",
//   //     addressLine2: "Apartment 4B",
//   //     city: "New Delhi",
//   //     state: "Delhi",
//   //     pincode: "110001"
//   //   },
//   //   deliveryDate: "2025-08-06",
//   //   orderStatus: "Delivered",
//   //   trackingId: "TRK123456789IN"
//   // };
//   const [param, setParam] = useState("");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [orderA, setOrderA] = useState(orders);
//   const [status, setStatus] = useState("");
//   const [time, setTime] = useState("");
//   const formatDate = (dateString) => {
//     const options = { day: "numeric", month: "short", year: "numeric" };
//     return new Date(dateString).toLocaleDateString("en-IN", options);
//   };
//   const navigate = useNavigate();
//   const timeFilter = {
//     last30Days: new Date().toISOString().split("T")[0],
//     year2025: 2025,
//     year2024: 2024,
//     year2023: 2023,
//     older: "Older",
//   };

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       let filtered = orders;

//       // Apply status filter if provided
//       if (status.trim()) {
//         filtered = filtered.filter((order) =>
//           order.orderStatus.toLowerCase().includes(status.toLowerCase())
//         );
//       }

//       if (time.trim()) {
//         switch (time) {
//           case "last30Days":
//             filtered = filtered.filter(
//               (order) =>
//                 Number(timeFilter[time].split("-").join("")) -
//                   Number(order.orderDate.split("T")[0].split("-").join("")) <=
//                 30
//             );
//             return;
//           default:
//             filtered = filtered.filter((order) =>
//               order.orderDate.split("T")[0].includes(timeFilter[time])
//             );
//         }
//       }

//       // Apply search filter if provided
//       if (param.trim()) {
//         filtered = filtered.filter((order) =>
//           order.items.some((item) =>
//             item.name.toLowerCase().includes(param.toLowerCase())
//           )
//         );
//       }

//       setOrderA(filtered);
//     }, 300);

//     return () => clearTimeout(handler);
//   }, [param, status, orders, time]);

//   // useEffect(() => {
//   //   const handler = setTimeout(() => {
//   //     if (param.trim()) {
//   //       setOrderA(
//   //         orders.filter((order) =>
//   //           order.items.some((item) =>
//   //             item.name.toLowerCase().includes(param.toLowerCase())
//   //           )
//   //         )
//   //       );
//   //     } else {
//   //       setOrderA(orders);
//   //     }
//   //   }, 300); // Debounce for better UX

//   //   return () => clearTimeout(handler);
//   // }, [param, orders]);
//   const today = new Date();
//   const date = today.toISOString().split("T")[0];
//   const orderDate = "2025-07-09";
//   const expectedDay = Number(orderDate.slice(0, 10).split("-").join(""));
//   const day = Number(date.slice(0, 10).split("-").join(""));

//   return (
//     <>
//       <Navbar />
//       <section className="lg:px-20 md:px-[60px] px-4 py-8 bg-gray-50 font-inter">
//         <div className="flex justify-between gap-4">
//           {/* Sidebar */}
//           {/* <OrderFilter /> */}
//           <div className="max-lg:hidden">
//             <AccountSidebar />
//           </div>

//           {/* Order History */}
//           <div className="w-full px-2 sm:px-4">
//             <div className="relative flex flex-row justify-between items-center bg-white rounded-lg shadow-sm p-3 gap-3 sm:gap-4">
//               {/* Search Input */}
//               <div className="flex items-center w-full sm:w-auto px-3 py-2 bg-gray-50 rounded-md focus-within:ring-2 focus-within:ring-[#212121] focus-within:border-[#212121] transition-all">
//                 <Search className="text-[#212121] w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search your orders..."
//                   className="outline-none bg-transparent w-full ml-2 text-gray-700 placeholder-gray-400 text-sm"
//                   aria-label="Search orders"
//                   value={param}
//                   onChange={(e) => setParam(e.target.value)}
//                 />
//               </div>

//               {/* Filter Button - Mobile */}
//               <button
//                 className="sm:hidden w-full flex items-center justify-center py-2 px-4 text-sm max-sm:text-xs max-sm:w-max font-medium text-[#212121] border border-[#212121] rounded-md hover:bg-[#FFF8E6] transition-colors"
//                 aria-label="Open filters"
//               >
//                 <FilterIcon className="w-4 h-4 mr-2" />
//                 Filters
//               </button>

//               {/* Filter Button - Desktop */}
//               <button
//                 className="hidden sm:flex items-center justify-center py-2 px-5 text-sm font-medium text-white bg-[#212121] rounded-md hover:bg-[#D9A300] transition-colors shadow-sm"
//                 aria-label="Open filters"
//                 onClick={() => setIsFilterOpen(!isFilterOpen)}
//               >
//                 <FilterIcon className="w-4 h-4 mr-2" />
//                 Filters
//               </button>

//               {isFilterOpen && (
//                 <div className="absolute top-16 z-30 right-0 w-64 max-w-[90vw]">
//                   <OrderFilter
//                     setStatus={setStatus}
//                     status={status}
//                     setTime={setTime}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Order Cards */}
//             <div className="mt-6 flex flex-col gap-6">
//               {orderA.map((order, index) => (
//                 <div key={index} className="bg-white rounded-lg shadow-sm">
//                   {/* Order Header */}
//                   <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 items-start sm:items-center px-4 sm:px-6 py-4 border-b text-sm">
//                     <div className="max-sm:w-full max-sm:flex justify-between">
//                       <span className="text-gray-500 block">Order Placed</span>
//                       <p className="font-medium">
//                         {formatDate(order.orderDate)}
//                       </p>
//                     </div>
//                     <div className="max-sm:w-full max-sm:flex justify-between">
//                       <span className="text-gray-500 block">Total</span>
//                       <p className="font-medium">
//                         ₹{order.totalAmount.toLocaleString()}
//                       </p>
//                     </div>
//                     <div className="max-sm:w-full max-sm:flex justify-between">
//                       <span className="text-gray-500 block">
//                         Order {order.orderId}
//                       </span>
//                       <p className="text-green-600 font-medium capitalize">
//                         {order.orderStatus}
//                       </p>
//                     </div>
//                     <div>
//                       <button className=" border border-gray-400 text-gray-500 px-3 py-1 rounded-md text-xs sm:text-sm">
//                         Order Details
//                       </button>
//                     </div>
//                   </div>

//                   {/* Order Items */}
//                   <div className="p-4 sm:p-6">
//                     <div className="flex flex-col sm:flex-row justify-between gap-4">
//                       {/* Product Info */}
//                       <div className="flex flex-row gap-4">
//                         <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border border-gray-200">
//                           <img
//                             className="w-full h-full object-cover"
//                             src={order.items[0].img}
//                             alt={order.items[0].name}
//                           />
//                         </div>
//                         <div>
//                           <h3 className="font-medium text-base sm:text-lg">
//                             {order.items[0].name}
//                           </h3>
//                           <p className="text-gray-600 text-sm">
//                             Quantity: {order.items[0].quantity}
//                           </p>
//                           <p className="text-gray-600 text-sm">
//                             Price: ₹{order.items[0].price.toLocaleString()}
//                           </p>
//                           <button className="mt-2 text-[#212121] text-xs sm:text-sm flex items-center gap-1">
//                             <StarIcon className="w-4 h-4 text-[#ebb100]" />
//                             Rate & Review
//                           </button>
//                         </div>
//                       </div>

//                       {/* Status & Actions */}
//                       <div className="text-right text-sm">
//                         <div className="flex items-center justify-end gap-2">
//                           <div
//                             className={`w-2 h-2 rounded-full ${
//                               order.orderStatus === "Delivered"
//                                 ? "bg-green-500"
//                                 : "bg-yellow-500"
//                             }`}
//                           ></div>
//                           <p className="capitalize">{order.orderStatus}</p>
//                         </div>
//                         <p className="text-gray-500 mt-1">
//                           {order.orderStatus === "Delivered"
//                             ? `Delivered on ${formatDate(order.deliveryDate)}`
//                             : `Expected by ${formatDate(order.deliveryDate)}`}
//                         </p>
//                         <p className="mt-2">Tracking ID: {order.trackingId}</p>
//                         <button
//                           className="mt-3 text-blue-600 hover:underline text-xs sm:text-sm"
//                           onClick={() =>
//                             navigate(`/order-history/${order.orderId}`)
//                           }
//                         >
//                           Track Package
//                         </button>
//                       </div>
//                     </div>

//                     {/* Footer Buttons */}
//                     <div className="mt-6 pt-6 border-t border-gray-200 flex flex-row gap-3 sm:gap-4 justify-end">
//                       <button className="w-full sm:w-auto px-6 py-2 border border-[#212121] rounded-full text-sm">
//                         Return/Replace
//                       </button>
//                       <button className="w-full sm:w-auto px-6 py-2 bg-[#212121] text-white rounded-full text-sm">
//                         Buy Again
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </>
//   );
// }

// // You'll need to import or define these icons
// function Search({ className }) {
//   return (
//     <svg
//       className={className}
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//       />
//     </svg>
//   );
// }

// function FilterIcon({ className }) {
//   return (
//     <svg
//       className={className}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 20 20"
//       fill="currentColor"
//     >
//       <path
//         fillRule="evenodd"
//         d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
//         clipRule="evenodd"
//       />
//     </svg>
//   );
// }

// function StarIcon({ className }) {
//   return (
//     <svg className={className} fill="currentColor" viewBox="0 0 20 20">
//       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//     </svg>
//   );
// }

// export default OrderHistory;

import AccountSidebar from "../components/AccountSidebar";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buyNow } from "../redux/cart/cartSlice";
import OrderFilter from "../components/OrderFilter";
import { ListFilter, Package } from "lucide-react";
import EmptyState from "../components/EmptyState";
// import orders from "../data/orders.json"

function OrderHistory() {
  const orders = useSelector((s) => s.order.list); // ✅ from Redux
  const [param, setParam] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [orderA, setOrderA] = useState([...orders].reverse());
  const [status, setStatus] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      let filtered = [...orders].reverse();

      // Status filter
      if (status.trim()) {
        filtered = filtered.filter((order) =>
          order.orderStatus.toLowerCase().includes(status.toLowerCase())
        );
      }

      // Time filter
      if (time) {
        const now = new Date();
        if (time === "last30Days") {
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.orderDate);
            const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
            return diffDays <= 30;
          });
        } else if (time.startsWith("year")) {
          const year = parseInt(time.replace("year", ""), 10);
          filtered = filtered.filter(
            (order) => new Date(order.orderDate).getFullYear() === year
          );
        } else if (time === "older") {
          const cutoffYear = new Date().getFullYear() - 2;
          filtered = filtered.filter(
            (order) => new Date(order.orderDate).getFullYear() < cutoffYear
          );
        }
      }

      // Search filter
      if (param.trim()) {
        filtered = filtered.filter((order) =>
          order.items.some((item) =>
            item.name.toLowerCase().includes(param.toLowerCase())
          )
        );
      }

      setOrderA(filtered);
    }, 300);

    return () => clearTimeout(handler);
  }, [param, status, orders, time]);

  return (
    <div className="w-full">
      <div className="md:mb-6 relative flex flex-row justify-between items-center border border-gray-200 bg-white md:rounded-lg p-3 gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="flex items-center w-full sm:w-auto px-3 py-2 bg-gray-50 rounded-md focus-within:ring-2 focus-within:ring-[#212121] transition-all">
          <Search className="text-[#212121] w-5 h-5" />
          <input
            type="text"
            placeholder="Search your orders..."
            className="outline-none bg-transparent w-full ml-2 text-gray-700 placeholder-gray-400 text-xs sm:text-sm"
            value={param}
            onChange={(e) => setParam(e.target.value)}
          />
        </div>

        {/* Filter Button - Desktop */}
        <button
          className="hidden sm:flex items-center justify-center py-2 px-5 text-xs sm:text-sm hover:text-white border border-[#212121] hover:bg-[#212121] rounded-full transition-colors shadow-sm"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <ListFilter className="w-4 h-4 mr-2" />
          Filters
        </button>

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
      {/* Order Cards */}
      <div className="flex flex-col gap-6 rounded-md">
        {orderA.length === 0 ? (
          <EmptyState
            heading="No Orders Yet"
            description="You haven’t placed any orders yet. Start shopping to see your
              orders here."
            icon={Package}
            ctaLabel="Start Shopping"
            ctaLink="/products"
          />
        ) : (
          orderA.map((order, index) => {
            return (
              <div
                key={index}
                className="bg-white md:rounded-lg md:shadow-sm text-xs sm:text-sm md:text-base"
              >
                {/* Order Header */}
                <div className="flex flex-wrap sm:flex-row justify-between gap-3 sm:gap-0 items-start sm:items-center px-4 sm:px-6 py-4 border-b">
                  <div>
                    <span className="text-gray-500 block">Order Placed</span>
                    <p className="font-medium">{formatDate(order.orderDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Total</span>
                    <p className="font-medium">
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">{order.orderId}</span>
                    <p className="text-green-600 font-medium capitalize">
                      {order.orderStatus}
                    </p>
                  </div>
                  <div className="flex justify-end max-sm:w-full">
                    <Link
                      className="border border-gray-400 text-gray-500 px-3 py-1 rounded-md text-xs sm:text-sm"
                      to={`/accounts/order-detail/${order.orderId.slice(1)}`}
                    >
                      Order Details
                    </Link>
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
                              src={item.img[0]}
                              alt={item.name}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm sm:text-base">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Price: ₹{item.price.toLocaleString()}
                            </p>
                            <button className="mt-2 text-[#212121] text-xs flex items-center gap-1">
                              <StarIcon className="w-4 h-4 text-[#ebb100]" />
                              Rate & Review
                            </button>
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
                            <p className="text-gray-500 mt-1">
                              {order.orderStatus === "Delivered"
                                ? `Delivered on ${formatDate(
                                    order.deliveryDate
                                  )}`
                                : `Expected by ${formatDate(
                                    order.deliveryDate
                                  )}`}
                            </p>
                            <p className="mt-2">
                              Tracking ID: {order.trackingId}
                            </p>
                            <button
                              className="mt-3 text-blue-600 hover:underline text-xs sm:text-sm"
                              onClick={() =>
                                navigate(
                                  `/order-history/${order.orderId.slice(1)}`
                                )
                              }
                            >
                              Track Package
                            </button>
                          </div>
                        )}
                      </div>
                    )
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
