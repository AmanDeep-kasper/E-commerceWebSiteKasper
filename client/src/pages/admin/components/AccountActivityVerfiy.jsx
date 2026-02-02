import { AlertCircle, CheckCircle } from "lucide-react";
import React from "react";

const AccountActivityVerfiy = ({ label, verified }) => {
  return (
    <div className="flex items-center justify-between text-sm py-2 space-y-3 border-gray-200">
      <span className="text-[#686868]">{label}</span>

      {verified ? (
        <CheckCircle size={16} className="text-green-500" />
      ) : (
        <AlertCircle size={16} className="text-red-500" />
      )}
    </div>
  );
};

export default AccountActivityVerfiy;
