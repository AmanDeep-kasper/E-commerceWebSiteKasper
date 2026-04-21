import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  PencilLine,
  Search,
  Trash,
  Package,
  Layers,
  FileText,
  Archive,
  PackageCheck,
  ListMinus,
  ListFilter,
  Circle,
  CopyCheck,
  FunnelX,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";
// import kpiCards from "./KpiCardProductlist";
// import Active_product from "../../../assets/icons/Icon.png";

const Transporter = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const { uuid } = useParams();

  const Editproduct = useMemo(() => {
    if (!uuid || !product?.length) return null;

    return product.find(
      (p) => p.uuid && p.uuid.toLowerCase() === uuid.toLowerCase(),
    );
  }, [product, uuid]);

  //  Delete button + selected items
  const [selectedItems, setSelectedItems] = useState([]);
  const deletebtnShow = selectedItems.length > 0;

  // Select all checkboxes
  const handleSelectAll = (e) => {
    const visibleIds = currentItems.map((item) => getId(item));

    if (e.target.checked) {
      setSelectedItems((prev) => [...new Set([...prev, ...visibleIds])]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => !visibleIds.includes(id)));
    }
  };

  //////////////////////////////
  const [CategoriesOpen, setCategoriesOpen] = useState(false);
  const [PriceSelected, setPriceSelected] = useState("Categories");
  /////////////////////////////////
  const [open, setOpen] = useState(false);

  //  Single checkbox toggle

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id) // unselect
        : [...prev, id],
    );
  };

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce logic usestate

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const [filterOpen, setFilterOpen] = useState(false); // main filter
  const [activeFilter, setActiveFilter] = useState(null); // "status" | "category"

  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [selectedCategory, setSelectedCategory] = useState("Category");

  // 🔹 Filter products by debouncedSearch
  let filteredProducts = Array.isArray(product)
    ? product.filter((p) => {
        const searchMatch =
          (p.transporterName || "").toLowerCase().includes(debouncedSearch) ||
          (p.registrationNumber || "").toLowerCase().includes(debouncedSearch);

        const statusMatch =
          selectedStatus === "All Status" ||
          selectedStatus === "Status" ||
          (selectedStatus === "Active" && p.isActive) ||
          (selectedStatus === "Inactive" && !p.isActive);

        const categoryMatch =
          selectedCategory === "Category" || p.category === selectedCategory;

        return searchMatch && statusMatch && categoryMatch;
      })
    : [];

  const [selectedSort, setSelectedSort] = useState("Latest");
  // Apply category filter
  // const categories = ["Forward", "Return", "Both"];

  ///////////////////////////////////
  // Sorting options
  const priceOptions = [
    "Latest",
    "Oldest",
    "Alphabetical (A–Z)",
    "Alphabetical (Z–A)",
  ];

  // Apply sorting
  if (selectedSort === "Latest") {
    filteredProducts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  } else if (selectedSort === "Oldest") {
    filteredProducts.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
  } else if (selectedSort === "Alphabetical (A–Z)") {
    filteredProducts.sort((a, b) =>
      (a.transporterName || "").localeCompare(b.transporterName || ""),
    );
  } else if (selectedSort === "Alphabetical (Z–A)") {
    filteredProducts.sort((a, b) =>
      (b.transporterName || "").localeCompare(a.transporterName || ""),
    );
  }

  /////////////////////////////////
  // 🔹 Then paginate filtered list
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const currentItems = filteredProducts;

  // useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/dashboard/transport?page=${currentPage}&limit=${itemsPerPage}`,
      );

      const response = res.data;

      setProduct(response?.data || []);

      // 👇 pagination from backend
      setTotalPages(response?.pagination?.totalPages || 1);
      setTotalItems(response?.pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching transporters:", error);
    } finally {
      setLoading(false);
    }
  };
  // }, []);

  useEffect(() => {
    fetchProduct();
  }, [currentPage]);

  //  Check if all visible rows are selected
  const allVisibleSelected =
    currentItems.length > 0 &&
    currentItems.every((item) => selectedItems.includes(item._id));

  // navigate the section in product detlis page

  const navigate = useNavigate();
  //////////////////////////

  const dropdownRef = useRef(null);
  const filterRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // status  drop down close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setActiveFilter(null); // close status/category
        setOpen(false); // close price dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // model open for add transporter form
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // pop up model
  const [deliveryOptions, setDeliveryOptions] = useState({
    forward: false,
    return: false,
    rto: false,
    fast: false,
    oneDay: false,
  });
  const handleToggle = (key) => {
    setDeliveryOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // form set data in usestate

  const [formdata, setFormData] = useState({
    transporterName: "",
    registrationNumber: "",
    trackingUrl: "",
    contactName: "",
    phone: "",
    email: "",
    status: "Active",
  });

  const validate = () => {
    let newErrors = {};

    // Transporter Name
    if (!formdata.transporterName.trim()) {
      newErrors.transporterName = "Transporter name is required";
    }

    // Registration Number
    if (!formdata.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }

    // Contact Name
    if (!formdata.contactName.trim()) {
      newErrors.contactName = "Contact person name is required";
    }

    // Phone validation (10 digits)
    if (!formdata.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formdata.phone)) {
      newErrors.phone = "Enter valid 10 digit phone number";
    }

    // Email validation
    if (!formdata.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formdata.email)) {
      newErrors.email = "Enter valid email address";
    }

    // Tracking URL (optional but if filled must be valid)
    if (formdata.trackingUrl.trim()) {
      if (!/^https?:\/\/.+/.test(formdata.trackingUrl)) {
        newErrors.trackingUrl = "Enter valid URL (http/https)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      transporterName: formdata.transporterName,
      registrationNumber: formdata.registrationNumber,
      trackingUrl: formdata.trackingUrl,
      contactDetails: {
        personName: formdata.contactName,
        phone: formdata.phone,
        email: formdata.email,
      },
      isActive: formdata.status === "Active",
    };

    try {
      await toast.promise(
        axiosInstance.post(
          `/dashboard/transport/add-transporter?page=${currentPage}&limit=10`,
          payload,
        ),
        {
          pending: "Adding transporter...",
          success: "Transporter added successfully ✅",
          error: {
            render({ data }) {
              return (
                data?.response?.data?.message || "Failed to add transporter ❌"
              );
            },
          },
        },
      );

      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      transporterName: "",
      registrationNumber: "",
      trackingUrl: "",
      contactName: "",
      phone: "",
      email: "",
      status: "Active",
    });
    setErrors({});
  };

  return (
    <>
      <div className="p-[24px] bg-[#F6F8F9] rounded-md min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between  16px px-2 rounded-md">
              <h2 className="text-[20px] font-semibold text-gray-800">
                Transporter
              </h2>
            </div>

            <div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#1C3753] text-white px-4 py-2 rounded-lg hover:bg-[#344558]"
              >
                + Add Transporter
              </button>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white p-4 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex bg-[#F8FBFC] items-center border border-gray-200 rounded-xl px-[16px] py-[13px] hover:bg-white transition-colors duration-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 w-[42%]">
              <Search className="w-4 h-4 text-gray-500 mr-2" size={20} />
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Transporter Name, Registration ID"
                className="outline-none flex-1 text-sm  text-gray-700 h-[20px] bg-transparent placeholder-[#686868]  placeholder:text-[16px]"
              />
            </div>

            <div
              ref={filterRef}
              className=" relative flex flex-wrap justify-center items-center gap-2 text-[#000000]"
            >
              <button
                onClick={() =>
                  setActiveFilter((prev) =>
                    prev === "status" ? null : "status",
                  )
                }
                className=" border rounded-lg px-4 py-2 flex items-center justify-center gap-6 text-[#686868] bg-[#F8F8F8]"
              >
                All Status
                <ChevronDown />
              </button>
              {/* <button
                onClick={() =>
                  setActiveFilter((prev) =>
                    prev === "category" ? null : "category",
                  )
                }
                className=" border rounded-lg px-4 py-2 flex items-center justify-center gap-6 text-[#686868] bg-[#F8F8F8]"
              >
                Delivery Type
                <ChevronDown />
              </button> */}

              <div className="relative inline-block">
                {filterOpen && (
                  <div
                    className="absolute mt-2 right-16 top-9 w-40 bg-white border rounded-lg shadow"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                      onClick={() => setActiveFilter("status")}
                    >
                      {selectedStatus === "Status"
                        ? "All Status"
                        : selectedStatus}
                      <ChevronRight className="text-[#686868]" size={"16px"} />
                    </div>

                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                      onClick={() => setActiveFilter("category")}
                    >
                      {selectedCategory === "Category"
                        ? "All Categories"
                        : selectedCategory}
                      <ChevronRight className="text-[#686868]" size={"16px"} />
                    </div>
                  </div>
                )}
              </div>

              {activeFilter === "status" && (
                <div className="absolute left-0 top-11 ml-2 w-36 z-30">
                  <ul className="bg-white border rounded-lg shadow">
                    {["All Status", "Active", "Inactive"].map((status) => (
                      <li
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setActiveFilter(null);
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-[#F5F8FA]"
                      >
                        {status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeFilter === "category" && (
                <div className="absolute left-40 top-11 ml-2 w-44 z-30">
                  <ul className="bg-white border rounded-lg shadow max-h-60 overflow-auto">
                    {categories.map((cat) => (
                      <li
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setActiveFilter(null);
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-[#F5F8FA]"
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price Dropdown */}
              <div className="relative inline-block" ref={filterRef}>
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="w-full border rounded-lg px-4 py-2 flex items-center justify-center gap-6 bg-[#F8F8F8] text-[15px] text-[#686868] focus:outline-none"
                >
                  <ListMinus
                    size={18}
                    className={`text-gray-500 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                  <span>{selectedSort}</span>
                </button>

                {/* Price Dropdown Menu */}
                {open && (
                  <ul className="absolute z-10 mt-1 w-full border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-[15px]">
                    {priceOptions.map((p, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setSelectedSort(p);
                          setOpen(false);
                        }}
                        className={`flex items-center justify-between px-4 py-2 hover:bg-[#F5F8FA] cursor-pointer ${
                          selectedSort === p ? "bg-gray-100 text-gray-900" : ""
                        }`}
                      >
                        <span className="text-[#686868]">{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-[#F8F8F8] h-[54px]">
                <tr className="text-[#4B5563] text-[18px]">
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Transporter Name
                  </th>
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Registration Number
                  </th>
                  {/* <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Delivery Type
                  </th> */}
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Active Shipments
                  </th>
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Status
                  </th>
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((item) => (
                  <tr
                    key={item.uuid || item._id || item.route}
                    className={`border-t hover:bg-gray-50 transition ${
                      selectedItems.includes(item._id) ? "bg-red-50" : ""
                    }`}
                    onClick={(e) => {
                      if (
                        e.target.tagName !== "INPUT" &&
                        e.target.tagName !== "BUTTON" &&
                        e.target.tagName !== "svg" &&
                        e.target.tagName !== "path"
                      ) {
                      }
                    }}
                  >
                    <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      {item.name || item.transporterName}
                    </td>

                    <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      {item.registrationNumber}
                    </td>
                    {/* <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      <div className="bg-[#EFEFEF] p-[6px] w-[90px] text-center rounded-lg font-medium">
                        Forward
                      </div>
                    </td> */}
                    <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      {item.activeShipment || 0}
                    </td>
                    <td className="px-4 py-3 text-[16px]  text-[#1F2937]">
                      {item.isActive ? (
                        <div className="flex items-center w-[100px] justify-center bg-[#E0F4DE] py-1.5 px-2 rounded-lg text-sm text-[#00A63E]">
                          Active
                        </div>
                      ) : (
                        <div className="flex items-center w-[100px] justify-center bg-[#FFEAE9] py-1.5 px-3 rounded-lg text-sm text-[#D53B35]">
                          Inactive
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[16px]">
                      <button
                        onClick={() =>
                          navigate(`/admin/transporter/detail/${item._id}`)
                        }
                        className="text-[#2C87E2] hover:underline"
                      >
                        view
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-2 px-6 py-4 border-t">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 border rounded ${
                      page === currentPage ? "bg-[#212121] text-white" : ""
                    }`}
                    onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                )
              )} */}
              <div className="px-4 py-1.5 border rounded text-sm text-gray-700">
                Page {String(currentPage).padStart(2, "0")} of{" "}
                {String(totalPages).padStart(2, "0")}
              </div>

              <button
                className="px-3 py-1 border rounded"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*  Add Transporter Modal/pop */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddModalOpen(false);
              resetForm();
            }
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-lg max-h-[90vh] flex flex-col"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header (sticky) */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-[#1C1C1C]">
                Add Transporter
              </h3>

              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  // resetForm();
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Body (scrollable) */}
            <div className="px-6 py-4 overflow-y-auto">
              <p className="font-medium text-[14px] mb-2">Basic Information</p>

              <form className="space-y-4">
                {/* <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <select
                    name="status"
                    value={formdata.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                    className={`w-full mt-1 border rounded-lg px-3 py-2 outline-none 
    `}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div> */}
                <div>
                  <label className="text-sm text-gray-600">
                    Transporter Name
                  </label>
                  <input
                    name="transporterName"
                    value={formdata.transporterName}
                    required
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                    placeholder="Enter transporter name"
                    className={`w-full mt-1 border rounded-lg px-3 py-2 outline-none 
    ${errors.transporterName ? "border-red-500" : "border-gray-300"}
  `}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Registration Number
                  </label>
                  <input
                    name="registrationNumber"
                    value={formdata.registrationNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                    placeholder="Enter registration number"
                    className={`w-full mt-1 border rounded-lg px-3 py-2 outline-none 
    ${errors.registrationNumber ? "border-red-500" : "border-gray-300"}
  `}
                  />
                  {errors.registrationNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Tracking ID URL
                  </label>
                  <input
                    name="trackingUrl"
                    value={formdata.trackingUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                    placeholder="Enter tracking id url"
                    className={`w-full mt-1 border rounded-lg px-3 py-2 outline-none 
    ${errors.transporterName ? "border-red-500" : "border-gray-300"}
  `}
                  />
                  {errors.trackingUrl && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.trackingUrl}
                    </p>
                  )}
                </div>

                <p className="font-medium text-[14px] mb-2">Contact Details</p>

                <div>
                  <label className="text-sm text-gray-600">
                    Contact Person Name
                  </label>
                  <input
                    name="contactName"
                    value={formdata.contactName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                    placeholder="Enter contact person name"
                    className={`w-full mt-1 border rounded-lg px-3 py-2 outline-none 
    ${errors.transporterName ? "border-red-500" : "border-gray-300"}
  `}
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contactName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Phone Number</label>
                  <input
                    name="phone"
                    value={formdata.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                      if (value.length <= 10) {
                        setFormData((prev) => ({
                          ...prev,
                          phone: value,
                        }));
                      }
                    }}
                    placeholder="Enter phone number"
                    className={`w-full mt-1 border rounded-lg px-3 py-2 outline-none 
    ${errors.transporterName ? "border-red-500" : "border-gray-300"}
  `}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email Address</label>
                  <input
                    name="email"
                    value={formdata.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                    placeholder="Enter email address"
                    className={`w-full mt-1 border rounded-lg px-3 py-2 outline-none 
    ${errors.transporterName ? "border-red-500" : "border-gray-300"}
  `}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2 px-6 py-4 border-t bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#1C3753] text-white hover:bg-[#344558]"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    Save Transporter
                  </button>
                </div>
              </form>
            </div>

            {/* Footer (sticky) */}
          </div>
        </div>
      )}
    </>
  );
};

export default Transporter;
