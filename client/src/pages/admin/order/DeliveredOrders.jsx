import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ChevronDown, ListFilter, Search } from "lucide-react";
import OrderDetails from "./OrdersPopModels/OrderDetails";
import { DayPicker } from "react-day-picker";
import axiosInstance from "../../../api/axiosInstance";

const DeliveredOrders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(false);
  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalItems);

  const apiStatus = "delivered";
  const handleOrderList = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/order/admin", {
        params: {
          page,
          limit,
          status: apiStatus,
        },
      });
      console.log(res);
      setOrdersList(res?.data?.orders || []);
      setTotalItems(res?.data?.pagination?.total || 0);
      setTotalPages(res?.data?.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleOrderList();
  }, [page]);

  const columns = [
    "Order ID",
    "Quantity",
    "Order Value",
    "Delivered Date",
    "Action",
  ];

  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const [paymentstatusOpen, setPaymentStatusOpen] = useState(false);
  const [paymentstatus, setPaymentStatus] = useState("Payment Status");

  const [filterOne, setfilterOne] = useState("Latest");
  const [filterOneOpen, setfilterOneOpen] = useState(false);

  const filterOneItems = [
    "Latest",
    "Latest Delivery Date",
    "Oldest Delivery Date",
    "Order Value (Low-High)",
    "Order Value (High-Low)",
  ];

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

  const filteredOrders = useMemo(() => {
    let result = [...ordersList];

    // search
    if (debouncedValue.trim()) {
      result = result.filter((item) =>
        item.orderNumber.toLowerCase().includes(debouncedValue.toLowerCase()),
      );
    }

    // payment filter
    // if (paymentstatus !== "Payment Status") {
    //   result = result.filter((item) => item.paymentStatus === paymentstatus);
    // }

    // sort
    if (filterOne === "Latest") {
      result.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
    }

    if (filterOne === "Latest Delivery Date") {
      result.sort(
        (a, b) => new Date(b.deliveredAt) - new Date(a.deliveredAt),
      );
    }

    if (filterOne === "Oldest Delivery Date") {
      result.sort(
        (a, b) => new Date(a.deliveredAt) - new Date(b.deliveredAt),
      );
    }

    if (filterOne === "Order Value (Low-High)") {
      result.sort((a, b) => a.grandTotal - b.grandTotal);
    }

    if (filterOne === "Order Value (High-Low)") {
      result.sort((a, b) => b.grandTotal - a.grandTotal);
    }

    // date filter
    const today = new Date();

    if (storeDate === "Today") {
      result = result.filter(
        (item) =>
          new Date(item.deliveredAt).toDateString() === today.toDateString(),
      );
    }

    if (storeDate === "Last 7 days") {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      result = result.filter((item) => new Date(item.deliveredAt) >= past);
    }

    if (storeDate === "Last 30 days") {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      result = result.filter((item) => new Date(item.deliveredAt) >= past);
    }

    if (storeDate === "Last 6 months") {
      const past = new Date();
      past.setMonth(today.getMonth() - 6);
      result = result.filter((item) => new Date(item.deliveredAt) >= past);
    }

    if (range?.from && range?.to && storeDate.includes("-")) {
      result = result.filter((item) => {
        const d = new Date(item.deliveredAt);
        return d >= range.from && d <= range.to;
      });
    }

    return result;
  }, [ordersList, debouncedValue, paymentstatus, filterOne, storeDate, range]);

  useEffect(() => {
    setPage(1);
  }, [debouncedValue, paymentstatus, filterOne, storeDate, range]);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const selectOrder = ordersList.find((order) => order._id === selectedOrderId);

  return (
    <>
      {selectOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-[#FFFFFF] w-[500px] max-w-[90vw] max-h-[90vh] p-[24px] rounded-xl relative md:w-[500px] overflow-y-auto overscroll-contain scrollbar-hide">
            <OrderDetails
              data={selectOrder}
              setSelectedOrderId={() => setSelectedOrderId(null)}
            />
          </div>
        </div>
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
              onClick={() => setOpenDatefilter((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg border hover:bg-gray-100"
            >
              {storeDate}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {openDatefilter && (
              <div className="absolute mt-2 w-[320px] right-0 bg-white border rounded-lg shadow-md z-50">
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

                {showCustomDate && (
                  <div className="p-3">
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setActivePicker("from")}
                        className={`flex-1 border rounded py-2 text-sm font-medium ${
                          activePicker === "from"
                            ? "border-[#1C3753] text-[#1C3753]"
                            : "text-gray-500"
                        } ${
                          range.from
                            ? "bg-[#D5E5F5] text-[#1C3753]"
                            : "bg-[#FFFFFF] text-[#1C3753]"
                        }`}
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

                          if (activePicker === "from") {
                            setActivePicker("to");
                          }

                          return updated;
                        });
                      }}
                      showOutsideDays
                      hideNavigation
                    />

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

          {/* <div className="relative">
            <button
              onClick={() => setPaymentStatusOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
            >
              {paymentstatus}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {paymentstatusOpen && (
              <div className="absolute mt-2 w-40 right-0 top-8 bg-white border rounded-lg shadow-md z-20">
                {Paymentstatuses.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setPaymentStatus(s);
                      setPaymentStatusOpen(false);
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer text-[#686868] hover:bg-gray-100 ${
                      paymentstatus === s ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div> */}

          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
              onClick={() => setfilterOneOpen((p) => !p)}
            >
              <ListFilter className="w-4 h-4" />
              {filterOne}
            </button>

            {filterOneOpen && (
              <div className="absolute mt-2 w-48 -right-2 top-8 bg-white border rounded-lg shadow-md z-50">
                {filterOneItems.map((s) => (
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-center text-gray-600">
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
            {filteredOrders.map((order) => (
              <tr
                key={order.orderNumber}
                className="border-t hover:bg-gray-50 transition cursor-pointer text-center"
              >
                <td className="px-4 py-3">{order.orderNumber}</td>
                <td className="px-4 py-3">{order.items?.reduce((acc, item) => acc + item.quantity, 0)}</td>
                <td className="px-4 py-3">₹{order.grandTotal}</td>

                {/* <td className="px-4 py-3 font-medium text-xs">
                  <span
                    className={`inline-flex items-center justify-center min-w-[110px] px-3 py-1.5 rounded-lg font-medium text-center ${
                      order.paymentStatus === "Paid"
                        ? "bg-[#D5E5F5] text-[#1C3753]"
                        : order.paymentStatus === "COD Collected"
                        ? "bg-[#FBDBF7] text-[#E91DD1]"
                        : ""
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td> */}

                <td className="px-4 py-3">
                 {new Date(order.deliveredAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-right relative">
                  <div className="flex items-center justify-center">
                    <p
                      onClick={() => setSelectedOrderId(order._id)}
                      className="hover:underline text-[#2C87E2]"
                    >
                      View
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-3 text-sm text-gray-600">
          <div>
            Showing <span className="font-medium">{startIndex}</span>–
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
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

export default DeliveredOrders;
