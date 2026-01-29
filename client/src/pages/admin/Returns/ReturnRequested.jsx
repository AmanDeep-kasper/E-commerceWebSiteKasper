import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import { ChevronDown, ListFilter, MoreVertical, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
// import OrderDetails from ". /OrdersPopModels/OrderDetails";
// import OrderCancel from "./OrdersPopModels/OrderCancel";
import { toast } from "react-toastify";

const ReturnRequested = () => {
  const { returns } = useOutletContext();

  const columns = [
    "Return ID",
    "Return Type",
    "Return Reason",
    "Return Date",
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
  const [paymentstatus, setPaymentStatus] = useState("Return Type");
  const Paymentstatuses = ["Return Type", "Exchange", "Return"];

  /* ================= SORT FILTER (MOVE UP) ================= */
  const [filterOne, setfilterOne] = useState("Latest");
  const [filterOneOpen, setfilterOneOpen] = useState(false);

  const filterOneItems = [
    "Latest",
    "Latest Return Date",
    "Oldest Return Date",
    // "Order Value (Low-High)",
    // "Order Value (High-Low)",
  ];

  const filteredOrders = useMemo(() => {
    let result = [...returns];

    /* 🔍 SEARCH */
    if (debouncedValue.trim()) {
      result = result.filter((item) =>
        item.returnId.toLowerCase().includes(debouncedValue.toLowerCase()),
      );
    }

    /* 💳 PAYMENT */
    if (paymentstatus !== "Return Type") {
      result = result.filter((item) => item.type === paymentstatus);
    }

    /* ↕️ SORT */
    if (filterOne === "Latest Return Date") {
      result.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
    }

    if (filterOne === "Oldest Return Date") {
      result.sort((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt));
    }

    // if (filterOne === "Order Value (Low-High)") {
    //   result.sort((a, b) => a.orderValue - b.orderValue);
    // }

    // if (filterOne === "Order Value (High-Low)") {
    //   result.sort((a, b) => b.orderValue - a.orderValue);
    // }

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

  //////////////////////////////////////////////////
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const selectOrder = returns.find(
    (orders) => orders.orderId === selectedOrderId,
  );

  // cancel order module

  const [openCancelModule, setopenCancelModule] = useState(null);
  const [cancelResionData, setCancelResionData] = useState("");

  const selectCancelOrder = returns.find(
    (orders) => orders.orderId === openCancelModule,
  );
  // Accepted order

  const [acceptedOrders, setAcceptedOrders] = useState([]);

  const handleAcceptedOrders = (orderId) => {
    setAcceptedOrders((prev) => [...prev, orderId]);
  };

  const handleCancelOrder = (orderId) => {
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

      {selectCancelOrder && (
        <OrderCancel
          order={selectCancelOrder}
          setCancelReason={setCancelResionData}
          cancelReason={cancelResionData}
          close={() => {
            setopenCancelModule(null);
            setCancelResionData("");
          }}
          onConfirmCancel={() => handleCancelOrder(selectCancelOrder.orderId)}
        />
      )}
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
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-[#F8F8F8] h-[54px]">
            <tr className="text-[#4B5563] text-sm text-center">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 font-medium text-[#1C1C1C]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.returnId}
                className="border-t hover:bg-gray-50 transition text-center cursor-pointer">
                <td
                  onClick={() => {
                    setSelectedOrderId(order.returnId);
                  }}
                  className="px-4 py-3 hover:underline text-[#2C87E2]">
                  {order.returnId}
                </td>
                <td className="px-4 py-3 font-medium text-xs ">
                  <span
                    className={`inline-flex items-center justify-center min-w-[110px] px-4 py-1.5 rounded-md font-medium text-center ${
                      order.type === "Return"
                        ? "text-[#8A38F5] bg-[#E6D3FF]"
                        : order.type === "Exchange"
                          ? "text-[#008D94] bg-[#C7FCFF]"
                          : ""
                    }`}>
                    {order.type}
                  </span>
                </td>
                <td className="px-4 py-3">{order.returnReason}</td>

                <td className="px-4 py-3">{order.requestedAt}</td>

                <td className="px-4 py-3 text-right flex items-center justify-center gap-3">
                  <span className="hover:underline text-[#1C3753]">view</span>
                  {acceptedOrders.includes(order.returnId) ? (
                    <span className="px-6 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-600">
                      Accepted
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAcceptedOrders(order.orderId)}
                        className="px-6 py-1.5 rounded-md flex items-center justify-center text-white bg-[#1C3753]">
                        Approve
                      </button>

                      <button
                        onClick={() => setopenCancelModule(order.orderId)}
                        className="px-6 py-1.5 rounded-md flex items-center justify-center text-[#1C3753] bg-white border border-[#1C3753]">
                        Reject
                      </button>
                    </>
                  )}
                </td>
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

export default ReturnRequested;
