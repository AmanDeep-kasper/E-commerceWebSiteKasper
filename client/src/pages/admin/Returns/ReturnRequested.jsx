// import { useEffect, useMemo, useState } from "react";
// import { useOutletContext } from "react-router-dom";
// import { ChevronDown, ListFilter, MoreVertical, Search } from "lucide-react";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import { toast } from "react-toastify";
// import ReturnRejectedModule from "./ReturnPopModules/ReturnRejectedModule";
// import ReturnRequestedModule from "./ReturnPopModules/ReturnRequestedModule";

// const ReturnRequested = () => {
//   const { returns: contextReturns } = useOutletContext();

//   const columns = [
//     "Return ID",
//     "Product Name",
//     "Return Reason",
//     "Created Date",
//     "Action",
//   ];

//   /* ================= PAGINATION ================= */
//   const [page, setPage] = useState(1);
//   const rowsPerPage = 10;

//   /* ================= SEARCH ================= */
//   const [search, setSearch] = useState("");
//   const [debouncedValue, setDebouncedValue] = useState("");

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedValue(search);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search]);

//   /* ================= PAYMENT FILTER ================= */
//   const [paymentstatusOpen, setPaymentStatusOpen] = useState(false);
//   const [paymentstatus, setPaymentStatus] = useState("Return Type");
//   const Paymentstatuses = ["Return Type", "Exchange", "Return"];

//   /* ================= SORT FILTER (MOVE UP) ================= */
//   const [filterOne, setfilterOne] = useState("Latest");
//   const [filterOneOpen, setfilterOneOpen] = useState(false);

//   const filterOneItems = ["Latest", "Latest Date", "Oldest Date"];

//   const [returnsData, setReturnsData] = useState([]);

//   useEffect(() => {
//     setReturnsData(contextReturns || []);
//   }, [contextReturns]);

//   const filteredOrders = useMemo(() => {
//     let result = [...returnsData];

//     /* 🔍 SEARCH */
//     if (debouncedValue.trim()) {
//       const searchValue = debouncedValue.toLowerCase();

//       result = result.filter((item) => {
//         const returnId = item.returnId?.toLowerCase() || "";
//         const orderId = item.orderDetails?.orderId?.toLowerCase() || "";

//         return returnId.includes(searchValue) || orderId.includes(searchValue);
//       });
//     }

//     /* 💳 PAYMENT */
//     if (paymentstatus !== "Return Type") {
//       result = result.filter((item) => item.type === paymentstatus);
//     }

//     /* ↕️ SORT */
//     if (filterOne === "Latest Return Date") {
//       result.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
//     }

//     if (filterOne === "Oldest Return Date") {
//       result.sort((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt));
//     }

//     return result;
//   }, [returnsData, debouncedValue, paymentstatus, filterOne]);

//   useEffect(() => {
//     setPage(1);
//   }, [debouncedValue, paymentstatus, filterOne]);

//   /* ================= PAGINATION ================= */
//   const total = filteredOrders.length;
//   const totalPages = Math.ceil(total / rowsPerPage);

//   const startIndex = (page - 1) * rowsPerPage;
//   const endIndex = Math.min(startIndex + rowsPerPage, total);

//   const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

