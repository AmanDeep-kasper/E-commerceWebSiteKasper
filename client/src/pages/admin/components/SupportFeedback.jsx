// import React from "react";
// import { Plus, Star } from "lucide-react";

// const InfoRow = ({ label, value }) => (
//   <div className="flex flex-col gap-0.5">
//     <span className="text-[13px] font-medium text-gray-700">{label}</span>
//     <span className="text-sm text-gray-900">{value}</span>
//   </div>
// );

// const Section = ({ children }) => (
//   <div className="grid grid-cols-2 gap-x-12 gap-y-4 py-4">{children}</div>
// );

// const Divider = () => <hr className="border-gray-200 my-4" />;

// function SupportFeedback() {
//   const data = {
//     ticketsRaised: 4,
//     lastTicketDate: "12 July 2025",
//     status: "In Progress",
//     priority: "Medium",
//     category: "Shipping Delay",
//     agent: "Priya Verma",
//     responseTime: "3 hours",
//     resolutionTime: "1 day",
//     feedbackScore: 4.2,
//     reviews: 6,
//     avgRating: 4.3,
//     lastReview: "09 July 2025",
//     mostReviewed: "Adiyogi Shiva",
//     comment:
//       "Absolutely loved the detailing in the Adiyogi piece! The craftsmanship is exceptional, and it looks even better in person. Will definitely buy again – truly a masterpiece for any wall!",
//     internalNotes:
//       "Customer prefers early morning delivery. Offered coupon.",
//   };

//   return (
//     <div className="col-span-6">
//         <div className="bg-white border rounded-xl shadow-sm p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-sm font-semibold text-gray-900">Support / Feedback</h2>
//             <button className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
//               <Plus className="w-4 h-4" /> Add New Ticket
//             </button>
//           </div>

//           <Section>
//             <InfoRow label="Support Tickets Raised:" value={data.ticketsRaised} />
//             <InfoRow label="Last Ticket Date:" value={data.lastTicketDate} />
//             <InfoRow label="Ticket Status:" value={data.status} />
//             <InfoRow label="Ticket Priority:" value={data.priority} />
//             <InfoRow label="Ticket Category:" value={data.category} />
//             <InfoRow label="Assigned Agent:" value={data.agent} />
//             <InfoRow label="Avg. Response Time:" value={data.responseTime} />
//             <InfoRow label="Avg. Resolution Time:" value={data.resolutionTime} />
//             <div>
//               <div className="text-[13px] font-medium text-gray-700 mb-1">Feedback Score:</div>
//               <div className="flex items-center gap-1 text-sm text-gray-900">
//                 <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {data.feedbackScore}
//               </div>
//             </div>
//           </Section>

//           <Divider />

//           <Section>
//             <InfoRow label="Reviews Submitted:" value={data.reviews} />
//             <div>
//               <div className="text-[13px] font-medium text-gray-700 mb-1">Average Rating:</div>
//               <div className="flex items-center gap-1 text-sm text-gray-900">
//                 <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {data.avgRating}
//               </div>
//             </div>
//             <InfoRow label="Latest Review Date:" value={data.lastReview} />
//             <InfoRow label="Most Reviewed Product:" value={data.mostReviewed} />
//           </Section>

//           <Divider />

//           <div className="py-2">
//             <div className="text-[13px] font-medium text-gray-700 mb-1">Public Comments:</div>
//             <p className="text-sm text-gray-800 italic mb-2">“{data.comment}”</p>
//             <div className="flex items-center gap-1 text-sm text-gray-700">
//               <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Verified Buyer
//             </div>
//             <button className="mt-3 inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
//               View All Reviews
//             </button>
//           </div>

//           <Divider />

//           <div className="py-2">
//             <div className="text-[13px] font-medium text-gray-700 mb-1">Internal Notes (Admin Only):</div>
//             <p className="text-sm text-gray-900">{data.internalNotes}</p>
//           </div>
//         </div>
//       </div>
//   );
// }

