import {
  Search,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function TransactionSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Revenue Card */}
      <div className="bg-[#F9FAFB] border rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Chart Skeleton */}
        <div className="h-[300px] bg-gray-200 rounded-lg"></div>
      </div>

      {/* Table Section */}
      <div className="bg-white border rounded-xl p-4">
        {/* Top Filters */}
        <div className="flex justify-between mb-4">
          <div className="h-10 w-[320px] bg-gray-200 rounded"></div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 mb-3">
          {Array(6)
            .fill()
            .map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
        </div>

        {/* Rows */}
        {Array(6)
          .fill()
          .map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 mb-4">
              {Array(6)
                .fill()
                .map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}

function TransactionView() {
  const [filter, setFilter] = useState("Weekly");
  const [openFilter, setOpenFilter] = useState(false);

  const [PaymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);

  // payment statusFilter
  const [statusFilter, setStatusFilter] = useState("");
  const [openStatus, setOpenStatus] = useState(false);
  const transactions = PaymentData?.payments || [];
  const [methodFilter, setMethodFilter] = useState("");
  const [openMethod, setOpenMethod] = useState(false);
  // search filter
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // pagnation
  const [page, setPage] = useState(1);
  const limit = 10;

  // get paymet data from backend and set to transactions state
  const handlePaymentData = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/order/payments?page=${page}&limit=${limit}`,
      );

      setPaymentData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePaymentData();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const statusMap = {
    Pending: ["pending"],
    Successful: ["captured", "paid"],
    Failed: ["failed"],
  };

  const graphData =
    filter === "Weekly"
      ? PaymentData?.stats?.weekly?.map((item) => ({
          name: item.day,
          revenue: item.revenue,
        })) || []
      : filter === "Monthly"
        ? PaymentData?.stats?.monthly?.map((item) => ({
            name: item.day,
            revenue: item.revenue,
          })) || []
        : PaymentData?.stats?.yearly?.map((item) => ({
            name: item.month,
            revenue: item.revenue,
          })) || [];

  const formatStatus = (status) => {
    const s = status?.toLowerCase();

    if (s === "paid" || s === "captured") return "Successful";
    if (s === "pending") return "Pending";
    if (s === "failed" || !s) return "Failed";

    return "Failed";
  };

  const getStatusClass = (status) => {
    if (status === "Successful") return "bg-[#E7F6EA] text-[#16A34A]";
    if (status === "Pending") return "bg-[#EFEFEF] text-[#686868]";
    if (status === "Failed") return "bg-[#FDECEC] text-[#DC2626]";
    return "bg-[#F3F4F6] text-[#6B7280]";
  };

  const getAmountColor = (status) => {
    const formatted = formatStatus(status);

    if (formatted === "Successful") return "text-green-600";
    if (formatted === "Failed") return "text-red-500";
    if (formatted === "Pending") return "text-yellow-500";

    return "text-gray-600";
  };

  const filteredTransactions = transactions.filter((item) => {
    const itemStatus = item.status?.toLowerCase().trim() || "failed"; // fallback
    const itemMethod = item.method?.toLowerCase().trim() || "unknown";

    // STATUS FILTER
    if (statusFilter && !statusMap[statusFilter]?.includes(itemStatus)) {
      return false;
    }

    // METHOD FILTER
    if (methodFilter && itemMethod !== methodFilter.toLowerCase()) {
      return false;
    }

    // SEARCH FILTER
    if (search) {
      const s = search.toLowerCase().trim();

      const orderMatch = item.orderId?.toLowerCase().includes(s);

      const paymentMatch = item.paymentId?.toLowerCase().includes(s);

      if (!orderMatch && !paymentMatch) {
        return false;
      }
    }

    return true;
  });
  console.log(PaymentData);

  const pagination = PaymentData?.pagination || {};

  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, methodFilter]);

  if (loading) {
    return <TransactionSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-[#1C1C1C]">Overview</h3>

        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-[#4B5563] bg-white">
          <CalendarDays className="w-4 h-4" />
          Today
          <ChevronDown className="w-4 h-4" />
        </button>
      </div> */}

      <div className="w-full">
        {/* <div className="col-span-4 space-y-6">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-[#F9FAFB] border border-[#EEF2F7] rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[14px] text-[#6B7280]">{card.title}</p>
                  <p className={`text-[12px] mt-2 ${card.color}`}>
                    {card.change}
                  </p>
                </div>
                <h4 className="text-[24px] font-semibold text-[#111827]">
                  {card.value}
                </h4>
              </div>
            </div>
          ))}
        </div> */}

        <div className="col-span-8 bg-[#F9FAFB] border border-[#EEF2F7] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-semibold">Revenue Overview</h1>
              <span className="text-[#686868] text-[14px]">
                Total Revenue -{" "}
                {PaymentData
                  ? `₹${PaymentData?.stats?.totalRevenue}`
                  : "Loading..."}
              </span>
            </div>

            <div className="relative inline-block">
              <section
                onClick={() => setOpenFilter((prev) => !prev)}
                className="px-3 py-2 border rounded-lg text-sm text-[#4B5563] bg-white flex items-center gap-2 cursor-pointer"
              >
                {filter}
                <ChevronDown className="w-4 h-4" />
              </section>

              {openFilter && (
                <div className="absolute w-full bg-white border rounded-lg shadow-md z-50">
                  {["Weekly", "Monthly", "Yearly"].map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setFilter(item);
                        setOpenFilter(false);
                      }}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-[300px] rounded-lg border border-dashed border-[#D1D5DB] text-[#9CA3AF] px-6 py-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1C3753"
                  strokeWidth={3}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[16px] font-semibold text-[#1C1C1C] mb-4">
          Transactions
        </h3>

        <div className="bg-white border border-[#EEF2F7] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 w-[320px] rounded-lg px-3 py-2 bg-[#F8FBFC] border">
              <Search className="w-4 h-4 text-[#686868]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                placeholder="Search by Order ID"
                className="outline-none text-sm text-[#686868] w-full bg-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setOpenMethod(!openMethod)}
                  className="px-3 py-2 border rounded-lg text-sm text-[#4B5563] bg-white flex items-center gap-2"
                >
                  {methodFilter || "Payment Method"}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {openMethod && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md z-50">
                    {["Card", "UPI", "Wallet", "Net Banking"].map((method) => (
                      <div
                        key={method}
                        onClick={() => {
                          setMethodFilter(method);
                          setOpenMethod(false);
                        }}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        {method}
                      </div>
                    ))}

                    {/* Clear */}
                    <div
                      onClick={() => {
                        setMethodFilter("");
                        setOpenMethod(false);
                      }}
                      className="px-3 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                      Clear
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpenStatus(!openStatus)}
                  className="px-3 py-2 border rounded-lg text-sm text-[#4B5563] bg-white flex items-center gap-2"
                >
                  {statusFilter || "Payment Status"}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {openStatus && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-50">
                    {["Pending", "Successful", "Failed"].map((status) => (
                      <div
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setOpenStatus(false);
                        }}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        {status}
                      </div>
                    ))}

                    {/* Clear */}
                    <div
                      onClick={() => {
                        setStatusFilter("");
                        setOpenStatus(false);
                      }}
                      className="px-3 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                      Clear
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-[#F8F8F8] h-[54px]">
                <tr className="text-[#4B5563] text-sm text-center">
                  <th className="px-4 py-3 font-medium text-[#1C1C1C]">
                    Payment ID
                  </th>
                  <th className="px-4 py-3 font-medium text-[#1C1C1C]">
                    Order ID
                  </th>
                  <th className="px-4 py-3 font-medium text-[#1C1C1C]">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 font-medium text-[#1C1C1C]">
                    Payment Method
                  </th>
                  <th className="px-4 py-3 font-medium text-[#1C1C1C]">
                    Payment Status
                  </th>
                  {/* <th className="px-4 py-3 font-medium text-[#1C1C1C]">
                    Settlement Status
                  </th> */}
                  <th className="px-4 py-3 font-medium text-[#1C1C1C]">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((item) => (
                  <tr
                    key={item.paymentId}
                    className="border-t hover:bg-gray-50 transition text-center"
                  >
                    <td className="px-4 py-4">{item.paymentId}</td>
                    <td className="px-4 py-4">{item.orderId}</td>
                    <td className="px-4 py-4">
                      {new Date(item.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-4">
                      {item.method ? item.method : "N/A"}
                    </td>
                    {/* <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1 rounded-md text-xs font-medium ${getStatusClass(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td> */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1 rounded-md text-xs font-medium ${getStatusClass(
                          formatStatus(item.status),
                        )}`}
                      >
                        {formatStatus(item.status)}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-4 font-medium ${getAmountColor(item.status)}`}
                    >
                      ₹{item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              {/* LEFT TEXT */}
              <span>
                Showing {start}-{end} of {pagination.total} results
              </span>

              {/* RIGHT CONTROLS */}
              <div className="flex items-center gap-2">
                {/* PREV */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* PAGE INFO */}
                <span className="px-3 py-1 border rounded bg-gray-50">
                  Page {pagination.page} of {pagination.pages}
                </span>

                {/* NEXT */}
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionView;
