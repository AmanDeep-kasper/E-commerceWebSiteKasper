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
  // Don't render if closed or no data
  if (!open || !data) return null;

  // Close on ESC
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setSelectedOrderId();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [setSelectedOrderId]);

  // Disable background scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, []);

  // Safe items - use your actual schema fields
  const items = Array.isArray(data?.items) ? data.items : [];

  // Calculate subtotal from actual items using sellingPrice
  const itemSubtotal = items.reduce(
    (total, item) =>
      total + (Number(item?.sellingPrice) || 0) * (Number(item?.quantity) || 1),
    0,
  );

  // Get values from real data
  const discount = Number(data?.discount ?? data?.discountAmount ?? 0);
  const shippingCost = Number(data?.shippingCharge ?? data?.shipping ?? data?.deliveryCharge ?? 0);
  const totalAmount = data?.grandTotal || itemSubtotal;

  const orderId = data?.orderNumber || data?.orderId || data?.order_id || "N/A";
  const orderStatus = data?.status || data?.orderStatus || data?.delivery_status || "pending";
  const createdAt = data?.createdAt || data?.orderDate;
  const paymentMethod = data?.paymentMethod || data?.paymentType || data?.payment_status || "N/A";

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status styling based on real status
  const getStatusStyle = (status) => {
    const statusMap = {
      placed: "bg-[#FFF9E0] text-[#F8A14A]",
      processing: "bg-[#E6D3FF] text-[#8A38F5]",
      ready_to_ship: "bg-[#FBDBF7] text-[#E91DD1]",
      shipped: "bg-[#C7FCFF] text-[#008D94]",
      delivered: "bg-[#E0F4DE] text-[#00A63E]",
      cancelled: "bg-[#EFEFEF] text-[#686868]",
      refunded: "bg-[#FFE0E0] text-[#D53B35]",
    };
    return statusMap[status?.toLowerCase()] || "bg-gray-100 text-gray-600";
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      placed: "Placed",
      processing: "Processing",
      ready_to_ship: "Ready to Ship",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      refunded: "Refunded",
    };
    return statusMap[status?.toLowerCase()] || status || "Pending";
  };

  const [selectedPartner, setSelectedPartner] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  // Prefill when modal opens / data changes
  useEffect(() => {
    setSelectedPartner(data?.deliveryPartner || "");
    setTrackingId(data?.trackingId || "");
    setTrackingUrl(data?.trackingUrl || "");
  }, [data]);

  const isPending = orderStatus?.toLowerCase() === "placed";
  const isProcessing = orderStatus?.toLowerCase() === "processing";
  const isShipped = orderStatus?.toLowerCase() === "shipped";

  const canAccept = isPending && !!selectedPartner;

  // Stop closing when clicking inside modal
  const stop = (e) => e.stopPropagation();

  return (
 <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3 py-6"
      onClick={setSelectedOrderId}
    >
      <div
        className="bg-white w-full max-w-[500px] rounded-2xl shadow-lg border p-4 overflow-y-auto max-h-[90vh]"
        onClick={stop}
      >
        <div className="bg-[#FFFFFF] w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 w-full flex-nowrap">
            <span className="text-[18px] font-semibold">Order Details</span>
            <button
              className="border-[1px] border-gray-300 rounded-full p-1 shrink-0 hover:bg-gray-100"
              onClick={setSelectedOrderId}
            >
              <X size={18} />
            </button>
          </div>

          {/* Order ID */}
          <div className="flex items-start border-b-[0.5px] w-full pb-2">
            <div className="flex mb-3 w-full justify-between flex-nowrap md:gap-4">
              <div className="min-w-0">
                <span className="text-sm font-medium">
                  Order ID #{orderId}
                </span>
                <div className="text-[#686868] text-sm flex items-start gap-1">
                  <span>{formatDate(createdAt)}</span>
                  <i className="text-[#DEDEDE]">●</i>
                  <span>{formatTime(createdAt)}</span>
                </div>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 ${getStatusStyle(orderStatus)}`}
                >
                  {getStatusDisplay(orderStatus)}
                </span>
              </div>
            </div>
          </div>


                   {/* Order Summary */}
          <div className="mt-2">
            <p className="text-sm mt-3 mb-2 font-medium">Order Summary</p>
            <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between w-full flex-nowrap">
                  <div className="flex items-center gap-1 min-w-0">
                    <Box size={15} />
                    <span>Total Items</span>
                  </div>
                  <div className="text-black font-medium shrink-0">
                    {items.length || data?.quantity || 0}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full flex-nowrap">
                  <div className="flex items-center gap-1 min-w-0">
                    <WalletCards size={15} />
                    <span>Payment Method</span>
                  </div>
                  <div className="text-black font-medium shrink-0">
                    {paymentMethod !== "N/A" ? paymentMethod : "--"}
                  </div>
                </div>

                {/* Add Payment Status */}
                <div className="flex items-center justify-between w-full flex-nowrap">
                  <div className="flex items-center gap-1 min-w-0">
                    <span>Payment Status</span>
                  </div>
                  <div className="text-black font-medium shrink-0">
                    <span className={`capitalize ${
                      data?.paymentStatus === 'paid' ? 'text-green-600' : 
                      data?.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {data?.paymentStatus || "pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
                   <div className="mt-2">
            <span className="text-sm mt-3 mb-3 font-medium">Items ({items.length})</span>
            <div className="w-full flex flex-col gap-3 p-3 text-sm text-gray-600 border rounded-md max-h-[300px] overflow-y-auto">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No items found</div>
              ) : (
                items.map((item, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between w-full flex-nowrap gap-3">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <img
                          width={42}
                          height={42}
                          className="rounded-md shrink-0 object-cover"
                          src={item?.image?.url || "https://via.placeholder.com/42"}
                          alt={item?.productTitle || "Product"}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/42";
                          }}
                        />
                        <div className="flex flex-col text-[14px] space-y-1 min-w-0 flex-1">
                          <span className="font-medium truncate">
                            {item?.productTitle || "Product Name"}
                          </span>
                          {(item?.variantName || item?.variantColor) && (
                            <div className="flex gap-2 text-[11px] flex-wrap">
                              {item?.variantName && (
                                <span className="px-2 py-0.5 bg-[#EFEFEF] text-[#686868] rounded-lg">
                                  Size: {item.variantName}
                                </span>
                              )}
                              {item?.variantColor && (
                                <span className="px-2 py-0.5 bg-[#EFEFEF] text-[#686868] rounded-lg">
                                  Color: {item.variantColor}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end text-[12px] space-y-1 shrink-0">
                        {item?.variantSkuId && (
                          <span className="text-gray-400 text-[10px]">SKU: {item.variantSkuId}</span>
                        )}
                        <div className="text-sm p-1 bg-[#EFEFEF] text-[#686868] rounded-lg font-medium whitespace-nowrap">
                          Qty: {item?.quantity || 1} × ₹{(item?.sellingPrice || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="text-sm font-medium whitespace-nowrap">
                          ₹{((item?.sellingPrice || 0) * (item?.quantity || 1)).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment */}
         <div className="mt-2">
            <p className="text-sm mt-3 mb-2 font-medium">Payment Details</p>
            <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
              <div className="space-y-2">
                <div className="flex items-center justify-between w-full flex-nowrap">
                  <span>Item Subtotal</span>
                  <span className="text-black font-medium shrink-0">
                    ₹{itemSubtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between w-full flex-nowrap">
                    <span>Discount</span>
                    <span className="text-green-600 font-medium shrink-0">
                      -₹{discount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {shippingCost > 0 && (
                  <div className="flex items-center justify-between w-full flex-nowrap">
                    <span>Shipping Cost</span>
                    <span className="text-black font-medium shrink-0">
                      ₹{shippingCost.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-2 w-full flex-nowrap">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-black font-bold shrink-0">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mt-4">
            {isPending && (
              <>
                <button
                  type="button"
                  disabled={!canAccept}
                  onClick={() =>
                    onAcceptOrder({ orderId, deliveryPartner: selectedPartner })
                  }
                  className={`px-6 py-1.5 rounded-md text-white ${
                    canAccept ? "bg-[#1C3753] hover:bg-[#2a4a6e]" : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Accept Order
                </button>

                <button
                  type="button"
                  onClick={() => setopenCancelModule(orderId)}
                  className="px-6 py-1.5 rounded-md text-[#1C3753] bg-white border border-[#1C3753] hover:bg-gray-50"
                >
                  Reject Order
                </button>
              </>
            )}

             {isProcessing && (
              <span className="px-6 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-600">
                Order Accepted
              </span>
            )}

            {isShipped && (
              <span className="px-6 py-1.5 rounded-md text-sm font-medium bg-[#D5E5F5] text-[#1C3753]">
                Order Shipped
              </span>
            )}
            
            {orderStatus?.toLowerCase() === "delivered" && (
              <span className="px-6 py-1.5 rounded-md text-sm font-medium bg-[#E0F4DE] text-[#00A63E]">
                Order Delivered
              </span>
            )}
            
            {orderStatus?.toLowerCase() === "cancelled" && (
              <span className="px-6 py-1.5 rounded-md text-sm font-medium bg-[#EFEFEF] text-[#686868]">
                Order Cancelled
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderViewModal;
