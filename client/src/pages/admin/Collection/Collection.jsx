// import React, { useState } from "react";
// import { Pencil, Search, ChevronDown } from "lucide-react";
// import { MdOutlineAdd } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { RiDeleteBin6Line } from "react-icons/ri";

// const data = [
//     { id: 1, name: "Wall Art", productCount: 12, status: "Active" },
//     { id: 2, name: "Nature", productCount: 8, status: "Inactive" },
//     { id: 3, name: "Abstract", productCount: 15, status: "Active" },
//     { id: 4, name: "Modern", productCount: 20, status: "Active" },
//     { id: 5, name: "Classic", productCount: 5, status: "Inactive" },
//     { id: 6, name: "Minimal", productCount: 9, status: "Active" },
// ];

// function Collection() {
//     const navigate = useNavigate();

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

//     // ✅ PAGINATION
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const currentItems = filteredData.slice(
//         startIndex,
//         startIndex + itemsPerPage
//     );

//     return (
//         <div className="p-6 bg-[#F6F8F9] min-h-screen">
//             {/* HEADER */}
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-[20px] font-semibold">Collection</h2>

//                 <button className="flex items-center gap-2 px-4 py-2 bg-[#0B3142] text-white rounded-lg"
//                     onClick={() => setAddCollection(true)}>
//                     <MdOutlineAdd size={20} />
//                     Add Collection
//                 </button>
//             </div>

//             <div className="bg-white p-4 rounded-xl">

//                 {/* SEARCH */}
//                 <div className="flex justify-between items-center">
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
//                 <table className="w-full text-sm mt-5">
//                     <thead className="bg-[#F8F8F8]">
//                         <tr>
//                             <th className="px-6 py-3 text-left">Collection Name</th>
//                             <th className="px-6 py-3 text-center">Product Count</th>
//                             <th className="px-6 py-3 text-center">Status</th>
//                             <th className="px-6 py-3 text-center"></th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {currentItems.map((item) => (
//                             <tr key={item.id} className="border-t hover:bg-gray-50">

//                                 <td className="px-6 py-4 font-medium">
//                                     {item.name}
//                                 </td>

//                                 <td className="px-6 py-4 text-center">
//                                     {item.productCount}
//                                 </td>
//                                 <td
//                                     className="px-6 py-4 text-center text-blue-600 cursor-pointer hover:underline"
//                                     onClick={() =>
//                                         navigate("/admin/best-selling", {
//                                             state: { collectionName: item.name },
//                                         })
//                                     }
//                                 >
//                                     View All
//                                 </td>
//                                 <td className="px-6 py-4 text-center">
//                                     <span><RiDeleteBin6Line size={24} className="text-[#D53B35]" /></span>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 {/* PAGINATION */}
//                 {/* <div className="flex justify-end items-center gap-2 mt-4">
//                     <button
//                         onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                     >
//                         ‹
//                     </button>

//                     <span>
//                         Page {currentPage} of {totalPages}
//                     </span>

//                     <button
//                         onClick={() =>
//                             setCurrentPage((p) => Math.min(p + 1, totalPages))
//                         }
//                     >
//                         ›
//                     </button>
//                 </div> */}
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
//                             Add Collection
//                         </h2>

//                         <div className="mb-5">
//                             <span>Collection Status</span>
//                             <div className="flex items-center gap-6">
//                                 <div className="flex items-center gap-1 mt-2">
//                                     <input type="radio" name="status" id="active" />
//                                     <label htmlFor="active">Active</label>
//                                 </div>
//                                 <div className="flex items-center gap-1 mt-2">
//                                     <input type="radio" name="status" id="inactive" />
//                                     <label htmlFor="inactive">Inactive</label>
//                                 </div>
//                             </div>
//                         </div>

//                         <input
//                             type="text"
//                             placeholder="Collection Name"
//                             className="w-full border p-2 rounded-lg mb-4 bg-[#F8FBFC] outline-none border border-[#DEDEDE] text-[#686868] text-[14px] font-normal"
//                         />

//                         <div className="flex justify-end gap-3">
//                             <button
//                                 onClick={() => setAddCollection(false)}
//                                 className="px-4 py-2 border rounded"
//                             >
//                                 Cancel
//                             </button>

//                             {/* ✅ SAVE BUTTON */}
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
//     );
// }

// export default Collection;


import React, { useState, useEffect, useRef } from "react";
import { Pencil, Search, ChevronDown, Eye, Trash2, MoreHorizontal } from "lucide-react";
import { MdOutlineAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

const ActionMenu = ({ item, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                <MoreHorizontal size={20} className="text-gray-600" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
                    <button
                        onClick={() => {
                            onEdit();
                            setIsOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                        <Pencil size={16} className="text-blue-500" />
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={() => {
                            onDelete();
                            setIsOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors border-t"
                    >
                        <Trash2 size={16} className="text-red-500" />
                        <span>Delete</span>
                    </button>
                </div>
            )}
        </div>
    );
};

function Collection() {
    const navigate = useNavigate();

    // State for collections from API
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and filter states
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedSort, setSelectedSort] = useState("Latest");
    const [addCollectionModal, setAddCollectionModal] = useState(false);
    const [editCollection, setEditCollection] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        collectionName: "",
        isActive: true,
    });
    const [submitting, setSubmitting] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch collections from API
    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/collection/admin/get-all-collections");
            // console.log("Collections API Response:", response.data);

            let collectionsData = [];
            if (response.data?.success && response.data?.data?.collections) {
                collectionsData = response.data.data.collections;
            } else if (Array.isArray(response.data)) {
                collectionsData = response.data;
            } else if (response.data?.collections) {
                collectionsData = response.data.collections;
            }

            setCollections(collectionsData);
            setError(null);
        } catch (err) {
            // console.error("Error fetching collections:", err);
            setError(err.response?.data?.message || "Failed to load collections");
        } finally {
            setLoading(false);
        }
    };

    // Add new collection
    // Add new collection
    const handleAddCollection = async () => {
        const trimmedName = formData.collectionName.trim();

        if (!trimmedName) {
            toast.error("Collection name is required");
            return;
        }

        if (trimmedName.length < 2) {
            toast.error("Collection name must be at least 2 characters");
            return;
        }

        // console.log("Sending payload:", {
        //     collectionName: trimmedName,
        //     products:[],
        //     isActive: formData.isActive === true
        // });

        setSubmitting(true);
        try {
            const payload = {
                collectionName: trimmedName,
                products: [],
                isActive: formData.isActive === true  // Ensure boolean
            };

            const response = await axiosInstance.post("/collection/admin/add-collection", payload);
            // console.log("Response:", response.data);

            toast.success("Collection added successfully!");
            setAddCollectionModal(false);
            resetForm();
            fetchCollections();
        } catch (err) {
            // console.error("Error response:", err.response?.data);
            // Show the actual error message from backend
            const errorMessage = err.response?.data?.message || "Failed to add collection";
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Update collection
    const handleUpdateCollection = async () => {
        if (!formData.collectionName.trim()) {
            toast.error("Collection name is required");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                collectionName: formData.collectionName,
                isActive: formData.isActive,
            };
            const response = await axiosInstance.patch(
                `/collection/admin/update-collection/${editCollection._id}`,
                payload
            );
            toast.success("Collection updated successfully!");
            setEditCollection(null);
            resetForm();
            fetchCollections();
        } catch (err) {
            // console.error("Error updating collection:", err);
            toast.error(err.response?.data?.message || "Failed to update collection");
        } finally {
            setSubmitting(false);
        }
    };

    // Delete collection
    const handleDeleteCollection = async () => {
        if (!deleteConfirm) return;

        try {
            const response = await axiosInstance.delete(
                `/collection/admin/delete-collection/${deleteConfirm._id}`
            );
            toast.success("Collection deleted successfully!");
            setDeleteConfirm(null);
            fetchCollections();
        } catch (err) {
            // console.error("Error deleting collection:", err);
            toast.error(err.response?.data?.message || "Failed to delete collection");
        }
    };

    // Toggle collection status
    const handleToggleStatus = async (collection) => {
        try {
            const response = await axiosInstance.patch(
                `/collection/admin/toggle-status/${collection._id}`
            );
            toast.success(`Collection ${collection.isActive ? "deactivated" : "activated"} successfully!`);
            fetchCollections();
        } catch (err) {
            // console.error("Error toggling status:", err);
            toast.error(err.response?.data?.message || "Failed to update status");
        }
    };

    // Open edit modal
    const openEditModal = (collection) => {
        setEditCollection(collection);
        setFormData({
            collectionName: collection.collectionName,
            isActive: collection.isActive,
        });
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            collectionName: "",
            isActive: true,
        });
    };

    // Filter and sort logic
    let filteredData = collections.filter((item) => {
        const searchMatch = (item.collectionName || "")
            .toLowerCase()
            .includes(search.toLowerCase());

        const statusMatch =
            selectedStatus === "All" ||
            (selectedStatus === "Active" && item.isActive === true) ||
            (selectedStatus === "Inactive" && item.isActive === false);

        return searchMatch && statusMatch;
    });

    // Sort logic
    if (selectedSort === "A-Z") {
        filteredData.sort((a, b) => (a.collectionName || "").localeCompare(b.collectionName || ""));
    } else if (selectedSort === "Z-A") {
        filteredData.sort((a, b) => (b.collectionName || "").localeCompare(a.collectionName || ""));
    } else if (selectedSort === "Latest") {
        filteredData = [...filteredData].reverse();
    }

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const isFilterActive = selectedSort !=="Latest"  || search !== "";
    // Loading state
    if (loading) {
        return (
            <div className="p-6 bg-[#F6F8F9] min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C3753] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading collections...</p>
                </div>
            </div>
        );
    }



    return (
        <div className="p-6 bg-[#F6F8F9] min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[20px] font-semibold">Collection</h2>

                <button className="flex items-center gap-2 px-4 py-2 bg-[#0B3142] text-white rounded-lg"
                    onClick={() => setAddCollectionModal(true)}>
                    <MdOutlineAdd size={20} />
                    Add Collection
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl">

                {/* SEARCH */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center border rounded-xl px-4 py-2 w-[50%]">
                        <Search className="w-4 h-4 mr-2" />
                        <input
                            type="text"
                            placeholder="Search collection..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="outline-none flex-1"
                        />
                    </div>

                    {/* FILTER UI */}
                    <div className="flex gap-3 items-center">

                        <div className="relative">
                            <button
                                onClick={() =>
                                    setActiveFilter(activeFilter === "sort" ? null : "sort")
                                }
                                className="border px-4 py-2 rounded-lg flex items-center gap-2 bg-[#F8F8F8]"
                            >
                                {selectedSort} <ChevronDown size={16} />
                            </button>

                            {activeFilter === "sort" && (
                                <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow w-full z-50">
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
                        {isFilterActive && (
                        <button
                            onClick={() =>{ setSelectedSort("Latest");
                                setSearch("");
                                setCurrentPage(1);
                            }}
                            className="text-[#1C3753]"
                        >
                            Clear
                        </button>
                        )}
                        <div className="relative">
                            {/* <button
                                onClick={() =>
                                    setActiveFilter(activeFilter === "status" ? null : "status")
                                }
                                className="border px-4 py-2 rounded-lg flex items-center gap-2 bg-[#F8F8F8]"
                            >
                                {selectedStatus} <ChevronDown size={16} />
                            </button> */}

                            {activeFilter === "status" && (
                                <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow w-full z-50">
                                    {["", "Active", "Inactive"].map((s) => (
                                        <div
                                            key={s}
                                            onClick={() => {
                                                setSelectedStatus(s);
                                                setActiveFilter(null);
                                                setCurrentPage(1);
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
                        {/* <button
                            onClick={() => {
                                setSelectedSort("Latest");
                                setSelectedStatus("All");
                                setSearch("");
                            }}
                            className="text-[#1C3753]"
                        >
                            Clear
                        </button> */}

                    </div>
                </div>


                {/* TABLE */}
                <table className="w-full text-sm mt-5">
                    <thead className="bg-[#F8F8F8]">
                        <tr>
                            <th className="px-6 py-3 text-left">Collection Name</th>
                            <th className="px-6 py-3 text-center">Product Count</th>
                            {/* <th className="px-6 py-3 text-center">Status</th> */}
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item._id} className="border-t hover:bg-gray-50">

                                <td className="px-6 py-4 font-medium">
                                    {item.collectionName}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    {item.products?.length || 0}
                                </td>
                                {/* <td
                                    className="px-6 py-4 text-center text-blue-600 cursor-pointer hover:underline"
                                    // onClick={() =>
                                    //     navigate("/admin/best-selling", {
                                    //         state: { collectionName: item.name },
                                    //     })
                                    // }
                                    onClick={() => navigate(`/admin/collection/${item._id}/products`)}

                                >
                                    View All
                                </td> */}
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center items-center gap-4">

                                        {/* VIEW */}
                                        <span
                                            onClick={() => navigate(`/admin/collection/${item._id}/products`)}
                                            className="text-blue-600 cursor-pointer hover:underline text-sm"
                                        >
                                            View
                                        </span>

                                        {/* EDIT */}
                                        <Pencil
                                            size={16}
                                            className="text-gray-600 cursor-pointer hover:text-blue-500"
                                            onClick={() => openEditModal(item)}
                                        />

                                        {/* DELETE */}
                                        <Trash2
                                            size={16}
                                            className="text-red-500 cursor-pointer hover:text-red-600"
                                            onClick={() => setDeleteConfirm(item)}
                                        />

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t text-sm text-gray-600 mt-4">
                        {/* Showing text */}
                        <div>
                            Showing <span className="font-medium">{startIndex + 1}</span>–
                            <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of{" "}
                            <span className="font-medium">{filteredData.length}</span> results
                        </div>

                        {/* Pagination controls */}
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
                    </div>
                )}
            </div>

            {addCollectionModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setAddCollectionModal(false);
                            resetForm();
                        }
                    }}
                >
                    <div
                        className="bg-white rounded-xl p-6 w-[400px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-4">
                            Add Collection
                        </h2>

                        <div className="mb-5">
                            <span>Collection Status</span>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1 mt-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={formData.isActive === true}
                                            onChange={() => setFormData({ ...formData, isActive: true })}
                                        />
                                        Active
                                    </label>

                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={formData.isActive === false}
                                            onChange={() => setFormData({ ...formData, isActive: false })}
                                        />
                                        Inactive
                                    </label>
                                </div>
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Collection Name"
                            value={formData.collectionName}
                            onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })}
                            className="w-full border p-2 rounded-lg mb-4 bg-[#F8FBFC] outline-none"
                        />


                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setAddCollectionModal(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            {/* ✅ SAVE BUTTON */}
                            <button
                                onClick={handleAddCollection}
                                disabled={submitting}
                                className="px-4 py-2 bg-[#1C3753] text-white rounded disabled:opacity-50"
                            >
                                {submitting ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* EDIT COLLECTION MODAL */}
            {editCollection && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setEditCollection(null);
                            resetForm();
                        }
                    }}
                >
                    <div className="bg-white rounded-xl p-6 w-[400px]">
                        <h2 className="text-lg font-semibold mb-4">Edit Collection</h2>

                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-2">Collection Status</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={formData.isActive === true}
                                        onChange={() => setFormData({ ...formData, isActive: true })}
                                    />
                                    Active
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={formData.isActive === false}
                                        onChange={() => setFormData({ ...formData, isActive: false })}
                                    />
                                    Inactive
                                </label>
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Collection Name"
                            value={formData.collectionName}
                            onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })}
                            className="w-full border p-2 rounded-lg mb-4 bg-[#F8FBFC] outline-none"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setEditCollection(null);
                                    resetForm();
                                }}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateCollection}
                                disabled={submitting}
                                className="px-4 py-2 bg-[#1C3753] text-white rounded disabled:opacity-50"
                            >
                                {submitting ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {deleteConfirm && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setDeleteConfirm(null);
                        }
                    }}
                >
                    <div className="bg-white rounded-xl p-6 w-[400px]">
                        <h2 className="text-lg font-semibold mb-4">Delete Collection</h2>
                        <p className="mb-6">
                            Are you sure you want to delete "<strong>{deleteConfirm.collectionName}</strong>"?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCollection}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Collection;