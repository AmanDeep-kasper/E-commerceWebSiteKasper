// import React, { useMemo, useState } from "react";
// import {
//   BellIcon,
//   MessageSquareIcon,
//   MoonIcon,
//   X,
// } from "lucide-react";
// import { ChevronLeft, MoreVertical, Upload, Filter, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import products from "../../../data/products.json";
// import AddProduct from "../../../components/admin/AddProduct";

// const INR = new Intl.NumberFormat("en-IN", {
//   style: "currency",
//   currency: "INR",
//   maximumFractionDigits: 0,
// });

// const Badge = ({ children, tone = "success" }) => {
//   const styles = {
//     success: "bg-green-100 text-green-700",
//     danger: "bg-red-100 text-red-600",
//     neutral: "bg-gray-100 text-gray-700",
//   };
//   return (
//     <span
//       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[tone]}`}
//     >
//       {children}
//     </span>
//   );
// };

// const cx = (...c) => c.filter(Boolean).join(" ");

// const links = [
//   { icon: MoonIcon },
//   { icon: MessageSquareIcon },
//   { icon: BellIcon },
// ];

// function Product() {
//   const [page, setPage] = useState(1);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const rowsPerPage = 10;
//   const allRows = [...products];
//   const totalPages = Math.ceil(allRows.length / rowsPerPage);
//   const rows = allRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   const navigate = useNavigate(null);

//   return (
//     <>
//       <div className="h-dvh flex flex-col gap-4 ">
//         <div className="min-h-max bg-gray-50 text-gray-900">
//           {/* Top nav */}
//           <div className=" bg-white ">
//             <div className=" mx-auto">
//               <div className="flex items-center h-12">
//                 <button
//                   className="p-2 rounded-full hover:bg-gray-100"
//                   aria-label="Go Back"
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
//                 <span className="ml-3 font-semibold text-lg">Products</span>
//               </div>
//             </div>
//           </div>

//           <div className="mx-auto py-6">
//             <div className="border rounded-xl shadow-sm overflow-hidden bg-white">
//               {/* Header */}
//               <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b bg-gray-50">
//                 <h2 className="text-base font-medium">Product</h2>
//                 <div className="flex items-center gap-2">
//                   <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
//                     <Upload className="w-4 h-4" />
//                     Bulk Import
//                   </button>
//                   <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
//                     <Filter className="w-4 h-4" />
//                     Filter
//                   </button>
//                   <button
//                     className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600"
//                     onClick={() => setIsFormOpen(true)}
//                   >
//                     <Plus className="w-4 h-4" /> Add
//                   </button>
//                 </div>
//               </div>

