import { useState } from "react";
import {
  ChevronLeft,
  MoreVertical,
  Upload,
  Filter,
  Plus,
  X,
} from "lucide-react";
import {
  BellIcon,
  Camera,
  MessageSquareIcon,
  MoonIcon,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router";
import orders from "../../../data/orders.json";

// const makeOrderRows = () => {
//   const statuses = [
//     { payment: "Paid", order: "Delivered", tone: "success" },
//     { payment: "Unpaid", order: "Pending", tone: "neutral" },
//     { payment: "Paid", order: "Delivered", tone: "success" },
//     { payment: "Paid", order: "Refunded", tone: "danger" },
//     { payment: "Paid", order: "Delivered", tone: "success" },
//     { payment: "Cancelled", order: "Cancelled", tone: "danger" },
//     { payment: "Paid", order: "Shipped", tone: "success" },
//     { payment: "Paid", order: "Delivered", tone: "success" },
//     { payment: "Paid", order: "Processing", tone: "info" },
//     { payment: "Cancelled", order: "Delivered", tone: "success" },
//     { payment: "Paid", order: "Delivered", tone: "success" },
//   ];

//   return statuses.map((s, i) => ({
//     id: "#12345",
//     customer: "Neha Pal",
//     product: "Adiyogi Shiva",
//     email: i % 2 === 0 ? "neha@gmail.com" : "8448******",
//     amount: "₹2,030",
//     method: [
//       "Credit Card",
//       "COD",
//       "Credit Card",
//       "PayPal",
//       "Credit Card",
//       "UPI",
//       "Credit Card",
//       "Pay Later",
//       "EMI",
//       "Credit Card",
//       "Credit Card",
//     ][i],
//     ...s,
//     date: "12 Jun 2025",
//     key: i,
//   }));
// };

const Badge = ({ children, tone }) => {
  const tones = {
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-600",
    Pending: "bg-gray-200 text-gray-600",
    Processing: "bg-blue-100 text-blue-600",
    Shipped: "bg-green-700 text-white",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
        tones[tone] || tones.neutral
      }`}
    >
      {children}
    </span>
  );
};

const classNames = (...c) => c.filter(Boolean).join(" ");

const options = [
  { label: "All Orders", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Processing", value: "Processing" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Refunded", value: "Refunded" },
];

const links = [
  { icon: MoonIcon },
  { icon: MessageSquareIcon },
  { icon: BellIcon },
];

function Order() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const allRows = [...orders];
  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const rows = allRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const navigate = useNavigate(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [param, setParam] = useState("all");

  const filteredRows =
    param.toLowerCase() === "all"
      ? rows
      : rows.filter(
          (row) => row.orderStatus.toLowerCase() === param.toLowerCase()
        );

  return (
    <div className=" flex flex-col gap-4 ">
      <div className="relative bg-gray-50 text-gray-900">
        {/* Top nav */}
        <div className=" bg-white ">
          <div className=" mx-auto">
            <div className="flex items-center h-12">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Go Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="ml-3 font-semibold text-lg">Orders</span>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full py-6">
          <div className="border rounded-xl shadow-sm overflow-hidden bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b bg-gray-50">
              <h2 className="text-base font-medium">Orders</h2>
              <div className=" flex items-center gap-2 ">
                <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
                  <Upload className="w-4 h-4" /> Bulk Import
                </button>
                <button
                  className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
                  <Plus className="w-4 h-4" /> Add
                </button>

                {isFilterOpen && (
                  <div className="cursor-default absolute top-32 right-[6.5rem] bg-white w-[200px] border rounded-[5px] ">
                    {options.map(({ label, value }, index) => (
                      <p
                        key={value}
                        className={`px-4 py-2 hover:bg-gray-100`}
                        onClick={() => {
                          setParam(value);
                          setIsFilterOpen(!isFilterOpen);
                        }}
                      >
                        {label}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto h-full">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-600 border-b">
                    {[
                      "Order Id",
                      "Customer Name",
                      "Product (Name+Thum)",
                      "Email/Phone",
                      "Total Amount",
                      "Payment Method",
                      "Payment Status",
                      "Order Status",
                      "Order Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left font-medium px-4 lg:px-6 py-3 whitespace-nowrap bg-white"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r) => (
                    <tr
                      key={r.key}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/admin/order-info/${r.orderId}`)}
                    >
                      <td className="px-4 lg:px-6 py-3 font-medium">
                        {r.orderId.slice(4)}
                      </td>
                      <td className="px-4 lg:px-6 py-3">
                        {r.deliveryAddress.name}
                      </td>
                      <td className="px-4 lg:px-6 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={r.items[0].img}
                            alt="thumb"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          {r.items[0].name}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3">
                        {r.deliveryAddress.mobile}
                      </td>
                      <td className="px-4 lg:px-6 py-3">
                        ₹{r.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 lg:px-6 py-3">{r.paymentMethod}</td>
                      <td className="px-4 lg:px-6 py-3">{r.paymentStatus}</td>
                      <td className="px-4 lg:px-6 py-3">
                        <Badge
                          tone={
                            r.orderStatus === "Out for Delivery"
                              ? "Pending"
                              : r.orderStatus
                          }
                        >
                          {r.orderStatus === "Out for Delivery"
                            ? "Pending"
                            : r.orderStatus}
                        </Badge>
                      </td>
                      <td className="px-4 lg:px-6 py-3">
                        {new Date(r.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-right">
                        <button className="p-1.5 rounded hover:bg-gray-100">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredRows.length <= 10 && param.toLowerCase() === "all"  && (
              <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-t bg-white text-sm">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    const isActive = n === page;
                    return (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={classNames(
                          "w-8 h-8 rounded text-sm flex items-center justify-center",
                          isActive
                            ? "bg-gray-900 text-white"
                            : "bg-white border hover:bg-gray-100"
                        )}
                      >
                        {String(n).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
                  disabled={page === totalPages}
                >
                  Next <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
