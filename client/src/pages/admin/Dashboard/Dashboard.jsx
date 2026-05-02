import {
  BellIcon,
  FileUser,
  HandCoins,
  MessageSquareIcon,
  MoonIcon,
  Package,
  PackageCheck,
  PackageOpenIcon,
  ShoppingCart,
  SquareX,
  Truck,
  Undo2,
  Users,
} from "lucide-react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import orders from "../../../data/orders.json";
import { useNavigate } from "react-router-dom";
import SalesChart from "./SalesChart";
import HalfPieChart from "./HalfPieChart";
import { useEffect, useState } from "react";
import {
  getKpiCards,
  getSalesOverview,
  getDashboardSummary,
  getTopSellingProducts,
  getRecentActivities,
  getRecentOrders,
} from "../../../services/dashboardService.js";

function Dashboard() {
  const navigate = useNavigate(null);

  const [kpi, setKpi] = useState(null);
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [range, setRange] = useState("weekly");
  // ////////
  const [type, setType] = useState("orders");

  useEffect(() => {
    fetchDashboard();
  }, [range, type]);

  const fetchDashboard = async () => {
    try {
      const [
        kpiRes,
        salesRes,
        summaryRes,
        topProductsRes,
        activitiesRes,
        recentOrdersRes,
      ] = await Promise.all([
        getKpiCards(),
        getSalesOverview(type, range),
        getDashboardSummary(),
        getTopSellingProducts(range),
        getRecentActivities(),
        getRecentOrders(),
      ]);

      setKpi(kpiRes.data.data);
      setSales(salesRes.data.data);
      setSummary(summaryRes.data.data);
      setTopProducts(topProductsRes.data.data);
      setActivities(activitiesRes.data.data);
      setRecentOrders(recentOrdersRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // console.log(sales);
  // aman
  // const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const paymentData = [
    {
      name: "Prepaid",
      amount: "₹63,280",
      value: 63,
      color: "#1F446B",
    },
    {
      name: "COD",
      amount: "₹12,329",
      value: 28,
      color: "#3E7BBE",
    },
    {
      name: "Refunded",
      amount: "₹7,607",
      value: 9,
      color: "#79AEE8",
    },
  ];

  const links = [
    { icon: MoonIcon },
    { icon: MessageSquareIcon },
    { icon: BellIcon },
  ];

  const topSoldData = [
    {
      name: "Delivered",
      value: 79,
      icon: PackageOpenIcon,
      color: "bg-green-500",
      bgcolor: "#ECFDF5",
      textcolor: "#00A63E",
    },
    {
      name: "Processing",
      value: 90,
      icon: Package,
      color: "bg-blue-500",
      bgcolor: "#EFF6FF",
      textcolor: "#155DFC",
    },
    {
      name: "Shipped",
      value: 86,
      icon: Truck,
      color: "bg-yellow-500",
      bgcolor: "#FFFBEB",
      textcolor: "#F8A14A",
    },
    {
      name: "Cancelled",
      value: 60,
      icon: SquareX,
      color: "bg-red-600",
      bgcolor: "#FFE4E3",
      textcolor: "#D53B35",
    },
  ];

  const data = [
    { name: "In Stock", value: 11695 },
    { name: "Low Stock", value: 566 },
    { name: "Out of Stock", value: 160 },
    // { name: "Other", value: 2 },
  ];

  const recentOrder = [...orders].reverse();

  const COLORS = ["#00A63E", "#F8A14A", "#D53B35"];

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
    (order) => order.orderStatus.toLowerCase() === "delivered",
  );
  const cancelled = orders.filter(
    (order) => order.orderStatus.toLowerCase() === "cancelled",
  );
  const pending = orders.filter(
    (order) =>
      order.orderStatus.toLowerCase().replace(/\s/g, "") === "outfordelivery",
  );

  const totalRevenue = completed.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0,
  );

  const formatPrice = (price) =>
    Number.isInteger(price) ? price : price.toFixed(2);

  const orderSummary = kpi
    ? [
        {
          price: `₹${kpi.revenue.overall}`,
          stats: "Total Revenue",
          icon: HandCoins,
          bgcolor: "#F0FDF4",
          tag: "this week",
          textcolor: "#16A34A",
        },
        {
          price: kpi.orders.overall,
          stats: "Total Orders",
          icon: ShoppingCart,
          bgcolor: "#E5DBFB",
          tag: "this week",
          textcolor: "#713CE8",
        },
        {
          price: kpi.products.overall,
          stats: "Total Products",
          icon: PackageCheck,
          bgcolor: "#D5E5F5",
          textcolor: "#1C3753",
        },
        {
          price: kpi.customers.overall,
          stats: "Total Customers",
          icon: Users,
          bgcolor: "#FFFBEB",
          textcolor: "#F8A14A",
        },
      ]
    : [];

  return (
    <div className="h-dvh flex flex-col gap-4 overflow-y-auto invisible-scrollbar p-[24px] bg-[#F6F8F9] rounded-md min-h-screen">
      <div className="flex flex-col py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {orderSummary.map(
            ({ price, stats, icon: Icon, bgcolor, tag, textcolor }) => (
              <div
                key={price}
                className="relative flex items-center justify-between gap-9 px-4 py-2 border rounded-2xl bg-white shadow-sm min-h-[96px]"
              >
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-10 bg-blue-500 rounded-r" />

                <div>
                  <div className="text-sm text-gray-500">{stats}</div>
                  <span className="text-[12px] text-[#686868]">{tag}</span>
                  <div className="text-2xl font-semibold">{price}</div>
                </div>

                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: bgcolor }}
                >
                  <Icon className="w-5 h-5" color={textcolor} />
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className=" flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="w-2/3 lg:w-full border rounded-lg bg-white h-full">
          <SalesChart
            data={sales}
            setType={setType}
            range={range}
            setRange={setRange}
          />
        </div>

        {/* recent activity */}
        <div className="w-1/3 p-4 bg-white border  rounded-lg flex flex-col gap-4 h-[420px]">
          <h1>Recent Activity</h1>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
            <div className="flex items-center justify-between text-black">
              <div className="text-base flex items-center gap-2 min-w-0">
                <div className="bg-[#EFF6FF] p-2 rounded-lg text-[#155DFC] shrink-0">
                  <Package />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">New Order</p>
                  <span className="text-[12px] text-[#778798] block truncate">
                    Order #4521 placed by John Doe
                  </span>
                </div>
              </div>
              <div className="text-[12px] shrink-0">Just now</div>
            </div>

            <div className="flex items-center justify-between text-black">
              <div className="text-base flex items-center gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  <Undo2 />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">Returned</p>
                  <span className="text-[12px] text-[#778798] block truncate">
                    Order #4517 returned by Sarah Wilson
                  </span>
                </div>
              </div>
              <div className="text-[12px] shrink-0">5 minutes ago</div>
            </div>

            <div className="flex items-center justify-between text-black">
              <div className="text-base flex items-center gap-2 min-w-0">
                <div className="bg-[#EFF6FF] p-2 rounded-lg text-[#155DFC] shrink-0">
                  <FileUser />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">New Customer</p>
                  <span className="text-[12px] text-[#778798] block truncate">
                    Account created by Michael ID CX-AI-3942
                  </span>
                </div>
              </div>
              <div className="text-[12px] shrink-0">1 hour ago</div>
            </div>

            <div className="flex items-center justify-between text-black">
              <div className="text-base flex items-center gap-2 min-w-0">
                <div className="bg-[#EFF6FF] p-2 rounded-lg text-[#155DFC] shrink-0">
                  <FileUser />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">New Customer</p>
                  <span className="text-[12px] text-[#778798] block truncate">
                    Account created by Michael ID CX-AI-3942
                  </span>
                </div>
              </div>
              <div className="text-[12px] shrink-0">1 hour ago</div>
            </div>

            <div className="flex items-center justify-between text-black">
              <div className="text-base flex items-center gap-2 min-w-0">
                <div className="bg-[#EFF6FF] p-2 rounded-lg text-[#155DFC] shrink-0">
                  <FileUser />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">New Customer</p>
                  <span className="text-[12px] text-[#778798] block truncate">
                    Account created by Michael ID CX-AI-3942
                  </span>
                </div>
              </div>
              <div className="text-[12px] shrink-0">1 hour ago</div>
            </div>

            <div className="flex items-center justify-between text-black">
              <div className="text-base flex items-center gap-2 min-w-0">
                <div className="bg-[#EFF6FF] p-2 rounded-lg text-[#155DFC] shrink-0">
                  <FileUser />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">New Customer</p>
                  <span className="text-[12px] text-[#778798] block truncate">
                    Account created by Michael ID CX-AI-3942
                  </span>
                </div>
              </div>
              <div className="text-[12px] shrink-0">1 hour ago</div>
            </div>

            <div className="flex items-center justify-between text-black">
              <div className="text-base flex items-center gap-2 min-w-0">
                <div className="bg-[#EFF6FF] p-2 rounded-lg text-[#155DFC] shrink-0">
                  <FileUser />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">New Customer</p>
                  <span className="text-[12px] text-[#778798] block truncate">
                    Account created by Michael ID CX-AI-3942
                  </span>
                </div>
              </div>
              <div className="text-[12px] shrink-0">1 hour ago</div>
            </div>

            <div className="flex items-center justify-between text-black">
              <div className="text-base flex items-center gap-2 min-w-0">
                <div className="bg-[#EFF6FF] p-2 rounded-lg text-[#155DFC] shrink-0">
                  <FileUser />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">New Customer</p>
                  <span className="text-[12px] text-[#778798] block truncate">
                    Account created by Michael ID CX-AI-3942
                  </span>
                </div>
              </div>
              <div className="text-[12px] shrink-0">1 hour ago</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-start">
        <div className="flex flex-col flex-1 gap-4 min-w-0">
          <div className="flex gap-4 items-stretch">
            <div className="w-2/4 p-4 bg-white border border-gray-200 rounded-md min-h-[360px]">
              <h1 className="text-[18px] mb-4">Top Categories</h1>
              <div className="flex justify-center items-center h-[calc(100%-40px)]">
                <HalfPieChart />
              </div>
            </div>
            <div className="w-3/4 p-4 bg-white  rounded-md flex flex-col gap-4 border border-gray-200">
              <h2 className="text-lg  mb-4">Orders Overview</h2>
              <div className="flex items-center justify-between">
                <div className="text-[#1C3753]">
                  <p className="text-[16px]">Total Orders</p>
                  <span className="text-[12px]">This Week</span>
                </div>
                <div className="text-[28px] font-semibold">787</div>
              </div>

              {topSoldData.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg shrink-0"
                      style={{
                        backgroundColor: item.bgcolor,
                        color: item.textcolor,
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="flex flex-col gap-1 w-full mb-4 min-w-0">
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-sm text-gray-700">
                          {item.name}
                        </span>
                        <span className="text-sm font-medium text-gray-900 shrink-0">
                          {item.value}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${item.color}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* <div className="w-3/5 p-4 bg-white border rounded-lg flex flex-col gap-4 min-h-[360px]">
              <h1 className="text-[18px]">Inventory Overview</h1>
              <div className="flex flex-col items-center justify-center flex-1 overflow-hidden">
                <PieChart width={400} height={300}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={1}
                    dataKey="value"
                    cornerRadius={6}
                    label={(entry) => `${entry.value} Qty`}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <text
                    x="50%"
                    y="40%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "14px", fill: "#6B7280" }}
                  >
                    Total Stock
                  </text>

                  <text
                    x="50%"
                    y="47%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: "18px",
                      fontWeight: "300",
                      fill: "#111827",
                    }}
                  >
                    {totalValue}
                  </text>

                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    layout="horizontal"
                    formatter={(value, entry, index) => (
                      <span className="ml-1" style={{ color: COLORS[index] }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </div>
            </div> */}
          </div>

          <div className="flex gap-4 items-stretch">
            {/* <div className="w-1/2 p-4 bg-white  rounded-md flex flex-col gap-4 border border-gray-200">
              <h2 className="text-[18px]  text-[#222222]">Payments Overview</h2>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="text-[16px] text-[#1C3753] font-medium">
                    Total Revenue
                  </p>
                  <span className="text-[12px] text-[#8A8A8A]">This Week</span>
                </div>
                <h1 className="text-[32px] font-semibold text-[#222222] leading-tight">
                  ₹95,087
                </h1>
              </div>

              <div className="flex items-center gap-2 w-full">
                {paymentData.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-[4px] h-[72px]"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color,
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {paymentData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[15px] text-[#333333]">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[15px] text-[#333333] font-medium shrink-0">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div> */}
            {/* <div className="w-1/2 p-4 bg-white  rounded-md flex flex-col gap-4 border border-gray-200">
              <h2 className="text-lg  mb-4">Orders Overview</h2>
              <div className="flex items-center justify-between">
                <div className="text-[#1C3753]">
                  <p className="text-[16px]">Total Orders</p>
                  <span className="text-[12px]">This Week</span>
                </div>
                <div className="text-[28px] font-semibold">787</div>
              </div>

              {topSoldData.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg shrink-0"
                      style={{
                        backgroundColor: item.bgcolor,
                        color: item.textcolor,
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="flex flex-col gap-1 w-full mb-4 min-w-0">
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-sm text-gray-700">
                          {item.name}
                        </span>
                        <span className="text-sm font-medium text-gray-900 shrink-0">
                          {item.value}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${item.color}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div> */}

            {/* ///// */}
            <div className="w-full p-4 bg-white border rounded-lg flex flex-col gap-4 min-h-[360px]">
              <h1 className="text-[18px]">Inventory Overview</h1>
              <div className="flex flex-col items-center justify-center flex-1 overflow-hidden">
                <PieChart width={400} height={300}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={1}
                    dataKey="value"
                    cornerRadius={6}
                    label={(entry) => `${entry.value} Qty`}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <text
                    x="50%"
                    y="40%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "14px", fill: "#6B7280" }}
                  >
                    Total Stock
                  </text>

                  <text
                    x="50%"
                    y="47%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: "18px",
                      fontWeight: "300",
                      fill: "#111827",
                    }}
                  >
                    {/* {totalValue} */}
                  </text>

                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    layout="horizontal"
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
        </div>

        <div className="w-1/4 p-4 bg-white border  rounded-lg flex flex-col gap-4 h-[800px]">
          <h1>Recent Orders</h1>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="text-[#155DFC] shrink-0">
                  <img
                    className="w-[50px] h-[40px] rounded-md object-cover"
                    src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D"
                    alt=""
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Flower Mandela Laser Cut Metal Wall Art
                  </p>
                  <span className="text-[12px] text-[#778798]">
                    5 minutes ago
                  </span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>

            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>

            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>

            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>

            <div className="flex items-center justify-between text-black border-b pb-3 gap-3">
              <div className="text-base flex items-start gap-2 min-w-0">
                <div className="bg-[#FFF7ED] p-2 rounded-lg text-[#F54900] shrink-0">
                  image
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">
                    Geometric Wooden Wall Sculpture
                  </p>
                  <span className="text-[12px] text-[#778798]">Just now</span>
                </div>
              </div>
              <div className="text-[12px] font-medium shrink-0">₹2000</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-full p-4 bg-white  border border-gray-200 rounded-md overflow-x-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-[18px] mb-4">Top Selling Products</h1>
            <div>
              <select className="border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50 outline-none">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div className="border p-2 rounded-xl flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <div>
                <img
                  className="h-[40px] w-[40px] rounded-lg"
                  src="https://images.unsplash.com/photo-1731657017065-6bf400d479fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZHVjfGVufDB8fDB8fHww"
                  alt=""
                />
                {/* image */}
              </div>
              <div className="flex flex-col text-[14px]">
                <p>Flower Mandela Laser Cut Metal Wall Art</p>
                <span className="text-[#1C3753]">Metal Flower Art</span>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-[16px]">Sales: ₹1,44,000</p>
              <span className="text-[#495F75] text-[14px]">197 Orders</span>
            </div>
          </div>
          <div className="border p-2 rounded-xl flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <div>
                <img
                  className="h-[40px] w-[40px] rounded-lg"
                  src="https://images.unsplash.com/photo-1731657017065-6bf400d479fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZHVjfGVufDB8fDB8fHww"
                  alt=""
                />
                {/* image */}
              </div>
              <div className="flex flex-col text-[14px]">
                <p>Flower Mandela Laser Cut Metal Wall Art</p>
                <span className="text-[#1C3753]">Metal Flower Art</span>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-[16px]">Sales: ₹1,44,000</p>
              <span className="text-[#495F75] text-[14px]">197 Orders</span>
            </div>
          </div>
          <div className="border p-2 rounded-xl flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <div>
                <img
                  className="h-[40px] w-[40px] rounded-lg"
                  src="https://images.unsplash.com/photo-1731657017065-6bf400d479fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZHVjfGVufDB8fDB8fHww"
                  alt=""
                />
                {/* image */}
              </div>
              <div className="flex flex-col text-[14px]">
                <p>Flower Mandela Laser Cut Metal Wall Art</p>
                <span className="text-[#1C3753]">Metal Flower Art</span>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-[16px]">Sales: ₹1,44,000</p>
              <span className="text-[#495F75] text-[14px]">197 Orders</span>
            </div>
          </div>
          <div className="border p-2 rounded-xl flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <div>
                <img
                  className="h-[40px] w-[40px] rounded-lg"
                  src="https://images.unsplash.com/photo-1731657017065-6bf400d479fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZHVjfGVufDB8fDB8fHww"
                  alt=""
                />
                {/* image */}
              </div>
              <div className="flex flex-col text-[14px]">
                <p>Flower Mandela Laser Cut Metal Wall Art</p>
                <span className="text-[#1C3753]">Metal Flower Art</span>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-[16px]">Sales: ₹1,44,000</p>
              <span className="text-[#495F75] text-[14px]">197 Orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
