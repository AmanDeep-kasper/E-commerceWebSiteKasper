import React, { useEffect, useState } from "react";
import InformationForm from "./form/InformationForm";
import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";
import { Link, Outlet, useLocation } from "react-router";
import { useMemo } from "react";

function CustomerForm() {
  const location = useLocation();

  // extract last segment from pathname
  const activeTab = useMemo(
    () => location.pathname.slice(location.pathname.lastIndexOf("/") + 1),
    [location.pathname]
  );

  const tabs = [
    { id: "customer", label: "Customer Info", path: "customer-form" },
    { id: "insights", label: "Order Insights", path: "insight-form" },
    { id: "wishlist", label: "Wishlist & Cart Info", path: "wishlist-form" },
    { id: "address", label: "Address Book", path: "address-form" },
    { id: "support", label: "Support / Feedback", path: "support-form" },
  ];

  return (
        <div className="h-max flex flex-col gap-4 overflow-y-auto bg-white border rounded-xl shadow-sm">
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
          <Outlet />
        </div>
  );
}

export default CustomerForm;

