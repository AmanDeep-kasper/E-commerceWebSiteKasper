import {
  BellIcon,
  Box,
  Camera,
  ChartNoAxesColumn,
  ChevronLeft,
  LayoutDashboard,
  MessageSquareIcon,
  MoonIcon,
  Package,
  PackageCheck,
  PackageMinus,
  PackageOpen,
  PackagePlus,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet2,
} from "lucide-react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import AdminSidebar from "./components/AdminSidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import Header from "./components/Header";
import orders from "../../data/orders.json";
import { useNavigate } from "react-router";

const links = [
  { icon: MoonIcon },
  { icon: MessageSquareIcon },
  { icon: BellIcon },
];

const topSoldData = [
  { name: "Tree of Life", value: 79, color: "bg-purple-400" },
  { name: "Adiyogi Shiva", value: 90, color: "bg-yellow-400" },
  { name: "Ayatul Kursi", value: 86, color: "bg-red-500" },
  { name: "Om Symbol", value: 60, color: "bg-green-500" },
  { name: "Stay Humble", value: 46, color: "bg-purple-300" },
];

const data = [
  { name: "Direct", value: 70 },
  { name: "Organic Search", value: 23 },
  { name: "Referral Links", value: 5 },
  { name: "Other", value: 2 },
];

const recentOrder = [...orders].reverse();

const COLORS = ["#000000", "#D4A007", "#7D735F", "#0C3C54"];

const salesData = [
  {
    category: "Spiritual & Religious",
    totalOrders: 230,
    revenue: "₹5,600K",
    mostSold: "Adiyogi Shiva",
  },
  {
    category: "Nature & Wildlife",
    totalOrders: 180,
    revenue: "₹4,200K",
    mostSold: "Tree of Life",
  },
  {
    category: "Geometric & Abstract",
    totalOrders: 90,
    revenue: "₹2,300K",
    mostSold: "Om Symbol",
  },
  {
    category: "Typography & Quotes",
    totalOrders: 76,
    revenue: "₹1,900K",
    mostSold: "Stay Humble / Believe",
  },
  {
    category: "Festival & Occasion",
    totalOrders: 70,
    revenue: "₹1,867K",
    mostSold: "Diwali (Diyas, Shubh Labh)",
  },
];

const recentTransactions = [
  { price: "₹2,030", items: 4, time: "05:27 PM", image: "/name1.jpg" },
  { price: "₹2,030", items: 4, time: "05:27 PM", image: "/name1.jpg" },
  { price: "₹2,030", items: 4, time: "05:27 PM", image: "/name1.jpg" },
];

