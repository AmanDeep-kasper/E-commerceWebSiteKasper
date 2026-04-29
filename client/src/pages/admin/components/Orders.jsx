// const InfoRow = ({ label, value }) => (
//   <div className="flex flex-col gap-0.5">
//     <span className="text-[13px] font-medium text-gray-700">{label}</span>
//     <span className="text-sm text-gray-900">{value}</span>
//   </div>
// );

// const Section = ({ children }) => (
//   <div className="grid grid-cols-2 gap-x-12 gap-y-5 py-4">{children}</div>
// );

// const Divider = () => <hr className="border-gray-200 my-2" />;

// function Orders({ customer }) {
//   return (
//     <div className="col-span-7 bg-gray-50 text-gray-900">
//       <div className="min-w-full">
//         <div className="bg-white border rounded-xl shadow-sm p-5 w-full">
//           <h2 className="text-sm font-semibold text-gray-900 mb-1">
//             Order Insights
//           </h2>

//           <Section>
//             <InfoRow label="Total Orders:" value={customer?.total_orders || "working"} />
//             <InfoRow
//               label="First Order Date:"
//               value={customer?.firstDate || "24 Aug"}
//             />
//             <InfoRow label="Total Spend:" value={customer.total_spent} />
//             <InfoRow
//               label="Last Order Date:"
//               value={customer.last_order_date}
//             />
//             <InfoRow
//               label="Avg. Order Value:"
//               value={customer?.avgValue || "24"}
//             />
//             <InfoRow
//               label="Most Purchased Product:"
//               value={customer?.mostProduct || "later"}
//             />
//             <InfoRow
//               label="Top Category Purchased:"
//               value={customer?.topCategory || "later"}
//             />
//           </Section>

//           <Divider />

//           <Section>
//             <InfoRow
//               label="Failed Payment Attempts:"
//               value={customer?.failedPayments || "fixed"}
//             />
//             <InfoRow
//               label="Discount Code Usage:"
//               value={customer?.discountUsage || "fixed"}
//             />
//             <InfoRow
//               label="Delivery Success Rate:"
//               value={customer?.deliveryRate || "fixed"}
//             />
//             <InfoRow label="Shipping Location(s):" value={customer.address} />
//             <InfoRow
//               label="Cart Abandonment Rate:"
//               value={customer?.cartAbandon || "fixed"}
//             />
//           </Section>

//           <Divider />

