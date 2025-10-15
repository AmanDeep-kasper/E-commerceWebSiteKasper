import React, { useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  BellIcon,
  Camera,
  MessageSquareIcon,
  MoonIcon,
  Search,
} from "lucide-react";
import { ChevronLeft, MoreVertical, Upload, Filter, Plus } from "lucide-react";
import customers from "../data/customer.json";
import { useNavigate } from "react-router";

const classNames = (...c) => c.filter(Boolean).join(" ");

const links = [
  { icon: MoonIcon },
  { icon: MessageSquareIcon },
  { icon: BellIcon },
];

function Customer() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const allRows = [...customers];
  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const rows = allRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const navigate = useNavigate(null);

  return (
    <div className="h-dvh flex flex-col gap-4">
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Top Navigation */}
        <div className=" bg-white mb-6">
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

        {/* Content */}
        <div className=" mx-auto pb-6">
          <div className="border rounded-xl shadow-sm overflow-hidden bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px]  font-medium">Users</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                  {allRows.length}
                </span>
              </div>
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-600 border-b">
                    {[
                      "ID",
                      "Name",
                      "Email Address",
                      "Phone No.",
                      "Total Orders",
                      "Registered On",
                      "Last Login",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left font-medium px-4 lg:px-6 py-3 whitespace-nowrap bg-white"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      onClick={() =>
                        navigate(`/admin/customers/${r.id}/customer-info`)
                      }
                      key={r.key}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 lg:px-6 py-3 font-medium text-gray-700">
                        {r.id}
                      </td>
                      <td className="px-4 lg:px-6 py-3">{r.name}</td>
                      <td className="px-4 lg:px-6 py-3 text-gray-700">
                        {r.email}
                      </td>
                      <td className="px-4 lg:px-6 py-3">{r.phone}</td>
                      <td className="px-4 lg:px-6 py-3">
                        {String(r.total_orders).padStart(2, "0")}
                      </td>
                      <td className="px-4 lg:px-6 py-3">{r.joined_date}</td>
                      <td className="px-4 lg:px-6 py-3">{r.last_order_date}</td>
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
                className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
                disabled={page === 1}
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  const isActive = n === page;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={classNames(
                        "w-8 h-8 rounded text-sm flex items-center justify-center",
                        isActive
                          ? "bg-gray-900 text-white"
                          : "bg-white border hover:bg-gray-100"
                      )}
                      aria-label={`Page ${n}`}
                    >
                      {String(n).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
                disabled={page === totalPages}
                aria-label="Next Page"
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

export default Customer;
