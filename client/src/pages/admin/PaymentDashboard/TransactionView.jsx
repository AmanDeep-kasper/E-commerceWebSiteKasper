import { Search, CalendarDays, ChevronDown } from "lucide-react";
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

const chartData = {
  orders: {
    weekly: [
      { name: "Mon", orders: 12 },
      { name: "Tue", orders: 18 },
      { name: "Wed", orders: 10 },
      { name: "Thu", orders: 22 },
      { name: "Fri", orders: 15 },
      { name: "Sat", orders: 28 },
      { name: "Sun", orders: 20 },
    ],
    monthly: [
      { name: "Jan", orders: 120 },
      { name: "Feb", orders: 180 },
      { name: "Mar", orders: 150 },
      { name: "Apr", orders: 200 },
      { name: "May", orders: 170 },
      { name: "Jun", orders: 220 },
    ],
    yearly: [
      { name: "2021", orders: 1200 },
      { name: "2022", orders: 1800 },
      { name: "2023", orders: 1500 },
      { name: "2024", orders: 2200 },
      { name: "2025", orders: 2600 },
    ],
  },
  revenue: {
    weekly: [
      { name: "Mon", revenue: 5000 },
      { name: "Tue", revenue: 7000 },
      { name: "Wed", revenue: 4000 },
      { name: "Thu", revenue: 9000 },
      { name: "Fri", revenue: 6500 },
      { name: "Sat", revenue: 11000 },
      { name: "Sun", revenue: 8500 },
    ],
    monthly: [
      { name: "Jan", revenue: 50000 },
      { name: "Feb", revenue: 70000 },
      { name: "Mar", revenue: 65000 },
      { name: "Apr", revenue: 90000 },
      { name: "May", revenue: 85000 },
      { name: "Jun", revenue: 100000 },
    ],
    yearly: [
      { name: "2021", revenue: 500000 },
      { name: "2022", revenue: 750000 },
      { name: "2023", revenue: 680000 },
      { name: "2024", revenue: 920000 },
      { name: "2025", revenue: 1100000 },
    ],
  },
};

const graphData = chartData.revenue.weekly;

const statCards = [
  {
    title: "Total Revenue",
    value: "₹1,60,789",
    change: "▲ 12.2% from previous period",
    color: "text-green-600",
  },
  {
    title: "Prepaid",
    value: "₹1,20,343",
    change: "▲ 16% from previous period",
    color: "text-green-600",
  },
  {
    title: "Cash On Delivery",
    value: "₹40,446",
    change: "▼ 8.6% from previous period",
    color: "text-red-500",
  },
  {
    title: "Refunded",
    value: "₹10,284",
    change: "▼ 4% from previous period",
    color: "text-red-500",
  },
];

const transactions = [
  {
    id: "ORD-FF-2355",
    date: "14/01/2026, 08:45 PM",
    method: "Card",
    status: "Success",
    amount: "₹1,250",
  },
  {
    id: "ORD-FF-2356",
    date: "14/01/2026, 09:30 AM",
    method: "UPI",
    status: "Success",
    amount: "₹800",
  },
  {
    id: "ORD-FF-2357",
    date: "14/01/2026, 10:15 AM",
    method: "COD",
    status: "Collected",
    amount: "₹2,100",
  },
  {
    id: "ORD-FF-2358",
    date: "14/01/2026, 11:00 AM",
    method: "Net banking",
    status: "Success",
    amount: "₹5,500",
  },
  {
    id: "ORD-FF-2359",
    date: "15/01/2026, 12:30 PM",
    method: "Card",
    status: "Failed",
    amount: "-₹650",
  },
  {
    id: "ORD-FF-2360",
    date: "15/01/2026, 01:45 PM",
    method: "Wallet",
    status: "Success",
    amount: "₹1,200",
  },
];

const getStatusClass = (status) => {
  if (status === "Success") return "bg-[#E7F6EA] text-[#16A34A]";
  if (status === "Collected") return "bg-[#E8F1FF] text-[#2563EB]";
  if (status === "Failed") return "bg-[#FDECEC] text-[#DC2626]";
  return "bg-[#F3F4F6] text-[#6B7280]";
};

function TransactionView() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-[#1C1C1C]">Overview</h3>

        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-[#4B5563] bg-white">
          <CalendarDays className="w-4 h-4" />
          Today
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 space-y-3">
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
        </div>

        <div className="col-span-8 bg-[#F9FAFB] border border-[#EEF2F7] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-semibold">Revenue Overview</h1>
              <span className="text-[#686868] text-[14px]">Total Revenue - ₹1,60,789</span>
            </div>

            <section className="px-3 py-2 border rounded-lg text-sm text-[#4B5563] bg-white flex items-center gap-2">
              All Transactions
              <ChevronDown className="w-4 h-4" />
              {/* <option value=""></option>
              <option value=""></option>
              <option value=""></option> */}
            </section>
          </div>

          <div className="h-[260px] rounded-lg border border-dashed border-[#D1D5DB] text-[#9CA3AF]">
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
                placeholder="Search by Order ID"
                className="outline-none text-sm text-[#686868] w-full bg-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-2 border rounded-lg text-sm text-[#4B5563] bg-white flex items-center gap-2">
                Payment Method
                <ChevronDown className="w-4 h-4" />
              </button>

              <button className="px-3 py-2 border rounded-lg text-sm text-[#4B5563] bg-white flex items-center gap-2">
                Payment Status
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-[#F8F8F8] h-[54px]">
                <tr className="text-[#4B5563] text-sm text-center">
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
                  <th className="px-4 py-3 font-medium text-[#1C1C1C]">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 transition text-center"
                  >
                    <td className="px-4 py-4 text-[#2C87E2] underline cursor-pointer">
                      {item.id}
                    </td>
                    <td className="px-4 py-4">{item.date}</td>
                    <td className="px-4 py-4">{item.method}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1 rounded-md text-xs font-medium ${getStatusClass(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-4 font-medium ${
                        item.amount.startsWith("-")
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionView;
