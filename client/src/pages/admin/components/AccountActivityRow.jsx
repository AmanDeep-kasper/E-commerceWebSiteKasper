import React from "react";

const AccountActivityRow = ({ lable, value, isBadge }) => {
  return (
    <div className="flex items-center justify-between text-sm border-b py-1.5 space-y-3">
      <span className="text-gray-500">{lable}</span>

      {isBadge ? (
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#F3F4F6] text-[#1C1C1C]">
          {value}
        </span>
      ) : (
        <span className="font-medium text-gray-900">{value}</span>
      )}
    </div>
  );
};

export default AccountActivityRow;
