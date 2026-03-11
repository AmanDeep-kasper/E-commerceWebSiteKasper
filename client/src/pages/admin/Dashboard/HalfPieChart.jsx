import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";

const chartData = [
  { name: "A", value: 80, fill: "#1C3753" },
  { name: "B", value: 45, fill: "#2F72B5" },
  { name: "C", value: 25, fill: "#7AB8F6" },
];

const NEEDLE_BASE_RADIUS_PX = 5;
const NEEDLE_COLOR = "#1C3753";

const Needle = ({ cx, cy, midAngle, innerRadius, outerRadius }) => {
  const needleBaseCenterX = cx;
  const needleBaseCenterY = cy;
  const needleLength = innerRadius + (outerRadius - innerRadius) / 2;

  return (
    <g>
      <circle
        cx={needleBaseCenterX}
        cy={needleBaseCenterY}
        r={NEEDLE_BASE_RADIUS_PX}
        fill={NEEDLE_COLOR}
        stroke="none"
      />
      <path
        d={`M${needleBaseCenterX},${needleBaseCenterY}l${needleLength},0`}
        strokeWidth={2}
        stroke={NEEDLE_COLOR}
        fill={NEEDLE_COLOR}
        style={{
          transform: `rotate(-${midAngle}deg)`,
          transformOrigin: `${needleBaseCenterX}px ${needleBaseCenterY}px`,
        }}
      />
    </g>
  );
};

const HalfPie = (props) => (
  <Pie
    {...props}
    stroke="none"
    dataKey="value"
    startAngle={180}
    endAngle={0}
    data={chartData}
    cx={120}
    cy={110}
    innerRadius={50}
    outerRadius={100}
    cornerRadius={4}
  />
);

const HalfPieChart = () => {
  return (
    <div className="flex flex-col">
      <PieChart width={260} height={150}>
        <HalfPie />
        <HalfPie activeIndex={0} activeShape={Needle} />
        <Tooltip />
      </PieChart>
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"> 
            <p className="rounded-full h-3 w-3 bg-[#1C3753]"></p>
            <span className="text-[#1C1C1C]">Metal Wall Art</span>
          </div>
          <div>27,093</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="rounded-full h-3 w-3 bg-[#2F72B5]"></p>
            <span className="text-[#1C1C1C]">Geometric Art</span>
          </div>
          <div>12,546</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="rounded-full h-3 w-3 bg-[#7AB8F6]"></p>
            <span className="text-[#1C1C1C]">Canvas Art</span>
          </div>
          <div>4,585</div>
        </div>
      </div>
    </div>
  );
};

export default HalfPieChart;
