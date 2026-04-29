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
import { useNavigate } from "react-router-dom";
// import { div } from "framer-motion/m";
import axiosInstance from "../../../api/axiosInstance";

const classNames = (...c) => c.filter(Boolean).join(" ");

const links = [
  { icon: MoonIcon },
  { icon: MessageSquareIcon },
  { icon: BellIcon },
];

function Customer() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  // state for users from API
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // search filter
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  // latest filter
  const [filterOne, setfilterOne] = useState("Latest");
  const [filterOneOpen, setfilterOneOpen] = useState(false);
  // status filter
  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState("All Status");

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Build query parameters
      let queryParams = `?page=${page}&limit=${rowsPerPage}&search=${debouncedValue}&role=user`;

      if (status === "Active") {
        queryParams += "&isActive=true";
      } else if (status === "Blocked") {
        queryParams += "&isActive=false";
      }

      const response = await axiosInstance.get(`/user/admin/all-users${queryParams}`);
      
      if (response.data?.success) {
        setUsers(response.data.users || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalUsers || 0);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedValue, status]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedValue, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Sorting logic (if backend doesn't support sorting yet, we can do it on the current page's data)
  const sortedUsers = useMemo(() => {
    let result = [...users];

    if (filterOne === "Latest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filterOne === "Oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filterOne === "Alphabetical (A-Z)") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (filterOne === "Alphabetical (Z-A)") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    if (filterOne === "Spend (Low-High)") {
      result.sort((a, b) => (a.totalSpend || 0) - (b.totalSpend || 0));
    } else if (filterOne === "Spend (High-Low)") {
      result.sort((a, b) => (b.totalSpend || 0) - (a.totalSpend || 0));
    } else if (filterOne === "Most Orders") {
      result.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
    } else if (filterOne === "Least Orders") {
      result.sort((a, b) => (a.totalOrders || 0) - (b.totalOrders || 0));
    }

    return result;
  }, [users, filterOne]);

  const rows = sortedUsers;

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

  const statuses = ["All Status", "Active", "Blocked"];

  const start = totalItems === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, totalItems);
  const total = totalItems;

    const formatDate = (dateString) => {
    if (!dateString) return "N/A";
   const date = new Date(dateString);
   return date.toLocaleDateString("en-US", {
    day:"2-digit",
    month:"short",
    year:"numeric",
    // hour:"2-digit",
    // minute:"2-digit",
   });
  }

  // Loading state
  //  if (loading) {
  //   return (
  //     <div className="p-[24px] bg-[#F6F8F9] min-h-screen flex justify-center items-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C3753] mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Loading customers...</p>
  //       </div>
  //     </div>
  //   );
  // }

        const SkeletonRow = () => {
    return (
      <tr className="animate-pulse border-t">
        <td className="px-4 py-3">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="h-4 w-10 bg-gray-200 rounded mx-auto"></div>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="h-4 w-10 bg-gray-200 rounded mx-auto"></div>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="h-6 w-20 bg-gray-200 rounded mx-auto"></div>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="h-6 w-16 bg-gray-200 rounded mx-auto"></div>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="h-6 w-20 bg-gray-200 rounded mx-auto"></div>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="h-6 w-16 bg-gray-200 rounded mx-auto"></div>
        </td>
      </tr>
    );
  };


  return (
    <div className="p-[24px] bg-[#F6F8F9] min-h-screen">
      <div className=" text-gray-900">
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
            <div className="flex items-center gap-2  w-full md:w-[45%] lg:w-[40%] border rounded-lg px-3 py-2 bg-[#F8FBFC]">
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
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
                >
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
          `}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
                  onClick={() => setfilterOneOpen((p) => !p)}
                >
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
                          }`}
                        >
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
                  setSearch("");
                }}
                className="border rounded-lg px-3 py-2 text-sm text-[#686868] flex items-center justify-between gap-2 bg-[#F8FBFC]  hover:bg-gray-100"
              >
                <FunnelX size={18} />
                Clear Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full text-sm text-gray-600">
              <thead className="bg-[#F5F8FA] h-[54px]">
                <tr className="text-[#4B5563] text-[16px]">
                  {[
                    "Customer Name",
                    "Email",
                    "Phone Number",
                    "Total Orders",
                    "Total Spend",
                    "Last Order Date",
                    "Status",
                    // "Action",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-4 font-medium text-left whitespace-nowrap ${
                        i === 7 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
                 ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No customers found
                    </td>
                  </tr>
                 ) : (
                rows.map((user) => (
                  <tr
                    key={user._id}
                      onClick={() => navigate(`/admin/customers/${user._id}/customer-info`)}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-4 py-3">{user?.name  || "N/A"}</td>
                    <td className="px-4 py-3">{user?.email  || "N/A"}</td>
                    <td className="px-4 py-3">{user?.phoneNumber || "N/A"}</td>
                    <td className="px-4 py-3">{user?.totalOrders || "N/A"}</td>
                    <td className="px-4 py-3">₹{user?.totalSpend || "0.00"}</td>
                    <td className="px-4 py-3">{formatDate(user?.lastOrderAt) || "N/A"}</td>

                    {/* Status */}
                  <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium ${
                          user.isActive === true
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-xl ${
                            user.isActive === true ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {user.isActive === true ? "Active" : "Blocked"}
                      </span>
                    </td>


                    {/* Action */}
                    {/* <td className="px-4 py-3 text-right">
                      <button
                        className="p-1.5 rounded hover:bg-gray-100"
                        onClick={() =>
                          navigate(`/admin/customers/${r.id}/customer-info`)
                        }
                      >
                        <PencilLine className="w-4 h-4 text-gray-600" />
                      </button>
                    </td> */}
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.length > 0 && (
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
                  disabled={page === 1}
                >
                  ‹
                </button>

                <div className="px-4 py-1 border rounded">
                  Page {String(page).padStart(2, "0")} of{" "}
                  {String(totalPages).padStart(2, "0")}
                </div>

                <button
                  className="px-3 py-1 border rounded disabled:opacity-40"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          )}
          {users.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No customers found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Customer;
