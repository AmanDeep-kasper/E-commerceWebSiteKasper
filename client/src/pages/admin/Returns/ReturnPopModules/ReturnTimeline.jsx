import React, { useMemo, useState } from "react";
import { X } from "lucide-react";

const ReturnTimeline = ({
  data,
  setSelectedOrderId,
  setopenCancelModule,
  handleAcceptedOrders,
}) => {
  // ✅ ONLY RETURN: If accidentally Exchange comes, don't render
  if (String(data?.type).toLowerCase() === "exchange") return null;

  const item = data?.item || {};
  const orderDetails = data?.orderDetails || {};
  const customerDetails = data?.customerDetails || {};

  // Delivery Partner dropdown (UI only, you can connect later)
  const deliveryPartners = useMemo(
    () => ["Select a delivery partner", "Blue Dart", "Delhivery", "DTDC", "Ecom Express"],
    []
  );

  const [deliveryPartner, setDeliveryPartner] = useState(deliveryPartners[0]);

  // Payment summary (same style as screenshot)
  const itemSubtotal = Number(orderDetails?.totalAmount || item?.price || 0);
  const platformFee = Number(orderDetails?.platformFee || 0); // optional
  const deliveryCharges = Number(orderDetails?.deliveryCharges || 0); // optional
  const refundable = Math.max(0, itemSubtotal - platformFee - deliveryCharges);

  const fmt = (n) =>
    `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-semibold text-[#1C1C1C]">
            Return Details
          </h2>
          <span className="px-3 py-0.5 rounded-md text-xs font-medium bg-[#D5E5F5] text-[#1C3753]">
            New Return
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
                    data.requestedAt
                  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
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
          <div className="mt-4 border rounded-lg p-3 bg-white">
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

            {/* NOTE: Currently deliveryPartner is only UI.
                When you connect backend, pass it in approve handler. */}
          </div>
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
                  src={customerDetails?.avatar || "https://via.placeholder.com/64"}
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
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-3 pt-5">
        <button
          type="button"
          onClick={() => setopenCancelModule(data?.returnId)}
          className="px-4 py-2 rounded-md border border-[#1C3753] text-[#1C3753] bg-white hover:bg-gray-50 text-sm font-medium"
        >
          Reject
        </button>

        <button
          type="button"
          onClick={() => {
            // ✅ your same logic call (no changes required in parent)
            handleAcceptedOrders(data?.returnId);
            setSelectedOrderId(null);
          }}
          className="px-4 py-2 rounded-md bg-[#1C3753] text-white hover:opacity-95 text-sm font-medium"
        >
          Approve
        </button>
      </div>
    </div>
  );
};

export default ReturnTimeline;