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
import { Link, useNavigate, useParams } from "react-router-dom";
import CategoriesPopOnClick from "./CategoriesPopOnClick";
import SubCategoriesPopOnClick from "./SubCategoriesPopOnClick";
import CategoriesPopUpEdit from "./CategoriesPopUpEdit";
import productService from "../../services/productService";
// import SubCategoriesPopUpEdit from "./SubCategoriesPopUpEdit";
// import { categoryService } from "../../redux/cart/productSlice";

const Products = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProduct = async (page = currentPage) => {
    try {
      setLoading(true);

      const res = await productService.getAllCategories(page, itemsPerPage);

      setProduct(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.pagination?.pages || 1);
      setTotalItems(res.pagination?.total || 0);

      console.log("categories:", res);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProduct([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct(currentPage);
  }, [currentPage]);

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
  let filteredProducts = (Array.isArray(product) ? product : []).filter((p) => {
    const searchMatch = (p.name || "").toLowerCase().includes(debouncedSearch);

    const statusText = p.isActive ? "Active" : "Inactive";
    const statusMatch =
      selectedStatus === "Status" || statusText === selectedStatus;

    const categoryMatch =
      selectedCategory === "Category" || p.name === selectedCategory;

    return searchMatch && statusMatch && categoryMatch;
  });

  // console.log(filteredProducts);

  // Apply category filter
  const categories = product
    ? Array.from(new Set(product.map((p) => p.name))).filter(Boolean)
    : [];

  /////////////////////////////////pagination section
  // 🔹 Then paginate filtered list
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProducts
  
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedCategory]);

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
        onclose={() => {
          setOpenCategory(false);
          fetchProduct();
        }}
      />
      <SubCategoriesPopOnClick
        open={openSubCategory}
        onClose={() => {
          setOpenSubCategory(false);
          setSelectedCategoryRow(null);
          fetchProduct();
        }}
        categoryName={selectedCategoryRow?.name || ""}
        categoryId={selectedCategoryRow?._id || ""}
      />

      <CategoriesPopUpEdit
        open={openEditCategory}
        onClose={() => setOpenEditCategory(false)}
        data={selectedRow}
      />
      {/* <SubCategoriesPopUpEdit
        open={openEditSubCategory}
        onClose={() => setOpenEditSubCategory(false)}
        data={"metal wall art"}
        categoryName={selectedCategory?.name}
      /> */}

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
               {selectedCategory === "Category" ? "All Categories" : selectedCategory}
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
                {currentItems.map((item) => (
                  <React.Fragment key={item._id}>
                    <tr
                      className={`border-t hover:bg-gray-50 transition ${
                        selectedItems.includes(item._id) ? "bg-red-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-left text-[15px] text-[#1F2937]">
                        <div
                          onClick={() => {
                            setExpandedCategoryId(
                              expandedCategoryId === item._id ? null : item._id,
                            );
                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <ChevronRight
                            size={16}
                            className={`transition-transform ${
                              expandedCategoryId === item._id ? "rotate-90" : ""
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center text-[15px]">
                        {item.subCategories?.length || 0}
                      </td>

                      <td className="px-4 py-3 text-center text-[15px]">
                        {item.productCount || 0}
                      </td>

                      <td className="px-4 py-3 text-[16px] text-center text-[#1F2937]">
                        {item.isActive ? (
                          <div className="inline-flex items-center gap-2 bg-[#E0F4DE] px-3 py-1 rounded-lg text-[#00A63E] text-sm">
                            <Circle fill="#00A63E" color="#00A63E" size={10} />
                            Active
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 bg-[#EFEFEF] px-3 py-1 rounded-lg text-[#686868] text-sm">
                            <Circle fill="#686868" color="#686868" size={10} />
                            Inactive
                          </div>
                        )}
                      </td>

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
                          </button>

                          <button
                            onClick={() => {
                              setOpenEditCategory(true);
                              setSelectedRow(item);
                            }}
                            className="relative p-2 rounded group"
                          >
                            <Pencil className="w-5 h-5 text-[#1C1C1C]" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedCategoryId === item._id && (
                      <tr className="bg-[#F8FBFC] border-t">
                        <td colSpan={5} className="px-3 text-sm text-gray-600">
                          <p className="p-2">Sub-Categories</p>
                          <div className="flex flex-wrap gap-3 pb-4">
                            {item.subCategories?.length > 0 ? (
                              item.subCategories.map((sub, idx) => (
                                <div
                                  key={sub._id || `${item._id}-${idx}`}
                                  className="flex items-center gap-2 bg-[#D5E5F5] py-2 px-3 rounded-full"
                                >
                                  <Circle size={8} fill="#686868" />
                                  <p className="text-sm">{sub.name}</p>
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
                className="px-3 py-1 border rounded disabled:opacity-50"
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
                className="px-3 py-1 border rounded disabled:opacity-50"
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
