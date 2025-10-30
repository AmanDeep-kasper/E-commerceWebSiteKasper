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
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 p-2">
        {!isCollapsed && (
          <h1 className="text-white text-xl font-bold whitespace-nowrap">
            Admin Panel
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md hover:bg-neutral-600 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronRight
            className={`transform ${
              isCollapsed ? "rotate-180" : ""
            } transition-transform`}
            size={18}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
        {dashboard.map(({ name, path, icon: Icon }) => (
          <Link
            key={name}
            to={`/admin${path}`}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : ""
            } gap-3 p-3 mb-1 rounded-lg transition-all duration-200 ${
              isActive(path)
                ? "bg-[#DD851F] text-white shadow-lg"
                : "text-gray-300 hover:bg-neutral-600 hover:text-white"
            }`}
          >
            <Icon size={20} />
            {!isCollapsed && <span className="font-medium">{name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-gray-700 pt-4">
        <Link
          to="/admin/settings/general"
          className="flex items-center gap-3 p-3 mb-1 rounded-lg text-gray-300 hover:bg-neutral-600 hover:text-white transition-colors"
        >
          <Settings size={20} />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </Link>

        <button className="flex items-center gap-3 p-3 w-full rounded-lg text-gray-300 hover:bg-neutral-600 hover:text-white transition-colors">
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
