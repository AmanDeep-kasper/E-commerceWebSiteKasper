import React from "react";
import AdminSidebar from "./components/AdminSidebar";
import Header from "./components/Header"; // your Navbar
import { Outlet } from "react-router";

function AdminLayout() {
  return (
    <section className="bg-gray-50">
      {/* Navbar */}
      <Header />

      <div className="w-full flex items-start h-dvh">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Page content */}
        <div className="h-dvh flex flex-col gap-4 w-full mx-4 py-4 ">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

export default AdminLayout