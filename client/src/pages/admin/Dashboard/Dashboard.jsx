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
  const [salesRange, setSalesRange] = useState("weekly");
  const [productRange, setProductRange] = useState("weekly");
  const [loading, setLoading] = useState(true);
  // ////////
  const [type, setType] = useState("orders");

  useEffect(() => {
    fetchDashboard();
  }, [salesRange, productRange, type]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [
        kpiRes,
        salesRes,
        summaryRes,
        topProductsRes,
        activitiesRes,
        recentOrdersRes,
      ] = await Promise.all([
        getKpiCards(),
        getSalesOverview(type, salesRange),
        getDashboardSummary(),
        getTopSellingProducts(productRange),
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
    } finally {
      setLoading(false);
    }
  };

  console.log(topProducts);
  // aman
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

  const ordersData = summary?.ordersOverview
    ? [
        {
          name: "Delivered",
          value: summary.ordersOverview.percentages.delivered,
          count: summary.ordersOverview.thisWeek.delivered,
          icon: PackageOpenIcon,
          color: "bg-green-500",
          bgcolor: "#ECFDF5",
          textcolor: "#00A63E",
        },
        {
          name: "Processing",
          value: summary.ordersOverview.percentages.processing,
          count: summary.ordersOverview.thisWeek.processing,
          icon: Package,
          color: "bg-blue-500",
          bgcolor: "#EFF6FF",
          textcolor: "#155DFC",
        },
        {
          name: "Shipped",
          value: summary.ordersOverview.percentages.shipped,
          count: summary.ordersOverview.thisWeek.shipped,
          icon: Truck,
          color: "bg-yellow-500",
          bgcolor: "#FFFBEB",
          textcolor: "#F8A14A",
        },
        {
          name: "New Orders",
          value: summary.ordersOverview.percentages.newOrder,
          count: summary.ordersOverview.thisWeek.newOrder,
          icon: ShoppingCart,
          color: "bg-purple-500",
          bgcolor: "#F5F3FF",
          textcolor: "#7C3AED",
        },
      ]
    : [];

  const totalOrders = summary?.ordersOverview?.totalOrders
    ? summary?.ordersOverview?.totalOrders
    : 0;

  const inventory = summary?.inventoryOverview;
  const totalValue = inventory?.totalStock || 0;

  const inventoryData = inventory
    ? [
        { name: "In Stock", value: inventory.inStock },
        { name: "Low Stock", value: inventory.lowStock },
        { name: "Out of Stock", value: inventory.outOfStock },
      ]
    : [];

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

  const KpiSkeleton = () => (
    <div className="flex items-center justify-between px-4 py-2 border rounded-2xl bg-white animate-pulse min-h-[96px]">
      <div className="space-y-2 w-full">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-300 rounded w-1/2" />
      </div>
      <div className="h-10 w-10 bg-gray-200 rounded-lg" />
    </div>
  );

  const ChartSkeleton = () => (
    <div className="w-full h-[300px] bg-gray-100 rounded-lg animate-pulse" />
  );

  const PieChartSkeleton = () => (
    <div className="flex flex-col items-center justify-center h-full animate-pulse">
      {/* Circle */}
      <div className="relative">
        <div className="w-[180px] h-[180px] rounded-full bg-gray-200" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[90px] h-[90px] rounded-full bg-white" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-16 h-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
  const OrdersOverviewSkeleton = () => (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-2 w-16 bg-gray-100 rounded" />
        </div>
        <div className="h-6 w-12 bg-gray-200 rounded" />
      </div>

      {/* Bars */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          {/* icon */}
          <div className="w-8 h-8 bg-gray-200 rounded-lg" />

          {/* content */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between">
              <div className="h-2 w-24 bg-gray-200 rounded" />
              <div className="h-2 w-10 bg-gray-200 rounded" />
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
  const ActivitySkeleton = () => (
    <div className="flex items-center justify-between animate-pulse">
      <div className="flex gap-3 items-center w-full">
        <div className="h-8 w-8 bg-gray-200 rounded-lg" />
        <div className="space-y-2 w-full">
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-2 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="h-2 w-10 bg-gray-200 rounded" />
    </div>
  );

  const OrderSkeleton = () => (
    <div className="flex items-center justify-between border-b pb-3 animate-pulse">
      <div className="flex gap-3 items-center w-full">
        <div className="w-[50px] h-[40px] bg-gray-200 rounded-md" />
        <div className="space-y-2 w-full">
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-2 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 w-10 bg-gray-200 rounded" />
    </div>
  );

  const ProductSkeleton = () => (
    <div className="border p-3 rounded-xl flex items-center justify-between mt-3 animate-pulse">
      <div className="flex gap-3 items-center w-full">
        <div className="h-[40px] w-[40px] bg-gray-200 rounded-lg" />
        <div className="space-y-2 w-full">
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-2 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-2 bg-gray-100 rounded w-12" />
      </div>
    </div>
  );

  return (
    <div className="h-dvh flex flex-col gap-4 overflow-y-auto invisible-scrollbar p-[24px] bg-[#F6F8F9] rounded-md min-h-screen">
      <div className="flex flex-col py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? [...Array(4)].map((_, i) => <KpiSkeleton key={i} />)
            : orderSummary.map(
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
          {loading ? (
            <ChartSkeleton />
          ) : (
            <SalesChart
              data={sales}
              setType={setType}
              range={salesRange}
              setRange={setSalesRange}
            />
          )}
        </div>

        {/* recent activity */}
        <div className="w-1/3 p-4 bg-white border  rounded-lg flex flex-col gap-4 h-[420px]">
          <h1>Recent Activity</h1>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
            {loading
              ? [...Array(5)].map((_, i) => <ActivitySkeleton key={i} />)
              : activities.map((item, index) => {
                  let Icon;
                  let bgColor;
                  let textColor;

                  switch (item.type) {
                    case "new_order":
                      Icon = Package;
                      bgColor = "#EFF6FF";
                      textColor = "#155DFC";
                      break;

                    case "new_customer":
                      Icon = FileUser;
                      bgColor = "#EFF6FF";
                      textColor = "#155DFC";
                      break;

                    case "low_stock":
                      Icon = Package;
                      bgColor = "#FFF7ED";
                      textColor = "#F54900";
                      break;

                    case "out_of_stock":
                      Icon = SquareX;
                      bgColor = "#FFE4E3";
                      textColor = "#D53B35";
                      break;

                    default:
                      Icon = BellIcon;
                      bgColor = "#F3F4F6";
                      textColor = "#6B7280";
                  }
                  return (
                    <div className="flex items-center justify-between text-black">
                      <div className="text-base flex items-center gap-2 min-w-0">
                        <div
                          className="bg-[#EFF6FF] p-2 rounded-lg text-[#155DFC] shrink-0"
                          style={{ backgroundColor: bgColor, color: textColor }}
                        >
                          <Icon />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-medium">
                            {item.title}
                          </p>
                          <span className="text-[12px] text-[#778798] block truncate">
                            {item.description}
                          </span>
                        </div>
                      </div>
                      <div className="text-[12px] shrink-0">{item.timeAgo}</div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-start">
        <div className="flex flex-col flex-1 gap-4 min-w-0">
          <div className="flex gap-4 items-stretch">
            <div className="w-2/4 p-4 bg-white border border-gray-200 rounded-md min-h-[360px]">
              <h1 className="text-[18px] mb-4">Top Categories</h1>
              <div className="flex justify-center items-center h-[calc(100%-40px)]">
                {loading ? (
                  <PieChartSkeleton />
                ) : (
                  <HalfPieChart data={summary} />
                )}
              </div>
            </div>

            <div className="w-3/4 p-4 bg-white  rounded-md flex flex-col gap-4 border border-gray-200">
              <h2 className="text-lg  mb-4">Orders Overview</h2>
              <div className="flex items-center justify-between">
                <div className="text-[#1C3753]">
                  <p className="text-[16px]">Total Orders</p>
                  <span className="text-[12px]">This Week</span>
                </div>
                <div className="text-[28px] font-semibold">{totalOrders}</div>
              </div>

              {loading ? (
                <OrdersOverviewSkeleton />
              ) : (
                ordersData.map((item, index) => {
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

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {item.count} orders
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {item.value}%
                            </span>
                          </div>
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
                })
              )}
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
                {loading ? (
                  <PieChartSkeleton />
                ) : (
                  <PieChart width={400} height={300}>
                    <Pie
                      data={inventoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={1}
                      dataKey="value"
                      cornerRadius={6}
                      label={(entry) => `${entry.value} Qty`}
                    >
                      {inventoryData.map((entry, index) => (
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
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/4 p-4 bg-white border  rounded-lg flex flex-col gap-4 h-[800px]">
          <h1>Recent Orders</h1>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
            {loading
              ? [...Array(5)].map((_, i) => <OrderSkeleton key={i} />)
              : recentOrders.map((order, index) => (
                  <div
                    key={order._id || index}
                    className="flex items-center justify-between text-black border-b pb-3 gap-3"
                  >
                    <div className="text-base flex items-start gap-2 min-w-0">
                      <div className="shrink-0">
                        <img
                          className="w-[50px] h-[40px] rounded-md object-cover"
                          src={order?.image || "https://via.placeholder.com/50"}
                          alt="product"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[14px] font-medium truncate">
                          {order?.title || "Product Name"}
                        </p>
                        <span className="text-[12px] text-[#778798]">
                          {order?.timeAgo || "Just now"}
                        </span>
                      </div>
                    </div>

                    <div className="text-[12px] font-medium shrink-0">
                      ₹{order?.amount || 0}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-full p-4 bg-white  border border-gray-200 rounded-md overflow-x-auto">
          <div className="flex gap-4">
            <div className="w-full p-4 bg-white border border-gray-200 rounded-md overflow-x-auto">
              <div className="flex items-center justify-between">
                <h1 className="text-[18px] mb-4">Top Selling Products</h1>

                {/* 🔥 connect range filter */}
                <select
                  value={productRange}
                  onChange={(e) => setProductRange(e.target.value)}
                  className="border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50 outline-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* ✅ dynamic data */}
              {loading
                ? [...Array(5)].map((_, i) => <ProductSkeleton key={i} />)
                : topProducts.map((product, index) => (
                    <div
                      key={product._id || index}
                      className="border p-3 rounded-xl flex items-center justify-between mt-3"
                    >
                      {/* LEFT */}
                      <div className="flex gap-3 items-center min-w-0">
                        <img
                          className="h-[40px] w-[40px] rounded-lg object-cover"
                          src={
                            product?.image || "https://via.placeholder.com/40"
                          }
                          alt="product"
                        />

                        <div className="flex flex-col text-[14px] min-w-0">
                          <p className="truncate font-medium">
                            {product?.name || "Product Name"}
                          </p>
                          <span className="text-[#1C3753] text-xs">
                            {product?.category || "Category"}
                          </span>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex flex-col text-right">
                        <p className="text-[15px] font-medium">
                          Sales: ₹{product?.sales || 0}
                        </p>
                        <span className="text-[#495F75] text-[13px]">
                          {product?.orders || 0} Orders
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
