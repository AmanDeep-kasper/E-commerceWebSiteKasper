import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  Upload,
  Filter,
  Plus,
  MoreVertical,
  MoonIcon,
  MessageSquareIcon,
  BellIcon,
  Search,
  Camera,
} from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import Header from "./components/Header";

const rowsFactory = () => {
  const base = {
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=64&q=60",
    name: "Sachin Sahoo",
    email: "sachinsahoo123@gmail.com",
    phone: "8448******",
    role: "Customer",
    status: "Active",
    signUp: "12 Jun 2025",
    lastActivity: { date: "25 Jun 2025", time: "09:15" },
  };
  const variants = [
    { role: "Manager", status: "Active" },
    { role: "Customer", status: "Blocked" },
    { role: "Staff", status: "Unverified" },
    { role: "Customer", status: "Active" },
    { role: "Customer", status: "Active" },
    { role: "Customer", status: "Active" },
    { role: "Customer", status: "Active" },
    { role: "Customer", status: "Active" },
    { role: "Customer", status: "Active" },
    { role: "Customer", status: "Active" },
  ];
  return variants.map((v, i) => ({ ...base, ...v, key: i + 1 }));
};

const Badge = ({ children, tone }) => {
  const tones = {
    Active: "bg-green-100 text-green-700",
    Blocked: "bg-red-100 text-red-600",
    Unverified: "bg-gray-200 text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        tones[tone] || "bg-gray-100 text-gray-700"
      }`}
    >
      {children}
    </span>
  );
};

const cx = (...c) => c.filter(Boolean).join(" ");

const links = [
  { icon: MoonIcon },
  { icon: MessageSquareIcon },
  { icon: BellIcon },
];

function User() {
  const [page, setPage] = useState(1);
  const totalPages = 4;
  const rows = useMemo(() => rowsFactory(), [page]);

  return (
    <div className="h-dvh flex flex-col gap-4 ">
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Top nav */}
        <div className=" bg-white ">
          <div className=" mx-auto">
            <div className="flex items-center h-12">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Go Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="ml-3 font-semibold text-lg">Users</span>
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="border rounded-xl shadow-sm overflow-hidden bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b bg-gray-50">
              <h2 className="text-base font-medium">Users</h2>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
                  <Upload className="w-4 h-4" />
                  Bulk Import
                </button>
                <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-600 border-b">
                    {[
                      "User Name",
                      "Email Address",
                      "Phone Number",
                      "Role",
                      "Status",
                      "Sign Up Date",
                      "Last Activity",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left font-medium px-4 lg:px-6 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.key} className="border-t hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={r.avatar}
                            alt="avatar"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-medium text-gray-800">
                            {r.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-gray-700">
                        {r.email}
                      </td>
                      <td className="px-4 lg:px-6 py-3">{r.phone}</td>
                      <td className="px-4 lg:px-6 py-3">{r.role}</td>
                      <td className="px-4 lg:px-6 py-3">
                        <Badge tone={r.status}>{r.status}</Badge>
                      </td>
                      <td className="px-4 lg:px-6 py-3">{r.signUp}</td>
                      <td className="px-4 lg:px-6 py-3">
                        <div className="flex items-center gap-2 text-gray-800">
                          {r.lastActivity.date}
                          <span className="text-xs text-gray-500">
                            {r.lastActivity.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-right">
                        <button
                          className="p-1.5 rounded hover:bg-gray-100"
                          aria-label={`Actions for ${r.name}`}
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-t bg-white text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50 disabled:opacity-40"
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  const active = n === page;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={cx(
                        "w-8 h-8 rounded text-sm flex items-center justify-center",
                        active
                          ? "bg-gray-900 text-white"
                          : "bg-white border hover:bg-gray-100"
                      )}
                    >
                      {String(n).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50 disabled:opacity-40"
                disabled={page === totalPages}
              >
                Next
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User