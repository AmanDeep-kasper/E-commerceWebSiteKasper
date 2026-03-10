import React, { useState } from "react";
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

const SalesChart = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [filterType, setFilterType] = useState("weekly");

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

  const graphData = chartData[activeTab][filterType];

  return (
    <div className="bg-white rounded-xl p-4 ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] flex flex-col items-center font-medium gap-2">
          Sales Overview
          <span className="text-[14px] text-[#686868]" aria-label="chart">
            Total Order - 197
          </span>
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-2 bg-[#EFEFEF] p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3 py-1 rounded-lg transition-all duration-300 ease-in-out ${
                activeTab === "orders"
                  ? "bg-white shadow text-black"
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              Orders
            </button>

            <button
              onClick={() => setActiveTab("revenue")}
              className={`px-3 py-1 rounded-lg transition-all duration-300 ease-in-out ${
                activeTab === "revenue"
                  ? "bg-white shadow text-black"
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              Revenue
            </button>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50 outline-none"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "orders" ? (
            <BarChart data={graphData}>
              {/* Gradient */}
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="50%" stopColor="#E5E5E5" />
                  <stop offset="100%" stopColor="#FFFFFF00" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#374151" />
              <YAxis
                stroke="#374151"
                // domain={[0, 50]}
                // ticks={[0, 10, 20, 30, 40, 50]}
              />
              <Tooltip />

              <Bar
                dataKey="orders"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : (
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
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
