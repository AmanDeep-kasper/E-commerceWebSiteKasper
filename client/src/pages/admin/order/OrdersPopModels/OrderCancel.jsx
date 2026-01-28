import { TriangleAlert } from "lucide-react";
import React from "react";

const OrderCancel = ({ close, order, cancelReason, setCancelReason }) => {
  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white w-[500px] max-w-[90vw] p-6 rounded-xl">
          <div>
            <div className="flex items-center gap-2 font-medium mb-4">
              <span>
                {" "}
                <TriangleAlert size={17} className="text-[#D53B35]" />
              </span>
              <span className="text-[18px]">Cancel Order</span>
            </div>
            <div className="flex items-center gap-10 border p-2 rounded-lg mb-2">
              <div className="flex flex-col">
                <span className="text-sm text-[#686868]">Order ID</span>
                <span>{order.orderId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#686868]">Order Value</span>
                <span>₹{order.orderValue ?? "N/A"}</span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm mb-1">
                Cancellation Reason <span className="text-[#D53B35]">*</span>
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter the reason for cancellation (e.g., Out of Stock, Customer request, Payment failed)"
                className="h-[90px] border w-full bg-[#F8FBFC] rounded-xl p-3 placeholder:text-[#686868] placeholder:text-sm"
              />
            </div>
            <div className="flex items-center justify-end gap-4 mt-4">
              <button
                onClick={close}
                className="px-3 py-1 border border-[#686868] text-sm text-[#686868] rounded-lg">
                Keep Order
              </button>
              <button
                onClick={close}
                disabled={!cancelReason.trim()}
                className="px-3 py-1 border border-[#686868] text-sm rounded-lg bg-[#1C3753] text-white">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCancel;
