import {
  BadgeIndianRupee,
  Contact,
  Layers,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  ChevronRight,
  LogOut,
  Settings,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router";
import { BsLayoutSidebar } from "react-icons/bs";

const dashboard = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/customers", icon: Contact },
  { name: "Products", path: "/products", icon: Package },
  { name: "Categories", path: "/categories", icon: Layers },
  { name: "Orders", path: "/orders", icon: ShoppingCart },
  { name: "Sales", path: "/sales", icon: BadgeIndianRupee },
  { name: "Stocks", path: "/stocks", icon: Warehouse },
  { name: "Accounts", path: "/accounts", icon: Warehouse },
];

function AdminSidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === `/admin${path}`;

  return (
    <div className="h-full flex flex-col  py-4 bg-[#F8FAFB]">
      {/* Header */}
      <div className="flex items-center justify-end bg-red-600 relative">
        {/* {!isCollapsed && (
          <h1 className="text-[#1626FF] text-xl font-bold whitespace-nowrap">
            Admin Panel
          </h1>
        )} */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 absolute border  -right-4 top-0  rounded-full hover:bg-[#FFFFFF] text-[#686868] hover:text-[#1C3753] transition-colors"
        >
          <BsLayoutSidebar
            className={`transform ${
              isCollapsed ? "rotate-180" : ""
            } transition-transform`}
            size={18}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-10 px-3 scrollbar-thumb-gray-500 scrollbar-track-transparent">
        {dashboard.map(({ name, path, icon: Icon }) => (
          <Link
            key={name}
            to={`/admin${path}`}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : ""
            } gap-3 p-3 mb-1 rounded-lg transition-all duration-200 ${
              isActive(path)
                ? "bg-white text-[#1C3753]  border-l-4 border-l-[#1C3753]"
                : "text-[#686868] hover:bg-[#FFFFFF] hover:text-[#1C3753]"
            }`}
          >
            <Icon size={20} />
            {!isCollapsed && <span className="font-medium">{name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      {/* <div className="mt-auto border-t border-gray-700 pt-4"> */}
      <div className="mt-auto border-gray-700 pt-4">
        <Link
          to="/admin/settings/general"
          className="flex items-center gap-3 p-3 mb-1 rounded-lg text-[#686868] hover:bg-[#FFFFFF]  hover:text-[#686868] transition-colors"
        >
          <Settings size={20} />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </Link>

        {/* <Link to="/admin/login"> */}
          <button className="flex items-center gap-3 p-3 w-full rounded-lg text-[#686868] hover:bg-[#FFFFFF] hover:text-[#686868] transition-colors">
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        {/* </Link> */}
      </div>
    </div>
  );
}

export default AdminSidebar;
