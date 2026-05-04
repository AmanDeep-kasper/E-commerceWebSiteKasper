import { useEffect, useState } from "react";
import {
  ClipboardClock,
  PackageSearch,
  Truck,
  PackageCheck,
  Ban,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import NavOrders from "./NavOrders";
import axiosInstance from "../../../api/axiosInstance";

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
  // { label: "Cancelled", path: "cancelled" },
];

function Order() {
  const [ordersList, setOrdersList] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const handleOrderList = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/order/admin", {
        params: {
          page,
          limit,
        },
      });

      setOrdersList(res?.data?.orders || []);
      setStats(res?.data?.stats || {});
      setTotalItems(res?.data?.pagination?.total || 0);
      setTotalPages(res?.data?.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleOrderList();
  }, [page]);

  const refreshOrders = async () => {
    await handleOrderList();
  };

  const kpicardData = [
    {
      name: "New Orders",
      data: stats.newOrders || 0,
      icon: <ClipboardClock />,
      iconbg: "bg-[#D5E5F5]",
      iconColor: "text-[#1C3753]",
    },
    {
      name: "Processing",
      data: (stats.processingOrders || 0) + (stats.readyToShipOrders || 0),
      icon: <PackageSearch />,
      iconbg: "bg-[#E5DBFB]",
      iconColor: "text-[#713CE8]",
    },
    {
      name: "Shipped",
      data: stats.shippedOrders || 0,
      icon: <Truck />,
      iconbg: "bg-[#F0FDF4]",
      iconColor: "text-[#00A63E]",
    },
    {
      name: "Delivered",
      data: stats.deliveredOrders || 0,
      icon: <PackageCheck />,
      iconbg: "bg-[#FFFBEB]",
      iconColor: "text-[#F8A14A]",
    },
    // {
    //   name: "Cancelled",
    //   data: stats.cancelledOrders || 0,
    //   icon: <Ban />,
    //   iconbg: "bg-[#FFFBEB]",
    //   iconColor: "text-[#F8A14A]",
    // },
  ];

  return (
    <div className="p-[24px] bg-[#F6F8F9] min-h-screen">
      <h2 className="text-[20px] font-semibold text-gray-800">Orders</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
        {kpicardData.map((item, index) => (
          <div
            key={index}
            className="relative flex items-center justify-between gap-9 p-4 border rounded-2xl bg-white shadow-sm"
          >
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-12 bg-[#4EA7FF] rounded-r" />

            <div>
              <div className="text-sm text-gray-500">{item.name}</div>
              <div className="text-2xl font-semibold">{item.data}</div>
            </div>

            <div className={`${item.iconbg} ${item.iconColor} p-[12px] rounded-lg`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl">
        <NavOrders profileMenu={profileMenu} data={ordersList} />

        <div className="pt-4">
          <Outlet
            context={{
              ordersList,
              refreshOrders,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Order;
