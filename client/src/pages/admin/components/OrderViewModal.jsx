import React, { useEffect, useState } from "react";
import {
  Box,
  ClipboardClock,
  Download,
  Truck,
  WalletCards,
  X,
} from "lucide-react";

const OrderViewModal = ({
  open,
  data,
  setSelectedOrderId,
  onAcceptOrder = () => {},
  onSaveTracking = () => {},
  setopenCancelModule = () => {},
}) => {
  // ✅ Don't render if closed or no data
  if (!open || !data) return null;

  // ✅ Close on ESC
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setSelectedOrderId();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [setSelectedOrderId]);

  // ✅ Disable background scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, []);

  // ✅ safe items
  const items = Array.isArray(data?.items) ? data.items : [];

  const itemSubtotal = items.reduce(
    (total, item) =>
      total + Number(item?.price || 0) * Number(item?.quantity || 0),
    0,
  );

  const discount = Number(data?.discount ?? 0);
  const shippingCost = Number(data?.shippingCost ?? 0);
  const totalAmount = itemSubtotal - discount + shippingCost;

  const deliveryPartners = ["Delhivery", "Blue Dart", "DTDC", "India Post"];
  const orderId = data?.orderId || data?.order_id;

  const [selectedPartner, setSelectedPartner] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  // ✅ Prefill when modal opens / data changes
  useEffect(() => {
    setSelectedPartner(data?.deliveryPartner || "");
    setTrackingId(data?.trackingId || "");
    setTrackingUrl(data?.trackingUrl || "");
  }, [data]);

  const orderStatus =
    data?.orderStatus || data?.delivery_status || data?.orderStatus;

  const isPending = orderStatus === "Pending";
  const isProcessing = orderStatus === "Processing";
  const isShipped = orderStatus === "Shipped";

  const canAccept = isPending && !!selectedPartner;
  const showTrackingSection = isProcessing || isShipped;
  const trackingAlreadySaved = !!data?.trackingId;

  // ✅ Stop closing when clicking inside modal
  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3 py-6"
      onClick={setSelectedOrderId} // click outside closes
    >
      <div
        className="bg-white w-full max-w-[500px] rounded-2xl shadow-lg border p-4 overflow-y-auto max-h-[90vh]"
        onClick={stop} // stop close on inner click
      >
        {/* ✅ Your existing UI */}
        <div className="bg-[#FFFFFF] w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 w-full flex-nowrap">
            <span className="text-[18px]">Order Details</span>
            <button
              className="border-[1px] border-black rounded-full shrink-0"
              onClick={setSelectedOrderId}
            >
              <X size={18} />
            </button>
          </div>

          {/* Order ID */}
          <div className="flex items-start border-b-[0.5px] w-full">
            <div className="flex mb-3 w-full justify-start flex-nowrap md:gap-4">
              <div className="min-w-0">
                <span className="text-sm font-medium">
                  Order ID #{data.orderId}
                </span>
                <div className="text-[#686868] text-sm flex items-start gap-1">
                  <span>{data.orderDate}</span>
                  <i className="text-[#DEDEDE]">●</i>
                  <span>{data.orderTime}</span>
                </div>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium shrink-0
          ${
            data.orderStatus === "Delivered"
              ? "bg-green-100 text-green-600"
              : data.orderStatus === "Cancelled"
                ? "bg-[#EFEFEF] text-[#686868]"
                : data.orderStatus === "Pending"
                  ? "bg-[#FFF9E0] text-[#F8A14A]"
                  : data.orderStatus === "Processing"
                    ? "bg-[#E6D3FF] text-[#8A38F5]"
                    : data.orderStatus === "Shipped"
                      ? "bg-[#D5E5F5] text-[#1C3753]"
                      : ""
          }`}
                >
                  {data.orderStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-2">
            <p className="text-sm mt-3 mb-2">Order Summary</p>
            <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between w-full flex-nowrap">
                  <div className="flex items-center gap-1 min-w-0">
                    <Box size={15} />
                    <span>Total Items</span>
                  </div>
                  <div className="text-black font-medium shrink-0">
                    {data.quantity}
                  </div>
                </div>

                {data.deliveryPartner && (
                  <div className="flex items-center justify-between w-full flex-nowrap">
                    <div className="flex items-center gap-1 min-w-0">
                      <Truck size={15} />
                      <span>Shipping Partner</span>
                    </div>
                    <div className="text-black font-medium shrink-0">
                      {data.deliveryPartner}
                    </div>
                  </div>
                )}

                {data.trackingId && (
                  <div className="flex items-center justify-between w-full flex-nowrap">
                    <div className="flex items-center gap-1 min-w-0">
                      <ClipboardClock size={15} />
                      <span>Tracking ID</span>
                    </div>
                    <div className="text-black font-medium shrink-0">
                      {data.trackingId}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between w-full flex-nowrap">
                  <div className="flex items-center gap-1 min-w-0">
                    <WalletCards size={15} />
                    <span>Payment Method</span>
                  </div>
                  <div className="text-black font-medium shrink-0">
                    {data.paymentType}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Summmary  */}
          <div className="mt-2">
            <span className="text-sm mt-3 mb-3">Delivery Summary</span>
            <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between w-full flex-nowrap">
                  <div className="flex items-center gap-1 min-w-0">
                    <Box size={15} />
                    <span>Delivery Type</span>
                  </div>
                  <div className="text-black font-medium shrink-0">
                    {/* change by contant */}
                    {data.quantity ? data.quantity : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Delivery Partner */}
          <div className="mt-2">
            <span className="text-sm mt-3 mb-3 block">Delivery Partner</span>

            <div className="w-full p-2 text-sm text-gray-600 border rounded-md">
              <div className="flex items-center justify-between w-full flex-nowrap">
                <div className="flex items-center gap-1 min-w-0">
                  {/* <Box size={15} /> */}
                  <span>Select a delivery partner</span>
                </div>

                <div className="shrink-0">
                  <select
                    value={selectedPartner}
                    disabled={!isPending}
                    onChange={(e) => setSelectedPartner(e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-md
    ${isPending ? "bg-white text-black" : "bg-[#F8FAFB] text-gray-500 cursor-not-allowed"}`}
                  >
                    <option value="">Select</option>
                    {deliveryPartners.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* traking details */}
          {/* {data.trakingDeatils && (
        <div className="mt-2 flex flex-col space-y-3">
          <span className="text-sm block">Tracking Details</span>
          <div className="w-full  text-sm text-gray-600 border rounded-md">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <input
                readOnly
                type="text"
                className="p-2 w-full outline-none"
                value={selectedPartner}
                placeholder="Shipping Partner"
              />
            </div>
          </div>
          <div className="w-full  text-sm text-gray-600 border rounded-md">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <input
                type="text"
                className="p-2 w-full outline-none"
                placeholder="Enter traking ID"
              />
            </div>
          </div>
          <div className="w-full  text-sm text-gray-600 border rounded-md">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <input
                type="text"
                className="p-2 w-full outline-none"
                placeholder="Enter tracking URL"
              />
            </div>
          </div>
        </div>
      )} */}
          {showTrackingSection && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Tracking Details</p>

              {/* Shipped OR Tracking already exists */}
              {trackingAlreadySaved ? (
                <div className="p-3 border rounded-md bg-[#F8FAFB] text-sm space-y-1">
                  <div>
                    <span className="text-gray-600">Partner:</span>{" "}
                    {data.deliveryPartner}
                  </div>
                  <div>
                    <span className="text-gray-600">Tracking ID:</span>{" "}
                    {data.trackingId}
                  </div>

                  {data.trackingUrl && (
                    <a
                      href={data.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2C87E2] underline"
                    >
                      Open Tracking URL
                    </a>
                  )}
                </div>
              ) : (
                <>
                  {/* only in Processing */}
                  <input
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm mb-2"
                    placeholder="Enter Tracking ID"
                  />
                  <input
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                    placeholder="Enter Tracking URL"
                  />

                  <button
                    type="button"
                    disabled={!trackingId}
                    onClick={() =>
                      onSaveTracking({ orderId, trackingId, trackingUrl })
                    }
                    className={`mt-2 px-4 py-2 rounded-md text-sm
            ${trackingId ? "bg-[#1C3753] text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                  >
                    Save Tracking
                  </button>
                </>
              )}
            </div>
          )}

          {/* Customer Details */}
          <div className="mt-2">
            <p className="text-sm mt-3 mb-2">Customer Details</p>
            <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
              <div className="flex items-center gap-2 mb-3 w-full flex-nowrap">
                <div className="w-[40px] h-[40px] rounded-full bg-gray-500 flex items-center justify-center overflow-hidden">
                  {data?.deliveryAddress?.profileImage ? (
                    <img
                      src={data.deliveryAddress.profileImage}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <span className="text-white font-semibold text-lg">
                      {data?.deliveryAddress?.name?.charAt(0)?.toUpperCase() ||
                        "?"}
                    </span>
                  )}
                </div>

                <div className=" flex flex-col min-w-0">
                  {/* <span className="text-black">{data.deliveryAddress.name}</span> */}
                  <span>{data.customerId ?? "N/A"} </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between w-full flex-nowrap">
                  <span>Phone Number</span>
                  <span className="text-black font-medium shrink-0">
                    {/* {data.deliveryAddress.mobile ?? "N/A"} */}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full flex-nowrap">
                  <span>Email</span>
                  <span className="text-black font-medium shrink-0">
                    {/* {data.deliveryAddress.email ?? "N/A"} */}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full flex-nowrap">
                  <span>Address</span>
                  <span className="text-black font-medium shrink-0">
                    {/* {data.deliveryAddress.addressLine1 ?? "N/A"} */}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-2">
            <span className="text-sm mt-3 mb-3">Items</span>
            <div className="w-full flex flex-col gap-3 p-3 text-sm text-gray-600 border rounded-md">
              {[1, 2].map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between border-b pb-3 w-full flex-nowrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        width={42}
                        height={42}
                        className="rounded-md shrink-0"
                        src="https://plus.unsplash.com/premium_photo-1675896084254-dcb626387e1e"
                        alt=""
                      />
                      <div className="flex flex-col text-[16px] space-y-2 min-w-0">
                        <span>
                          {"Flower Mandela Laser Cut Metal Wall Art"
                            .split(" ")
                            .slice(0, 4)
                            .join(" ") + "..."}
                        </span>
                        <div className="flex gap-2 text-[12px]">
                          <span className="border px-2 rounded-lg">Red</span>
                          <span className="border px-2 rounded-lg">25X12</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-[12px] space-y-1 shrink-0">
                      <span>SKU ID #SK-FLV1-391</span>
                      <div className="text-sm p-1 bg-[#EFEFEF] text-[#686868] rounded-lg font-medium">
                        Quantity 1
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="mt-2">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <p className="text-sm mt-3 mb-2">Payment</p>
              <button className="flex items-center gap-2 text-[#2C87E2] shrink-0">
                Download Invoice <Download size={18} />
              </button>
            </div>

            <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
              <div className="space-y-2">
                <div className="flex items-center justify-between w-full flex-nowrap">
                  <span>Item Subtotal</span>
                  <span className="text-black font-medium shrink-0">
                    {" "}
                    ₹{itemSubtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full flex-nowrap">
                  <span>Discount</span>
                  <span className="text-black font-medium shrink-0">
                    ₹{discount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full flex-nowrap">
                  <span>Shipping Cost</span>
                  <span className="text-black font-medium shrink-0">
                    ₹{shippingCost.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t py-2 w-full flex-nowrap">
                  <span>Total</span>
                  <span className="text-black font-medium shrink-0">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            {isPending && (
              <>
                <button
                  type="button"
                  disabled={!canAccept}
                  onClick={() =>
                    onAcceptOrder({ orderId, deliveryPartner: selectedPartner })
                  }
                  className={`px-6 py-1.5 rounded-md text-white
          ${canAccept ? "bg-[#1C3753]" : "bg-gray-300 cursor-not-allowed"}`}
                >
                  Accept
                </button>

                <button
                  type="button"
                  onClick={() => setopenCancelModule(orderId)}
                  className="px-6 py-1.5 rounded-md text-[#1C3753] bg-white border border-[#1C3753]"
                >
                  Reject
                </button>
              </>
            )}

            {isProcessing && (
              <span className="px-6 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-600">
                Accepted
              </span>
            )}

            {isShipped && (
              <span className="px-6 py-1.5 rounded-md text-sm font-medium bg-[#D5E5F5] text-[#1C3753]">
                Shipped
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderViewModal;
