// import React, { useMemo, useState } from "react";
// // import AdminSidebar from "./components/AdminSidebar";
// import {
//   BellIcon,
//   Camera,
//   MessageSquareIcon,
//   MoonIcon,
//   Search,
// } from "lucide-react";
// import { ChevronLeft, Upload, Filter, Plus, MoreVertical } from "lucide-react";
// // import Header from "./components/Header";

// const rowsFactory = () => {
//   const names = [
//     "Spiritual & Religious",
//     "Clones",
//     "Typography & Quotes",
//     "Festival & Occasion",
//     "Nature & Wildfire",
//     "Festival & Occasion",
//     "Reflection Art",
//     "Home & Living",
//     "",
//     "Spiritual & Religious",
//     "Typography & Quotes",
//     "Spiritual & Religious",
//   ];
//   return names.map((name, i) => ({
//     sr: String(i + 1).padStart(2, "0"),
//     name,
//     total: [50, 20, 78, 27, 56, 50, 19, 59, 48, 50, 50, 50][i] ?? 50,
//     visible: i % 3 !== 1,
//     created: "12 Jun 2025",
//     modified: "15 Jul 2025",
//     key: i + 1,
//   }));
// };

// // ---- Activity timeline dummy ----
// const timelineFactory = () => [
//   {
//     date: "12 Jun 2025",
//     time: "4:36 PM",
//     type: "Update",
//     who: "Neha Pal",
//     desc: 'Changed name from "Nature" to "Nature-inspired"',
//   },
//   {
//     date: "12 Jun 2025",
//     time: "3:10 PM",
//     type: "Update",
//     who: "Neha Pal",
//     desc: "Adiyogi Shiva Modified in 75×75 cm",
//   },
//   {
//     date: "12 Jun 2025",
//     time: "4:36 PM",
//     type: "Delete",
//     who: "Manshi Gupta",
//     desc: 'Deleted tag: "Spiritual Classic"',
//   },
//   {
//     date: "12 Jun 2025",
//     time: "4:36 PM",
//     type: "Create",
//     who: "Faiz Alam",
//     desc: 'Added new category "Abstract Designs"',
//   },
//   {
//     date: "12 Jun 2025",
//     time: "4:36 PM",
//     type: "Create",
//     who: "Irma Shaikh",
//     desc: "Metal designs featuring deities, symbols, and mandalas rooted in spirituality.",
//   },
//   {
//     date: "12 Jun 2025",
//     time: "4:36 PM",
//     type: "Update",
//     who: "Sachin Sahoo",
//     desc: "Art inspired by Indian heritage, folk dances, or cultural symbols.",
//   },
// ];
// const cx = (...c) => c.filter(Boolean).join(" ");

// function VisibilityToggle({ checked, onChange }) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       onClick={onChange}
//       className={cx(
//         "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors",
//         checked
//           ? "bg-amber-600 border-amber-600"
//           : "bg-gray-200 border-gray-200"
//       )}
//     >
//       {" "}
//       <span
//         className={cx(
//           "pointer-events-none inline-block h-4 w-4 translate-x-0.5 transform rounded-full bg-white shadow transition",
//           checked ? "translate-x-4" : "translate-x-0.5"
//         )}
//       />{" "}
//     </button>
//   );
// }

// function Badge({ children, tone }) {
//   const styles = {
//     Update: "bg-blue-100 text-blue-700",
//     Create: "bg-green-100 text-green-700",
//     Delete: "bg-red-100 text-red-600",
//   };
//   return (
//     <span
//       className={cx(
//         "text-xs font-medium px-2.5 py-0.5 rounded-full",
//         styles[tone] || "bg-gray-100 text-gray-700"
//       )}
//     >
//       {children}
//     </span>
//   );
// }

// const links = [
//   { icon: MoonIcon },
//   { icon: MessageSquareIcon },
//   { icon: BellIcon },
// ];

// function Categories() {
//   const [page, setPage] = useState(1);
//   const totalPages = 4;
//   const rows = useMemo(() => rowsFactory(), [page]);
//   const timeline = useMemo(() => timelineFactory(), []);
//   return (
//     <div className="h-dvh flex flex-col gap-4">

