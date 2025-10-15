import React, { useState, useMemo } from "react";
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

const makeSalesRows = () => {
  const data = [
    {
      name: "Adiyogi Shiva",
      category: "Spiritual & Religious",
      price: 2030,
      sold: 50,
      revenue: 101500,
      rate: "0%",
    },
    {
      name: "Tree of Life",
      category: "Nature & Wildlife",
      price: 2030,
      sold: 41,
      revenue: 83230,
      rate: "2%",
    },
    {
      name: "Custom Name Plate",
      category: "Typography & Quotes",
      price: 2030,
      sold: 30,
      revenue: 60900,
      rate: "5%",
    },
    {
      name: "Lord Ganesha Frame",
      category: "Festival & Occasion",
      price: 2030,
      sold: 15,
      revenue: 30450,
      rate: "0%",
    },
    {
      name: "Mandala Art",
      category: "Geometric & Abstract",
      price: 2030,
      sold: 18,
      revenue: 36540,
      rate: "0%",
    },
    {
      name: "Bismillah Wall Frame",
      category: "Spiritual & Religious",
      price: 2030,
      sold: 24,
      revenue: 48720,
      rate: "1%",
    },
    {
      name: "3 birds set",
      category: "Nature & Wildlife",
      price: 2030,
      sold: 78,
      revenue: 158340,
      rate: "3%",
    },
  ];
  // Repeat some rows for demo purposes
  return Array.from({ length: 14 }).map((_, i) => ({
    sr: String(i + 1).padStart(2, "0"),
    ...data[i % data.length],
    key: i,
  }));
};

const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;

const classNames = (...c) => c.filter(Boolean).join(" ");

const links = [
  { icon: MoonIcon },
  { icon: MessageSquareIcon },
  { icon: BellIcon },
];

function Sale() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const allRows = useMemo(() => makeSalesRows(), [page]);
  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const rows = allRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="h-dvh flex flex-col gap-4 ">
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Top nav */}
        <div className="bg-white ">
          <div className="mx-auto">
            <div className="flex items-center h-12">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Go Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="ml-3 font-semibold text-lg">Sales</span>
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="border rounded-xl shadow-sm overflow-hidden bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b bg-gray-50">
              <h2 className="text-base font-medium">Sales</h2>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
                  <Upload className="w-4 h-4" /> Bulk Import
                </button>
                <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>

            {/* Sales Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-600 border-b">
                    {[
                      "S.No.",
                      "Product Name",
                      "Category Name",
                      "Unit Price",
                      "Total Units Sold",
                      "Total Revenue",
                      "Return Rate",
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
                    <tr key={r.key} className="border-t hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-3 text-gray-700">
                        {r.sr}
                      </td>
                      <td className="px-4 lg:px-6 py-3 font-medium text-gray-800">
                        {r.name}
                      </td>
                      <td className="px-4 lg:px-6 py-3">{r.category}</td>
                      <td className="px-4 lg:px-6 py-3">
                        {formatINR(r.price)}
                      </td>
                      <td className="px-4 lg:px-6 py-3">{r.sold}</td>
                      <td className="px-4 lg:px-6 py-3">
                        {formatINR(r.revenue)}
                      </td>
                      <td className="px-4 lg:px-6 py-3">{r.rate}</td>
                      <td className="px-4 lg:px-6 py-3 text-right">
                        <button className="p-1.5 rounded hover:bg-gray-100">
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
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  const active = n === page;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={classNames(
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
                Next <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sale;

// iiii