const ordersData = [
  {
    id: "#12345",
    customer: "Neha Pal",
    total: "₹120K",
    status: "Pending",
    date: "Today",
    action: "View/Edit",
  },
  {
    id: "#12344",
    customer: "Lisa Ray",
    total: "₹89K",
    status: "Shipped",
    date: "Yesterday",
    action: "Track",
  },
  {
    id: "#12343",
    customer: "Ankit Mehra",
    total: "₹149K",
    status: "Delivered",
    date: "18 Jul 2025",
    action: "View",
  },
  {
    id: "#12342",
    customer: "Nisha Verma",
    total: "₹199K",
    status: "Cancelled",
    date: "18 Jul 2025",
    action: "View/Edit",
  },
  {
    id: "#12341",
    customer: "Jason Clark",
    total: "₹75K",
    status: "Processing",
    date: "17 Jul 2025",
    action: "View",
  },
  {
    id: "#12340",
    customer: "Ayesha Noor",
    total: "₹180K",
    status: "Returned",
    date: "16 Jul 2025",
    action: "View",
  },
  {
    id: "#12339",
    customer: "Ali Khan",
    total: "₹210K",
    status: "Delivered",
    date: "15 Jul 2025",
    action: "View",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Shipped":
      return "bg-blue-100 text-blue-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-gray-200 text-gray-600";
    case "Processing":
      return "bg-sky-100 text-sky-700";
    case "Returned":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const graphData = [
  { month: "January", orders: 150, date: 480 },
  { month: "February", orders: 260, date: 470 },
  { month: "March", orders: 140, date: 475 },
  { month: "April", orders: 300, date: 480 },
  { month: "May", orders: 370, date: 490 },
  { month: "June", orders: 125, date: 495 },
  { month: "July", orders: 260, date: 492 },
  { month: "August", orders: 200, date: 495 },
  { month: "September", orders: 400, date: 498 },
  { month: "October", orders: 280, date: 493 },
  { month: "November", orders: 320, date: 497 },
  { month: "December", orders: 210, date: 499 },
];

const completed = orders.filter(
  (order) => order.orderStatus.toLowerCase() === "delivered"
);
const cancelled = orders.filter(
  (order) => order.orderStatus.toLowerCase() === "cancelled"
);
const pending = orders.filter(
  (order) =>
    order.orderStatus.toLowerCase().replace(/\s/g, "") === "outfordelivery"
);

const totalRevenue = completed.reduce(
  (sum, order) => sum + (order.totalAmount || 0),
  0
);

const formatPrice = (price) =>
  Number.isInteger(price) ? price : price.toFixed(2);

const orderSummary = [
  {
    price: `₹${formatPrice(totalRevenue).toLocaleString("en-IN")}`,
    stats: "Total Revenue",
    icon: LayoutDashboard,
    bgcolor: "#03ae25",
  },
  {
    price: orders.length,
    stats: "Total Orders",
    icon: Package,
    bgcolor: "#638bed",
  },
  {
    price: completed.length,
    stats: "Completed Orders",
    icon: PackageCheck,
    bgcolor: "#03ae25",
  },
  {
    price: pending.length,
    stats: "Pending Orders",
    icon: PackagePlus,
    bgcolor: "#d19b06",
  },
  {
    price: cancelled.length,
    stats: "Cancelled/Returned Orders",
    icon: PackageMinus,
    bgcolor: "#b22222",
  },
];

function Dashboard() {
  const [year, setYear] = useState("2025");
  const navigate = useNavigate(null);
  return (
    <div className="h-dvh flex flex-col gap-4 overflow-y-auto invisible-scrollbar">
      <div className="flex flex-col p-4 bg-white shadow-md border border-gray-200 rounded-md">
        <h1 className="text-3xl mb-4">Overview</h1>
        <div className="grid grid-cols-5 gap-4">
          {orderSummary.map(({ price, stats, icon: Icon, bgcolor }) => (
            <div className="aspect-auto bg-gray-100 py-6 rounded-lg px-2 flex gap-4 items-start justify-between">
              <div className="max-w-30">
                <h1 className="text-black font-medium text-2xl">{price}</h1>
                <p className="text-[#414141] leading-5">{stats}</p>
              </div>
              <Icon
                className="h-8 w-8 p-1 rounded"
                style={{
                  backgroundColor: `${bgcolor}33`, // hex + alpha (20% opacity)
                  color: bgcolor,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-3/4 border rounded-lg shadow-md bg-white p-4 h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl flex items-center gap-2">
              Analytics Report
              <span aria-label="chart">
                <ChartNoAxesColumn size={24} />
              </span>
            </h2>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {/* Chart */}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="gray" />
                <XAxis dataKey="month" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#356cc5" name="Number of Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend below */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              Number of orders
            </div>
          </div>
        </div>
        <div className="w-1/4 p-4 bg-white border shadow-md rounded-lg flex flex-col gap-4">
          <h1 className="">Account</h1>
          <div className=" p-4 flex bg-green-700 rounded-md justify-between">
            <div className="flex flex-col gap-2 text-white ">
              <h1 className="text-base">Rohit Sharma</h1>
              <p className="text-sm font-light">Total Balance</p>
              <h1 className="text-xl ">₹2,877.00</h1>
            </div>
            <div className="text-white">
              <Wallet2></Wallet2>
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <h1>Recent Transaction</h1>
              <button className="text-amber-600 underline text-xs">
                View All
              </button>
            </div>
            <div className="flex flex-col gap-2 my-2">
              {recentOrder
                .reverse()
                .slice(0, 4)
                .map((order, index) => (
                  <div key={order.orderId} className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <img
                        className="w-8 h-8 rounded-full object-contain"
                        src={order.items[0].img}
                        alt={order.name}
                      />
                      <div className="flex flex-col">
                        <p>Order Payment</p>
                        <p className="text-gray-700 font-light text-sm">
                          - {order.items.length} items
                        </p>
                      </div>
                      <div></div>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                      <h1>₹{order.totalAmount.toLocaleString("en-IN")}</h1>
                      <p className="text-xs">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-3/5 p-4 bg-white shadow-md border border-gray-200 rounded-md">
          <h1 className="text-3xl mb-4">Category-wise Sales</h1>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3 text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="p-3 text-sm font-medium text-gray-600">
                  Total Orders
                </th>
                <th className="p-3 text-sm font-medium text-gray-600">
                  Revenue
                </th>
                <th className="p-3 text-sm font-medium text-gray-600">
                  Most Sold Product
                </th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-800">{item.category}</td>
                  <td className="p-3 text-gray-800">{item.totalOrders}</td>
                  <td className="p-3 text-gray-800">{item.revenue}</td>
                  <td className="p-3 text-gray-800">{item.mostSold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-2/5 p-4 bg-white border shadow-md rounded-lg flex flex-col gap-4 ">
          <h1 className="text-[24px] font-semibold">Traffic Sources</h1>
          <div className="flex justify-center items-center">
            <PieChart width={500} height={300}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={(entry) => `${entry.value}%`}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                formatter={(value, entry, index) => (
                  <span className="ml-1" style={{ color: COLORS[index] }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
            
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-3/5 p-4 bg-white shadow-md border border-gray-200 rounded-md">
          <h1 className="text-3xl mb-4">Recent Orders Table</h1>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3 text-sm font-medium text-gray-600">
                  Order ID
                </th>
                <th className="p-3 text-sm font-medium text-gray-600">
                  Customer
                </th>
                <th className="p-3 text-sm font-medium text-gray-600">Total</th>
                <th className="p-3 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="p-3 text-sm font-medium text-gray-600">Date</th>
                <th className="p-3 text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrder.slice(0, 6).map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-800">{order.orderId}</td>
                  <td className="p-3 text-gray-800">
                    {order.deliveryAddress.name}
                  </td>
                  <td className="p-3 text-gray-800">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 text-gray-800">
                    {new Date(order.orderDate).toDateString()}
                  </td>
                  <td
                    className="p-3 text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate(`order-info/${order.orderId}`)}
                  >
                    {order.action || "view"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-2/5 p-4 bg-white shadow-md rounded-md flex flex-col gap-4 border border-gray-200 ">
          <h2 className="text-lg font-semibold mb-4">Top Sold items</h2>
          {topSoldData.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">{item.name}</span>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${item.color[0]} h-3 rounded-full`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
