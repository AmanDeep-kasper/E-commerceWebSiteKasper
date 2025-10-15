import React, { useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router";

function SettingsLayout() {
  const location = useLocation();

  // Extract last segment from pathname to detect active tab
  const activeTab = useMemo(
    () => location.pathname.slice(location.pathname.lastIndexOf("/") + 1),
    [location.pathname]
  );

  const tabs = [
    { id: "general", label: "General Settings", path: "general" },
    { id: "notification", label: "Notification Settings", path: "notification" },
    { id: "payment", label: "Payment Settings", path: "payment" },
    { id: "taxes", label: "Taxes Settings", path: "taxes" },
    { id: "product", label: "Product Settings", path: "product" },
  ];

  return (
    <div className="h-max flex flex-col gap-4 overflow-y-auto bg-white border rounded-xl shadow-sm">
      {/* Tabs Navigation */}
      <div className="px-4 lg:px-6 pt-4 border-b">
        <nav className="flex gap-6 text-sm">
          {tabs.map((t) => (
            <Link
              key={t.id}
              className={`px-1 pb-3 -mb-px border-b-2 ${
                activeTab === t.path
                  ? "border-amber-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
              to={t.path}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsLayout;
