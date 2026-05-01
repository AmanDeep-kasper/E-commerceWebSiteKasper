import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ChevronDown, ListFilter, Search } from "lucide-react";
import OrderDetails from "./OrdersPopModels/OrderDetails";
import OrdersTimelines from "./OrdersPopModels/OrdersTimelines";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

const ShippedOrders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(false);
  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalItems);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const apiStatus = "shipped";

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

  const handleMarkDelivered = async ({ orderId }) => {
    try {
      await axiosInstance.patch(`/order/admin/${orderId}/deliver`);

      setOrdersList((prev) => prev.filter((order) => order._id !== orderId));

      toast.success("Order marked as Delivered");
      handleOrderList();
      setSelectedOrderId(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to mark ready to ship",
      );
    }
  };

  useEffect(() => {
    handleOrderList();
  }, []);

  const columns = ["Order ID", "Tracking ID", "Delivery Partner", "Action"];

  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // const [paymentstatusOpen, setPaymentStatusOpen] = useState(false);
  const [paymentstatus, setPaymentStatus] = useState("Shipment Status");
  // const Paymentstatuses = [
  //   "Shipment Status",
  //   "Shipped",
  //   "In transit",
  //   "Out for delivery",
  //   "Delivery delayed",
  //   "Failed delivery",
  // ];

  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/transport");
        setDeliveryPartners(res?.data?.data || []);
      } catch (error) {
        console.error("Transport fetch error:", error);
      }
    };

    fetchTransporters();
  }, []);

  const [filterOne, setfilterOne] = useState("Latest");
  const [filterOneOpen, setfilterOneOpen] = useState(false);

  // const filterOneItems = ["Latest", "Delivering Soon", "Delivering Later"];

  const filteredOrders = useMemo(() => {
    let result = [...ordersList];

    if (debouncedValue.trim()) {
      result = result.filter((item) =>
        item.orderNumber.toLowerCase().includes(debouncedValue.toLowerCase()),
      );
    }

    if (paymentstatus !== "Shipment Status") {
      result = result.filter((item) => item.shipmentStatus === paymentstatus);
    }

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
  }, [ordersList, debouncedValue, paymentstatus, filterOne]);

  useEffect(() => {
    setPage(1);
  }, [debouncedValue, paymentstatus, filterOne]);

  // const paginatedOrders = ordersList.slice(startIndex, endIndex);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const selectOrder = ordersList.find((order) => order._id === selectedOrderId);

  const [openTimelineId, setOpenTimelineId] = useState(null);
  const selectTimeline = ordersList.find(
    (order) => order._id === openTimelineId,
  );

  const [DeliveryPartner, setDeliveryPartner] = useState(
    "Select Delivery Partner",
  );
  const DeliveryPartners = deliveryPartners;
  const [DeliveryPartnerOpen, setDeliveryPartnerOpen] = useState(false);

  return (
    <>
      {selectOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-[#FFFFFF] w-[500px] max-w-[90vw] max-h-[90vh] p-[24px] rounded-xl relative md:w-[500px] overflow-y-auto overscroll-contain scrollbar-hide">
            <OrderDetails
              data={selectOrder}
              setSelectedOrderId={() => setSelectedOrderId(null)}
              onMarkDelivered={handleMarkDelivered}
            />
          </div>
        </div>
      )}

      {selectTimeline && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-[#FFFFFF] w-[500px] max-w-[90vw] max-h-[90vh] p-[24px] rounded-xl relative md:w-[500px] overflow-y-auto overscroll-contain scrollbar-hide">
            <OrdersTimelines
              data={selectTimeline}
              setSelectedOrderId={() => setOpenTimelineId(null)}
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

          {/* <div className="relative">
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
          </div> */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
              onClick={() => setDeliveryPartnerOpen((p) => !p)}
            >
              {DeliveryPartner}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {DeliveryPartnerOpen && (
              <div className="absolute mt-2 w-52 -right-2 top-8 bg-white border rounded-lg shadow-md z-100 max-h-60 overflow-y-auto">
                {DeliveryPartners.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => {
                      setDeliveryPartner(s.transporterName);
                      setDeliveryPartnerOpen(false);
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-[#686868] ${
                      DeliveryPartner === s.transporterName
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    {s.transporterName}
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
                <td className="px-4 py-3">
                  {order?.tracking?.trackingNumber || "-"}
                </td>
                {/* <td className="px-4 py-3">{order.deliveryDate || "-"}</td> */}

                <td className="px-4 py-3 font-medium text-xs">
                  <span className="bg-[#D5E5F5] inline-flex items-center justify-center min-w-[110px] px-4 py-1.5 rounded-lg font-medium text-center">
                    {order?.tracking?.carrier || "Not Assigned"}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-center gap-3">
                    {/* <button
                      onClick={() => setOpenTimelineId(order.orderId)}
                      className="text-[#2C87E2]"
                    >
                      Timeline
                    </button> */}

                    <button
                      onClick={() => setSelectedOrderId(order._id)}
                      className="text-[#2C87E2]"
                    >
                      View
                    </button>
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

export default ShippedOrders;
