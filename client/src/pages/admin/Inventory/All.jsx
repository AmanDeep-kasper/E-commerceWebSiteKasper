import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  ChevronDown,
  ListFilter,
  MoreVertical,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axiosInstance";

const All = () => {
  const [openDetails, setOpenDetails] = useState(null);
  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  /* ================= SORT FILTER (MOVE UP) ================= */
  const [filterOne, setfilterOne] = useState("latest");
  const [filterOneOpen, setfilterOneOpen] = useState(false);
  // open
  const [openCancelModule, setopenCancelModule] = useState(null);
  const [cancelResionData, setCancelResionData] = useState("");
  // stock adjected
  const [stockType, setStockType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [adjustLoading, setAdjustLoading] = useState(false);
  // backend integration for inventory data
  const [inventoryData, setInventoryData] = useState([]);

  const filterOneItems = [
    { label: "Latest", value: "latest" },
    { label: "Oldest Date", value: "oldest" },
    { label: "Price Low to High", value: "price_low" },
    { label: "Price High to Low", value: "price_high" },
  ];

  // stock updata api call
  const handleAdjustStock = async () => {
    try {
      setAdjustLoading(true);

      const res = await axiosInstance.post("/inventory/adjust-stock", {
        productId: openDetails.productId,
        variantId: openDetails.variantId,
        quantity: Number(quantity),
        stockType,
      });

      toast.success(res.data?.message || "Stock updated");

      setOpenDetails(null);
      setQuantity("");
      setStockType("inStock");

      // ✅ manually refresh data
      handleInventoryData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update stock");
    } finally {
      setAdjustLoading(false);
    }
  };

  // fetch inventory data from backend
  const handleInventoryData = async () => {
    try {
      const res = await axiosInstance.get("/inventory/get-inventory", {
        params: {
          page,
          limit,
          search: debouncedValue.trim(),
          sortBy: filterOne,
          filterBy: "all",
        },
      });

      console.log(res);

      setInventoryData(res.data?.data || []);
      setTotal(res.data?.total || 0);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  useEffect(() => {
    handleInventoryData();
  }, [page, debouncedValue, filterOne]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const columns = [
    " SKU ID",
    "Product Name",
    "Category",
    "Available Stock",
    "Selling Price",
    "Status",
    "Action",
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-[30%] rounded-lg px-3 py-2 bg-[#F8FBFC]">
          <Search className="w-4 h-4 text-[#686868]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU ID, Product name, category"
            className="outline-none text-sm text-[#686868] w-full bg-transparent"
          />
        </div>

        <div className="flex items-center justify-evenly gap-4">
          {/* <div className="relative">
            <button
              onClick={() => setPaymentStatusOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border">
              {paymentstatus}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {paymentstatusOpen && (
              <div className="absolute mt-2 w-36 right-0 top-8  bg-white border rounded-lg shadow-md z-20">
                {Paymentstatuses.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setPaymentStatus(s);
                      // setStatusOpen(false);
                      setPaymentStatusOpen(false);
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer text-[#686868] hover:bg-gray-100
            ${paymentstatus === s ? "bg-gray-100 font-medium" : ""}
          `}>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div> */}

          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
              onClick={() => setfilterOneOpen((p) => !p)}
            >
              <ListFilter className="w-4 h-4" />
              {filterOneItems.find((item) => item.value === filterOne)?.label ||
                "Filter"}
            </button>

            {filterOneOpen && (
              <div className="absolute mt-2 w-48 -right-2 top-8 bg-white border rounded-lg shadow-md z-50">
                {filterOneItems.map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => {
                      setfilterOne(item.value);
                      setfilterOneOpen(false);
                      setPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-[#686868] ${
                      filterOne === item.value
                        ? "bg-gray-100 text-[#686868] font-medium"
                        : ""
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        {openDetails && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[500px] relative shadow-lg">
              {/* Close button */}
              <button
                onClick={() => setOpenDetails(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <div className="w-[500px] inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                <div className="w-[452px] flex flex-col justify-start items-start gap-4">
                  <div className="inline-flex justify-center items-center gap-2.5">
                    <div className="justify-start text-zinc-900 text-lg font-medium font-['Inter'] leading-4">
                      Adjust Stock
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch p-3 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col justify-start items-start gap-2.5">
                      <div className="inline-flex justify-start items-center gap-2.5">
                        <div className="justify-start text-zinc-900 text-xs font-medium font-['Inter'] leading-3">
                          Available Stock
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center gap-2.5">
                        <div className="justify-start text-zinc-900 text-base font-medium font-['Inter'] leading-4">
                          {openDetails?.stock}
                        </div>
                      </div>
                    </div>
                    <div
                      data-type="increase - filled"
                      className="w-[452px] flex flex-col justify-start items-start gap-6"
                    >
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="flex flex-col justify-start items-start gap-4">
                          <div className="w-[452px] flex flex-col justify-start items-start gap-4">
                            <div className="inline-flex justify-start items-center gap-2.5">
                              <div className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-4">
                                Adjustment Type
                              </div>
                            </div>
                            <div
                              data-type="increase"
                              className="self-stretch inline-flex justify-start items-center gap-4"
                            >
                              <div className="flex-1 px-2.5 py-2 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-3 overflow-hidden">
                                <input
                                  type="checkbox"
                                  checked={stockType === "inStock"}
                                  onChange={() => setStockType("inStock")}
                                />
                                <div className="flex justify-start items-center gap-1.5">
                                  <div className=" text-green-600">
                                    <TrendingUp />
                                  </div>

                                  <div className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-4">
                                    Stock In
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 px-2.5 py-2 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-3 overflow-hidden">
                                <input
                                  type="checkbox"
                                  checked={stockType === "outStock"}
                                  onChange={() => setStockType("outStock")}
                                />
                                <div className="flex justify-start items-center gap-1.5">
                                  {/* <div
                                    data-type="down"
                                    className="w-5 h-5 relative overflow-hidden"
                                  > */}
                                  <div className="text-red-600">
                                    {" "}
                                    <TrendingDown />
                                  </div>
                                  {/* </div> */}
                                  <div className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-4">
                                    Stock Out
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-[452px] flex flex-col justify-start items-start gap-2">
                            <div className="inline-flex justify-start items-start gap-0.5">
                              <div className="flex justify-start items-center gap-2.5">
                                <div className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-4">
                                  Stock Quantity
                                </div>
                              </div>
                              <div className=" text-red-600">*</div>
                            </div>
                            <div className="w-[452px] flex flex-col justify-start items-start gap-2">
                              <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter stock quantity"
                                className="self-stretch h-10 px-3 py-2 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-200 text-zinc-900 text-sm font-normal font-['Inter'] leading-4"
                              />
                            </div>
                          </div>
                          {quantity && Number(quantity) > 0 && (
                            <div className="w-[452px] p-3 bg-blue-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col justify-start items-start gap-2.5">
                              <div className="inline-flex justify-start items-center gap-2.5">
                                <div className="justify-start text-zinc-900 text-xs font-medium font-['Inter'] leading-3">
                                  Preview After Adjustment
                                </div>
                              </div>
                              <div className="self-stretch inline-flex justify-start items-center gap-14">
                                <div className="h-9 inline-flex flex-col justify-center items-start gap-2">
                                  <div className="inline-flex justify-start items-center gap-2.5">
                                    <div className="justify-start text-stone-500 text-sm font-normal font-['Inter'] leading-4">
                                      Current Available Stock
                                    </div>
                                  </div>
                                  <div className="flex flex-col justify-center items-center gap-2.5">
                                    <div className="justify-start text-zinc-900 text-base font-medium font-['Inter'] leading-4">
                                      {openDetails?.stock}
                                    </div>
                                  </div>
                                </div>
                                <div className="h-9 inline-flex flex-col justify-center items-start gap-2">
                                  <div className="inline-flex justify-start items-center gap-2.5">
                                    <div className="justify-start text-stone-500 text-sm font-normal font-['Inter'] leading-4">
                                      New Available Stock
                                    </div>
                                  </div>
                                  <div className="flex flex-col justify-center items-center gap-2.5">
                                    <div
                                      className={`justify-start text-base font-medium font-['Inter'] leading-4 ${
                                        stockType === "outStock"
                                          ? "text-red-600"
                                          : "text-green-600"
                                      }`}
                                    >
                                      {stockType === "inStock"
                                        ? Number(openDetails?.stock || 0) +
                                          Number(quantity || 0)
                                        : Number(openDetails?.stock || 0) -
                                          Number(quantity || 0)}
                                      {""}({stockType === "inStock" ? "+" : "-"}
                                      {Number(quantity || 0)})
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="self-stretch inline-flex justify-end items-center gap-2">
                        <div
                          data-has-icon="Off"
                          data-type="Secondary"
                          className="w-24 px-2.5 py-2 rounded-md outline outline-1 outline-offset-[-1px] outline-stone-500 flex justify-center items-center gap-2.5 overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenDetails(null)}
                            className="justify-start text-stone-500 text-sm font-medium font-['Inter'] leading-4"
                          >
                            Cancel
                          </button>
                        </div>
                        <div
                          data-has-icon="Off"
                          data-type="Primary"
                          className="px-2.5 py-2 bg-blue-950 rounded-md flex justify-center items-center gap-2.5 overflow-hidden"
                        >
                          <button
                            onClick={handleAdjustStock}
                            disabled={
                              !quantity ||
                              Number(quantity) <= 0 ||
                              adjustLoading
                            }
                            className={`justify-start text-white text-sm font-medium font-['Inter'] leading-4 ${
                              !quantity || Number(quantity) <= 0
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {adjustLoading
                              ? "Updating..."
                              : "Confirm Adjustment"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-[#F8F8F8] h-[54px]">
            <tr className="text-[#4B5563] text-sm text-center">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 font-medium text-[#1C1C1C]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {inventoryData.map((order, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition text-center cursor-pointer"
              >
                <td
                  // onClick={() => {
                  //   setSelectedOrderId(order.returnId);
                  // }}
                  className="px-4 py-3 text-[#000000]"
                >
                  {order.sku}
                </td>
                <td className="px-0 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-[50px] w-[50px] ml-2 bg-[#EFEFEF] p-1.5 rounded-md overflow-hidden">
                      <img
                        className="h-full w-full object-cover object-center"
                        src={order.image || "/no-image.png"}
                        alt={order.productName || "Product image"}
                      />
                    </div>

                    <div className="flex flex-col items-start justify-start">
                      <span className="text-[#1F2937] text-[16px]  font-medium cursor-pointer">
                        {order.productName.split(" ").length > 3
                          ? order.productName.split(" ").slice(0, 6).join(" ") +
                            "..."
                          : order.productName || ""}
                      </span>
                      <div className="flex items-start justify-start gap-3 mt-1">
                        <span className="p-0.5 border text-xs border-[#495F75] rounded-md">
                          {order.varintStyle || ""}
                        </span>
                        <span className="p-0.5 border text-xs border-[#495F75] rounded-md">
                          {order.weight || ""} {order.weightUnit || "20X10"}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">{order.categoryName}</td>
                <td className="px-4 py-3">{order.stock}</td>

                <td className="px-4 py-3">₹{order.sellingPrice}</td>
                <td className="px-4 py-3 font-medium text-xs">
                  <span
                    className={`inline-flex items-center justify-center min-w-[110px] px-4 py-1.5 rounded-md font-medium text-center ${
                      order.status === "in_stock"
                        ? "text-[#00A63E] bg-[#E0F4DE]"
                        : order.status === "low_stock"
                          ? "text-[#F8A14A] bg-[#FFFBEB]"
                          : order.status === "out_of_stock"
                            ? "bg-[#FFE4E3] text-[#D53B35]"
                            : ""
                    }`}
                  >
                    {order.status
                      ?.replaceAll("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
                </td>

                <td className="px-4 py-3 gap-3">
                  <button
                    onClick={() => setOpenDetails(order)}
                    className="hover:underline text-[#2C87E2]"
                  >
                    Adjust Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-3 text-sm text-gray-600">
          <div>
            Showing{" "}
            <span className="font-medium">
              {total === 0 ? 0 : (page - 1) * limit + 1}
            </span>
            –
            <span className="font-medium">{Math.min(page * limit, total)}</span>{" "}
            of <span className="font-medium">{total}</span> results
          </div>

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
      </div>
    </>
  );
};

export default All;
