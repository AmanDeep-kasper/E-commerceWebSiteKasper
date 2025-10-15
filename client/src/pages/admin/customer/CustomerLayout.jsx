import React, { useMemo } from "react";
import { useParams, Outlet } from "react-router";
import customers from "../data/customer.json";
import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileCard from "../components/ProfileCard";

function CustomerLayout() {
  const { id } = useParams();

  const customer = useMemo(() => customers.find((p) => p.id == id), [id]);
  console.log(customer);

  return (
    <div className="mx-auto">
      {/* <h1 className="text-[20px] font-medium mb-4">Customer Overview</h1> */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Sidebar */}
        <ProfileSidebar customer={customer} />

        {/* Main dynamic content */}
        <Outlet context={{ customer }} />

        {/* Right Summary Card */}
        <ProfileCard customer={customer} />
      </div>

      {/* Footer Actions */}
      {/* <div className="flex items-center gap-2 justify-end mt-6">
              <button className="inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
                Edit
              </button>
              <button className="inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
                Delete
              </button>
            </div> */}
    </div>
  );
}

export default CustomerLayout;
