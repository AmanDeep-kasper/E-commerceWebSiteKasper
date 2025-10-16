// import React, { useMemo, useState } from "react";
// import {
//   BellIcon,
//   MessageSquareIcon,
//   MoonIcon,
//   X,
// } from "lucide-react";
// import { ChevronLeft, MoreVertical, Upload, Filter, Plus } from "lucide-react";
// import { useNavigate } from "react-router";
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

import { useEffect, useState } from "react";
import {
  ArrowDownUp,
  ChevronDown,
  Pencil,
  PencilLine,
  Search,
  Trash,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";

const Products = () => {
  const [products] = useState(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: i + 1,
      title: `Live Laugh Love Wall Art ${i + 1}`,
      sku: `MMWA00${i + 1}`,
      category: "Lord Ganesh",
      quantity: 45,
      SallingPrice: 599,
      CostPrice: 499,
      variant: "Dimension - 65L x 60W cm",
    }))
  );

  // ✅ Delete button + selected items
  const [selectedItems, setSelectedItems] = useState([]);
  const deletebtnShow = selectedItems.length > 0;

  // Select all checkboxes
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Add only visible product IDs
      const visibleIds = currentItems.map((item) => item.id);
      setSelectedItems([...new Set([...selectedItems, ...visibleIds])]);
    } else {
      // Remove only visible product IDs
      const visibleIds = currentItems.map((item) => item.id);
      setSelectedItems(selectedItems.filter((id) => !visibleIds.includes(id)));
    }
  };

  //////////////////////////////
  const [PriceOpen, setPriceOpen] = useState(false);
  const [PriceSelected, setPriceSelected] = useState("Categories");

  const categories = [
    "Spiritual & Religious Art",
    "Nature & Wildlife",
    "Geometric & Abstract",
    "Wall Arts",
    "Typography & Symbols",
    "Clones",
    "Festival & Occasion",
    "Reflection Art",
  ];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Price: Low → High");

  const price = [
    "Price: Low → High",
    "Price: High → Low",
    "Alphabetical (A–Z)",
    "Alphabetical (Z–A)",
  ];

  // ✅ Single checkbox toggle
  const handleCheckboxChange = (id) => {
    setSelectedItems(
      (prev) =>
        prev.includes(id)
          ? prev.filter((x) => x !== id) // Unselect if already selected
          : [...prev, id] // Add if not selected
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

  // 🔹 Filter products by debouncedSearch
  let filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSort, setSelectedSort] = useState("Price: Low → High");
  // Apply category filter

  if (selectedCategory != "All Categories") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === selectedCategory
    );
  }

  // Apply sorting
  if (selectedSort === "Price: Low → High") {
    filteredProducts.sort((a, b) => a.SallingPrice - b.SallingPrice);
  } else if (selectedSort === "Price: High → Low") {
    filteredProducts.sort((a, b) => b.SallingPrice - a.SallingPrice);
  } else if (selectedSort === "Alphabetical (A–Z)") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedSort === "Alphabetical (Z–A)") {
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔹 Then paginate filtered list
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  // ✅ Check if all visible rows are selected
  const allVisibleSelected =
    currentItems.length > 0 &&
    currentItems.every((item) => selectedItems.includes(item.id));

  return (
    <>
      {/* <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-md">
        <h2 className="text-xl font-semibold text-gray-800">All Products</h2>
        </div> */}
      {/* </div> */}
      <div className="p-4 bg-white rounded-md min-h-screen">
        {/* Header */}

        <div className="flex justify-between mb-[16px]">
          <div className="flex-1 max-w-sm hidden md:block">
            <div className="flex items-center justify-between mb-4 bg-white py-[]16px px-2 rounded-md">
              <h2 className="text-[20px] font-semibold text-gray-800">
                All Products
              </h2>
            </div>
            <div className="flex items-center border border-gray-200 rounded-md px-[16px] py-[13px] bg-gray-50 hover:bg-white transition-colors duration-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
              <Search className="w-4 h-4 text-gray-500 mr-2" size={20} />
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for anything..."
                className="outline-none flex-1 text-sm text-gray-700 h-[20px] bg-transparent placeholder-gray-400  placeholder:text-[16px]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link to={`/admin/add-product`}>
              <button className="bg-[#DD851F] text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                + Add Product
              </button>
            </Link>

            <div className=" flex items-center justify-end ">
              {deletebtnShow && (
                <button className="border px-3 py-2 rounded-lg text-white bg-[#D11A2A] hover:bg-[#F64646] flex items-center justify-center gap-3">
                  <Trash className="w-4 h-4 text-white" />
                  Delete ({selectedItems.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search + Filters */}

        <div className="flex flex-wrap gap-4 mb-6 text-[#000000]">
          {/* Categories Dropdown */}
          <div className="relative inline-block w-56">
            <button
              onClick={() => setPriceOpen((prev) => !prev)}
              className="w-full border rounded-lg px-4 py-2 flex items-center justify-between bg-[#F8F8F8] text-[15px] text-gray-800 focus:outline-none"
            >
              <span>{selectedCategory}</span>
              <ChevronDown
                size={18}
                className={`text-gray-500 transition-transform duration-200  ${
                  PriceOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Category Dropdown Menu */}
            {PriceOpen && (
              <ul className="absolute z-10 mt-1 w-full border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-[15px]">
                {["All Categories", ...categories].map((category, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setSelectedCategory(category);
                      setPriceOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-4 py-2 hover:bg-[#FFEAD2] cursor-pointer ${
                      PriceSelected === category
                        ? "bg-gray-100 text-gray-900"
                        : ""
                    }`}
                  >
                    <span>{category}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Price Dropdown */}
          <div className="relative inline-block w-56">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="w-full border rounded-lg px-4 py-2 flex items-center justify-between bg-[#F8F8F8] text-[15px] text-gray-800 focus:outline-none"
            >
              <span>{selected}</span>
              <ChevronDown
                size={18}
                className={`text-gray-500 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Price Dropdown Menu */}
            {open && (
              <ul className="absolute z-10 mt-1 w-full border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-[15px]">
                {price.map((p, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setSelectedSort(p);
                      setOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-2 hover:bg-[#FFEAD2] cursor-pointer ${
                      selected === p ? "bg-gray-100 text-gray-900" : ""
                    }`}
                  >
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-[#F8F8F8] h-[54px]">
              <tr className="text-[#4B5563] text-[18px]">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      setSelectedItems === products.length &&
                      products.length > 0
                    }
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-4 py-3 font-normal">Product</th>
                <th className="px-4 py-3 font-normal">SKU ID</th>
                <th className="px-4 py-3 font-normal">Category</th>
                <th className="px-4 py-3 font-normal">Quantity</th>
                <th className="px-4 py-3 font-normal">Selling Price </th>
                <th className="px-4 py-3 font-normal">Cost Price </th>
                <th className="px-4 py-3 font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t hover:bg-gray-50 transition group ${
                    selectedItems.includes(item.id) ? "bg-red-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="w-4 h-4"
                    />
                  </td>

                  <td className="px-0 py-3">
                    <div className="flex items-center justify-start gap-2">
                      <div className="h-[50px] w-[50px] ml-2 bg-[#D9D9D9] rounded-md"></div>
                      <div>
                        <span className="text-[#1F2937] hover:underline text-[16px] font-medium cursor-pointer">
                          {item.title}
                        </span>
                        <p className="text-[14px] text-gray-500">
                          {item.variant}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                    {item.sku}
                  </td>
                  <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                    {item.category}
                  </td>
                  <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                    ₹{item.SallingPrice}
                  </td>
                  <td className="px-4 py-3 text-[16px] text-[#1F2937]">
                    ₹{item.CostPrice}
                  </td>

                  {/* Centered action icons (hidden until hover) */}
                  <td className="px-0 py-3">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition">
                        <PencilLine className="w-6 h-6 text-gray-900" />
                      </button>
                      <button className="p-2 rounded bg-red-50 hover:bg-red-100 transition">
                        <Trash className="w-6 h-6 text-red-700" />
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 border rounded ${
                  page === currentPage ? "bg-[#212121] text-white" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
