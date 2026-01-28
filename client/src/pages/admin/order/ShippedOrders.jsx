import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { ChevronDown, ListFilter, Search } from "lucide-react";
import OrderDetails from "./OrdersPopModels/OrderDetails";

const ShippedOrders = () => {
  const { orders } = useOutletContext();

  const columns = [
    "Order ID",
    "Tracking ID",
    "Shipment Status ",
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
  const [paymentstatus, setPaymentStatus] = useState("Shipment Status");
  const Paymentstatuses = [
    "Shipment Status",
    "Shipped",
    "In transit",
    "Out for delivery",
    "Delivery delayed",
    "Failed delivery",
  ];

  /* ================= SORT FILTER (MOVE UP) ================= */
  const [filterOne, setfilterOne] = useState("Latest");
  const [filterOneOpen, setfilterOneOpen] = useState(false);

  const filterOneItems = [, "Latest", "Delivering Soon", "Delivering Later"];

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    /* 🔍 SEARCH */
    if (debouncedValue.trim()) {
      result = result.filter((item) =>
        item.orderId.toLowerCase().includes(debouncedValue.toLowerCase()),
      );
    }

    /* 💳 PAYMENT */
    if (paymentstatus !== "Shipment Status") {
      result = result.filter((item) => item.shipmentStatus === paymentstatus);
    }

    /* ↕️ SORT */
    if (filterOne === "Latest") {
      result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    }

    if (filterOne === "Delivering Soon") {
      result.sort(
        (a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate),
      );
    }

    if (filterOne === "Delivering Later") {
      result.sort(
        (a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate),
      );
    }

    return result;
  }, [orders, debouncedValue, paymentstatus, filterOne]);

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
  const selectOrder = orders.find(
    (orders) => orders.orderId === selectedOrderId,
  );

  /////////////////////////////////////////////////////////////
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
      {/* serach  and filter  */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-[30%] rounded-lg px-3 py-2 bg-[#F8FBFC]">
          <Search className="w-4 h-4 text-[#686868]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID"
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
              <div className="absolute mt-2 w-36 right-0 top-8  bg-white border rounded-lg shadow-md z-20">
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
                key={order.orderId}
                className="border-t hover:bg-gray-50 transition  cursor-pointer text-center">
                <td
                  onClick={() => {
                    setSelectedOrderId(order.orderId);
                  }}
                  className="px-4 py-3 hover:underline text-[#2C87E2]">
                  {order.orderId}
                </td>
                {/* <td className="px-4 py-3">{order.quantity}</td> */}
                <td className="px-4 py-3">{order.trackingId}</td>
                <td className={`px-4 py-3 font-medium text-xs  `}>
                  <span
                    className={`inline-flex items-center justify-center min-w-[110px] px-4 py-1.5 rounded-md font-medium text-center ${
                      order.shipmentStatus === "Failed delivery"
                        ? "text-[#D53B35] bg-[#FFEAE9]"
                        : order.shipmentStatus === "Out for delivery"
                          ? "text-[#8A38F5] bg-[#E6D3FF]"
                          : order.shipmentStatus === "In transit"
                            ? "text-[#FE00D8] bg-[#FFDAF9]"
                            : order.shipmentStatus === "Delivery delayed"
                              ? "text-[#F8A14A] bg-[#FFF9E0]"
                              : order.shipmentStatus === "Shipped"
                                ? "text-[#1C3753] bg-[#D5E5F5]"
                                : ""
                    }`}>
                    {order.shipmentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">{order.deliveryDate}</td>

                <td className="px-4 py-3 font-medium text-xs">
                  <span
                    className={` bg-[#D5E5F5] inline-flex items-center justify-center min-w-[110px] px-4 py-1.5 rounded-lg font-medium text-center
                  `}>
                    {order.deliveryPartner}
                  </span>
                </td>

                <div className="flex items-center justify-center ">
                  <td className="px-4 py-3 text-right">
                    <button className="p-2  text-[#2C87E2]">
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

export default ShippedOrders;