// export default SupportFeedback;

import React, { useState } from "react";

import { Link } from "react-router-dom";
import customers from "../../../data/Support.json";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white mb-4 rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

// const InfoRow = ({ label, value, icon: Icon, status, className = "" }) => {
//   const statusColors = {
//     high: "bg-red-100 text-red-800 w-max",
//     medium: "bg-amber-100 text-amber-800 w-max",
//     low: "bg-blue-100 text-blue-800 w-max",
//     completed: "bg-green-100 text-green-800 w-max",
//     progress: "bg-blue-100 text-blue-800 w-max",
//     open: "bg-gray-100 text-gray-800 w-max",
//   };

//   return (
//     <div
//       className={`flex flex-col gap-1 p-3 bg-gray-50 rounded-lg ${className}`}>
//       <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
//         {Icon && <Icon className="w-3.5 h-3.5" />}
//         <span>{label}</span>
//       </div>
//       {status && statusColors[status] ? (
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]} mt-1 inline-block`}>
//           {value}
//         </span>
//       ) : (
//         <div className="text-sm font-medium text-gray-900">{value}</div>
//       )}
//     </div>
//   );
// };

// const Section = ({ title, icon: Icon, children }) => (
//   <div className="mb-6 last:mb-0">
//     <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2 mb-4">
//       {Icon && <Icon className="w-4 h-4" />}
//       {title}
//     </h3>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
//   </div>
// );

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
function SupportFeedback() {
  // const getPriorityStatus = (priority) => {
  //   const statusMap = {
  //     high: "high",
  //     medium: "medium",
  //     low: "low",
  //   };
  //   return statusMap[priority.toLowerCase()] || "low";
  // };

  // const getTicketStatus = (status) => {
  //   const statusMap = {
  //     "in progress": "progress",
  //     completed: "completed",
  //     open: "open",
  //   };
  //   return statusMap[status.toLowerCase()] || "open";
  // };

  // /////////////////////////////
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

  return (
    <div className="text-gray-900">
      <div className="bg-white px-4 py-3 rounded-xl">
        <Card>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              Support & Ticket
            </h2>
          </div>

          <div className="gap-2">
            {/* Info Section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
              <InfoRow label="Total Tickets" value={orderSummary.totalOrder} />
              <InfoRow label="Open" value={`₹${orderSummary.totalSpend}`} />
              <InfoRow label="Closed" value={orderSummary.cancelledOrder} />
            </div>
          </div>
        </Card>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F5F8FA] text-gray-600">
              <tr>
                {[
                  "Ticket ID",
                  "Linked Order",
                  "Priority",
                  "Created Date",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-4 font-medium text-center whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.order_id}
                  className="border-t hover:bg-gray-50 transition text-center ">
                  <td className="px-4 py-3 ">{r.ticket_id}</td>
                  <td className="px-4 py-3  ">{r.linked_order}</td>
                  <td className="px-1 py-3 ">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium  ${
                        r.priority === "Low"
                          ? " text-[#00A63E]"
                          : r.priority === "High"
                            ? " text-[#D53B35]"
                            : r.priority === "Medium"
                              ? " text-[#F8A14A]"
                              : r.priority === "No Priority"
                                ? " text-[#686868]"
                                : "*"
                      }`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 ">{r.created_date}</td>
                  <td className="px-4 py-3 ">
                    <span
                      className={`inline-flex gap-2 px-3 py-1 rounded-md text-xs font-medium ${r.status === "New" ? "text-[#000000] bg-[#D5E5F5]" : r.status === "Open" ? "bg-[#FBDBF7] text-[#E91DD1]" : r.status === "Closed" ? "text-[#686868] bg-[#EFEFEF]" : "*"}`}>
                      {r.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/orders/${r.order_id}`}
                      className="text-blue-500 hover:underline">
                      View
                    </Link>
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
    </div>
  );
}

export default SupportFeedback;