//               {/* Table */}
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                   <thead>
//                     <tr className="text-gray-600 border-b">
//                       {[
//                         "Product Name",
//                         "Product ID",
//                         "SKU",
//                         "Category",
//                         "Price",
//                         "Stock Quantity",
//                         "Status",
//                         "Actions",
//                       ].map((h) => (
//                         <th
//                           key={h}
//                           className="text-left font-medium px-4 lg:px-6 py-3 whitespace-nowrap"
//                         >
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rows.map((r) => (
//                       <tr
//                         key={r.uuid}
//                         className="border-t hover:bg-gray-50"
//                         onClick={() =>
//                           navigate(`/admin/product-info/${r.uuid}`)
//                         }
//                       >
//                         <td className="px-4 lg:px-6 py-3">
//                           <div className="flex items-center gap-2">
//                             <img
//                               src={r.image[0]}
//                               alt="thumb"
//                               className="w-7 h-7 rounded-full object-cover"
//                             />
//                             <span className="font-medium text-gray-800 truncate">
//                               {r.title}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-4 lg:px-6 py-3 text-gray-700">
//                           {r.uuid}
//                         </td>
//                         <td className="px-4 lg:px-6 py-3 truncate">{r.SKU}</td>
//                         <td className="px-4 lg:px-6 py-3 truncate">
//                           {r.category}
//                         </td>
//                         <td className="px-4 lg:px-6 py-3">
//                           {INR.format(r.basePrice)}
//                         </td>
//                         <td className="px-4 lg:px-6 py-3">{r.stockQuantity}</td>
//                         <td className="px-4 lg:px-6 py-3">
//                           {r.stockQuantity > 0 ? (
//                             <Badge tone="success">In Stock</Badge>
//                           ) : (
//                             <Badge tone="danger">Out of Stock</Badge>
//                           )}
//                         </td>
//                         <td className="px-4 lg:px-6 py-3 text-right">
//                           <button
//                             className="p-1.5 rounded hover:bg-gray-100"
//                             aria-label={`Actions for ${r.title}`}
//                           >
//                             <MoreVertical className="w-5 h-5 text-gray-600" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-t bg-white text-sm">
//                 <button
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
//                   disabled={page === 1}
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                   Previous
//                 </button>
//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: totalPages }).map((_, i) => {
//                     const n = i + 1;
//                     const active = n === page;
//                     return (
//                       <button
//                         key={n}
//                         onClick={() => setPage(n)}
//                         className={cx(
//                           "w-8 h-8 rounded text-sm flex items-center justify-center",
//                           active
//                             ? "bg-gray-900 text-white"
//                             : "bg-white border hover:bg-gray-100"
//                         )}
//                       >
//                         {String(n).padStart(2, "0")}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <button
//                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
//                   disabled={page === totalPages}
//                 >
//                   Next
//                   <ChevronLeft className="w-4 h-4 rotate-180" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {isFormOpen && (
//         <div className="absolute top-0 w-full bg-black/70 h-[100%]">
//           <div className="relative p-4 flex justify-center items-center h-lvh">
//             <AddProduct></AddProduct>
//             <div className="absolute right-4 top-4 hover:bg-white/50 rounded-full p-2">
//               <X onClick={() => setIsFormOpen(false)}></X>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Product;

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
import productData from "../../../data/products.json";
import { data } from "framer-motion/m";
// import axiosInstance from "../../../api/axiosInstance";
// import kpiCards from "./KpiCardProductlist";
// import Active_product from "../../../assets/icons/Icon.png";

const Products = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { uuid } = useParams();

  const [currentPage, setCurrentPage] = useState(1); // ✅ MOVE HERE
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    draft: 0,
  });

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      if (isFirstLoad) setLoading(true);
      // const response = await axiosInstance.get("/product/all");
      const response = await axiosInstance.get(
        `/product/admin/get-all-products`,
        {
          params: {
            page: currentPage,
            limit: 10,
            search: debouncedSearch || undefined,
            status:
              selectedStatus === "Active"
                ? "active"
                : selectedStatus === "Inactive"
                  ? "inactive"
                  : selectedStatus === "Draft"
                    ? "draft"
                    : "all",
            category:
              selectedCategory !== "Category" ? selectedCategory : undefined,
          },
        },
      );
      // console.log("Products API Response:", response.data);

      let products = [];
      if (response.data?.success && response.data?.data) {
        products = response.data.data;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data?.products) {
        products = response.data.products;
      }
      setProduct(products);
      setTotalPages(response.data?.pagination?.pages);
      setTotalItems(response.data?.pagination?.total);
      setStats({
        total: response.data?.stats?.total || 0,
        active: response.data?.stats?.active || 0,
        inactive: response.data?.stats?.inactive || 0,
        draft: response.data?.stats?.draft || 0,
      });
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [currentPage, debouncedSearch, selectedStatus, selectedCategory]);

  // const Editproduct = useMemo(() => {
  //   if (!uuid || !productData?.length) return null;

  //   return productData.find(
  //     (p) => p.uuid && p.uuid.toLowerCase() === uuid.toLowerCase()
  //   );
  // }, [productData, uuid]);

  //  Delete button + selected items
  const [selectedItems, setSelectedItems] = useState([]);
  const deletebtnShow = selectedItems.length > 0;

  // Select all checkboxes
  const handleSelectAll = (e) => {
    const visibleIds = product.map((item) => item._id || item.id);

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

  const [selectedSort, setSelectedSort] = useState("Price: Low → High");

  // extract unique categories from actual product data
  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    product.forEach((p) => {
      const catName = p.categoryName || p.category?.name;
      if (catName) {
        uniqueCategories.add(catName);
      }
    });
    return [...uniqueCategories];
  }, [product]);

  // Sorting options
  const priceOptions = [
    "Price: Low → High",
    "Price: High → Low",
    "Alphabetical (A–Z)",
    "Alphabetical (Z–A)",
  ];

  // Apply sorting
  const sortedProducts = [...product];
  if (selectedSort === "Price: Low → High") {
    sortedProducts.sort(
      (a, b) => (a.defaultPrice || 0) - (b.defaultPrice || 0),
    );
  } else if (selectedSort === "Price: High → Low") {
    sortedProducts.sort(
      (a, b) => (b.defaultPrice || 0) - (a.defaultPrice || 0),
    );
  } else if (selectedSort === "Alphabetical (A–Z)") {
    sortedProducts.sort((a, b) =>
      (a.name || a.productTittle || "").localeCompare(
        b.name || b.productTittle || "",
      ),
    );
  } else if (selectedSort === "Alphabetical (Z–A)") {
    sortedProducts.sort((a, b) =>
      (b.name || b.productTittle || "").localeCompare(
        a.name || a.productTittle || "",
      ),
    );
  }

  // console.log(sortedProducts);

  /////////////////////////////////

  //  Check if all visible rows are selected
  const allVisibleSelected =
    product.length > 0 &&
    product.every((item) => selectedItems.includes(item._id || item.id));

  // navigate the section in product detlis page
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
      data: totalItems,
      icon: <Package />,
      iconbg: "bg-[#D5E5F5]",
      iconColor: "text-[#1C3753]",
    },
    {
      name: "Total Categories",
      data: categories.length,
      icon: <Layers />,
      iconbg: "bg-[#E5DBFB]",
      iconColor: "text-[#713CE8]",
    },
    {
      name: "Active Products",
      data: stats?.active || 0,
      icon: <PackageCheck />,
      iconbg: "bg-[#F0FDF4]",
      iconColor: "text-[#00A63E]",
    },
    {
      name: "Draft",
      data: stats?.draft || 0,
      //  product.filter((p) => p.isActive === false).length,
      icon: <FileText />,
      iconbg: "bg-[#EFEFEF]",
      iconColor: "text-[#686868]",
    },
    {
      name: "Inactive",
      // data: product.filter((p) => p.isActive === false).length,
      data: stats?.inactive || 0,
      icon: <Archive />,
      iconbg: "bg-[#FFFBEB]",
      iconColor: "text-[#F8A14A]",
    },
  ];

  // const handleEdit = () => {
  //   navigate(`/admin/add-product/${Editproduct.uuid}`);
  // };

  const isFilterActive =
    selectedStatus !== "Status" ||
    selectedCategory !== "Category" ||
    search !== "";

  if (loading && isFirstLoad) {
    return (
      <div className="p-[24px] bg-[#F6F8F9] rounded-md min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C3753] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="p-[24px] bg-[#F6F8F9] rounded-md min-h-screen">
        {/* Header */}

        <div className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between  16px px-2 rounded-md">
              <h2 className="text-[20px] font-semibold text-gray-800">
                All Products
              </h2>
            </div>

            <div>
              <Link to={`/admin/add-product`}>
                <button className="bg-[#1C3753] text-white px-4 py-2 rounded-lg hover:bg-[#344558]">
                  + Add Product
                </button>
              </Link>
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
        {/* delete in click in item apper */}
        {/* <div className=" flex items-center justify-end ">
            {deletebtnShow && (
              <button className="border px-3 py-2 rounded-lg text-white bg-[#D11A2A] hover:bg-[#F64646] flex items-center justify-center gap-3">
                <Trash className="w-4 h-4 text-white" />
                Delete ({selectedItems.length})
              </button>
            )}
          </div> */}

        {/* Search + Filters */}

        <div className="bg-white p-4 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex bg-[#F8FBFC] items-center border border-gray-200 rounded-xl px-[16px] py-[13px] hover:bg-white transition-colors duration-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 w-[42%]">
              <Search className="w-4 h-4 text-gray-500 mr-2" size={20} />
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name, SKU ID, Category"
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
                {/* All Status */}
                {selectedStatus === "Status" ? "All Status" : selectedStatus}
                <ChevronDown />
              </button>
              <button
                onClick={() =>
                  setActiveFilter((prev) =>
                    prev === "category" ? null : "category",
                  )
                }
                className=" border rounded-lg px-4 py-2 flex items-center justify-center gap-6 text-[#686868] bg-[#F8F8F8]"
              >
                {/* All Categories */}
                {selectedCategory === "Category"
                  ? "All Categories"
                  : selectedCategory}
                <ChevronDown />
              </button>
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
                  <ul className=" bg-white border rounded-lg shadow">
                    {["Active", "Inactive", "Draft"].map((status) => (
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
                <div className="absolute left-40 top-11 ml-2 w-64 z-30">
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
              {/* <div className="relative inline-block" ref={filterRef}>
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="w-full border rounded-lg px-4 py-2 flex items-center justify-center gap-6 bg-[#F8F8F8] text-[15px] text-[#686868] focus:outline-none">
                  <ListMinus
                    size={18}
                    className={`text-gray-500 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                  <span>{selectedSort}</span>
                </button>

                
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
                        }`}>
                        <span className="text-[#686868]">{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div> */}
              {isFilterActive && (
                <button
                  onClick={() => {
                    setSelectedSort("Price: Low → High");
                    setSelectedCategory("Category");
                    setSelectedStatus("Status");
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="text-[#1C3753] flex items-center justify-between gap-2"
                >
                  {/* <FunnelX size={18} /> */}
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-[#F8F8F8] h-[54px]">
                <tr className="text-[#4B5563] text-[18px]">
                  {/* // header ka input ha yaa */}
                  {/* <th className="px-4 py-3"> */}
                  {/* <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        currentItems.length > 0 &&
                        currentItems.every((item) =>
                          selectedItems.includes(item.id || item.uuid)
                        ) &&
                        currentItems.length > 0
                      }
                      className="w-4 h-4"
                    /> */}
                  {/* </th> */}
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Product Name
                  </th>
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    SKU ID
                  </th>
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Category
                  </th>
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Price
                  </th>
                  <th className="px-4 py-3 font-normal text-[#1C1C1C] text-center">
                    Variants
                  </th>
                  <th className="px-4 py-3 font-normal text-[#1C1C1C] text-center">
                    Status
                  </th>
                  {/* <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Selling Price{" "}
                  </th>
                  <th className="px-4 py-3 font-normal text-[#1C1C1C]">
                    Cost Price{" "}
                  </th> */}
                  <th className="px-4 py-3 font-normal text-[#1C1C1C] text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedProducts.map((item) => (
                  <tr
                    key={item._id}
                    className={`border-t hover:bg-gray-50 transition ${
                      selectedItems.includes(item._id) ? "bg-red-50" : ""
                    }`}
                    onClick={() =>
                      item.isDraft
                        ? navigate(`/admin/add-product/${item._id}`)
                        : navigate(
                            `/admin/product-info/${item.slug || item._id}`,
                          )
                    }
                  >
                    <td className="px-0 py-4">
                      <div className="flex items-center justify-start gap-2">
                        <div className="h-[50px] w-[50px] ml-2 bg-[#EFEFEF] p-1 rounded-md overflow-hidden">
                          <img
                            className="h-full w-full object-cover object-center"
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D"
                            }
                            alt={item.name || item.productTittle}
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D";
                            }}
                          />
                        </div>

                        <div>
                          <span className="text-[#1F2937]  text-[16px] font-medium cursor-pointer">
                            {item.name && item.name.split(" ").length > 3
                              ? item.name.split(" ").slice(0, 3).join(" ") +
                                "..."
                              : item.name ||
                                item.productTittle ||
                                "Untitled Product"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      {/* {item.variants?.[0]?.variantSkuId || "N/A"} */}
                      {item.skuId || item.variants?.[0]?.variantSkuId || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      {item.categoryName || item.category?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      ₹{item.defaultPrice || 0}
                    </td>
                    {/* <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      {item.sellingPrice === 0 ? (
                        <div className="text-red-500 font-semibold">
                          Out of Stock
                        </div>
                      ) : item.sellingPrice <= 10 ? (
                        <div className="text-yellow-500 font-semibold">
                          Low Stock
                        </div>
                      ) : (
                        <div className="text-green-600 font-semibold">
                          In Stock
                        </div>
                      )}
                    </td> */}
                    <td className="px-4 py-3 text-[16px] text-[#1F2937] text-center">
                      {item.variantCount || item.variants?.length || 1}
                    </td>
                    {/* <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      {item.status === "Active" ? (
                        <div className="flex items-center justify-center gap-2 bg-[#E0F4DE] py-1.5 px-2 rounded-lg text-sm text-[#00A63E]">
                          <Circle
                            fill="#00A63E"
                            color="#00A63E"
                            size={"12px"}
                            className=""
                          />
                          Active
                        </div>
                      ) : item.status === "Draft" ? (
                        <div className="flex items-center justify-center gap-2 bg-[#EFEFEF] py-1.5 px-3 rounded-lg text-sm text-[#686868]">
                          <Circle
                            fill="#686868"
                            color="#686868"
                            size={"12px"}
                            className=""
                          />
                          Draft
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 bg-[#FFFBEB] py-1.5 px-3 rounded-lg text-sm text-[#F8A14A]">
                          <Circle
                            fill="#F8A14A"
                            color="#F8A14A"
                            size={"12px"}
                            className=""
                          />
                          Archived
                        </div>
                      )}
                    </td> */}

                    <td className="px-4 py-3 text-center">
                      {item.isDraft ? (
                        <div className="flex items-center justify-center gap-2 bg-[#EFEFEF] py-1.5 px-3 rounded-lg text-sm text-[#686868]">
                          <Circle
                            fill="#686868"
                            color="#686868"
                            size={"12px"}
                          />
                          Draft
                        </div>
                      ) : item.isActive ? (
                        <div className="flex items-center justify-center gap-2 bg-[#E0F4DE] py-1.5 px-2 rounded-lg text-sm text-[#00A63E]">
                          <Circle
                            fill="#00A63E"
                            color="#00A63E"
                            size={"12px"}
                          />
                          Active
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 bg-[#FFFBEB] py-1.5 px-3 rounded-lg text-sm text-[#F8A14A]">
                          <Circle
                            fill="#F8A14A"
                            color="#F8A14A"
                            size={"12px"}
                          />
                          Inactive
                        </div>
                      )}
                    </td>

                    {/* <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      ₹{item.sellingPrice}
                    </td>
                    <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                      ₹{item.costPrice}
                    </td> */}

                    {/* Centered action icons (hidden until hover) */}
                    <td className="px-0 py-3 text-center">
                      <div className="flex items-center justify-center gap-2 ">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            if (item.isDraft) {
                              navigate(`/admin/add-product/${item._id}`);
                            } else {
                              navigate(
                                `/admin/product-info/${item.slug || item._id}`,
                              );
                            }
                          }}
                          className="relative p-2 rounded group text-[#2C87E2] hover:underline"
                        >
                          {item.isDraft ? "Edit" : "View"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center gap-2 px-6 py-4 border-t">
              {/* Showing X of Y results */}
              <div className="text-sm text-gray-600">
                Showing {product.length} of {totalItems} results
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-40"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                <div className="px-4 py-1 border rounded text-sm text-gray-700">
                  Page {String(currentPage).padStart(2, "0")} of{" "}
                  {String(totalPages).padStart(2, "0")}
                </div>

                <button
                  className="px-3 py-1 border rounded disabled:opacity-40"
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
      </div>
    </>
  );
};

export default Products;
