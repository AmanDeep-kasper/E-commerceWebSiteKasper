import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ChevronDown, ListFilter, Search } from "lucide-react";
import OrderDetails from "./OrdersPopModels/OrderDetails";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

const ProcessingOrders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(false);
  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalItems);

  const apiStatus = "processing";

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

  const handleReadyToShip = async ({ orderId, carrier }) => {
    try {
      if (!carrier) {
        toast.error("Please select delivery partner");
        return;
      }

      await axiosInstance.patch(`/order/admin/${orderId}/ready-to-ship`, {
        carrier,
      });

      setOrdersList((prev) => prev.filter((order) => order._id !== orderId));

      toast.success("Order marked as Ready to Ship ✅");
      setSelectedOrderId(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to mark ready to ship",
      );
    }
  };

  useEffect(() => {
    if (!apiStatus) return;
    handleOrderList();
  }, [page, apiStatus]);

  const columns = [
    "Order ID",
    "Quantity",
    "Order Value",
    "Status",
    "Delivery Partner",
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
  const [paymentstatus, setPaymentStatus] = useState("Label Generated");
  const Paymentstatuses = ["Label Generated", "Generated", "Not Generated"];
  const [DeliveryPartner, setDeliveryPartner] = useState(
    "Select Delivery Partner",
  );
  const DeliveryPartners = ["Kasper", "Other"];

  const [filterOne, setfilterOne] = useState("Latest Dispatch Date");
  const [filterOneOpen, setfilterOneOpen] = useState(false);
  const [DeliveryPartnerOpen, setDeliveryPartnerOpen] = useState(false);

  const filterOneItems = [
    "Latest Dispatch Date",
    "Oldest Dispatch Date",
    "Order Value (Low-High)",
    "Order Value (High-Low)",
  ];

  const filteredOrders = useMemo(() => {
    let result = [...ordersList];

    if (debouncedValue.trim()) {
      result = result.filter((item) =>
        item.orderNumber.toLowerCase().includes(debouncedValue.toLowerCase()),
      );
    }

    if (paymentstatus !== "Label Generated") {
      result = result.filter((item) => item.labelGenerated === paymentstatus);
    }

    if (filterOne === "Latest Dispatch Date") {
      result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    }

    if (filterOne === "Oldest Dispatch Date") {
      result.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
    }

    if (filterOne === "Order Value (Low-High)") {
      result.sort((a, b) => a.orderValue - b.orderValue);
    }

    if (filterOne === "Order Value (High-Low)") {
      result.sort((a, b) => b.orderValue - a.orderValue);
    }

    return result;
  }, [ordersList, debouncedValue, paymentstatus, filterOne]);

  useEffect(() => {
    setPage(1);
  }, [debouncedValue, paymentstatus, filterOne]);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const selectOrder = ordersList.find((order) => order._id === selectedOrderId);

  const [openCancelModule, setopenCancelModule] = useState(null);

  return (
    <>
      {selectOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-[#FFFFFF] w-[500px] max-w-[90vw] max-h-[90vh] p-[24px] rounded-xl relative md:w-[500px] overflow-y-auto overscroll-contain scrollbar-hide">
            <OrderDetails
              data={selectOrder}
              setSelectedOrderId={() => setSelectedOrderId(null)}
              onReadyToShip={handleReadyToShip}
              onSaveTracking={({ orderId, trackingId, trackingUrl }) => {
                updateOrder(orderId, {
                  orderStatus: "Shipped",
                  trackingId,
                  trackingUrl,
                });

                toast.success("Order moved to Shipped", {
                  style: { background: "#E0F4DE", color: "#1C1C1C" },
                });

                setSelectedOrderId(null);
              }}
              setopenCancelModule={setopenCancelModule}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg">
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
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
                onClick={() => setDeliveryPartnerOpen((p) => !p)}
              >
                {DeliveryPartner}
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {DeliveryPartnerOpen && (
                <div className="absolute mt-2 w-52 -right-2 top-8 bg-white border rounded-lg shadow-md z-100">
                  {DeliveryPartners.map((s) => (
                    <div
                      key={s}
                      onClick={() => {
                        setDeliveryPartner(s);
                        setDeliveryPartnerOpen(false);
                      }}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-[#686868] ${
                        DeliveryPartner === s
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

            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
                onClick={() => setfilterOneOpen((p) => !p)}
              >
                <ListFilter className="w-4 h-4" />
                {filterOne}
              </button>
              {filterOneOpen && (
                <div className="absolute mt-2 w-52 -right-2 top-8 bg-white border rounded-lg shadow-md z-100">
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

        <table className="w-full text-sm text-center text-gray-600">
          <thead className="bg-[#F8F8F8] h-[54px]">
            <tr className="text-[#4B5563] text-sm">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 font-medium text-[#1C1C1C]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ordersList.map((order, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="px-4 py-3">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  {order.items?.reduce((acc, item) => acc + item.quantity, 0)}
                </td>
                <td className="px-4 py-3">₹{order.grandTotal}</td>

                <td className="px-4 py-3 font-medium text-xs">
                  <span className="inline-flex items-center justify-center min-w-[110px] px-4 py-1.5 rounded-lg font-medium text-center bg-[#E0F4DE] text-[#00A63E]">
                    {order?.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs">
                  <span className="bg-[#D5E5F5] inline-flex items-center justify-center min-w-[110px] px-4 py-1.5 rounded-lg font-medium text-center">
                    {order.deliveryPartner || "Not Assigned"}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-center">
                    <p
                      onClick={() => {
                        setSelectedOrderId(order._id);
                      }}
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

export default ProcessingOrders;
