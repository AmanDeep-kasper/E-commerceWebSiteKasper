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
// import ReturnRejectedModule from "./ReturnPopModules/ReturnRejectedModule";
// import ReturnRequestedModule from "./ReturnPopModules/ReturnRequestedModule";

const All = () => {
  const { returnsData, setReturnsData } = useOutletContext();
  const [openDetails, setOpenDetails] = useState(null);

  const columns = [
    " SKU ID",
    "Product Name",
    "Category",
    "Available Stock",
    "Selling Price",
    "Status",
    "Action",
  ];

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= PAYMENT FILTER ================= */
  // const [paymentstatusOpen, setPaymentStatusOpen] = useState(false);
  // const [paymentstatus, setPaymentStatus] = useState("Return Type");
  // const Paymentstatuses = ["Return Type", "Exchange", "Return"];

  /* ================= SORT FILTER (MOVE UP) ================= */
  const [filterOne, setfilterOne] = useState("Latest");
  const [filterOneOpen, setfilterOneOpen] = useState(false);

  const filterOneItems = ["Latest", "Latest Date", "Oldest Date"];

  // const [returnsData, setReturnsData] = useState([]);

  // useEffect(() => {
  //   setReturnsData(contextReturns || []);
  // }, [contextReturns]);

  const filteredOrders = useMemo(() => {
    let result = [...returnsData];

    /* 🔍 SEARCH */
    if (debouncedValue.trim()) {
      const searchValue = debouncedValue.toLowerCase();

      result = result.filter((item) => {
        const returnId = item.returnId?.toLowerCase() || "";
        const orderId = item.orderDetails?.orderId?.toLowerCase() || "";

        return returnId.includes(searchValue) || orderId.includes(searchValue);
      });
    }

    /* 💳 PAYMENT */
    // if (paymentstatus !== "Return Type") {
    //   result = result.filter((item) => item.type === paymentstatus);
    // }

    /* ↕️ SORT */
    if (filterOne === "Latest Return Date") {
      result.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
    }

    if (filterOne === "Oldest Return Date") {
      result.sort((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt));
    }

    return result;
    // }, [returnsData, debouncedValue, paymentstatus, filterOne]);
  }, [returnsData, debouncedValue, filterOne]);

  useEffect(() => {
    setPage(1);
    // }, [debouncedValue, paymentstatus, filterOne]);
  }, [debouncedValue, filterOne]);

  /* ================= PAGINATION ================= */
  const total = filteredOrders.length;
  const totalPages = Math.ceil(total / rowsPerPage);

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, total);

  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  //////////////////////////////////////////////////
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const selectOrder = returnsData.find(
    (orders) => orders.returnId === selectedOrderId,
  );

  ///////////////////////////////////////////////////
  // cancel order module

  const [openCancelModule, setopenCancelModule] = useState(null);
  const [cancelResionData, setCancelResionData] = useState("");

  const selectCancelOrder = returnsData.find(
    (orders) => orders.returnId === openCancelModule,
  );

  // Accepted order

  const [acceptedOrders, setAcceptedOrders] = useState([]);

  // const handleAcceptedOrders = (orderId) => {
  //   setAcceptedOrders((prev) => [...prev, orderId]);
  // };

  // const handleAcceptedOrders = (orderId) => {
  //   const updatedReturns = returnsData.map((item) => {
  //     if (item.returnId === orderId) {
  //       return { ...item, status: "Approved" };
  //     }
  //     return item;
  //   });

  //   setReturnsData(updatedReturns);

  //   setAcceptedOrders((prev) => [...prev, orderId]);
  // };

  // agin
  const handleAcceptedOrders = ({ returnId, deliveryPartner }) => {
    const updatedReturns = returnsData.map((item) => {
      if (item.returnId === returnId) {
        return {
          ...item,
          status: "Approved",
          shippingDetails: {
            ...(item.shippingDetails || {}),
            shippingPartner: deliveryPartner,
            trackingId: "",
            trackingLink: "",
            shippingStatus: "Approved",
            expectedDeliveryDate: "",
          },
        };
      }
      return item;
    });

    setReturnsData(updatedReturns);
  };

  // marks as shipped
  const handleMarkAsShipped = ({
    returnId,
    deliveryPartner,
    trackingId,
    trackingLink,
  }) => {
    const updatedReturns = returnsData.map((item) => {
      if (item.returnId === returnId) {
        return {
          ...item,
          status: "Pickup Scheduled",
          shippingDetails: {
            ...(item.shippingDetails || {}),
            shippingPartner: deliveryPartner,
            trackingId,
            trackingLink,
            shippingStatus: "Pickup Scheduled",
            expectedDeliveryDate: "2026-02-06",
          },
        };
      }
      return item;
    });

    setReturnsData(updatedReturns);
  };

  const handleCancelOrder = (orderId) => {
    toast.error("Order has been cancelled", {
      icon: true,
      style: {
        background: "#FDECEC",
        color: "#1C1C1C",
      },
    });

    setopenCancelModule(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-[30%] rounded-lg px-3 py-2 bg-[#F8FBFC]">
          <Search className="w-4 h-4 text-[#686868]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Return ID and Order ID"
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
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-[#F8FBFC] rounded-lg hover:bg-gray-100 border"
              onClick={() => setfilterOneOpen((p) => !p)}
            >
              <ListFilter className="w-4 h-4" />
              {filterOne}
            </button>
            {filterOneOpen && (
              <div className="absolute mt-2 w-48 -right-2 top-8 bg-white border rounded-lg shadow-md z-100">
                {filterOneItems.map((s) => {
                  return (
                    <div
                      key={s}
                      onClick={() => {
                        setfilterOne(s);
                        setfilterOneOpen(false);
                      }}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-[#686868] ${
                        filterOne === s
                          ? "bg-gray-100 text-[#686868] font-medium"
                          : ""
                      }`}
                    >
                      {s}
                    </div>
                  );
                })}
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
                          53
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
                                <input type="checkbox" />
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
                                <input type="checkbox" />
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
                              {/* <div className="w-3 h-3 relative overflow-hidden"> */}
                              <div className=" text-red-600">*</div>
                              {/* </div> */}
                            </div>
                            <div className="w-[452px] flex flex-col justify-start items-start gap-2">
                              <div className="self-stretch h-10 px-3 py-2 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-200 inline-flex justify-start items-center gap-2.5">
                                <div className="flex-1 flex justify-start items-center gap-2.5">
                                  <div className="flex justify-center items-center gap-2.5">
                                    <div className="justify-start text-zinc-900 text-sm font-normal font-['Inter'] leading-4">
                                      10
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
                                    53
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
                                  <div className="justify-start text-green-600 text-base font-medium font-['Inter'] leading-4">
                                    63 (+10)
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch inline-flex justify-end items-center gap-2">
                        <div
                          data-has-icon="Off"
                          data-type="Secondary"
                          className="w-24 px-2.5 py-2 rounded-md outline outline-1 outline-offset-[-1px] outline-stone-500 flex justify-center items-center gap-2.5 overflow-hidden"
                        >
                          <button className="justify-start text-stone-500 text-sm font-medium font-['Inter'] leading-4">
                            Cancel
                          </button>
                        </div>
                        <div
                          data-has-icon="Off"
                          data-type="Primary"
                          className="px-2.5 py-2 bg-blue-950 rounded-md flex justify-center items-center gap-2.5 overflow-hidden"
                        >
                          <button className="justify-start text-white text-sm font-medium font-['Inter'] leading-4">
                            Confirm Adjustment
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
            {paginatedOrders.map((order) => (
              <tr
                key={order.returnId}
                className="border-t hover:bg-gray-50 transition text-center cursor-pointer"
              >
                <td
                  // onClick={() => {
                  //   setSelectedOrderId(order.returnId);
                  // }}
                  className="px-4 py-3 text-[#000000]"
                >
                  {order.returnId}
                </td>
                <td className="px-0 py-4">
                  <div className="flex items-center justify-center text-center bg-emerald- gap-2">
                    <div className="h-[50px] w-[50px] ml-2 bg-[#EFEFEF] p-1 rounded-md overflow-hidden">
                      <img
                        className="h-full w-full object-cover object-center"
                        src={order?.item?.images?.[0] || "/no-image.png"}
                        alt={order?.item?.productName || "Product image"}
                      />
                    </div>

                    <div className="flex flex-col items-start justify-start">
                      <span className="text-[#1F2937] text-[16px]  font-medium cursor-pointer">
                        {order.item.productName.split(" ").length > 3
                          ? order.item.productName
                              .split(" ")
                              .slice(0, 6)
                              .join(" ") + "..."
                          : order.item.productName}
                      </span>
                      <div className="flex items-start justify-start gap-3 mt-1">
                        <span className="p-0.5 border rounded-md">Black</span>
                        <span className="p-0.5 border rounded-md">20X10</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">{order.returnReason}</td>
                <td className="px-4 py-3">{order.returnReason}</td>

                <td className="px-4 py-3">{order.requestedAt}</td>
                <td className="px-4 py-3 font-medium text-xs ">
                  <span
                    className={`inline-flex items-center justify-center min-w-[110px] px-4 py-1.5 rounded-md font-medium text-center ${
                      order.type === "In Stock"
                        ? "text-[#00A63E] bg-[#E0F4DE]"
                        : order.type === "Low Stock"
                          ? "text-[#F8A14A] bg-[#FFFBEB]"
                          : order.type === "Out of Stock"
                            ? "bg-[#e0d7d6] text-[#D53B35]"
                            : ""
                    }`}
                  >
                    {order.type}
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
            Showing <span className="font-medium">{startIndex + 1}</span>–
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{total}</span> results
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
