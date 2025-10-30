import React, { useState } from "react";
import { Outlet } from "react-router";
import Header from "./components/Header";
import AdminSidebar from "./components/AdminSidebar";

function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#F9F9F9]">
      {/* ✅ Fixed Header */}
      <Header isCollapsed={isCollapsed} />

      {/* ✅ Sidebar + Page Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 bottom-0 left-0 bg-[#383838] text-white transition-all duration-300 z-40 ${
            isCollapsed ? "w-[80px]" : "w-[240px]"
          }`}
        >
          <AdminSidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </aside>

        {/* Main content area */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 p-6`}
          style={{
            marginLeft: isCollapsed ? "80px" : "240px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
