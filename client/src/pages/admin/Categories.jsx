import React, { useMemo, useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import {
  BellIcon,
  Camera,
  MessageSquareIcon,
  MoonIcon,
  Search,
} from "lucide-react";
import { ChevronLeft, Upload, Filter, Plus, MoreVertical } from "lucide-react";
import Header from "./components/Header";

const rowsFactory = () => {
  const names = [
    "Spiritual & Religious",
    "Clones",
    "Typography & Quotes",
    "Festival & Occasion",
    "Nature & Wildfire",
    "Festival & Occasion",
    "Reflection Art",
    "Home & Living",
    "Geometric & Abstract",
    "Spiritual & Religious",
    "Typography & Quotes",
    "Spiritual & Religious",
  ];
  return names.map((name, i) => ({
    sr: String(i + 1).padStart(2, "0"),
    name,
    total: [50, 20, 78, 27, 56, 50, 19, 59, 48, 50, 50, 50][i] ?? 50,
    visible: i % 3 !== 1,
    created: "12 Jun 2025",
    modified: "15 Jul 2025",
    key: i + 1,
  }));
};

// ---- Activity timeline dummy ----
const timelineFactory = () => [
  {
    date: "12 Jun 2025",
    time: "4:36 PM",
    type: "Update",
    who: "Neha Pal",
    desc: 'Changed name from "Nature" to "Nature-inspired"',
  },
  {
    date: "12 Jun 2025",
    time: "3:10 PM",
    type: "Update",
    who: "Neha Pal",
    desc: "Adiyogi Shiva Modified in 75×75 cm",
  },
  {
    date: "12 Jun 2025",
    time: "4:36 PM",
    type: "Delete",
    who: "Manshi Gupta",
    desc: 'Deleted tag: "Spiritual Classic"',
  },
  {
    date: "12 Jun 2025",
    time: "4:36 PM",
    type: "Create",
    who: "Faiz Alam",
    desc: 'Added new category "Abstract Designs"',
  },
  {
    date: "12 Jun 2025",
    time: "4:36 PM",
    type: "Create",
    who: "Irma Shaikh",
    desc: "Metal designs featuring deities, symbols, and mandalas rooted in spirituality.",
  },
  {
    date: "12 Jun 2025",
    time: "4:36 PM",
    type: "Update",
    who: "Sachin Sahoo",
    desc: "Art inspired by Indian heritage, folk dances, or cultural symbols.",
  },
];
const cx = (...c) => c.filter(Boolean).join(" ");

function VisibilityToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cx(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors",
        checked
          ? "bg-amber-600 border-amber-600"
          : "bg-gray-200 border-gray-200"
      )}
    >
      {" "}
      <span
        className={cx(
          "pointer-events-none inline-block h-4 w-4 translate-x-0.5 transform rounded-full bg-white shadow transition",
          checked ? "translate-x-4" : "translate-x-0.5"
        )}
      />{" "}
    </button>
  );
}

function Badge({ children, tone }) {
  const styles = {
    Update: "bg-blue-100 text-blue-700",
    Create: "bg-green-100 text-green-700",
    Delete: "bg-red-100 text-red-600",
  };
  return (
    <span
      className={cx(
        "text-xs font-medium px-2.5 py-0.5 rounded-full",
        styles[tone] || "bg-gray-100 text-gray-700"
      )}
    >
      {children}
    </span>
  );
}

const links = [
  { icon: MoonIcon },
  { icon: MessageSquareIcon },
  { icon: BellIcon },
];

function Categories() {
  const [page, setPage] = useState(1);
  const totalPages = 4;
  const rows = useMemo(() => rowsFactory(), [page]);
  const timeline = useMemo(() => timelineFactory(), []);
  return (
    <div className="h-dvh flex flex-col gap-4">
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Header */}
        <header className="bg-white">
          <div className=" mx-auto">
            <div className="flex items-center h-12">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Go Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="ml-3 font-semibold text-lg">Categories</span>
            </div>
          </div>
        </header>

        <main className="mx-auto py-6 space-y-6">
          {/* Categories Section */}
          <section className="border rounded-xl shadow-sm bg-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b bg-gray-50">
              <h2 className="text-base font-medium">Product</h2>
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
                      "S.No.",
                      "Available Category",
                      "Total Products",
                      "Visibility",
                      "Created Date",
                      "Modified Date",
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
                  {rows.map((c) => (
                    <tr key={c.key} className="border-t hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-3 text-gray-700">
                        {c.sr}
                      </td>
                      <td className="px-4 lg:px-6 py-3 font-medium text-gray-800">
                        {c.name}
                      </td>
                      <td className="px-4 lg:px-6 py-3">{c.total}</td>
                      <td className="px-4 lg:px-6 py-3">
                        <VisibilityToggle
                          checked={c.visible}
                          onChange={() => {}}
                        />
                      </td>
                      <td className="px-4 lg:px-6 py-3">{c.created}</td>
                      <td className="px-4 lg:px-6 py-3">{c.modified}</td>
                      <td className="px-4 lg:px-6 py-3 text-right">
                        <button
                          className="p-1.5 rounded hover:bg-gray-100"
                          aria-label={`Actions for ${c.name}`}
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
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={cx(
                        "w-8 h-8 rounded text-sm flex items-center justify-center",
                        page === n
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
                className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
                disabled={page === totalPages}
              >
                Next <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </section>

          {/* Activity Log Section */}
          <section className="border rounded-xl shadow-sm bg-white overflow-hidden">
            {/* Header */}

            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b bg-gray-50">
              <h2 className="text-base font-medium">Activity Log</h2>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
                  <Upload className="w-4 h-4" />
                  Bulk Import
                </button>
                <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-600 border-b">
                    {[
                      "Date & Time",
                      "Action Type",
                      "Performed By",
                      "Description",
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
                  {timeline.map((t, idx) => (
                    <tr
                      key={idx}
                      className="border-t hover:bg-gray-50 align-top"
                    >
                      <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-gray-800">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <span className="block w-2 h-2 rounded-full bg-gray-300 mt-2" />
                            {idx !== timeline.length - 1 && (
                              <span className="absolute left-0.5 top-3 w-0.5 h-full bg-gray-200" />
                            )}
                          </div>
                          <div>
                            <div>{t.date}</div>
                            <div className="text-xs text-gray-500">
                              {t.time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                        <Badge tone={t.type}>{t.type}</Badge>
                      </td>
                      <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                        {t.who}
                      </td>
                      <td className="px-4 lg:px-6 py-3">{t.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Categories;
