import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { div } from "framer-motion/m";

const ReturnRequestedModule = ({
  data,
  setSelectedOrderId,
  setopenCancelModule,
  handleAcceptedOrders,
  handleMarkAsShipped,
  handleSaveQualityCheck,
  handleMarkAsReturned,
  mode = "requested",
}) => {
  if (String(data?.type).toLowerCase() === "exchange") return null;
  const item = data?.item || {};
  const orderDetails = data?.orderDetails || {};
  const customerDetails = data?.customerDetails || {};

  // Delivery Partner dropdown (UI only, you can connect later)
  const deliveryPartners = useMemo(
    () => [
      "Select a delivery partner",
      "Blue Dart",
      "Delhivery",
      "DTDC",
      "Ecom Express",
    ],
    [],
  );

  const [deliveryPartner, setDeliveryPartner] = useState(
    data?.shippingDetails?.shippingPartner || deliveryPartners[0],
  );

  // Payment summary (same style as screenshot)
  const itemSubtotal = Number(orderDetails?.totalAmount || item?.price || 0);
  const platformFee = Number(orderDetails?.platformFee || 0); // optional
  const deliveryCharges = Number(orderDetails?.deliveryCharges || 0); // optional
  const refundable = Math.max(0, itemSubtotal - platformFee - deliveryCharges);

  const fmt = (n) =>
    `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  // status change

  const [isApproved, setIsApproved] = useState(
    ["approved", "pickup scheduled"].includes(
      String(data?.status).toLowerCase(),
    ),
  );

  const [trackingId, setTrackingId] = useState(
    data?.shippingDetails?.trackingId || "",
  );
  const [trackingLink, setTrackingLink] = useState(
    data?.shippingDetails?.trackingLink || "",
  );

  // status usestate
  const [qualityCheck, setQualityCheck] = useState(
    data?.qualityCheckStatus || "",
  );

  const isPickupScheduled =
    String(data?.status).toLowerCase() === "pickup scheduled";

  // timer
  const showTrackingFields =
    String(data?.status).toLowerCase() === "approved" || isApproved;

  const isRequestedMode = mode === "requested";
  const isInitiatedMode = mode === "initiated";
  const isReceivedMode = mode === "received";

  useEffect(() => {
    setDeliveryPartner(
      data?.shippingDetails?.shippingPartner || "Select a delivery partner",
    );
    setTrackingId(data?.shippingDetails?.trackingId || "");
    setTrackingLink(data?.shippingDetails?.trackingLink || "");
    setQualityCheck(data?.qualityCheckStatus || "");
    setIsApproved(
      ["approved", "pickup scheduled"].includes(
        String(data?.status).toLowerCase(),
      ),
    );
  }, [data]);

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-semibold text-[#1C1C1C]">
            Return Details
          </h2>
          <span
            className={`px-3 py-0.5 rounded-md text-xs font-medium ${
              isPickupScheduled
                ? "bg-[#D5E5F5] text-[#1C3753]"
                : isApproved
                  ? "bg-[#E6FFED] text-[#027A48]"
                  : "bg-[#D5E5F5] text-[#1C3753]"
            }`}
          >
            {isPickupScheduled
              ? "Pickup Scheduled"
              : isApproved
                ? "Approved"
                : "New Return"}
          </span>
        </div>

        <button
          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
          onClick={setSelectedOrderId}
          type="button"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="flex gap-6 pt-4">
        {/* LEFT SIDE */}
        <div className="flex-1 min-w-0">
          {/* Return ID + Date */}
          <div className="mb-4">
            <div className="text-sm font-medium text-[#1C1C1C]">
              Return ID #{data?.returnId || "--"}
            </div>
            <div className="text-xs text-[#686868] mt-1">
              {data?.requestedAt
                ? `${new Date(data.requestedAt).toLocaleDateString()}  •  ${new Date(
                    data.requestedAt,
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "--"}
            </div>
          </div>

          {/* Product Card */}
          <div className="flex gap-3">
            <div className="w-[84px] h-[72px] rounded-md bg-[#EFEFEF] overflow-hidden shrink-0">
              <img
                src={item?.images?.[0] || "/no-image.png"}
                alt={item?.productName || "product"}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-[#1C1C1C] truncate">
                {item?.productName || "--"}
              </div>
              <div className="text-xs text-[#686868] mt-0.5">
                SKU ID #{item?.sku || "--"}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs border rounded text-[#495F75]">
                    {item?.color || "Red"}
                  </span>
                  <span className="px-2 py-0.5 text-xs border rounded text-[#495F75]">
                    {item?.size || "25x12"}
                  </span>
                </div>

                <span className="px-3 py-1 text-xs rounded-md bg-[#EFEFEF] text-[#686868]">
                  Quantity{" "}
                  <span className="text-[#1C1C1C] font-medium">
                    {item?.quantity ?? 1}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Return Reason */}
          <div className="mt-4 border rounded-lg p-3 bg-white">
            <div className="text-sm font-medium text-[#1C1C1C] mb-2">
              Return Reason
            </div>
            <div className="text-sm text-[#1C1C1C] border-l-2 border-[#686868] pl-2">
              {data?.returnReason || "--"}
            </div>
          </div>

          {/* Return Proof */}
          <div className="mt-4">
            <div className="text-sm font-medium text-[#1C1C1C] mb-2">
              Return Proof
            </div>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {(data?.proofs || []).length === 0 ? (
                <>
                  {/* fallback demo thumbnails (same like screenshot) */}
                  {[1, 2, 3, 4].map((k) => (
                    <div
                      key={k}
                      className="min-w-[110px] h-[78px] rounded-lg bg-[#EFEFEF] overflow-hidden"
                    >
                      <img
                        src={item?.images?.[0] || "/no-image.png"}
                        alt="proof"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </>
              ) : (
                data.proofs.map((p, idx) => (
                  <div
                    key={idx}
                    className="min-w-[110px] h-[78px] rounded-lg bg-[#EFEFEF] overflow-hidden"
                  >
                    <img
                      src={p}
                      alt={`proof-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              )}
            </div>

            <div className="mt-2 h-1 w-28 bg-gray-200 rounded-full" />
          </div>

          {/* Delivery Partner */}
          {/* <div className="mt-4 border rounded-lg p-3 bg-white">
            <div className="text-sm font-medium text-[#1C1C1C] mb-2">
              Delivery Partner
            </div>

            <select
              value={deliveryPartner}
              onChange={(e) => setDeliveryPartner(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm outline-none bg-white"
            >
              {deliveryPartners.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div> */}

          {!isPickupScheduled ? (
            <>
              {/* Delivery Partner */}
              <div className="mt-4 border rounded-lg p-3 bg-white">
                <div className="text-sm font-medium text-[#1C1C1C] mb-2">
                  Delivery Partner
                </div>

                <select
                  value={deliveryPartner}
                  onChange={(e) => setDeliveryPartner(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm outline-none bg-white"
                  disabled={isApproved}
                >
                  {deliveryPartners.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tracking fields only after approve */}
              {showTrackingFields && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="text-xs text-[#686868]">
                      Tracking ID
                    </label>
                    <input
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="Enter tracking ID"
                      className="w-full mt-1 border rounded-md px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#686868]">
                      Tracking Link
                    </label>
                    <input
                      value={trackingLink}
                      onChange={(e) => setTrackingLink(e.target.value)}
                      placeholder="Enter tracking link"
                      className="w-full mt-1 border rounded-md px-3 py-2 text-sm outline-none"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mt-4 border rounded-lg p-3 bg-white">
              <div className="text-sm font-medium text-[#1C1C1C] mb-3">
                Delivery Summary
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#686868]">Shipping Partner</span>
                  <span className="text-[#1C1C1C] font-medium">
                    {data?.shippingDetails?.shippingPartner || "--"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#686868]">Tracking ID</span>
                  <span className="text-[#1C1C1C] font-medium">
                    {data?.shippingDetails?.trackingId || "--"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#686868]">Tracking URL</span>
                  <a
                    href={data?.shippingDetails?.trackingLink || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2C87E2] underline truncate max-w-[180px]"
                  >
                    {data?.shippingDetails?.trackingLink || "--"}
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#686868]">Expected Return Date</span>
                  <span className="text-[#1C1C1C] font-medium">
                    {data?.shippingDetails?.expectedDeliveryDate || "--"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-[360px] shrink-0 border-l pl-6">
          {/* Order Details */}
          <div className="pb-4 border-b">
            <div className="text-sm font-medium text-[#1C1C1C] mb-3">
              Order Details
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-[#686868]">Order ID</div>
              <div className="text-[#1C1C1C] font-medium text-right">
                {orderDetails?.orderId ? `#${orderDetails.orderId}` : "--"}
              </div>

              <div className="text-[#686868]">Order Status</div>
              <div className="text-[#1C1C1C] font-medium text-right">
                {orderDetails?.orderStatus || "--"}
              </div>

              <div className="text-[#686868]">Payment Status</div>
              <div className="text-[#1C1C1C] font-medium text-right">
                {orderDetails?.paymentStatus || "--"}
              </div>

              <div className="text-[#686868]">Order Date</div>
              <div className="text-[#1C1C1C] font-medium text-right">
                {orderDetails?.orderDate || "--"}
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="py-4 border-b">
            <div className="text-sm font-medium text-[#1C1C1C] mb-3">
              Customer Details
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#EFEFEF] overflow-hidden">
                <img
                  src={
                    customerDetails?.avatar || "https://via.placeholder.com/64"
                  }
                  alt="customer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-medium text-[#1C1C1C] truncate">
                  {customerDetails?.name || "--"}
                </div>
                <div className="text-xs text-[#686868]">
                  {customerDetails?.customerId || "--"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-[#686868]">Phone Number</div>
              <div className="text-[#1C1C1C] font-medium text-right">
                {customerDetails?.phone || "--"}
              </div>

              <div className="text-[#686868]">Email</div>
              <div className="text-[#1C1C1C] font-medium text-right break-all">
                {customerDetails?.email || "--"}
              </div>

              <div className="text-[#686868]">Address</div>
              <div className="text-[#1C1C1C] font-medium text-right">
                {customerDetails?.address || "--"}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="pt-4">
            <div className="text-sm font-medium text-[#1C1C1C] mb-3">
              Payment Summary
            </div>

            <div className="border rounded-lg p-3 bg-white text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="text-[#686868]">Item Subtotal</span>
                <span className="text-[#1C1C1C] font-medium">
                  {fmt(itemSubtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-[#686868]">Platform Fee</span>
                <span className="text-[#1C1C1C] font-medium">
                  - {fmt(platformFee)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-[#686868]">Delivery Charges</span>
                <span className="text-[#1C1C1C] font-medium">
                  - {fmt(deliveryCharges)}
                </span>
              </div>

              <div className="border-t mt-2 pt-2 flex items-center justify-between">
                <span className="text-[#686868]">Total refundable amount</span>
                <span className="text-[#1C1C1C] font-semibold">
                  {fmt(refundable)}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#686868] mt-2">
              <span className="text-[#D53B35]">*</span> Refund will be processed
              to the original payment method.
            </div>
          </div>

          {isReceivedMode && (
            <div className="pt-4 border-t mt-4">
              <div className="text-sm font-medium text-[#1C1C1C] mb-3">
                Quality Check
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-[#1C1C1C] cursor-pointer">
                  <input
                    type="radio"
                    name="qualityCheck"
                    value="Pass"
                    checked={qualityCheck === "Pass"}
                    onChange={(e) => setQualityCheck(e.target.value)}
                  />
                  QC Approved
                </label>

                <label className="flex items-center gap-2 text-sm text-[#1C1C1C] cursor-pointer">
                  <input
                    type="radio"
                    name="qualityCheck"
                    value="Fail"
                    checked={qualityCheck === "Fail"}
                    onChange={(e) => setQualityCheck(e.target.value)}
                  />
                  QC Deny
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-3 pt-5">
        {/* <button
          type="button"
          onClick={() => setopenCancelModule(data?.returnId)}
          className="px-4 py-2 rounded-md border border-[#1C3753] text-[#1C3753] bg-white hover:bg-gray-50 text-sm font-medium"
        >
          Reject
        </button> */}

        <div className="flex items-center justify-end gap-3 pt-5">
          {isRequestedMode && !isApproved && !isPickupScheduled && (
            <button
              type="button"
              onClick={() => {
                if (deliveryPartner === "Select a delivery partner") {
                  alert("Please select a delivery partner");
                  return;
                }

                handleAcceptedOrders({
                  returnId: data?.returnId,
                  deliveryPartner,
                });

                setIsApproved(true);
              }}
              className="px-4 py-2 rounded-md bg-[#1C3753] text-white hover:opacity-95 text-sm font-medium"
            >
              Approve
            </button>
          )}

          {isInitiatedMode && !isPickupScheduled && (
            <button
              type="button"
              onClick={() => {
                if (!trackingId.trim()) {
                  alert("Please enter tracking ID");
                  return;
                }

                if (!trackingLink.trim()) {
                  alert("Please enter tracking link");
                  return;
                }

                handleMarkAsShipped({
                  returnId: data?.returnId,
                  deliveryPartner,
                  trackingId,
                  trackingLink,
                });

                setSelectedOrderId(null);
              }}
              className="px-4 py-2 rounded-md bg-[#1C3753] text-white hover:opacity-95 text-sm font-medium"
            >
              Mark as Shipped
            </button>
          )}

          {isReceivedMode && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (!qualityCheck) {
                    alert("Please select quality check status");
                    return;
                  }

                  handleSaveQualityCheck({
                    returnId: data?.returnId,
                    qualityCheckStatus: qualityCheck,
                  });
                }}
                className="px-4 py-2 rounded-md border border-[#1C3753] text-[#1C3753] bg-white hover:bg-gray-50 text-sm font-medium"
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!qualityCheck) {
                    alert("Please select quality check status");
                    return;
                  }

                  handleMarkAsReturned({
                    returnId: data?.returnId,
                    qualityCheckStatus: qualityCheck,
                  });

                  setSelectedOrderId(null);
                }}
                className="px-4 py-2 rounded-md bg-[#1C3753] text-white hover:opacity-95 text-sm font-medium"
              >
                Mark as Returned
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestedModule;
