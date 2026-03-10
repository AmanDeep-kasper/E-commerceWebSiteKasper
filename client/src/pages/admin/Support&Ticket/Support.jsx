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
  Ticket,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import productData from "../../../data/products.json";

const Support = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const { uuid } = useParams();

  const Editproduct = useMemo(() => {
    if (!uuid || !productData?.length) return null;

    return productData.find(
      (p) => p.uuid && p.uuid.toLowerCase() === uuid.toLowerCase(),
    );
  }, [productData, uuid]);

  //  Delete button + selected items
  const [selectedItems, setSelectedItems] = useState([]);
  const deletebtnShow = selectedItems.length > 0;

  // Select all checkboxes
  const handleSelectAll = (e) => {
    const visibleIds = currentItems.map((item) => item.id || item.uuid);

    if (e.target.checked) {
      // Add only visible product IDs
      // const visibleIds = currentItems.map((item) => item.id);
      setSelectedItems((prev) => [...new Set([...prev, ...visibleIds])]);
    } else {
      // Remove only visible product IDs
      // const visibleIds = currentItems.map((item) => item.id);

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
    setSelectedItems(
      (prev) =>
        prev.includes(id)
          ? prev.filter((x) => x !== id) // unselect
          : [...prev, id], // select
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

//   const [filterOpen, setFilterOpen] = useState(false); // main filter
  const [activeFilter, setActiveFilter] = useState(null); // "status" | "category"

  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [selectedCategory, setSelectedCategory] = useState("Category");

  // 🔹 Filter products by debouncedSearch
  let filteredProducts = productData.filter((p) => {
    //  Search filter
    const searchMatch = (p.title || "").toLowerCase().includes(debouncedSearch);

    //  Status filter
    const statusMatch =
      selectedStatus === "Status" || p.status === selectedStatus;

    //  Category filter
    const categoryMatch =
      selectedCategory === "Category" || p.category === selectedCategory;

    return searchMatch && statusMatch && categoryMatch;
  });

  const [selectedSort, setSelectedSort] = useState("Latest");
  // Apply category filter
  //   const categories = [
  //     "Spiritual & Religious Art",
  //     "Nature & Wildlife",
  //     "Geometric & Abstract",
  //     "Wall Arts",
  //     "Typography & Symbols",
  //     "Clones",
  //     "Festival & Occasion",
  //     "Reflection Art",
  //   ];

  ///////////////////////////////////
  // Sorting options
  const priceOptions = [
    "Latest",
    "Oldest",
  ];

  // Apply sorting
  if (selectedSort === "Latest") {
    filteredProducts.sort((a, b) => (a.costPrice || 0) - (b.costPrice || 0));
  } else if (selectedSort === "Oldest") {
    filteredProducts.sort((a, b) => (b.costPrice || 0) - (a.costPrice || 0));
  }

  // console.log(filteredProducts);

  /////////////////////////////////
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔹 Then paginate filtered list
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  //  Check if all visible rows are selected
  const allVisibleSelected =
    currentItems.length > 0 &&
    currentItems.every((item) => selectedItems.includes(item.id));

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

  const kpicardData = [
    {
      name: "Total Products",
      data: "45",
      icon: <Ticket />,
      iconbg: "bg-[#D5E5F5]",
      iconColor: "text-[#1C3753]",
    },
    {
      name: "Total Categories",
      data: "15",
      icon: <Ticket />,
      iconbg: "bg-[#E5DBFB]",
      iconColor: "text-[#713CE8]",
    },
    {
      name: "Active Products",
      data: "42",
      icon: <Ticket />,
      iconbg: "bg-[#F0FDF4]",
      iconColor: "text-[#00A63E]",
    },
    {
      name: "Draft",
      data: "2",
      icon: <Ticket />,
      iconbg: "bg-[#EFEFEF]",
      iconColor: "text-[#686868]",
    },
    {
      name: "Archived",
      data: "1",
      icon: <Ticket />,
      iconbg: "bg-[#FFFBEB]",
      iconColor: "text-[#F8A14A]",
    },
  ];

  return (
    <>
      <div className="p-[24px] bg-[#F6F8F9] rounded-md min-h-screen">
        {/* Header */}

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between  16px px-2 rounded-md">
              <h2 className="text-[20px] font-semibold text-gray-800">
                Support & Ticket
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4  py-6">
            {kpicardData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="relative flex items-center justify-between gap-9
  p-4 border rounded-2xl bg-white shadow-sm"
                >
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2
                    w-[4px] h-10 bg-blue-500 rounded-r"
                  />

                  <div>
                    <div className="text-sm text-gray-500">{item.name}</div>
                    <div className="text-2xl font-semibold">{item.data}</div>
                  </div>

                  <div
                    className={`${item.iconbg} ${item.iconColor} p-[12px] rounded-lg`}
                  >
                    {item.icon}
                  </div>
                </div>
              );
            })}
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
                placeholder="Search by Ticket ID, Order ID"
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
               Status
                <ChevronDown />
              </button>

              {activeFilter === "status" && (
                <div className="absolute left-0 top-11 ml-2 w-36 z-30">
                  <ul className=" bg-white border rounded-lg shadow">
                    {["New", "Open", "Closed"].map((status) => (
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
                  <ul className="absolute  z-10 mt-1 w-52 border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-[15px]">
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
                    Ticket ID
                  </th>
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Issue Type
                  </th>
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Created Date
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
                    key={item.uuid || item.id || item.route}
                    className={`border-t hover:bg-gray-50 transition ${
                      selectedItems.includes(item.id) ? "bg-red-50" : ""
                    }`}
                    onClick={(e) => {
                      if (
                        e.target.tagName !== "INPUT" &&
                        e.target.tagName !== "BUTTON" &&
                        e.target.tagName !== "svg" &&
                        e.target.tagName !== "path"
                      ) {
                        // navigate(`/admin/product-info/:uuid${item.sku}`);
                        // navigate(`/admin/product-info/${item.uuid}`);
                      }
                    }}
                  >
                    <td className="px-0 py-4 [16px] text-[#1F2937]">TK-0001</td>

                    <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      Order
                    </td>
                    <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      20/08/2024
                    </td>
                    <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      {item.status === "New" ? (
                        <div className="flex items-center justify-center gap-2 bg-[#E0F4DE] py-1.5 px-3 w-[120px] rounded-lg text-sm text-[#00A63E]">
                          <Circle fill="#00A63E" color="#00A63E" size={12} />
                          Active
                        </div>
                      ) : item.status === "Open" ? (
                        <div className="flex items-center justify-center gap-2 bg-[#EFEFEF] py-1.5 px-3 w-[120px] rounded-lg text-sm text-[#686868]">
                          <Circle fill="#686868" color="#686868" size={12} />
                          Draft
                        </div>
                      ) : item.status === "Closed" ? (
                        <div className="flex items-center justify-center gap-2 bg-[#FFFBEB] py-1.5 px-3 w-[120px] rounded-lg text-sm text-[#F8A14A]">
                          <Circle fill="#F8A14A" color="#F8A14A" size={12} />
                          Archived
                        </div>
                      ) : (
                        ""
                      )}
                    </td>

                    {/* Centered action icons (hidden until hover) */}
                    <td className="px-0 py-3">
                      <div className="flex items-center justify-center gap-2 ">
                        <button
                          onClick={(e) => {
                            // e.stopPropagation();
                            navigate("/admin/support&ticket/ticketdetail");
                          }}
                          className="relative p-2 rounded group text-[#2C87E2] hover:underline"
                        >
                          View ticket
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-2 px-6 py-4 border-t">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;
