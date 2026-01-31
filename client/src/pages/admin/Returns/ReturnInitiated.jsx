import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { ChevronDown, ListFilter, Search } from "lucide-react";
// import OrderDetails from "./OrdersPopModels/OrderDetails";
// import OrdersTimelines from "./OrdersPopModels/OrdersTimelines";

const ReturnInitiated = () => {
  const { returns } = useOutletContext();

  const columns = [
    "Return ID",
    "Tracking ID",
    "Delivery Status",
    "Expected Delivery Date",
    "Delivery Partner",
    "Action",
  ];

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= PAYMENT FILTER ================= */
  const [paymentstatusOpen, setPaymentStatusOpen] = useState(false);
  const [paymentstatus, setPaymentStatus] = useState("Delivery Status");
  const Paymentstatuses = [
    "Delivery Status",
    "Pickup scheduled",
    "Picked up",
    "In transit",
    "Out for delivery",
    "Delivery delayed",
    "Delivered",
  ];

  /* ================= SORT FILTER (MOVE UP) ================= */
  const [filterOne, setfilterOne] = useState("Latest");
  const [filterOneOpen, setfilterOneOpen] = useState(false);

  const filterOneItems = [, "Latest", "Delivering Soon", "Delivering Later"];

  const filteredOrders = useMemo(() => {
    let result = [...returns];

    /* 🔍 SEARCH */
    if (debouncedValue.trim()) {
      const searchValue = debouncedValue.toLowerCase();

      result = result.filter((item) => {
        const returnId = item.returnId?.toLowerCase() || "";
        const orderId = item.orderDetails?.orderId?.toLowerCase() || "";

        return returnId.includes(searchValue) || orderId.includes(searchValue);
      });
    }

    /* 💳 PAYMENT */
    if (paymentstatus !== "Delivery Status") {
      result = result.filter(
        (item) => item.trackingDetails.deliveryStatus === paymentstatus,
      );
    }

    /* ↕️ SORT */
    if (filterOne === "Latest") {
      result.sort(
        (a, b) =>
          new Date(b.trackingDetails.expectedDeliveryDate) -
          new Date(a.trackingDetails.expectedDeliveryDate),
      );
    }

    if (filterOne === "Delivering Soon") {
      result.sort(
        (a, b) =>
          new Date(a.trackingDetails.expectedDeliveryDate) -
          new Date(b.trackingDetails.expectedDeliveryDate),
      );
    }

    if (filterOne === "Delivering Later") {
      result.sort(
        (a, b) =>
          new Date(b.trackingDetails.expectedDeliveryDate) -
          new Date(a.trackingDetails.expectedDeliveryDate),
      );
    }

    return result;
  }, [returns, debouncedValue, paymentstatus, filterOne]);

  useEffect(() => {
    setPage(1);
  }, [debouncedValue, paymentstatus, filterOne]);

  /* ================= PAGINATION ================= */
  const total = filteredOrders.length;
  const totalPages = Math.ceil(total / rowsPerPage);

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, total);

  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  // ======================== Pops ==================

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const selectOrder = returns.find(
    (orders) => orders.orderId === selectedOrderId,
  );

  /////////////////////////////////////////////////////////////

  // this is for timeline pop model
  const [openTimelineId, setOpenTimelineId] = useState(null);
  const selectTimeline = returns.find(
    (orders) => orders.orderId === openTimelineId,
  );

  return (
    <>
      {/* pop models */}
      {selectOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div
            className="
            bg-[#FFFFFF]
            w-[500px]
            max-w-[90vw]
            max-h-[90vh]
            p-[24px]
            rounded-xl
            relative
            md:w-[500px]
            overflow-y-auto
            overscroll-contain
            scrollbar-hide
          ">
            <OrderDetails
              data={selectOrder}
              setSelectedOrderId={() => setSelectedOrderId(null)}
            />
          </div>
        </div>
      )}

      {/* Order Timelines */}
      {selectTimeline && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div
            className="
        bg-[#FFFFFF]
        w-[500px]
        max-w-[90vw]
        max-h-[90vh]
        p-[24px]
        rounded-xl
        relative
        md:w-[500px]
        overflow-y-auto
        overscroll-contain
        scrollbar-hide
      ">
            <OrdersTimelines
              data={selectTimeline}
              setSelectedOrderId={() => setOpenTimelineId(null)}
            />
          </div>
        </div>
      )}

      {/* serach  and filter  */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-[30%] rounded-lg px-3 py-2 bg-[#F8FBFC]">
          <Search className="w-4 h-4 text-[#686868]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Return ID and Order ID"
            className="outline-none text-sm text-[#686868] w-full bg-transparent"
          />
        </div>

        <div className="flex items-center justify-evenly gap-4">
          <div className="relative">
            <button
              onClick={() => setPaymentStatusOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border">
              {paymentstatus}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {paymentstatusOpen && (
              <div className="absolute mt-2 w-40 right-0 top-8  bg-white border rounded-lg shadow-md z-20">
                {Paymentstatuses.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setPaymentStatus(s);
                      // setStatusOpen(false);
                      setPaymentStatusOpen(false);
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer text-[#686868] hover:bg-gray-100
                      ${paymentstatus === s ? "bg-gray-100 font-medium" : ""}
                    `}>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
              onClick={() => setfilterOneOpen((p) => !p)}>
              <ListFilter className="w-4 h-4" />
              {filterOne}
            </button>
            {filterOneOpen && (
              <div className="absolute mt-2 w-48 -right-2 top-8 bg-white border rounded-lg shadow-md z-100">
                {filterOneItems.map((s) => {
                  return (
                    <div
                      key={s}
                      onClick={() => {
                        setfilterOne(s);
                        setfilterOneOpen(false);
                      }}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-[#686868] ${
                        filterOne === s
                          ? "bg-gray-100 text-[#686868] font-medium"
                          : ""
                      }`}>
                      {s}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-center text-gray-600">
          <thead className="bg-[#F8F8F8] h-[54px]">
            <tr className="text-[#4B5563] text-sm ">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 font-medium text-[#1C1C1C] text-center">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.returnId}
                className="border-t hover:bg-gray-50 transition  cursor-pointer text-center">
                <td
                  onClick={() => {
                    setSelectedOrderId(order.returnId);
                  }}
                  className="px-4 py-3 hover:underline text-[#2C87E2]">
                  {order.returnId}
                </td>
                {/* <td className="px-4 py-3">{order.quantity}</td> */}
                <td className="px-4 py-3">
                  {order.trackingDetails.trackingId}
                </td>
                <td className={`px-4 py-3 font-medium text-xs  `}>
                  <span
                    className={`inline-flex items-center justify-center min-w-[110px] px-4 py-1.5 rounded-md font-medium text-center ${
                      order.trackingDetails.deliveryStatus ===
                      "Pickup scheduled"
                        ? "text-[#1C3753] bg-[#D5E5F5]"
                        : order.trackingDetails.deliveryStatus === "Picked up"
                          ? "text-[#008D94] bg-[#C7FCFF]"
                          : order.trackingDetails.deliveryStatus ===
                              "In transit"
                            ? "text-[#FE00D8] bg-[#FFDAF9]"
                            : order.trackingDetails.deliveryStatus ===
                                "Out for delivery"
                              ? "text-[#8A38F5] bg-[#E6D3FF]"
                              : order.trackingDetails.deliveryStatus ===
                                  "Delivery delayed"
                                ? "text-[#F8A14A] bg-[#FFF9E0]"
                                : order.trackingDetails.deliveryStatus ===
                                    "Pickup failed"
                                  ? "text-[#D53B35] bg-[#FFEAE9]"
                                  : order.trackingDetails.deliveryStatus ===
                                      "Delivered"
                                    ? "text-[#00A63E] bg-[#E0F4DE]"
                                    : ""
                    }`}>
                    {order.trackingDetails.deliveryStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {order.trackingDetails.expectedDeliveryDate}
                </td>

                <td className="px-4 py-3 font-medium text-xs">
                  <span
                    className={` bg-[#D5E5F5] inline-flex items-center justify-center min-w-[110px] px-4 py-1.5 rounded-lg font-medium text-center
                  `}>
                    {order.trackingDetails.deliveryPartner}
                  </span>
                </td>

                <div className="flex items-center justify-center ">
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setOpenTimelineId(order.orderId);
                      }}
                      className="p-2  text-[#2C87E2]">
                      View Tracking
                    </button>
                  </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-3 text-sm text-gray-600">
          <div>
            Showing <span className="font-medium">{startIndex + 1}</span>–
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}>
              ‹
            </button>

            <div className="px-4 py-1 border rounded">
              Page {String(page).padStart(2, "0")} of{" "}
              {String(totalPages).padStart(2, "0")}
            </div>

            <button
              className="px-3 py-1 border rounded disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}>
              ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnInitiated;
