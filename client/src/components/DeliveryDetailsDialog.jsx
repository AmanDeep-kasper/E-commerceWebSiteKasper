import { X } from "lucide-react";
import React from "react";

function DeliveryDetailsDialog({ onClose }) {
  return (
    <div className="w-[510px] h-max shadow-md mx-auto my-10 bg-white rounded-lg">
      <div className="flex justify-between p-4 shadow-md">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Enter Delivery Details</h1>
        <X className="cursor-pointer" size={20} onClick={onClose} />
      </div>
      <div className="mt-4 shadow-md p-4">
        <div className="flex justify-between border px-4 py-2 rounded-md">
          <input
            type="text"
            placeholder="Enter Pincode"
            className="outline-none "
          />
          <button className="bg-[#EBB100] text-white px-4 py-1 rounded-md">
            Submit
          </button>
        </div>
      </div>
      <p className="text-center my-6">OR</p>
      <div className="flex shadow-md p-4 border">
        <button className="flex-1 py-2 text-[#EBB100] border border-[#EBB100] rounded-md">
          Add New Address
        </button>
      </div>
    </div>
  );
}

export default DeliveryDetailsDialog;