//   //////////////////////////////////////////////////
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const selectOrder = returnsData.find(
//     (orders) => orders.returnId === selectedOrderId,
//   );

//   ///////////////////////////////////////////////////
//   // cancel order module

//   const [openCancelModule, setopenCancelModule] = useState(null);
//   const [cancelResionData, setCancelResionData] = useState("");

//   const selectCancelOrder = returnsData.find(
//     (orders) => orders.returnId === openCancelModule,
//   );

//   // Accepted order

//   const [acceptedOrders, setAcceptedOrders] = useState([]);



//   // agin
//   const handleAcceptedOrders = (orderId) => {
//     const updatedReturns = returnsData.map((item) => {
//       if (item.returnId === orderId) {
//         return {
//           ...item,
//           status: "Approved",
//           shippingDetails: {
//             shippingPartner: "Blue Dart",
//             trackingId: "DLV123456789",
//             shippingStatus: "In Transit",
//             expectedDate: "2026-02-06",
//           },
//         };
//       }
//       return item;
//     });

//     setReturnsData(updatedReturns);
//   };

//   const handleCancelOrder = (orderId) => {
//     toast.error("Order has been cancelled", {
//       icon: true,
//       style: {
//         background: "#FDECEC",
//         color: "#1C1C1C",
//       },
//     });

//     setopenCancelModule(null);
//   };

//   return (
//     <>
//       {/* pop models */}
//       {selectOrder && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//           <div
//             className="
//     bg-white
//     w-[750px]
//     max-w-[95vw]
//     max-h-[90vh]
//     p-6
//     rounded-xl
//     relative
//     overflow-y-auto
//     overscroll-contain
//     scrollbar-hide
//   "
//           >
//             <ReturnRequestedModule
//               data={selectOrder}
//               setSelectedOrderId={() => setSelectedOrderId(null)}
//               setopenCancelModule={setopenCancelModule}
//               handleAcceptedOrders={() =>
//                 handleAcceptedOrders(selectOrder.returnId)
//               }
//             />
//           </div>
//         </div>
//       )}

//       {selectCancelOrder && (
//         <ReturnRejectedModule
//           order={selectCancelOrder}
//           setCancelReason={setCancelResionData}
//           cancelReason={cancelResionData}
//           close={() => {
//             setopenCancelModule(null);
//             setCancelResionData("");
//           }}
//           onConfirmCancel={() => handleCancelOrder(selectCancelOrder.orderId)}
//         />
//       )}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-2 w-[30%] rounded-lg px-3 py-2 bg-[#F8FBFC]">
//           <Search className="w-4 h-4 text-[#686868]" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by Return ID and Order ID"
//             className="outline-none text-sm text-[#686868] w-full bg-transparent"
//           />
//         </div>

//         <div className="flex items-center justify-evenly gap-4">
//           <div className="relative">
//             <button
//               onClick={() => setPaymentStatusOpen((p) => !p)}
//               className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
//             >
//               {paymentstatus}
//               <ChevronDown className="w-4 h-4 text-gray-500" />
//             </button>
//             {paymentstatusOpen && (
//               <div className="absolute mt-2 w-36 right-0 top-8  bg-white border rounded-lg shadow-md z-20">
//                 {Paymentstatuses.map((s) => (
//                   <div
//                     key={s}
//                     onClick={() => {
//                       setPaymentStatus(s);
//                       // setStatusOpen(false);
//                       setPaymentStatusOpen(false);
//                     }}
//                     className={`px-4 py-2 text-sm cursor-pointer text-[#686868] hover:bg-gray-100
//             ${paymentstatus === s ? "bg-gray-100 font-medium" : ""}
//           `}
//                   >
//                     {s}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="relative">
//             <button
//               className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
//               onClick={() => setfilterOneOpen((p) => !p)}
//             >
//               <ListFilter className="w-4 h-4" />
//               {filterOne}
//             </button>
//             {filterOneOpen && (
//               <div className="absolute mt-2 w-48 -right-2 top-8 bg-white border rounded-lg shadow-md z-100">
//                 {filterOneItems.map((s) => {
//                   return (
//                     <div
//                       key={s}
//                       onClick={() => {
//                         setfilterOne(s);
//                         setfilterOneOpen(false);
//                       }}
//                       className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-[#686868] ${
//                         filterOne === s
//                           ? "bg-gray-100 text-[#686868] font-medium"
//                           : ""
//                       }`}
//                     >
//                       {s}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="overflow-x-auto bg-white shadow rounded-lg">
//         <table className="w-full text-sm text-left text-gray-600">
//           <thead className="bg-[#F8F8F8] h-[54px]">
//             <tr className="text-[#4B5563] text-sm text-center">
//               {columns.map((col) => (
//                 <th key={col} className="px-4 py-3 font-medium text-[#1C1C1C]">
//                   {col}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedOrders.map((order) => (
//               <tr
//                 key={order.returnId}
//                 className="border-t hover:bg-gray-50 transition text-center cursor-pointer"
//               >
//                 <td
//                   onClick={() => {
//                     setSelectedOrderId(order.returnId);
//                   }}
//                   className="px-4 py-3 hover:underline text-[#000000]"
//                 >
//                   {order.returnId}
//                 </td>
//                 <td className="px-0 py-4">
//                   <div className="flex items-center justify-center text-center bg-emerald- gap-2">
//                     <div className="h-[50px] w-[50px] ml-2 bg-[#EFEFEF] p-1 rounded-md overflow-hidden">
//                       <img
//                         className="h-full w-full object-cover object-center"
//                         src={order?.item?.images?.[0] || "/no-image.png"}
//                         alt={order?.item?.productName || "Product image"}
//                       />
//                     </div>

//                     <div>
//                       <span className="text-[#1F2937] text-[16px] font-medium cursor-pointer">
//                         {order.item.productName.split(" ").length > 3
//                           ? order.item.productName
//                               .split(" ")
//                               .slice(0, 3)
//                               .join(" ") + "..."
//                           : order.item.productName}
//                       </span>
//                     </div>
//                   </div>
//                 </td>

//                 <td className="px-4 py-3">{order.returnReason}</td>

//                 <td className="px-4 py-3">{order.requestedAt}</td>

//                 <td className="px-4 py-3 gap-3">
//                   <span
//                     onClick={() => {
//                       setSelectedOrderId(order.returnId);
//                     }}
//                     className="hover:underline text-[#2C87E2]"
//                   >
//                     view
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination Footer */}
//         <div className="flex items-center justify-between px-6 py-3 text-sm text-gray-600">
//           <div>
//             Showing <span className="font-medium">{startIndex + 1}</span>–
//             <span className="font-medium">{endIndex}</span> of{" "}
//             <span className="font-medium">{total}</span> results
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               className="px-3 py-1 border rounded disabled:opacity-40"
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//             >
//               ‹
//             </button>

