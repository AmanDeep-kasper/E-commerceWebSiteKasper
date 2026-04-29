import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Search, ChevronDown, Plus } from "lucide-react";
import { IoIosArrowBack } from "react-icons/io";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

function CollectionProducts() {
    const { collectionId } = useParams();
    const navigate = useNavigate();

    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addProductModal, setAddProductModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
const [categories, setCategories] = useState([]);

    const [step, setStep] = useState(1); // 1: search, 2: list, 3: preview
    const [searchInput, setSearchInput] = useState("");
    const [filteredList, setFilteredList] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Search and filter states
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState(null);
    const [selectedSort, setSelectedSort] = useState("Latest");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (searchInput.trim()) {
            const filtered = availableProducts.filter((p) =>
                (p.productTittle || p.name || "")
                    .toLowerCase()
                    .includes(searchInput.toLowerCase())
            );
            setFilteredList(filtered);
            setStep(2);
        } else {
            setStep(1);
        }
    }, [searchInput]);

    const toggleProduct = (product) => {
        setSelectedProducts((prev) => {
            const exists = prev.find((p) => p._id === product._id);
            if (exists) {
                return prev.filter((p) => p._id !== product._id);
            } else {
                return [...prev, product];
            }
        });
    };

    // Fetch collection details
    useEffect(() => {
        fetchCollectionDetails();
        fetchAllProducts();
        fetchCategories();
    }, [collectionId]);

    const fetchCollectionDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/collection/admin/get-collection/${collectionId}`);
            // console.log("Collection Details:", response.data);

            let collectionData = null;
            if (response.data?.success && response.data?.data) {
                collectionData = response.data.data;
            }

            setCollection(collectionData);
            setProducts(collectionData?.products || []);
        } catch (err) {
            // console.error("Error fetching collection:", err);
            toast.error(err.response?.data?.message || "Failed to load collection");
        } finally {
            setLoading(false);
        }
    };

    // Fetch all products for adding to collection
    const fetchAllProducts = async () => {
        try {
            const response = await axiosInstance.get("/product/admin/get-all-products");
            let productsData = [];
            if (response.data?.success && response.data?.data) {
                productsData = response.data.data;
            }
            setAllProducts(productsData);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };
    const handleAddProduct = async () => {
        if (selectedProducts.length === 0) {
            toast.error("Select at least one product");
            return;
        }

        try {
            await axiosInstance.post(
                `/collection/admin/add-product/${collectionId}`,
                { products: selectedProducts.map(p => p._id) }
            );

            toast.success("Products added!");
            setAddProductModal(false);
            setSelectedProducts([]);
            setSearchInput("");
            setStep(1);
            fetchCollectionDetails();
        } catch (err) {
            toast.error("Failed to add");
        }
    };

    // Fetch all categories for filter
const fetchCategories = async () => {
    try {
        const response = await axiosInstance.get("/category/admin/all-categories");
        let categoriesData = [];
        if (response.data?.success && response.data?.category) {
            categoriesData = response.data.category;
        } else if (Array.isArray(response.data)) {
            categoriesData = response.data;
        }
        setCategories(categoriesData);
    } catch (err) {
        console.error("Error fetching categories:", err);
    }
};

    // Remove product from collection
    const handleRemoveProduct = async (productId) => {
        try {
            const response = await axiosInstance.delete(
                `/collection/admin/delete-product/${collectionId}`,
                { data: { productId } }
            );
            toast.success("Product removed from collection!");
            fetchCollectionDetails();
        } catch (err) {
            // console.error("Error removing product:", err);
            toast.error(err.response?.data?.message || "Failed to remove product");
        }
    };

    // Filter products by search
    let filteredProducts = products.filter((product) => {
        const searchMatch = (product.productTittle || product.name || "")
            .toLowerCase()
            .includes(search.toLowerCase());
             const categoryMatch = selectedCategory === "All" || 
        (product.category?.name === selectedCategory) ||
        (product.categoryName === selectedCategory);
        return searchMatch && categoryMatch;
    });

    // Sort logic
    if (selectedSort === "A-Z") {
        filteredProducts.sort((a, b) => (a.productTittle || "").localeCompare(b.productTittle || ""));
    } else if (selectedSort === "Z-A") {
        filteredProducts.sort((a, b) => (b.productTittle || "").localeCompare(a.productTittle || ""));
    } else if (selectedSort === "Latest") {
        filteredProducts = [...filteredProducts].reverse();
    }

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    // Available products for adding (not already in collection)
    const availableProducts = allProducts.filter(
        (p) => !products.some((cp) => cp._id === p._id)
    );
    const isFilterActive = selectedSort !=="Latest" || selectedCategory !== "All" || search !== "";

    if (loading) {
        return (
            <div className="p-6 bg-[#F6F8F9] min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C3753] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#F6F8F9] min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <Link to="/admin/collection">
                    <div className="flex gap-4 items-center cursor-pointer">
                        <IoIosArrowBack size={20} />
                        <span className="text-[20px] font-semibold">
                            {collection?.collectionName || "Collection"} - Products
                        </span>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAddProductModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0B3142] text-white rounded-lg"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
            </div>
            {/* INFO MESSAGE */}
{products.length < 4 && (
    <div className="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
        <p className="text-sm">
            If a collection has fewer than <b>four products</b>, it will only appear in your Collections section.
        </p>
        <p className="text-sm mt-1">
            Once you add <b>four or more products</b>, the collection will automatically be displayed on your homepage for visitors to see.
        </p>
    </div>
)}

            <div className="bg-white p-4 rounded-xl">
                {/* SEARCH + FILTER */}
                <div className="flex justify-between mb-6">
                    <div className="flex items-center border rounded-xl px-4 py-2 w-[50%]">
                        <Search className="w-4 h-4 mr-2" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="outline-none flex-1"
                        />
                    </div>

                    <div className="flex gap-3 items-center">
                            {/* CATEGORY FILTER */}
    <div className="relative">
        <button
            onClick={() => setActiveFilter(activeFilter === "category" ? null : "category")}
            className="border px-4 py-2 rounded-lg flex items-center gap-2 bg-[#F8F8F8]"
        >
            {selectedCategory === "All" ? "All Categories" : selectedCategory} <ChevronDown size={16} />
        </button>

        {activeFilter === "category" && (
            <div className="absolute mt-2 bg-white border rounded shadow w-48 z-20 max-h-60 overflow-y-auto">
                <div
                    onClick={() => {
                        setSelectedCategory("All");
                        setActiveFilter(null);
                        setCurrentPage(1);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                    All Categories
                </div>
                {categories.map((cat) => (
                    <div
                        key={cat._id}
                        onClick={() => {
                            setSelectedCategory(cat.name);
                            setActiveFilter(null);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                    >
                        {cat.name}
                    </div>
                ))}
            </div>
        )}
    </div>
                        {/* SORT */}
                        <div className="relative">
                            <button
                                onClick={() => setActiveFilter(activeFilter === "sort" ? null : "sort")}
                                className="border px-4 py-2 rounded-lg flex items-center gap-2 bg-[#F8F8F8]"
                            >
                                {selectedSort} <ChevronDown size={16} />
                            </button>

                            {activeFilter === "sort" && (
                                <div className="absolute mt-2 bg-white border rounded shadow w-40 z-20">
                                    {["Latest", "A-Z", "Z-A"].map((s) => (
                                        <div
                                            key={s}
                                            onClick={() => {
                                                setSelectedSort(s);
                                                setActiveFilter(null);
                                            }}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CLEAR */}
                        {isFilterActive && (
                        <button
                            onClick={() =>{ setSelectedSort("Latest");
                                setSelectedCategory("All");
                                setSearch("");
                                setCurrentPage(1);
                            }}
                            className="text-[#1C3753]"
                        >
                            Clear
                        </button>
                        )}
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F8F8F8]">
                            <tr>
                                <th className="px-6 py-3 text-left">S.No</th>
                                <th className="px-6 py-3 text-left">Product Name</th>
                                <th className="px-6 py-3 text-center">SKU ID</th>
                                <th className="px-6 py-3 text-center">Category</th>
                                {/* <th className="px-6 py-3 text-center">Price</th> */}
                                <th className="px-6 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => {
                                // Get the first variant (or default variant)
                                const defaultVariant = item.variants?.[0];
                                // Get image from variant
                                const productImage = defaultVariant?.variantImage?.[0]?.url || item.image || "/placeholder.png";
                                // Get SKU from variant
                                const productSku = defaultVariant?.variantSkuId || item.skuId || "N/A";
                                // Get price from variant
                                const productPrice = defaultVariant?.variantSellingPrice || item.defaultPrice || 0;
                                // Get category name (might be populated or just ID)
                                const categoryName = item.category?.name || item.categoryName || "N/A";

                                return (
                                    <tr key={item._id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4 text-left">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex gap-2 items-center">
                                                <img
                                                    src={productImage}
                                                    alt={item.productTittle || item.name}
                                                    className="w-12 h-12 rounded-md object-cover"
                                                    onError={(e) => e.target.src = "/placeholder.png"}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-[16px] font-medium">{item.productTittle || item.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {productSku}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {categoryName}
                                        </td>
                                        {/* <td className="px-6 py-4 text-center">
                            ₹{productPrice}
                        </td> */}
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleRemoveProduct(item._id)}
                                                className="px-3 py-1  text-gray-500 rounded-md text-sm"
                                            >
                                                x
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {currentItems.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-500">
                                        No products found in this collection
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION - Show if there are products */}
                {filteredProducts.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t text-sm text-gray-600">
                        {/* Showing text */}
                        <div>
                            Showing <span className="font-medium">{startIndex + 1}</span>–
                            <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> of{" "}
                            <span className="font-medium">{filteredProducts.length}</span> products
                        </div>

                        {/* Pagination controls - only show if more than 1 page */}
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-3 py-1 border rounded disabled:opacity-40"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    ‹
                                </button>

                                <div className="px-4 py-1 border rounded">
                                    Page {String(currentPage).padStart(2, "0")} of{" "}
                                    {String(totalPages).padStart(2, "0")}
                                </div>

                                <button
                                    className="px-3 py-1 border rounded disabled:opacity-40"
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ADD PRODUCT MODAL */}
            {addProductModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setAddProductModal(false);
                            setSelectedProduct(null);
                        }
                    }}
                >
                    {/* <div className="bg-white rounded-xl p-6 w-[500px]">
                        <h2 className="text-lg font-semibold mb-4">Add Product to Collection</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Select Product</label>
                            <select
                                value={selectedProduct || ""}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="w-full border p-2 rounded-lg bg-[#F8FBFC] outline-none"
                            >
                                <option value="">-- Select a product --</option>
                                {availableProducts.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.name || product.productTittle}
                                    </option>
                                ))}
                            </select>
                            {availableProducts.length === 0 && (
                                <p className="text-sm text-gray-500 mt-2">No more products available to add</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setAddProductModal(false);
                                    setSelectedProduct(null);
                                }}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddProduct}
                                disabled={!selectedProduct}
                                className="px-4 py-2 bg-[#1C3753] text-white rounded disabled:opacity-50"
                            >
                                Add Product
                            </button>
                        </div>
                    </div> */}
                    <div className="bg-white rounded-xl p-6 w-[500px]">

                        <h2 className="text-lg font-semibold mb-4">Add Products</h2>

                        {/* SEARCH */}
                        <div className="flex items-center border rounded-xl px-4 py-2 mb-4">
                            <Search className="w-4 h-4 mr-2" />
                            <input
                                type="text"
                                placeholder="Search by product name"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="outline-none flex-1"
                            />
                        </div>

                        {/* STEP 2: LIST */}
                        {step >= 2 && (
                            <div className="max-h-60 overflow-y-auto border rounded-lg">
                                {filteredList.map((item) => {
                                    const isChecked = selectedProducts.some(p => p._id === item._id);

                                    const getProductImage = (item) => {
                                        // Try to get image from variants
                                        if (item?.variants?.[0]?.variantImage?.[0]?.url) {
                                            return item?.variants[0]?.variantImage[0]?.url;
                                        }
                                        // Try product level image
                                        if (item.image) {
                                            return item.image;
                                        }
                                        // Fallback to placeholder
                                        return "/placeholder.png";
                                    };

                                    const img = getProductImage(item)
                                    console.log('immmff', img)

                                    return (
                                        <div
                                            key={item._id}
                                            className="flex items-center gap-3 p-2 border-b"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleProduct(item)}
                                            />

                                            <img
                                                src={img || "/placeholder.png"}
                                                className="w-10 h-10 rounded object-cover"
                                            />

                                            <span className="text-sm">
                                                {item.productTittle || item.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* STEP 3: PREVIEW */}
                        {selectedProducts.length > 0 && (
                            <div className="mt-4 space-y-2" style={{ height: "100px", overflowY: "scroll" }}>
                                {selectedProducts.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between items-center border px-3 py-2 rounded-lg"
                                    >
                                        <span className="text-sm">
                                            {item.productTittle || item.name}
                                        </span>

                                        <button
                                            onClick={() => toggleProduct(item)}
                                            className="text-gray-500"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setAddProductModal(false);
                                    setSelectedProducts([]);
                                    setSearchInput("");
                                    setStep(1);
                                }}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAddProduct}
                                disabled={selectedProducts.length === 0}
                                className="px-4 py-2 bg-[#1C3753] text-white rounded disabled:opacity-50"
                            >
                                Add Products
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default CollectionProducts;
// import React, { useState } from "react";
// import { useLocation, Link } from "react-router-dom";


// import { Pencil, Search, ChevronDown, } from "lucide-react";
// import { MdOutlineAdd } from "react-icons/md";
// import { IoIosArrowBack } from "react-icons/io";

// {/* <==============------------- images -------------==============> */ }


// // dummy data
// const data = [
//     { id: 1, name: "Wall Art", sku: "WALLART123", category: "Wall Art", img: "", status: "x" },
//     { id: 2, name: "Nature", sku: "NATURE890", category: "Nature", img: "", status: "x" },
//     { id: 3, name: "Abstract", sku: "ABSTRACT123", category: "Abstract", img: "", status: "x" },
//     { id: 4, name: "Modern", sku: "MODERN123", category: "Modern", img: "", status: "x" },
//     { id: 5, name: "Classic", sku: "CLASSIC123", category: "Classic", img: "", status: "x" },
//     { id: 6, name: "Minimal", sku: "MINIMAL123", category: "Minimal", img: "", status: "x" },
// ]

// function BestSelling() {
//     const [search, setSearch] = useState("");

//     // ✅ FILTER STATES
//     const [activeFilter, setActiveFilter] = useState(null);
//     const [selectedStatus, setSelectedStatus] = useState("All");
//     const [selectedSort, setSelectedSort] = useState("Latest");
//     const [addCollection, setAddCollection] = useState(false);

//     // ✅ FILTER LOGIC
//     let filteredData = data.filter((item) => {
//         const searchMatch = item.name
//             .toLowerCase()
//             .includes(search.toLowerCase());

//         const statusMatch =
//             selectedStatus === "All" || item.status === selectedStatus;

//         return searchMatch && statusMatch;
//     });

//     // ✅ SORT LOGIC
//     if (selectedSort === "A-Z") {
//         filteredData.sort((a, b) => a.name.localeCompare(b.name));
//     }

//     if (selectedSort === "Z-A") {
//         filteredData.sort((a, b) => b.name.localeCompare(a.name));
//     }

//     if (selectedSort === "Latest") {
//         filteredData = [...filteredData].reverse();
//     }



//     // ✅ PAGINATION (added)
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     const currentItems = filteredData.slice(startIndex, endIndex);


//     const location = useLocation();

//     const collectionName =
//         location.state?.collectionName || "Best Seller";

//     return (

//         <div className="p-6 bg-[#F6F8F9] min-h-screen">

//             {/* HEADER */}
//             <div className="flex justify-between items-center mb-6">
//                 <Link to="/admin/collection">
//                     <div className="flex gap-4 items-center ">
//                         <span><IoIosArrowBack size={20} /></span>
//                         <span className="text-[20px] font-semibold">
//                             {collectionName}
//                         </span>
//                     </div>
//                 </Link>
//                 <div className="flex items-center gap-2">
//                     <button className="flex items-center px-4 py-2 bg-[#F8FBFC] rounded-lg border border-[#1800AC] text-[#1C1C1C]">
//                         <select name="status" id="">
//                             <option value="All">All</option>
//                             <option value="x">Active</option>
//                             <option value="Inactive">Inactive</option>
//                         </select>
//                     </button>
//                     <button className="flex items-center px-4 py-2 bg-[#0B3142] text-white rounded-lg"
//                         onClick={() => setAddCollection(!addCollection)}
//                     >
//                         <MdOutlineAdd size={20} />
//                         Add Product
//                     </button>
//                 </div>
//             </div>

//             <div className="bg-white p-4 rounded-xl">

//                 {/* SEARCH + FILTER */}
//                 <div className="flex justify-between mb-6">

//                     {/* SEARCH */}
//                     <div className="flex items-center border rounded-xl px-4 py-2 w-[50%]">
//                         <Search className="w-4 h-4 mr-2" />
//                         <input
//                             type="text"
//                             placeholder="Search collection..."
//                             value={search}
//                             onChange={(e) => {
//                                 setSearch(e.target.value);
//                                 setCurrentPage(1);
//                             }}
//                             className="outline-none flex-1"
//                         />
//                     </div>

//                     {/* FILTER UI */}
//                     <div className="flex gap-3 items-center">
//                         {/* SORT */}
//                         <div className="relative">
//                             <button
//                                 onClick={() =>
//                                     setActiveFilter(activeFilter === "sort" ? null : "sort")
//                                 }
//                                 className="border px-4 py-2 rounded-lg flex items-center gap-2 bg-[#F8F8F8]"
//                             >
//                                 {selectedSort} <ChevronDown size={16} />
//                             </button>

//                             {activeFilter === "sort" && (
//                                 <div className="absolute mt-2 bg-white border rounded shadow w-40 z-20">
//                                     {["Latest", "A-Z", "Z-A"].map((s) => (
//                                         <div
//                                             key={s}
//                                             onClick={() => {
//                                                 setSelectedSort(s);
//                                                 setActiveFilter(null);
//                                             }}
//                                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                         >
//                                             {s}
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>

//                         {/* CLEAR */}
//                         <button
//                             onClick={() => {
//                                 setSelectedSort("Latest");
//                             }}
//                             className="text-[#1C3753]"
//                         >
//                             Clear
//                         </button>

//                     </div>
//                 </div>

//                 {/* TABLE */}
//                 <div className="bg-white rounded-xl shadow overflow-hidden">
//                     <table className="w-full text-sm">

//                         <thead className="bg-[#F8F8F8]">
//                             <tr>
//                                 <th className="px-6 py-3 text-left">S.no</th>
//                                 <th className="px-6 py-3 text-left">Product Name</th>
//                                 <th className="px-6 py-3 text-center">SKU ID</th>
//                                 <th className="px-6 py-3 text-center">Category</th>
//                                 <th className="px-6 py-3 text-center">Action</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {currentItems.map((item) => (
//                                 <tr key={item.id} className="border-t hover:bg-gray-50">
//                                     <td className="px-6 py-4 text-left">
//                                         {item.id}
//                                     </td>

//                                     <td className="px-6 py-4 text-left">
//                                         <div className="flex gap-2 items-center">
//                                             <img src={item.img} alt="" className="w-12 h-12 rounded-md" />
//                                             <div className="flex flex-col justify-between">
//                                                 <span className="text-[16px] font-medium">{item.name}</span>
//                                             </div>
//                                         </div>
//                                     </td>

//                                     <td className="px-6 py-4 text-center">
//                                         {item.sku}
//                                     </td>
//                                     <td className="px-6 py-4 text-center">
//                                         {item.category}
//                                     </td>

//                                     <td className="px-6 py-4">
//                                         <div className="flex justify-center gap-3">
//                                             <button className="p-2 hover:bg-gray-100 rounded">
//                                                 {item.status}
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}

//                             {currentItems.length === 0 && (
//                                 <tr>
//                                     <td colSpan={3} className="text-center py-6 text-gray-500">
//                                         No collections found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* ✅ PAGINATION UI (added) */}
//                 <div className="flex justify-end items-center gap-2 px-6 py-4 border-t">
//                     <button
//                         className="px-3 py-1 border rounded"
//                         onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                         disabled={currentPage === 1}
//                     >
//                         ‹
//                     </button>

//                     <div className="px-4 py-1.5 border rounded text-sm text-gray-700">
//                         Page {String(currentPage).padStart(2, "0")} of{" "}
//                         {String(totalPages).padStart(2, "0")}
//                     </div>

//                     <button
//                         className="px-3 py-1 border rounded"
//                         onClick={() =>
//                             setCurrentPage((p) => Math.min(p + 1, totalPages))
//                         }
//                         disabled={currentPage === totalPages}
//                     >
//                         ›
//                     </button>
//                 </div>

//             </div>
//             {addCollection && (
//                 <div
//                     className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//                     onClick={(e) => {
//                         if (e.target === e.currentTarget) {
//                             setAddCollection(false);
//                         }
//                     }}
//                 >
//                     <div
//                         className="bg-white rounded-xl p-6 w-[400px]"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <h2 className="text-lg font-semibold mb-4">
//                             Add Product
//                         </h2>

//                         <input
//                             type="search"
//                             placeholder="search product name"
//                             className="w-full border p-2 rounded-lg mb-4 bg-[#F8FBFC] outline-none border border-[#DEDEDE] text-[#686868] text-[14px] font-normal"
//                         />

//                         <div className="flex justify-end gap-3">
//                             <button
//                                 onClick={() => setAddCollection(false)}
//                                 className="px-4 py-2 border rounded"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     // your save logic here
//                                     setAddCollection(false);
//                                 }}
//                                 className="px-4 py-2 bg-[#1C3753] text-white rounded"
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default BestSelling