//           <Section>
//             <InfoRow
//               label="Preferred Payment Method:"
//               value={customer.preferred_payment_method}
//             />
//             <InfoRow label="Order Frequency:" value={customer.freq || "Most"} />
//             <InfoRow
//               label="Last Order Value:"
//               value={customer.lastValue || "20k"}
//             />
//             <InfoRow
//               label="Cancelled Orders:"
//               value={String(customer.cancelled || "4").padStart(2, "0")}
//             />
//           </Section>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Orders;
import { Link, useOutletContext } from "react-router-dom";
import customers from "../data/orders.json";
import { useState, useEffect } from "react";
import OrderViewModal from "../components/OrderViewModal";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl overflow-hidden mb-4 ${className}`}>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1 p-1 rounded-lg">
    <div className="flex items-center text-xs font-medium text-gray-500 tracking-wide">
      <span>{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  </div>
);

function Orders() {
  const {customer} = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
   const [stats, setStats] = useState({
    total: 0,
    cancelled: 0,
    totalSpend: 0,
    topCategory: null,
    lastOrderDate: null
  });

  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [totalItems, setTotalItems] = useState(0);
 const rowsPerPage = 10;

 const [open, setOpen] = useState(false);
 const [selectedOrder, setSelectedOrder] = useState(null);

//  Fetch orders from API
const fetchOrders = async () => {
  try {
    setLoading(true);
      // Get userId from customer context
    const userId = customer?._id || customer?.id;
      if (!userId) {
        throw new Error("User ID not found");
      }
    const response = await axiosInstance.get(`/order/admin/${userId}/orders`, {
      params: {
        page,
        limit: rowsPerPage,
      },
    });
    console.log("Orders API Response:", response.data);
     if (response.data?.data && response.data.data.length > 0) {
      console.log("=== FIRST ORDER DETAILS ===");
      console.log("First order:", response.data.data[0]);
      console.log("Items in first order:", response.data.data[0].items);
      console.log("Number of items:", response.data.data[0].items?.length);
      
      // Check if product is populated
      if (response.data.data[0].items && response.data.data[0].items.length > 0) {
        console.log("First item product:", response.data.data[0].items[0].product);
      }
    }
    
    if(response.data?.success) {
      setOrders(response.data.data || []);
      setTotalItems(response.data.pagination?.total || 0);
      setTotalPages(response.data.pagination?.pages || 1);
      // ✅ Use the stats from API
        setStats({
          total: response.data.stats?.total || 0,
          cancelled: response.data.stats?.cancelled || 0,
          totalSpend: response.data.stats?.totalSpend || 0,
          topCategory: response.data.stats?.topCategory?.name,
          lastOrderDate: response.data.stats?.lastOrderDate
        });

    }
    setError(null);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to load orders");
    setError(err.response?.data?.message || "Failed to load orders");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if(customer?._id || customer?.id) {
    fetchOrders();
  }
}, [page, customer]);


 // Format last order date
  const formatLastOrderDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };


// calculate order summary from API data
const orderSummary = {
  totalOrder: totalItems,
  totalSpend: orders.reduce((sum,o) => sum + (o.grandTotal || 0), 0),
  cancelledOrder: orders.filter(o => o.status === "Cancelled").length,
  lastOrderDate: orders.length > 0 ? new Date(Math.max(...orders.map(o => new Date(o.createdAt)))).toLocaleDateString() : "N/A",
  topCategoryPurchased:"N/A", // This would require additional data processing based on order items
};

// if loading 
if(loading && page === 1) {
  return (
    <div className="text-center py-8">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C3753] mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading orders...</p>
    </div>
  )
}

  // Pagination calculations
  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, totalItems);

  const formatDate = (dateString) => {
    if(!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
   
   const getStatusColor = (status) => {
    const statusColors = {
      placed: "bg-[#FFF9E0] text-[#F8A14A]",
      processing: "bg-[#E6D3FF] text-[#8A38F5]",
      ready_to_ship: "bg-[#FBDBF7] text-[#E91DD1]",
      shipped: "bg-[#C7FCFF] text-[#008D94]",
      delivered: "bg-[#E0F4DE] text-[#00A63E]",
      cancelled: "bg-[#EFEFEF] text-[#686868]",
      refunded: "bg-[#FFE0E0] text-[#D53B35]",
    };
    return statusColors[status] || "bg-gray-100 text-gray-600";
  };

    const getStatusDisplay = (status) => {
    const statusMap = {
      placed: "Placed",
      processing: "Processing",
      ready_to_ship: "Ready to Ship",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      refunded: "Refunded",
    };
    return statusMap[status] || status;
  };

  // ======= SUMMARY OBJECT FOR InfoRow =======
  // const orderSummary = {
  //   totalOrder: customers.length,
  //   totalSpend: customers
  //     .filter(
  //       (o) => o.payment_status === "Paid" && o.delivery_status === "Delivered",
  //     )
  //     .reduce((sum, o) => sum + Number(o.amazon_price), 0),
  //   cancelledOrder: customers.filter((o) => o.delivery_status === "Cancelled")
  //     .length,
  //   lastOrderDate: customers
  //     .map((o) => new Date(o.order_date))
  //     .sort((a, b) => b - a)[0]
  //     ?.toDateString(),
  //   topCategoryPurchased: (() => {
  //     const map = {};
  //     customers.forEach((o) => {
  //       map[o.category] = (map[o.category] || 0) + 1;
  //     });
  //     return Object.keys(map).reduce((a, b) => (map[a] > map[b] ? a : b));
  //   })(),
  // };

  // const [open, setOpen] = useState(false);
  // const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="text-gray-900">
      <div className="bg-white px-4 py-2 rounded-xl border">
        <Card>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              Order Details
            </h2>
          </div>

          <div className="gap-4">
            {/* Info Section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoRow label="Total Orders" value={stats?.total || 0} />
              <InfoRow
                label="Total Spend"
                value={`₹${(stats?.totalSpend || 0).toFixed(2)}`}
              />
              <InfoRow
                label="Cancelled Orders"
                value={stats?.cancelled || 0}
              />
              <InfoRow
                label="Last Order Date"
                value={formatLastOrderDate(stats?.lastOrderDate) || "N/A"}
              />
              <InfoRow
                label="Top Category Purchased"
                value={stats?.topCategory || "N/A"}
              />
            </div>
          </div>
        </Card>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F5F8FA] text-gray-600">
              <tr>
                {[
                  "Order ID",
                  "Order Date",
                  "Amount",
                  // "Payment",
                  "Order Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-4 font-medium text-center whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
No Orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition text-center"
                >
                  <td className="px-4 py-3">{order?.orderNumber || "N/A"}</td>
                  <td className="px-4 py-3  ">{formatDate(order?.createdAt)}</td>
                  <td className="px-4 py-3 ">₹{order?.grandTotal?.toFixed(2) || "0.00"}</td>
                  {/* <td className="px-4 py-3 ">
                    <span
                      className={`inline-flex text-sm font-medium  ${r.payment_status === "Paid" ? "text-[#00A63E]" : r.payment_status === "Cod" ? "text-[#F8A14A]" : ""}`}
                    >
                      {r.payment_status}
                    </span>
                  </td> */}
                 <td className="px-1 py-3">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(order?.status)}`}
                      >
                        {getStatusDisplay(order?.status)}
                      </span>
                    </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrder(order);
                        setOpen(true);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
    {totalItems > 0 && (  
        <div className="flex items-center justify-between py-3 text-sm text-gray-600">
          <div>
            Showing <span className="font-medium">{start}</span>–
            <span className="font-medium">{end}</span> of{" "}
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
          )}
        </div>
        <OrderViewModal
          open={open}
          data={selectedOrder}
          setSelectedOrderId={() => {
            setOpen(false);
            setSelectedOrder(null);
          }}
        />
      </div>
  );
}

export default Orders;
