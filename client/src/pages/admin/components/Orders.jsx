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
import { Link, useOutletContext } from "react-router";
import customers from "../data/orders.json";
import { useState } from "react";
import OrderViewModal from "../components/OrderViewModal";

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
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Pagination calculations
  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, customers.length);
  const total = customers.length;
  const totalPages = Math.ceil(customers.length / rowsPerPage);
  const rows = customers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ======= SUMMARY OBJECT FOR InfoRow =======
  const orderSummary = {
    totalOrder: customers.length,
    totalSpend: customers
      .filter(
        (o) => o.payment_status === "Paid" && o.delivery_status === "Delivered",
      )
      .reduce((sum, o) => sum + Number(o.amazon_price), 0),
    cancelledOrder: customers.filter((o) => o.delivery_status === "Cancelled")
      .length,
    lastOrderDate: customers
      .map((o) => new Date(o.order_date))
      .sort((a, b) => b - a)[0]
      ?.toDateString(),
    topCategoryPurchased: (() => {
      const map = {};
      customers.forEach((o) => {
        map[o.category] = (map[o.category] || 0) + 1;
      });
      return Object.keys(map).reduce((a, b) => (map[a] > map[b] ? a : b));
    })(),
  };

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
              <InfoRow label="Total Orders" value={orderSummary.totalOrder} />
              <InfoRow
                label="Total Spend"
                value={`₹${orderSummary.totalSpend}`}
              />
              <InfoRow
                label="Cancelled Orders"
                value={orderSummary.cancelledOrder}
              />
              <InfoRow
                label="Last Order Date"
                value={orderSummary.lastOrderDate}
              />
              <InfoRow
                label="Top Category Purchased"
                value={orderSummary.topCategoryPurchased}
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
                  "Payment",
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
              {rows.map((r) => (
                <tr
                  key={r.order_id}
                  className="border-t hover:bg-gray-50 transition text-center"
                >
                  <td className="px-4 py-3">{r.order_id}</td>
                  <td className="px-4 py-3  ">{r.order_date}</td>
                  <td className="px-4 py-3 ">₹{r.amazon_price}</td>
                  <td className="px-4 py-3 ">
                    <span
                      className={`inline-flex text-sm font-medium  ${r.payment_status === "Paid" ? "text-[#00A63E]" : r.payment_status === "Cod" ? "text-[#F8A14A]" : ""}`}
                    >
                      {r.payment_status}
                    </span>
                  </td>
                  <td className="px-1 py-3 ">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium ${
                        r.delivery_status === "Pending"
                          ? "bg-[#FFF9E0] text-[#F8A14A]"
                          : r.delivery_status === "Processing"
                            ? "bg-[#E6D3FF] text-[#8A38F5]"
                            : r.delivery_status === "Shipped"
                              ? "bg-[#D5E5F5] text-[#1C3753]"
                              : r.delivery_status === "Return Initiated"
                                ? "bg-[#FBDBF7] text-[#E91DD1]"
                                : r.delivery_status === "Cancelled"
                                  ? "bg-[#EFEFEF] text-[#686868]"
                                  : r.delivery_status === "Returned"
                                    ? "bg-[#C7FCFF] text-[#008D94]"
                                    : r.delivery_status === "Delivered"
                                      ? "bg-[#E0F4DE] text-[#00A63E]"
                                      : ""
                      }`}
                    >
                      {r.delivery_status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrder(r);
                        setOpen(true);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-3 text-sm text-gray-600">
          <div>
            Showing <span className="font-medium">{start}</span>–
            <span className="font-medium">{end}</span> of{" "}
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
        <OrderViewModal
          open={open}
          data={selectedOrder}
          setSelectedOrderId={() => {
            setOpen(false);
            setSelectedOrder(null);
          }}
        />
      </div>
    </div>
  );
}

export default Orders;
