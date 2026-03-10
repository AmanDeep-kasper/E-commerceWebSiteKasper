import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import { ChevronDown, ListFilter, MoreVertical, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import OrderDetails from "./OrdersPopModels/OrderDetails";
import { div } from "framer-motion/m";
import OrdersTimelines from "./OrdersPopModels/OrdersTimelines";
import OrderSectionInvoice from "./OrdersPopModels/OrderSectionInvoice";

const AllOrders = () => {
  const { orders } = useOutletContext();

  const columns = [
    "Order ID",
    "Quantity",
    "Order Value",
    "Payment Status",
    "Order Date",
    "Status",
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
  const [paymentstatus, setPaymentStatus] = useState("Payment Type");
  const Paymentstatuses = ["Payment Type", "Prepaid", "COD"];

  /* ================= SORT FILTER (MOVE UP) ================= */
  const [filterOne, setfilterOne] = useState("Latest Order Date");
  const [filterOneOpen, setfilterOneOpen] = useState(false);

  const filterOneItems = [
    "Latest Order Date",
    "Oldest Order Date",
    "Order Value (Low-High)",
    "Order Value (High-Low)",
  ];

  /* ================= DATE FILTER ================= */
  const [storeDate, setStoreDate] = useState("All time");
  const [openDatefilter, setOpenDatefilter] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);

  const filterOneDateItems = [
    "All time",
    "Today",
    "Last 7 days",
    "Last 30 days",
    "Last 6 months",
    "Custom date",
  ];

  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [activePicker, setActivePicker] = useState("from");

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 40 }, (_, i) => 2000 + i);

  /* ================= FILTER LOGIC ================= */
  const getDateRangeFromPreset = (preset) => {
    const today = new Date();
    let from = null;
    let to = new Date();

    switch (preset) {
      case "Today":
        from = new Date(today.setHours(0, 0, 0, 0));
        break;

      case "Last 7 days":
        from = new Date();
        from.setDate(from.getDate() - 7);
        break;

      case "Last 30 days":
        from = new Date();
        from.setDate(from.getDate() - 30);
        break;

      case "Last 6 months":
        from = new Date();
        from.setMonth(from.getMonth() - 6);
        break;

      default:
        return null;
    }

    return { from, to };
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    /* 🔍 SEARCH */
    if (debouncedValue.trim()) {
      result = result.filter((item) =>
        item.orderId.toLowerCase().includes(debouncedValue.toLowerCase()),
      );
    }

    /* 💳 PAYMENT */
    if (paymentstatus !== "Payment Type") {
      result = result.filter((item) => item.paymentType === paymentstatus);
    }

    /* 📅 DATE */
    const today = new Date();

    if (storeDate === "Today") {
      result = result.filter(
        (item) =>
          new Date(item.orderDate).toDateString() === today.toDateString(),
      );
    }

    if (storeDate === "Last 7 days") {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      result = result.filter((item) => new Date(item.orderDate) >= past);
    }

    if (storeDate === "Last 30 days") {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      result = result.filter((item) => new Date(item.orderDate) >= past);
    }

    if (storeDate === "Last 6 months") {
      const past = new Date();
      past.setMonth(today.getMonth() - 6);
      result = result.filter((item) => new Date(item.orderDate) >= past);
    }

    /* 📅 CUSTOM RANGE */
    if (range?.from && range?.to && storeDate.includes("-")) {
      result = result.filter((item) => {
        const d = new Date(item.orderDate);
        return d >= range.from && d <= range.to;
      });
    }

    /* ↕️ SORT */
    if (filterOne === "Latest Order Date") {
      result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    }

    if (filterOne === "Oldest Order Date") {
      result.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
    }

    if (filterOne === "Order Value (Low-High)") {
      result.sort((a, b) => a.orderValue - b.orderValue);
    }

    if (filterOne === "Order Value (High-Low)") {
      result.sort((a, b) => b.orderValue - a.orderValue);
    }

    return result;
  }, [orders, debouncedValue, paymentstatus, storeDate, range, filterOne]);

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

  const [openActionId, setOpenActionId] = useState(null);
  const [actionItem, setActionItem] = useState(null);
  const ActionElement = ["Order Detail", "Order Timeline", "View Invoice"];

  // this is for timeline pop model
  const [openTimelineId, setOpenTimelineId] = useState(null);
  const selectTimeline = orders.find(
    (orders) => orders.orderId === openTimelineId,
  );

  //  this is for invoice pop model
  const [openInvoiceId, setOpenInvoiceId] = useState(null);
  const selectInvoice = orders.find(
    (orders) => orders.orderId === openInvoiceId,
  );

  return (
    <>
      {/* Order Detail */}
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
      "
          >
            {/* <OrderDetails
              data={selectOrder}
              setSelectedOrderId={() => setSelectedOrderId(null)}
              handleAcceptedOrders={handleAcceptedOrders}
            /> */}
            <OrderDetails
              data={selectOrder}
              setSelectedOrderId={() => setSelectedOrderId(null)}
              onAcceptOrder={({ orderId, deliveryPartner }) => {}}
              onSaveTracking={({ orderId, trackingId, trackingUrl }) => {}}
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
      "
          >
            <OrdersTimelines
              data={selectTimeline}
              setSelectedOrderId={() => setOpenTimelineId(null)}
            />
          </div>
        </div>
      )}

      {/* Order Invoice */}

      {selectInvoice && (
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
      "
          >
            <OrderSectionInvoice
              data={selectInvoice}
              setSelectedOrderId={() => setOpenInvoiceId(null)}
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
              onClick={() => setOpenDatefilter((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg border hover:bg-gray-100"
            >
              {storeDate}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {openDatefilter && (
              <div className="absolute mt-2 w-[320px] right-0 bg-white border rounded-lg shadow-md z-50">
                {/* Date options */}
                {!showCustomDate &&
                  filterOneDateItems.map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        if (item === "Custom date") {
                          setShowCustomDate(true);
                        } else {
                          setStoreDate(item);
                          setShowCustomDate(false);
                          setOpenDatefilter(false);
                        }
                      }}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-[#686868]"
                    >
                      {item}
                    </div>
                  ))}

                {/* Custom Date Picker */}
                {showCustomDate && (
                  <div className="p-3">
                    {/* Start / End buttons */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setActivePicker("from")}
                        className={`flex-1 border rounded py-2 text-sm font-medium
    ${
      activePicker === "from"
        ? "border-[#1C3753] text-[#1C3753]"
        : "text-gray-500"
    }
    ${
      range.from ? "bg-[#D5E5F5] text-[#1C3753]" : "bg-[#FFFFFF] text-[#1C3753]"
    }
  `}
                      >
                        {range.from
                          ? range.from.toLocaleDateString()
                          : "Start Date"}
                      </button>

                      <button
                        onClick={() => setActivePicker("to")}
                        className={`flex-1 border rounded py-2 text-sm font-medium ${
                          activePicker === "to"
                            ? "border-[#1C3753] text-[#1C3753]"
                            : "text-gray-500"
                        }`}
                      >
                        {range.to ? range.to.toLocaleDateString() : "End Date"}
                      </button>
                    </div>

                    {/* Month & Year dropdowns  */}
                    <div className="flex gap-2 mb-3">
                      <select
                        value={currentMonth.getMonth()}
                        onChange={(e) =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              Number(e.target.value),
                            ),
                          )
                        }
                        className="flex-1 border rounded px-2 py-1 text-sm"
                      >
                        {months.map((m, i) => (
                          <option key={m} value={i}>
                            {m}
                          </option>
                        ))}
                      </select>

                      <select
                        value={currentMonth.getFullYear()}
                        onChange={(e) =>
                          setCurrentMonth(
                            new Date(
                              Number(e.target.value),
                              currentMonth.getMonth(),
                            ),
                          )
                        }
                        className="flex-1 border rounded px-2 py-1 text-sm"
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Calendar */}
                    <DayPicker
                      mode="single"
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      selected={activePicker === "from" ? range.from : range.to}
                      onSelect={(date) => {
                        if (!date) return;

                        setRange((prev) => {
                          const updated = {
                            ...prev,
                            [activePicker]: date,
                          };

                          // auto switch to End Date after selecting Start
                          if (activePicker === "from") {
                            setActivePicker("to");
                          }

                          return updated;
                        });
                      }}
                      showOutsideDays
                      hideNavigation
                    />

                    {/* Footer */}
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={() => {
                          setRange({ from: undefined, to: undefined });
                          setShowCustomDate(false);
                        }}
                        className="px-4 py-1.5 border rounded text-sm"
                      >
                        Cancel
                      </button>

                      <button
                        disabled={!range?.from || !range?.to}
                        onClick={() => {
                          setStoreDate(
                            `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`,
                          );
                          setOpenDatefilter(false);
                          setShowCustomDate(false);
                        }}
                        className={`px-4 py-1.5 rounded text-sm ${
                          range?.from && range?.to
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setPaymentStatusOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
            >
              {paymentstatus}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {paymentstatusOpen && (
              <div className="absolute mt-2 w-36 right-0 top-8  bg-white border rounded-lg shadow-md z-50">
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
          `}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
              onClick={() => setfilterOneOpen((p) => !p)}
            >
              <ListFilter className="w-4 h-4" />
              {filterOne}
            </button>
            {filterOneOpen && (
              <div className="absolute mt-2 w-52 -right-2 top-8 bg-white border rounded-lg shadow-md z-50">
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
                      }`}
                    >
                      {s}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* table rows */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm  text-gray-600">
          <thead className="bg-[#F8F8F8] h-[54px]">
            <tr className="text-[#4B5563] text-sm">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 font-medium text-[#1C1C1C] text-center"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.orderId}
                className="border-t hover:bg-gray-50 transition  cursor-pointer text-center"
              >
                <td
                  // onClick={() => {
                  //   setSelectedOrderId(order.orderId);
                  // }}
                  className="px-4 py-3"
                >
                  {order.orderId}
                </td>
                <td className="px-4 py-3">{order.quantity}</td>
                <td className="px-4 py-3">₹{order.orderValue}</td>
                <td
                  className={`px-4 py-3 font-medium text-xs ${
                    order.paymentType === "Prepaid"
                      ? "text-[#00A63E]"
                      : order.paymentType
                        ? "text-[#F8A14A]"
                        : ""
                  }`}
                >
                  {order.paymentType}
                </td>
                <td className="px-4 py-3 ">{order.orderDate}</td>

                <td className=" py-4 ">
                  <span
                    className={`px-6 py-1 rounded-md text-xs font-medium
                    ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-600"
                        : order.orderStatus === "Cancelled"
                          ? "bg-[#EFEFEF] text-[#686868]"
                          : order.orderStatus === "New Orders"
                            ? "bg-[#FFF9E0] text-[#F8A14A]"
                            : order.orderStatus === "Processing"
                              ? "bg-[#E6D3FF] text-[#8A38F5]"
                              : order.orderStatus === "Shipped"
                                ? "bg-[#D5E5F5] text-[#1C3753]"
                                : ""
                    }
                  `}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <div className="flex items-center justify-center">
                  <td className="px-4 py-3  relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionId(
                          openActionId === order.orderId ? null : order.orderId,
                        );
                      }}
                      className="p-2 rounded-full  flex items-center justify-center"
                    >
                      {/* <MoreVertical className="w-4 h-4 text-gray-600" /> */}
                      <p
                        className="hover:underline text-[#2C87E2]"
                        onClick={() => {
                          setSelectedOrderId(order.orderId);
                        }}
                      >
                        view
                      </p>
                    </button>
                    {/* {openActionId === order.orderId && (
                      <div
                        className="absolute mt-2 w-40 right-0 top-10
bg-white border rounded-lg shadow-md z-50">
                        {ActionElement.map((item) => {
                          return (
                            <div
                              key={item}
                              onClick={() => {
                                setActionItem(item);
                                setOpenActionId(null);

                                if (item === "Order Detail") {
                                  setSelectedOrderId(order.orderId);
                                }

                                if (item === "Order Timeline") {
                                  console.log(
                                    "Open timeline for",
                                    order.orderId,
                                    setOpenTimelineId(order.orderId),
                                  );
                                }

                                if (item === "View Invoice") {
                                  console.log(
                                    "Open invoice for",
                                    order.orderId,
                                    setOpenInvoiceId(order.orderId),
                                  );
                                }
                              }}
                              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-[#686868] `}>
                              {item}
                            </div>
                          );
                        })}
                      </div>
                    )} */}
                  </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination on the bottom */}
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
              disabled={page === 1}
            >
              ‹
            </button>

            <div className="px-4 py-1 border rounded">
              Page {String(page).padStart(2, "0")} of{" "}
              {String(totalPages).padStart(2, "0")}
            </div>

            <button
              className="px-3 py-1 border rounded disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllOrders;
