import { TriangleAlert } from "lucide-react";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReturnRejectedModule = ({
  close,
  order,
  cancelReason,
  setCancelReason,
  onConfirmCancel,
}) => {
  // console.log(order)
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
              <span className="text-[18px]">Reject Return Request</span>
            </div>
            <div className="flex items-center gap-10 border p-2 rounded-lg mb-2">
              {/* <div className="flex flex-col">
                <span className="text-sm text-[#686868]">Order ID</span>
                <span>{order.orderId}</span>
              </div> */}
              <div className="flex flex-col text-sm space-y-2">
                <span className=" font-medium">Return Reason</span>
                <span className="text-[#1C1C1C] border-l-2 border-[#686868] pl-2">
                  {order.returnReason}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm mb-1">
                Rejection Reason <span className="text-[#D53B35]">*</span>
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter the reason for cancellation (e.g., Product used, Doesn’t match return policy)"
                className="h-[90px] border w-full bg-[#F8FBFC] rounded-xl p-3 placeholder:text-[#686868] placeholder:text-sm"
              />
            </div>
            <div className="flex items-center justify-end gap-4 mt-4">
              <button
                onClick={close}
                className="px-3 py-1 border border-[#686868] text-sm text-[#686868] rounded-lg">
                Cancel
              </button>

              <button
                onClick={() => {
                  onConfirmCancel();
                  setTimeout(close, 50);
                }}
                disabled={!cancelReason.trim()}
                className="px-3 py-1 border border-[#686868] text-sm rounded-lg bg-[#1C3753] text-white">
               Reject Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRejectedModule;
