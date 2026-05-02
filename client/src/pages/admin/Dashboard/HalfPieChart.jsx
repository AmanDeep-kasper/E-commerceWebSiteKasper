import React from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#1800AC", "#D0CAFF", "#F0EEFF"];

const NEEDLE_BASE_RADIUS_PX = 5;
const NEEDLE_COLOR = "#1C3753";

// ✅ Needle (optional - not used yet)
const Needle = ({ cx, cy, midAngle, innerRadius, outerRadius }) => {
  const needleLength = innerRadius + (outerRadius - innerRadius) / 2;

  return (
    <g>
      <circle cx={cx} cy={cy} r={NEEDLE_BASE_RADIUS_PX} fill={NEEDLE_COLOR} />
      <path
        d={`M${cx},${cy}l${needleLength},0`}
        strokeWidth={2}
        stroke={NEEDLE_COLOR}
        fill={NEEDLE_COLOR}
        style={{
          transform: `rotate(-${midAngle}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
    </g>
  );
};

// ✅ HalfPie now receives dynamic data
const HalfPie = ({ chartData }) => (
  <Pie
    data={chartData}
    cx="50%"
    cy="90%"
    startAngle={180}
    endAngle={0}
    innerRadius={60}
    outerRadius={100}
    paddingAngle={4}
    dataKey="value"
  >
    {chartData.map((entry, index) => (
      <Cell key={index} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
);

const HalfPieChart = ({ data }) => {
  if (!data) return <p className="text-sm text-gray-400">Loading...</p>;

  // ✅ API → chart data
  const chartData =
    data?.topCategories?.categories?.map((item) => ({
      name: item.name,
      value: item.percentage,
      sales: item.sales,
    })) || [];

  const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);

  return (
    <div className="flex flex-col">
      <PieChart width={260} height={150}>
        <HalfPie chartData={chartData} />

        {/* Center text */}
        <text
          x="50%"
          y="70%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "14px", fill: "#6B7280" }}
        >
          Top Categories
        </text>

        <text
          x="50%"
          y="85%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "18px", fontWeight: "600" }}
        >
          {totalSales.toFixed(0)}%
        </text>

        <Tooltip />
      </PieChart>

      {/* ✅ Dynamic Legend */}
      <div className="flex flex-col mt-3 gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="capitalize">{item.name}</span>
            </div>
            <span>
              {item.sales} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HalfPieChart;
