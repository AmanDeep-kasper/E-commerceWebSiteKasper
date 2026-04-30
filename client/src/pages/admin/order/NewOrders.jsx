import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ChevronDown, ListFilter, Search } from "lucide-react";
import "react-day-picker/dist/style.css";
import OrderDetails from "./OrdersPopModels/OrderDetails";
import OrderCancel from "./OrdersPopModels/OrderCancel";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axiosInstance";

const NewOrders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(false);
  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalItems);

  const apiStatus = "placed";

  const handleOrderList = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/order/admin", {
        params: {
          page,
          limit,
          status: apiStatus,
          search: debouncedValue,
          paymentType: paymentstatus !== "Payment Type" ? paymentstatus : "",
          sortBy: filterOne,
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

  const handleAcceptOrder = async (orderId) => {
    try {
      await axiosInstance.patch(`/order/admin/${orderId}/accept`);

      setOrdersList((prev) =>
        (Array.isArray(prev) ? prev : []).map((order) =>
          order._id === orderId ? { ...order, status: "processing" } : order,
        ),
      );

      toast.success("Order accepted successfully ✅");

      handleOrderList();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to accept order ❌",
      );
    }
  };

  const columns = [
    "Order ID",
    "Quantity",
    "Order Value",
    // "Payment Status",
    "Order Time",
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
  const [paymentstatus, setPaymentStatus] = useState("Payment Type");
  const Paymentstatuses = ["Payment Type", "Prepaid", "COD"];

  const [filterOne, setfilterOne] = useState("Latest");
  const [filterOneOpen, setfilterOneOpen] = useState(false);

  const filterOneItems = [
    "Latest Order Date",
    "Oldest Order Date",
    "Order Value (Low-High)",
    "Order Value (High-Low)",
  ];

  const filteredOrders = useMemo(() => {
    let result = [...(ordersList || [])];

    if (debouncedValue.trim()) {
      result = result.filter((item) =>
        item._id?.toLowerCase().includes(debouncedValue.toLowerCase()),
      );
    }

    // if (paymentstatus !== "Payment Type") {
    //   result = result.filter((item) => item.paymentType === paymentstatus);
    // }

    if (filterOne === "Latest Order Date") {
      result.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
    }

    if (filterOne === "Oldest Order Date") {
      result.sort((a, b) => new Date(a.placedAt) - new Date(b.placedAt));
    }

    if (filterOne === "Order Value (Low-High)") {
      result.sort((a, b) => a.grandTotal - b.grandTotal);
    }

    if (filterOne === "Order Value (High-Low)") {
      result.sort((a, b) => b.grandTotal - a.grandTotal);
    }

    return result;
  }, [ordersList, debouncedValue, paymentstatus, filterOne]);

  useEffect(() => {
    handleOrderList();
  }, [page, apiStatus, debouncedValue, paymentstatus, filterOne]);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const selectOrder = ordersList.find((o) => o._id === selectedOrderId);

  const [openCancelModule, setopenCancelModule] = useState(null);
  const [cancelResionData, setCancelResionData] = useState("");

  const selectCancelOrder = ordersList.find(
    (o) => o.orderId === openCancelModule,
  );

  const handleCancelOrder = (orderId) => {
    updateOrder(orderId, { orderStatus: "Cancelled" });

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
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
          onMouseDown={() => setSelectedOrderId(null)}
        >
          <div
            className="bg-white w-[500px] max-w-[90vw] max-h-[90vh] p-[24px] rounded-xl overflow-y-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <OrderDetails
              data={selectOrder}
              setSelectedOrderId={() => setSelectedOrderId(null)}
              onAcceptOrder={handleAcceptOrder}
              onSaveTracking={({ orderId, trackingId, trackingUrl }) => {}}
              setopenCancelModule={setopenCancelModule}
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
          {/* <div className="relative">
            <button
              onClick={() => setPaymentStatusOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
            >
              {paymentstatus}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {paymentstatusOpen && (
              <div className="absolute mt-2 w-36 right-0 top-8 bg-white border rounded-lg shadow-md z-20">
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
              <div className="absolute mt-2 w-48 -right-2 top-8 bg-white border rounded-lg shadow-md z-100">
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
            {filteredOrders.map((order, indx) => (
              <tr
                key={indx}
                className="border-t hover:bg-gray-50 transition text-center cursor-pointer"
              >
                <td className="px-4 py-3">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  {" "}
                  {order.items?.reduce((acc, item) => acc + item.quantity, 0)}
                </td>
                <td className="px-4 py-3">₹{order.grandTotal}</td>
                {/* <td
                  className={`px-4 py-3 font-medium text-xs ${
                    order.paymentType === "Prepaid"
                      ? "text-[#00A63E]"
                      : order.paymentType
                      ? "text-[#F8A14A]"
                      : ""
                  }`}
                >
                  {order.paymentType}
                </td> */}
                <td className="px-4 py-3">
                  {/* <div>
                    {new Date(order.placedAt).toLocaleDateString("en-IN")}
                  </div> */}
                  <div className="">
                    {new Date(order.placedAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>

                <td className="px-4 py-3 text-right flex items-center justify-center gap-2">
                  <p
                    onClick={() => {
                      setSelectedOrderId(order._id);
                    }}
                    className="hover:underline text-[#2C87E2]"
                  >
                    View
                  </p>
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

export default NewOrders;