//             <div className="px-4 py-1 border rounded">
//               Page {String(page).padStart(2, "0")} of{" "}
//               {String(totalPages).padStart(2, "0")}
//             </div>

//             <button
//               className="px-3 py-1 border rounded disabled:opacity-40"
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//             >
//               ›
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ReturnRequested;

import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ChevronDown, ListFilter, Search } from "lucide-react";
import { toast } from "react-toastify";
import ReturnRejectedModule from "./ReturnPopModules/ReturnRejectedModule";
import ReturnRequestedModule from "./ReturnPopModules/ReturnRequestedModule";

const ReturnRequested = () => {
  const { returnsData = [], setReturnsData } = useOutletContext();

  const columns = [
    "Return ID",
    "Product Name",
    "Return Reason",
    "Created Date",
    "Action",
  ];

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const [paymentstatusOpen, setPaymentStatusOpen] = useState(false);
  const [paymentstatus, setPaymentStatus] = useState("Return Type");
  const Paymentstatuses = ["Return Type", "Exchange", "Return"];

  const [filterOne, setfilterOne] = useState("Latest Date");
  const [filterOneOpen, setfilterOneOpen] = useState(false);
  const filterOneItems = ["Latest Date", "Oldest Date"];

  const filteredOrders = useMemo(() => {
    let result = [...returnsData];

    if (debouncedValue.trim()) {
      const searchValue = debouncedValue.toLowerCase();

      result = result.filter((item) => {
        const returnId = item?.returnId?.toLowerCase() || "";
        const orderId = item?.orderDetails?.orderId?.toLowerCase() || "";
        return returnId.includes(searchValue) || orderId.includes(searchValue);
      });
    }

    if (paymentstatus !== "Return Type") {
      result = result.filter((item) => item?.type === paymentstatus);
    }

    if (filterOne === "Latest Date") {
      result.sort(
        (a, b) =>
          new Date(b?.requestedAt || 0).getTime() -
          new Date(a?.requestedAt || 0).getTime()
      );
    }

    if (filterOne === "Oldest Date") {
      result.sort(
        (a, b) =>
          new Date(a?.requestedAt || 0).getTime() -
          new Date(b?.requestedAt || 0).getTime()
      );
    }

    return result;
  }, [returnsData, debouncedValue, paymentstatus, filterOne]);

  useEffect(() => {
    setPage(1);
  }, [debouncedValue, paymentstatus, filterOne]);

  const total = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, total);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const selectOrder = returnsData.find(
    (orders) => orders?.returnId === selectedOrderId
  );

  const [openCancelModule, setopenCancelModule] = useState(null);
  const [cancelResionData, setCancelResionData] = useState("");

  const selectCancelOrder = returnsData.find(
    (orders) => orders?.returnId === openCancelModule
  );

  const handleAcceptedOrders = (orderId) => {
    const updatedReturns = returnsData.map((item) => {
      if (item?.returnId === orderId) {
        return {
          ...item,
          status: "Approved",
          shippingDetails: {
            shippingPartner: "Blue Dart",
            trackingId: "DLV123456789",
            shippingStatus: "In Transit",
            expectedDeliveryDate: "2026-02-06",
          },
        };
      }
      return item;
    });

    setReturnsData(updatedReturns);
  };

  const handleCancelOrder = () => {
    toast.error("Order has been cancelled", {
      icon: true,
      style: {
        background: "#FDECEC",
        color: "#1C1C1C",
      },
    });

    setopenCancelModule(null);
  };

  return (
    <>
      {selectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative max-h-[90vh] w-[750px] max-w-[95vw] overflow-y-auto rounded-xl bg-white p-6 overscroll-contain scrollbar-hide">
            <ReturnRequestedModule
              data={selectOrder}
              setSelectedOrderId={() => setSelectedOrderId(null)}
              setopenCancelModule={setopenCancelModule}
              handleAcceptedOrders={() =>
                handleAcceptedOrders(selectOrder.returnId)
              }
            />
          </div>
        </div>
      )}

      {selectCancelOrder && (
        <ReturnRejectedModule
          order={selectCancelOrder}
          setCancelReason={setCancelResionData}
          cancelReason={cancelResionData}
          close={() => {
            setopenCancelModule(null);
            setCancelResionData("");
          }}
          onConfirmCancel={handleCancelOrder}
        />
      )}

      <div className="mb-4 flex items-center justify-between">
        <div className="flex w-[30%] items-center gap-2 rounded-lg bg-[#F8FBFC] px-3 py-2">
          <Search className="h-4 w-4 text-[#686868]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Return ID and Order ID"
            className="w-full bg-transparent text-sm text-[#686868] outline-none"
          />
        </div>

        <div className="flex items-center justify-evenly gap-4">
          <div className="relative">
            <button
              onClick={() => setPaymentStatusOpen((p) => !p)}
              className="flex items-center gap-2 rounded-lg border bg-[#F8FBFC] px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {paymentstatus}
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {paymentstatusOpen && (
              <div className="absolute right-0 top-8 z-20 mt-2 w-36 rounded-lg border bg-white shadow-md">
                {Paymentstatuses.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setPaymentStatus(s);
                      setPaymentStatusOpen(false);
                    }}
                    className={`cursor-pointer px-4 py-2 text-sm text-[#686868] hover:bg-gray-100 ${
                      paymentstatus === s ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-lg border bg-[#F8FBFC] px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setfilterOneOpen((p) => !p)}
            >
              <ListFilter className="h-4 w-4" />
              {filterOne}
            </button>

            {filterOneOpen && (
              <div className="absolute -right-2 top-8 z-20 mt-2 w-48 rounded-lg border bg-white shadow-md">
                {filterOneItems.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setfilterOne(s);
                      setfilterOneOpen(false);
                    }}
                    className={`cursor-pointer px-4 py-2 text-sm text-[#686868] hover:bg-gray-100 ${
                      filterOne === s ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="h-[54px] bg-[#F8F8F8]">
            <tr className="text-center text-sm text-[#4B5563]">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 font-medium text-[#1C1C1C]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr
                  key={order?.returnId}
                  className="cursor-pointer border-t text-center transition hover:bg-gray-50"
                >
                  <td
                    onClick={() => setSelectedOrderId(order?.returnId)}
                    className="px-4 py-3 text-[#000000] hover:underline"
                  >
                    {order?.returnId || "-"}
                  </td>

                  <td className="px-0 py-4">
                    <div className="flex items-center justify-center gap-2 text-center">
                      <div className="ml-2 h-[50px] w-[50px] overflow-hidden rounded-md bg-[#EFEFEF] p-1">
                        <img
                          className="h-full w-full object-cover object-center"
                          src={order?.item?.images?.[0] || "/no-image.png"}
                          alt={order?.item?.productName || "Product image"}
                        />
                      </div>

                      <div>
                        <span className="cursor-pointer text-[16px] font-medium text-[#1F2937]">
                          {order?.item?.productName
                            ? order.item.productName.split(" ").length > 3
                              ? order.item.productName
                                  .split(" ")
                                  .slice(0, 3)
                                  .join(" ") + "..."
                              : order.item.productName
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">{order?.returnReason || "-"}</td>
                  <td className="px-4 py-3">{order?.requestedAt || "-"}</td>

                  <td className="px-4 py-3">
                    <span
                      onClick={() => setSelectedOrderId(order?.returnId)}
                      className="text-[#2C87E2] hover:underline"
                    >
                      View
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No return requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-3 text-sm text-gray-600">
          <div>
            Showing <span className="font-medium">{total ? startIndex + 1 : 0}</span>–
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              className="rounded border px-3 py-1 disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹
            </button>

            <div className="rounded border px-4 py-1">
              Page {String(page).padStart(2, "0")} of{" "}
              {String(totalPages).padStart(2, "0")}
            </div>

            <button
              className="rounded border px-3 py-1 disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || total === 0}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnRequested;
