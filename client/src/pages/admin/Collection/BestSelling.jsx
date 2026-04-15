import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";


import { Pencil, Search, ChevronDown, } from "lucide-react";
import { MdOutlineAdd } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";

{/* <==============------------- images -------------==============> */ }


// dummy data
const data = [
    { id: 1, name: "Wall Art", sku: "WALLART123", category: "Wall Art", img: "", status: "x" },
    { id: 2, name: "Nature", sku: "NATURE890", category: "Nature", img: "", status: "x" },
    { id: 3, name: "Abstract", sku: "ABSTRACT123", category: "Abstract", img: "", status: "x" },
    { id: 4, name: "Modern", sku: "MODERN123", category: "Modern", img: "", status: "x" },
    { id: 5, name: "Classic", sku: "CLASSIC123", category: "Classic", img: "", status: "x" },
    { id: 6, name: "Minimal", sku: "MINIMAL123", category: "Minimal", img: "", status: "x" },
]

function BestSelling() {
    const [search, setSearch] = useState("");

    // ✅ FILTER STATES
    const [activeFilter, setActiveFilter] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedSort, setSelectedSort] = useState("Latest");
    const [addCollection, setAddCollection] = useState(false);

    // ✅ FILTER LOGIC
    let filteredData = data.filter((item) => {
        const searchMatch = item.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const statusMatch =
            selectedStatus === "All" || item.status === selectedStatus;

        return searchMatch && statusMatch;
    });

    // ✅ SORT LOGIC
    if (selectedSort === "A-Z") {
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (selectedSort === "Z-A") {
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (selectedSort === "Latest") {
        filteredData = [...filteredData].reverse();
    }



    // ✅ PAGINATION (added)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentItems = filteredData.slice(startIndex, endIndex);


    const location = useLocation();

    const collectionName =
        location.state?.collectionName || "Best Seller";

    return (

        <div className="p-6 bg-[#F6F8F9] min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <Link to="/admin/collection">
                    <div className="flex gap-4 items-center ">
                        <span><IoIosArrowBack size={20} /></span>
                        <span className="text-[20px] font-semibold">
                            {collectionName}
                        </span>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    <button className="flex items-center px-4 py-2 bg-[#F8FBFC] rounded-lg border border-[#1800AC] text-[#1C1C1C]">
                        <select name="status" id="">
                            <option value="All">All</option>
                            <option value="x">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </button>
                    <button className="flex items-center px-4 py-2 bg-[#0B3142] text-white rounded-lg"
                        onClick={() => setAddCollection(!addCollection)}
                    >
                        <MdOutlineAdd size={20} />
                        Add Product
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl">

                {/* SEARCH + FILTER */}
                <div className="flex justify-between mb-6">

                    {/* SEARCH */}
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
                        {/* SORT */}
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
                        <button
                            onClick={() => {
                                setSelectedSort("Latest");
                            }}
                            className="text-[#1C3753]"
                        >
                            Clear
                        </button>

                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">

                        <thead className="bg-[#F8F8F8]">
                            <tr>
                                <th className="px-6 py-3 text-left">S.no</th>
                                <th className="px-6 py-3 text-left">Product Name</th>
                                <th className="px-6 py-3 text-center">SKU ID</th>
                                <th className="px-6 py-3 text-center">Category</th>
                                <th className="px-6 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id} className="border-t hover:bg-gray-50">
                                    <td className="px-6 py-4 text-left">
                                        {item.id}
                                    </td>

                                    <td className="px-6 py-4 text-left">
                                        <div className="flex gap-2 items-center">
                                            <img src={item.img} alt="" className="w-12 h-12 rounded-md" />
                                            <div className="flex flex-col justify-between">
                                                <span className="text-[16px] font-medium">{item.name}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {item.sku}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.category}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-3">
                                            <button className="p-2 hover:bg-gray-100 rounded">
                                                {item.status}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {currentItems.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-6 text-gray-500">
                                        No collections found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ✅ PAGINATION UI (added) */}
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
            {addCollection && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setAddCollection(false);
                        }
                    }}
                >
                    <div
                        className="bg-white rounded-xl p-6 w-[400px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-4">
                            Add Product
                        </h2>

                        <input
                            type="search"
                            placeholder="search product name"
                            className="w-full border p-2 rounded-lg mb-4 bg-[#F8FBFC] outline-none border border-[#DEDEDE] text-[#686868] text-[14px] font-normal"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setAddCollection(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // your save logic here
                                    setAddCollection(false);
                                }}
                                className="px-4 py-2 bg-[#1C3753] text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BestSelling