//       <div className="min-h-screen bg-gray-50 text-gray-900">
//         {/* Header */}
//         <header className="bg-white">
//           <div className=" mx-auto">
//             <div className="flex items-center h-12">
//               <button
//                 className="p-2 rounded-full hover:bg-gray-100"
//                 aria-label="Go Back"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <span className="ml-3 font-semibold text-lg">Categories</span>
//             </div>
//           </div>
//         </header>

//         <main className="mx-auto py-6 space-y-6">
//           {/* Categories Section */}
//           <section className="border rounded-xl shadow-sm bg-white overflow-hidden">
//             {/* Header */}
//             <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b bg-gray-50">
//               <h2 className="text-base font-medium">Product</h2>
//               <div className="flex items-center gap-2">
//                 <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
//                   <Upload className="w-4 h-4" />
//                   Bulk Import
//                 </button>
//                 <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
//                   <Filter className="w-4 h-4" />
//                   Filter
//                 </button>
//                 <button className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
//                   <Plus className="w-4 h-4" />
//                   Add
//                 </button>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="text-gray-600 border-b">
//                     {[
//                       "S.No.",
//                       "Available Category",
//                       "Total Products",
//                       "Visibility",
//                       "Created Date",
//                       "Modified Date",
//                       "Actions",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         className="text-left font-medium px-4 lg:px-6 py-3 whitespace-nowrap"
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows.map((c) => (
//                     <tr key={c.key} className="border-t hover:bg-gray-50">
//                       <td className="px-4 lg:px-6 py-3 text-gray-700">
//                         {c.sr}
//                       </td>
//                       <td className="px-4 lg:px-6 py-3 font-medium text-gray-800">
//                         {c.name}
//                       </td>
//                       <td className="px-4 lg:px-6 py-3">{c.total}</td>
//                       <td className="px-4 lg:px-6 py-3">
//                         <VisibilityToggle
//                           checked={c.visible}
//                           onChange={() => {}}
//                         />
//                       </td>
//                       <td className="px-4 lg:px-6 py-3">{c.created}</td>
//                       <td className="px-4 lg:px-6 py-3">{c.modified}</td>
//                       <td className="px-4 lg:px-6 py-3 text-right">
//                         <button
//                           className="p-1.5 rounded hover:bg-gray-100"
//                           aria-label={`Actions for ${c.name}`}
//                         >
//                           <MoreVertical className="w-5 h-5 text-gray-600" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-t bg-white text-sm">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
//                 disabled={page === 1}
//               >
//                 <ChevronLeft className="w-4 h-4" /> Previous
//               </button>
//               <div className="flex items-center gap-1">
//                 {Array.from({ length: totalPages }).map((_, i) => {
//                   const n = i + 1;
//                   return (
//                     <button
//                       key={n}
//                       onClick={() => setPage(n)}
//                       className={cx(
//                         "w-8 h-8 rounded text-sm flex items-center justify-center",
//                         page === n
//                           ? "bg-gray-900 text-white"
//                           : "bg-white border hover:bg-gray-100"
//                       )}
//                     >
//                       {String(n).padStart(2, "0")}
//                     </button>
//                   );
//                 })}
//               </div>
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
//                 disabled={page === totalPages}
//               >
//                 Next <ChevronLeft className="w-4 h-4 rotate-180" />
//               </button>
//             </div>
//           </section>

//           {/* Activity Log Section */}
//           <section className="border rounded-xl shadow-sm bg-white overflow-hidden">
//             {/* Header */}

//             <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b bg-gray-50">
//               <h2 className="text-base font-medium">Activity Log</h2>
//               <div className="flex items-center gap-2">
//                 <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
//                   <Upload className="w-4 h-4" />
//                   Bulk Import
//                 </button>
//                 <button className="inline-flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-100">
//                   <Filter className="w-4 h-4" />
//                   Filter
//                 </button>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="text-gray-600 border-b">
//                     {[
//                       "Date & Time",
//                       "Action Type",
//                       "Performed By",
//                       "Description",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         className="text-left font-medium px-4 lg:px-6 py-3 whitespace-nowrap"
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {timeline.map((t, idx) => (
//                     <tr
//                       key={idx}
//                       className="border-t hover:bg-gray-50 align-top"
//                     >
//                       <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-gray-800">
//                         <div className="flex items-start gap-3">
//                           <div className="relative">
//                             <span className="block w-2 h-2 rounded-full bg-gray-300 mt-2" />
//                             {idx !== timeline.length - 1 && (
//                               <span className="absolute left-0.5 top-3 w-0.5 h-full bg-gray-200" />
//                             )}
//                           </div>
//                           <div>
//                             <div>{t.date}</div>
//                             <div className="text-xs text-gray-500">
//                               {t.time}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
//                         <Badge tone={t.type}>{t.type}</Badge>
//                       </td>
//                       <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
//                         {t.who}
//                       </td>
//                       <td className="px-4 lg:px-6 py-3">{t.desc}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Categories;

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

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Search,
  CirclePlus,
  Circle,
  PencilLine,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import productData from "../../data/products.json";
import CategoriesPopOnClick from "./CategoriesPopOnClick";
import SubCategoriesPopOnClick from "./SubCategoriesPopOnClick";
import CategoriesPopUpEdit from "./CategoriesPopUpEdit";
import SubCategoriesPopUpEdit from "./SubCategoriesPopUpEdit";
// import axiosInstance from "../../../api/axiosInstance";

const Products = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const res = await axiosInstance.get("/products/all");
  //       setProduct(res.data);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProduct();
  // }, []);

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

  // const handleCheckboxChange = (id) => {
  //   setSelectedItems(
  //     (prev) =>
  //       prev.includes(id)
  //         ? prev.filter((x) => x !== id) // unselect
  //         : [...prev, id] // select
  //   );
  // };

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

  // Apply category filter
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

  // const handleEdit = () => {
  //   navigate(`/admin/add-product/${Editproduct.uuid}`);
  // };

  // pop up Add Cat & SubCat
  const [openCategory, setOpenCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);

  // pop up Edit Cat & SubCat
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [openEditSubCategory, setOpenEditSubCategory] = useState(false);

  // click the category open bottom row
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  // pass the data in sub category
  const [selectedCategoryRow, setSelectedCategoryRow] = useState(null);
  // pass the data is edit the category and sub category
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <>
      <CategoriesPopOnClick
        open={openCategory}
        onclose={() => setOpenCategory(false)}
      />
      <SubCategoriesPopOnClick
        open={openSubCategory}
        onClose={() => {
          setOpenSubCategory(false);
          setSelectedCategoryRow(null);
        }}
        categoryName={selectedCategoryRow?.category || ""} // ✅ default category
        categoryId={selectedCategoryRow?.uuid || ""}
      />

      <CategoriesPopUpEdit
        open={openEditCategory}
        onClose={() => setOpenEditCategory(false)}
        data={selectedRow}
      />
      <SubCategoriesPopUpEdit
        open={openEditSubCategory}
        onClose={() => setOpenEditSubCategory(false)}
        data={"metal wall art"}
        categoryName={selectedCategory?.name}
      />

      <div className="p-[24px] bg-[#F6F8F9] rounded-md min-h-screen">
        {/* Header */}

        {/* <div className=""> */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center justify-between  16px px-2 rounded-md">
            <h2 className="text-[20px] font-semibold text-gray-800">
              Categories
            </h2>
          </div>

          <div>
            {/* <Link to={`/admin/add-product`}> */}
            <button
              onClick={() => {
                setOpenCategory(true);
              }}
              className="bg-[#1C3753] text-white px-4 py-2 rounded-lg hover:bg-[#344558]"
            >
              + Add Category
            </button>
            {/* </Link> */}
          </div>
        </div>
        {/* </div> */}

        {/* Search + Filters */}

        <div className="bg-white p-4 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex bg-[#F8FBFC] items-center border border-gray-200 rounded-xl px-[16px] py-[13px] hover:bg-white transition-colors duration-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 w-[50%]">
              <Search className="w-4 h-4 text-gray-500 mr-2" size={20} />
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name, SKU ID, Category, Sub-category"
                // placeholder="Search by Category and Sub-category"
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
              <button
                onClick={() =>
                  setActiveFilter((prev) =>
                    prev === "category" ? null : "category",
                  )
                }
                className=" border rounded-lg px-4 py-2 flex items-center justify-center gap-6 text-[#686868] bg-[#F8F8F8]"
              >
                All Categories
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
                <div className="absolute left-0 top-11 ml-2  z-30">
                  <ul className=" bg-white border rounded-lg shadow">
                    {["Active", "Inactive"].map((status) => (
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
              <button
                onClick={() => {
                  // setSelectedStatus("Price: Low → High");
                  setSelectedCategory("Category");
                  setSelectedStatus("Status");
                }}
                className="text-[#1C3753] flex items-center justify-between gap-2"
              >
                Clear Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full text-sm text-gray-600">
              <thead className="bg-[#F8F8F8] h-[54px]">
                <tr className="text-[#4B5563] text-[16px]">
                  <th className="px-4 py-3 text-left font-medium">
                    Category Name
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Sub-Category Count
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Product Count
                  </th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="px-4 py-3 text-center font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((item, index) => (
                  <React.Fragment key={item.uuid}>
                    <tr
                      // key={item.uuid || item.id || item.route}
                      className={`border-t hover:bg-gray-50 transition${
                        selectedItems.includes(item.id) ? "bg-red-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-left text-[15px] text-[#1F2937]">
                        <div
                          onClick={() => {
                            setExpandedCategoryId(
                              expandedCategoryId == item.uuid
                                ? null
                                : item.uuid,
                            );
                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <ChevronRight
                            size={16}
                            className={`transition-transform ${
                              expandedCategoryId === item.uuid
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                          <span>{item.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-[15px]">
                        {item.subcategory?.length || 0}
                      </td>
                      <td className="px-4 py-3 text-center text-[15px]">
                        {item.productCount || 0}
                      </td>
                      <td className="px-4 py-3 text-[16px] text-center text-[#1F2937]">
                        {item.status === "Active" ? (
                          <div className="inline-flex items-center gap-2 bg-[#E0F4DE] px-3 py-1 rounded-lg text-[#00A63E] text-sm">
                            <Circle
                              fill="#00A63E"
                              color="#00A63E"
                              size={10}
                              className=""
                            />
                            Active
                          </div>
                        ) : item.status === "Inactive" ? (
                          <div className="inline-flex items-center gap-2 bg-[#EFEFEF] px-3 py-1 rounded-lg text-[#686868] text-sm">
                            <Circle
                              fill="#686868"
                              color="#686868"
                              size={10}
                              className=""
                            />
                            Drift
                          </div>
                        ) : (
                          ""
                        )}
                      </td>

                      {/* Centered action icons (hidden until hover) */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedCategoryRow(item);
                              setOpenSubCategory(true);
                            }}
                            className="relative p-2 rounded group"
                          >
                            <CirclePlus className="w-5 h-5 text-[#1C1C1C]" />
                            <div
                              className="
      absolute left-1/2 top-8 -translate-x-1/2
      bg-[#F5F8FA] py-1 px-3 rounded-lg
      text-xs font-medium
      opacity-0
      group-hover:opacity-100
      transition-opacity duration-200
      whitespace-nowrap
      pointer-events-none
    "
                            >
                              Add <br /> Sub-catgeory
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setOpenEditCategory(true);
                              setSelectedRow(item);
                            }}
                            className=" relative p-2 rounded group"
                          >
                            <Pencil className="w-5 h-5 text-[#1C1C1C]" />
                            <div
                              className="
      absolute left-1/2 top-8 -translate-x-1/2
      bg-[#F5F8FA] py-1 px-3 rounded-lg
      text-xs font-medium
      opacity-0
      group-hover:opacity-100
      transition-opacity duration-200
      whitespace-nowrap
      pointer-events-none
    "
                            >
                              Edit
                            </div>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedCategoryId === item.uuid && (
                      <tr className=" bg-[#F8FBFC] border-t">
                        <td colSpan={5} className="px-3 text-sm text-gray-600">
                          <p className="p-2">Sub-Categories</p>
                          <div className="flex flex-wrap gap-3 pb-4">
                            {item.subcategory?.length > 0 ? (
                              item.subcategory.map((sub, idx) => (
                                <div
                                  key={`${item.uuid}-${idx}`} // ✅ important
                                  className="flex items-center gap-2 bg-[#D5E5F5] py-2 px-3 rounded-full"
                                >
                                  <Circle size={8} fill="#686868" />
                                  <p className="text-sm">{sub}</p>
                                  {"(1)"}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">
                                No sub-categories
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

export default Products;
