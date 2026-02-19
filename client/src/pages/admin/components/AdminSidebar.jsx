import {
  Contact,
  Layers,
  LayoutDashboard,
  Package,
  LogOut,
  Settings,
  ShoppingBag,
  ClipboardCheck,
  CalendarSync,
  Wallet,
  Ticket,
  SquareDashedKanban,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router";
import { BsLayoutSidebar } from "react-icons/bs";

const dashboard = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "All Products", path: "/products", icon: Package },
  { name: "Orders", path: "/orders/all", icon: ShoppingBag },
  { name: "Returns", path: "/returns/ReturnRequested", icon: CalendarSync },
  { name: "Categories", path: "/categories", icon: Layers },
  { name: "Customers", path: "/customers", icon: Contact },
  { name: "Transporter", path: "/transporter", icon: ClipboardCheck },
  { name: "Payments", path: "#", icon: Wallet },
  { name: "Report & Analysis", path: "#", icon: SquareDashedKanban  },
  { name: "Support & Ticket", path: "#", icon: Ticket },
];

function AdminSidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === `/admin${path}`;

  return (
    <div className="h-full flex flex-col  py-4 bg-[#FFFFFF]">
      {/* Header */}
      <div className="flex items-center justify-end bg-red-600 relative">
        {/* {!isCollapsed && (
          <h1 className="text-[#1626FF] text-xl font-bold whitespace-nowrap">
            Admin Panel
          </h1>
        )} */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 absolute border -right-4 top-0 bg-[#FFFFFF]  rounded-full hover:bg-[#F5F8FA] text-[#686868] hover:text-[#1C3753] transition-colors">
          <BsLayoutSidebar
            className={`transform ${
              isCollapsed ? "rotate-180" : ""
            } transition-transform`}
            size={18}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-8 px-3 scrollbar-thumb-gray-500 scrollbar-track-transparent">
        {dashboard.map(({ name, path, icon: Icon }) => (
          <Link
            key={name}
            to={`/admin${path}`}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : ""
            } gap-3 p-3 mb-1 rounded-lg transition-all duration-200 ${
              isActive(path)
                ? "bg-[#F5F8FA] text-[#1C3753]  border-l-4 border-l-[#1C3753]"
                : "text-[#686868] hover:bg-[#F5F8FA] hover:text-[#1C3753]"
            }`}>
            <Icon size={20} />
            {!isCollapsed && <span className="font-medium">{name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto  px-4 pt-4">
        <Link
          to="/admin/settings/general"
          className="flex items-center gap-3 p-2 mb-1 rounded-lg text-[#686868] hover:bg-[#FFFFFF]  hover:text-[#686868] transition-colors">
          <Settings size={20} />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </Link>

        {/* <button className="flex items-center gap-3 p-3 w-full rounded-lg text-[#686868] hover:bg-[#FFFFFF] hover:text-[#686868] transition-colors">
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button> */}
      </div>
    </div>
  );
}

export default AdminSidebar;
