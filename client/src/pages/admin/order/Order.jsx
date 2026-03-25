import { useState } from "react";
import {
  ClipboardClock,
  PackageSearch,
  Truck,
  PackageCheck,
  Ban,
} from "lucide-react";
import { Outlet } from "react-router";
import orders from "../../../data/orders.json";
import NavOrders from "./NavOrders";

const Badge = ({ children, tone }) => {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium `}>
      {children}
    </span>
  );
};

const profileMenu = [
  { label: "All Orders", path: "all" },
  { label: "New Orders", path: "pending" },
  { label: "Processing", path: "processing" },
  { label: "Shipped", path: "shipped" },
  { label: "Delivered", path: "delivered" },
  { label: "Cancelled", path: "cancelled" },
];

function Order() {
  const [ordersList, setOrdersList] = useState(orders);

  const updateOrder = (orderId, patch) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, ...patch } : o)),
    );
  };

  const getCount = (status) => {
    if (status === "all") return ordersList.length;
    return ordersList.filter(
      (item) => item.orderStatus?.toLowerCase() === status.toLowerCase(),
    ).length;
  };

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  // const allRows = [...orders]; // old
  const allRows = [...ordersList]; // edit by aman
  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const rows = allRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const [param, setParam] = useState("all");

  const filteredRows =
    param.toLowerCase() === "all"
      ? rows
      : rows.filter(
          (row) => row.orderStatus.toLowerCase() === param.toLowerCase(),
        );

  // /////////////////////////////////////////

  const kpicardData = [
    {
      name: "New Orders",
      data: "45",
      icon: <ClipboardClock />,
      iconbg: "bg-[#D5E5F5]",
      iconColor: "text-[#1C3753]",
    },
    {
      name: "Processing",
      data: "15",
      icon: <PackageSearch />,
      iconbg: "bg-[#E5DBFB]",
      iconColor: "text-[#713CE8]",
    },
    {
      name: "Shipped",
      data: "42",
      icon: <Truck />,
      iconbg: "bg-[#F0FDF4]",
      iconColor: "text-[#00A63E]",
    },
    {
      name: "Delivered",
      data: "1",
      icon: <PackageCheck />,
      iconbg: "bg-[#FFFBEB]",
      iconColor: "text-[#F8A14A]",
    },
    {
      name: "Cancelled",
      data: "10",
      icon: <Ban />,
      iconbg: "bg-[#FFFBEB]",
      iconColor: "text-[#F8A14A]",
    },
  ];

  return (
    <div className="p-[24px] bg-[#F6F8F9] min-h-screen">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between 16px px-2 rounded-md">
            <h2 className="text-[20px] font-semibold text-gray-800">Orders</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4  py-6">
          {kpicardData.map((item, index) => {
            return (
              <div
                key={index}
                className="relative flex items-center justify-between gap-9
  p-4 border rounded-2xl bg-white shadow-sm"
              >
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2
                    w-[4px] h-10 bg-blue-500 rounded-r"
                />

                <div>
                  <div className="text-sm text-gray-500">{item.name}</div>
                  <div className="text-2xl font-semibold">{item.data}</div>
                </div>

                <div
                  className={`${item.iconbg} ${item.iconColor} p-[12px] rounded-lg`}
                >
                  {item.icon}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-4 rounded-xl">
          <NavOrders profileMenu={profileMenu} data={ordersList} />
          <div className="pt-4">
            {/* <Outlet context={{ orders }} /> */}
            <Outlet context={{ ordersList, updateOrder }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
