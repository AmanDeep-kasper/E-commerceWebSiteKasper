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
    { id: "general", label: "Business Details", path: "general" },
    { id: "notification", label: "Shipping", path: "notification" },
    { id: "payment", label: "Payments", path: "payment" },
    { id: "taxes", label: "Warehouse Details", path: "taxes" },
    { id: "Banners", label: "Banners", path: "Banners" },
    { id: "Policies", label: "Policies", path: "Policies" },
    { id: "Notifications", label: "Notifications", path: "Notifications" },
    { id: "AccountSettings", label: "Account Settings", path: "AccountSettings" },
  ];

  return (
    <div className="border shadow-sm bg-[#F6F8F9] flex gap-2  invisible-scrollbar p-[24px]  rounded-md min-h-screen">
      {/* Tabs Navigation */}
      <div className="px-4 pt-4 h-auto w-[232px] rounded-md border-b bg-[#FFFFFF]">
        <nav className="flex flex-col gap-2 text-sm">
          {tabs.map((t) => (
            <Link
              key={t.id}
              className={` gap-3 p-3 mb-1 rounded-lg transition-all duration-200 ${
                activeTab === t.path
                  ? "bg-[#F5F8FA] text-[#1C3753]  border-l-4 border-l-[#1C3753]"
                  : "text-[#686868] hover:bg-[#F5F8FA] hover:text-[#1C3753]"
              }`}
              to={t.path}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-2 w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsLayout;
