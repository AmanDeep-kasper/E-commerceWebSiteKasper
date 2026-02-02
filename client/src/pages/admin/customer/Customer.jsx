import React, { useEffect, useMemo, useState } from "react";
// import AdminSidebar from "../components/AdminSidebar";
import {
  BellIcon,
  ChevronDown,
  FunnelX,
  ListFilter,
  MessageSquareIcon,
  MoonIcon,
  PencilLine,
  Search,
} from "lucide-react";
import { ChevronLeft } from "lucide-react";
import customers from "../data/customer.json"; // json data
import { useNavigate } from "react-router";
// import { div } from "framer-motion/m";

const classNames = (...c) => c.filter(Boolean).join(" ");

const links = [
  { icon: MoonIcon },
  { icon: MessageSquareIcon },
  { icon: BellIcon },
];

function Customer() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  // search filter

  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  // console.log(search);

  // latest filter
  const [filterOne, setfilterOne] = useState("Latest");
  const [filterOneOpen, setfilterOneOpen] = useState(false);
  // status filter
  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState("All Status");
  // const allRows = [...customers];

  // debouncce filter

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // all filter logic

  const filterCustomers = useMemo(() => {
    let result = [...customers];

    // Search logic filter
    if (debouncedValue.trim() !== "") {
      result = result.filter((item) => {
        return (
          item.name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
          item.email.toLowerCase().includes(debouncedValue.toLowerCase()) ||
          item.phone.includes(debouncedValue)
        );
      });
    }
    // STATUS FILTER
    if (status !== "All Status") {
      result = result.filter((item) => item.status === status);
    }

    if (filterOne === "Latest") {
      result.sort(
        (a, b) => new Date(b.last_order_date) - new Date(a.last_order_date)
      );
    }

    if (filterOne === "Oldest") {
      result.sort((a, b) => {
        return new Date(a.last_order_date) - new Date(b.last_order_date);
      });
    }

    if (filterOne === "Alphabetical (A-Z)") {
      result.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }

    if (filterOne === "Alphabetical (Z-A)") {
      result.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }

    if (filterOne === "Spend (Low-High)") {
      result.sort((a, b) => {
        return a.total_spent - b.total_spent;
      });
    }

    if (filterOne === "Spend (High-Low)") {
      result.sort((a, b) => {
        return b.total_spent - a.total_spent;
      });
    }
    if (filterOne === "Most Orders") {
      result.sort((a, b) => {
        return b.total_orders - a.total_orders;
      });
    }
    if (filterOne === "Least Orders") {
      result.sort((a, b) => {
        return a.total_orders - b.total_orders;
      });
    }

    return result;
  }, [customers, debouncedValue, status, filterOne]);

  const totalPages = Math.ceil(filterCustomers.length / rowsPerPage);
  const rows = filterCustomers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const navigate = useNavigate(null);

  // store the Latest filter status

  const filterOneItems = [
    "Latest",
    "Oldest",
    "Alphabetical (A-Z)",
    "Alphabetical (Z-A)",
    "Spend (Low-High)",
    "Spend (High-Low)",
    "Most Orders",
    "Least Orders",
  ];

  // Filter two status

  const statuses = ["All Status", "Active", "Blocked"];

  //  pagination side logic

  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, filterCustomers.length);
  const total = filterCustomers.length;

  return (
    <div className="p-[24px] bg-[#F6F8F9] min-h-screen">
      <div className="min-h-screen text-gray-900">
        {/* Top Navigation */}
        <div className="mb-4">
          <div className="mx-auto">
            <div className="flex items-center">
              {/* <button
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Go Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button> */}
              <span className="ml-3 font-medium text-[20px]">Customers</span>
            </div>
          </div>
        </div>

        {/* Content */}

        <div className="bg-white p-4 rounded-xl border">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 w-[40%] border rounded-lg px-3 py-2 bg-[#F8FBFC]">
              <Search className="w-4 h-4 text-[#686868]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Name, Email, Phone number"
                className="outline-none text-sm text-[#686868] w-full bg-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Button */}
                <button
                  onClick={() => setStatusOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border">
                  {status}
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown */}
                {statusOpen && (
                  <div className="absolute mt-2 w-40 bg-white border rounded-lg shadow-md z-20">
                    {statuses.map((s) => (
                      <div
                        key={s}
                        onClick={() => {
                          setStatus(s);
                          setStatusOpen(false);
                        }}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100
            ${status === s ? "bg-gray-100 font-medium" : ""}
          `}>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
                  onClick={() => setfilterOneOpen((p) => !p)}>
                  <ListFilter className="w-4 h-4" />
                  {filterOne}
                </button>
                {filterOneOpen && (
                  <div className="absolute mt-2  w-52 bg-white border rounded-lg shadow-md z-100">
                    {filterOneItems.map((s) => {
                      return (
                        <div
                          key={s}
                          onClick={() => {
                            setfilterOne(s);
                            setfilterOneOpen(false);
                          }}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                            filterOne === s ? "bg-gray-100 font-medium" : ""
                          }`}>
                          {s}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setStatus("All Status");
                  setfilterOne("Latest");
                  setPage(1);
                }}
                className="border rounded-lg px-3 py-2 text-sm text-[#686868] flex items-center justify-between gap-2 bg-[#F8FBFC]  hover:bg-gray-100">
                <FunnelX size={18} />
                Clear Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F5F8FA] text-gray-600">
                <tr>
                  {[
                    "Customer Name",
                    "Email",
                    "Phone Number",
                    "Total Orders",
                    "Total Spend",
                    "Last Order Date",
                    "Status",
                    "Action",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-4 font-medium text-left whitespace-nowrap ${
                        i === 7 ? "text-right" : ""
                      }`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{r.name}</td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{r.phone}</td>
                    <td className="px-4 py-3">{r.total_orders}</td>
                    <td className="px-4 py-3">₹{r.total_spent}</td>
                    <td className="px-4 py-3">{r.last_order_date}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium
                ${
                  r.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : r.status === "Blocked"
                    ? "bg-red-100 text-red-600"
                    : ""
                }
              `}>
                        <span
                          className={`w-2 h-2 rounded-xl ${
                            r.status === "Active"
                              ? "bg-green-500"
                              : r.status === "Blocked"
                              ? "bg-red-500"
                              : ""
                          }`}
                        />
                        {r.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right">
                      <button
                        className="p-1.5 rounded hover:bg-gray-100"
                        onClick={() =>
                          navigate(`/admin/customers/${r.id}/customer-info`)
                        }>
                        <PencilLine className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          <div className="flex items-center justify-between px-6 py-3  text-sm text-gray-600">
            {/* Showing text */}
            <div>
              Showing <span className="font-medium">{start}</span>–
              <span className="font-medium">{end}</span> of{" "}
              <span className="font-medium">{total}</span> results
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}>
                ‹
              </button>

              <div className="px-4 py-1 border rounded">
                Page {String(page).padStart(2, "0")} of{" "}
                {String(totalPages).padStart(2, "0")}
              </div>

              <button
                className="px-3 py-1 border rounded disabled:opacity-40"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}>
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Customer;
