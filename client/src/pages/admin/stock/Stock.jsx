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
import AdminSidebar from "../components/AdminSidebar";
import Header from "../components/Header";
import products from "../../../data/products.json";
import { useNavigate } from "react-router";

const cx = (...c) => c.filter(Boolean).join(" ");

const rowsFactory = () => {
  const src = [
    {
      name: "Adiyogi Shiva",
      cat: "Spiritual & Religious",
      sku: "SHIVA001",
      price: 2030,
      stock: 12,
      reorder: 15,
      updated: "15 Jul 2025",
    },
    {
      name: "Tree of Life",
      cat: "Nature & Wildlife",
      sku: "TREE002",
      price: 2030,
      stock: 45,
      reorder: 20,
      updated: "15 Jul 2025",
    },
    {
      name: "Custom Name Plate",
      cat: "Typography & Quotes",
      sku: "CNP003",
      price: 2030,
      stock: 5,
      reorder: 10,
      updated: "14 Jul 2025",
    },
    {
      name: "Bismillah Frame",
      cat: "Spiritual & Religious",
      sku: "BIS004",
      price: 2030,
      stock: 0,
      reorder: 5,
      updated: "15 Jul 2025",
    },
    {
      name: "Home Sweet Home",
      cat: "Home & Living",
      sku: "HSH005",
      price: 2030,
      stock: 30,
      reorder: 10,
      updated: "13 Jul 2025",
    },
    {
      name: "Mandala Art",
      cat: "Geometric & Abstract",
      sku: "MAN006",
      price: 2030,
      stock: 25,
      reorder: 15,
      updated: "13 Jul 2025",
    },
    {
      name: "Couples Clones",
      cat: "Clones",
      sku: "CCLN007",
      price: 2030,
      stock: 30,
      reorder: 20,
      updated: "12 Jul 2025",
    },
    {
      name: "Adiyogi Shiva",
      cat: "Spiritual & Religious",
      sku: "SHIVA001",
      price: 2030,
      stock: 12,
      reorder: 15,
      updated: "11 Jul 2025",
    },
    {
      name: "Adiyogi Shiva",
      cat: "Spiritual & Religious",
      sku: "SHIVA001",
      price: 2030,
      stock: 0,
      reorder: 15,
      updated: "11 Jul 2025",
    },
    {
      name: "Adiyogi Shiva",
      cat: "Spiritual & Religious",
      sku: "SHIVA001",
      price: 2030,
      stock: 12,
      reorder: 15,
      updated: "11 Jul 2025",
    },
    {
      name: "Adiyogi Shiva",
      cat: "Spiritual & Religious",
      sku: "SHIVA001",
      price: 2030,
      stock: 12,
      reorder: 15,
      updated: "11 Jul 2025",
    },
    {
      name: "Adiyogi Shiva",
      cat: "Spiritual & Religious",
      sku: "SHIVA001",
      price: 2030,
      stock: 12,
      reorder: 15,
      updated: "11 Jul 2025",
    },
    {
      name: "Adiyogi Shiva",
      cat: "Spiritual & Religious",
      sku: "SHIVA001",
      price: 2030,
      stock: 12,
      reorder: 15,
      updated: "11 Jul 2025",
    },
    {
      name: "Adiyogi Shiva",
      cat: "Spiritual & Religious",
      sku: "SHIVA001",
      price: 2030,
      stock: 12,
      reorder: 15,
      updated: "11 Jul 2025",
    },
  ];
  return src.map((r, i) => ({
    sr: String(i + 1).padStart(2, "0"),
    ...r,
    key: i,
  }));
};

const StatusPill = ({ stock, reorder }) => {
  let label = "In Stock";
  let tone = "success";
  if (stock === 0) {
    label = "Out of Stock";
    tone = "danger";
  } else if (stock <= reorder) {
    label = "Low Stock";
    tone = "warn";
  }
  const styles = {
    success: "bg-green-100 text-green-700",
    warn: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-600",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        styles[tone]
      )}
    >
      {label}
    </span>
  );
};

function Stock() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const allRows = [...products];
  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const rows = allRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const navigate = useNavigate();

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
              <span className="ml-3 font-semibold text-lg">Stocks</span>
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="border rounded-xl shadow-sm overflow-hidden bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b bg-gray-50">
              <h2 className="text-base font-medium">Stocks</h2>
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

            {/* Stocks Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-600 border-b">
                    {[
                      "S.No.",
                      "Product Name",
                      "Category Name",
                      "SKU Code",
                      "Unit Price",
                      "Units in Stock",
                      "Reorder Level",
                      "Status",
                      "Last Updated",
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
                    <tr
                      key={r.uuid}
                      className="border-t hover:bg-gray-50"
                      onClick={() => navigate(`/admin/stock-info/${r.uuid}`)}
                    >
                      <td className="px-4 lg:px-6 py-3 text-gray-700 overflow-hidden !text-ellipsis line-clamp-2 max-h-[3rem]">
                        {r.uuid}
                      </td>
                      <td className="px-4 lg:px-6 py-3 font-medium text-gray-800">
                        {r.title}
                      </td>
                      <td className="px-4 lg:px-6 py-3">{r.category}</td>
                      <td className="px-4 lg:px-6 py-3">{r.SKU}</td>
                      <td className="px-4 lg:px-6 py-3">{r.basePrice}</td>
                      <td className="px-4 lg:px-6 py-3">{r.stockQuantity}</td>
                      <td className="px-4 lg:px-6 py-3">{r.stockQuantity}</td>
                      <td className="px-4 lg:px-6 py-3 truncate">
                        <StatusPill stock={r.stockQuantity} reorder={10} />
                      </td>
                      <td className="px-4 lg:px-6 py-3">today</td>
                      <td className="px-4 lg:px-6 py-3 text-right">
                        <button
                          className="p-1.5 rounded hover:bg-gray-100"
                          aria-label={`Actions for ${r.title}`}
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
                Next <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stock;
