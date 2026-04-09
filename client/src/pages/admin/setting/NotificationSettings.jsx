import React from "react";
import { Link } from "react-router-dom";

const GeneralSettings = () => {
  const weightCharges = [
    { range: "0-1 kg", price: "₹20" },
    { range: "1-5 kg", price: "₹30" },
    { range: "5-10 kg", price: "₹40" },
    { range: ">10 kg", price: "₹60" },
  ];

  const distanceCharges = [
    { range: "Delhi/NCR", price: "₹20" },
    { range: "North", price: "₹30" },
    { range: "Metro", price: "₹40" },
    { range: "Rural", price: "₹60" },
    { range: "North East", price: "₹80" },
  ];

  const deliveryCharges = [
    { type: "Standard", price: "₹20" },
    { type: "Fast", price: "₹30" },
  ];

  return (
    <div className="w-full bg-[#F4F6F8] p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[30px] font-semibold text-[#222222] leading-none">
            Shipping
          </h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">
            Controls how orders are shipped and delivered
          </p>
        </div>

        <Link to={"/admin/settings/notification-form"}>
          {" "}
          <button className="bg-[#1E3A5F] text-white text-[13px] font-medium px-4 py-2 rounded-[6px]">
            Edit
          </button>
        </Link>
      </div>

      {/* Section Title */}
      <h2 className="text-[18px] font-medium text-[#222222] mb-3">
        Shipping Charges
      </h2>

      {/* Table Card */}
      <div className="bg-white rounded-[14px] p-3 shadow-sm ">
        <div className="overflow-x-auto ">
          <table className="border-collapse text-center w-full ">
            <thead>
              <tr className="bg-[#DCE8F3]">
                <th
                  colSpan={2}
                  className="border border-[#4B5563] px-6 py-3 text-[14px] font-medium text-[#222222]"
                >
                  Weight
                </th>
                <th
                  colSpan={2}
                  className="border border-[#4B5563] px-6 py-3 text-[14px] font-medium text-[#222222]"
                >
                 Zone Based
                </th>
                <th
                  colSpan={2}
                  className="border border-[#4B5563] px-6 py-3 text-[14px] font-medium text-[#222222]"
                >
                  Type of Delivery
                </th>
              </tr>

              <tr className="bg-[#F8FAFC]">
                <th className="border border-[#A3A3A3] px-8 py-2 text-[14px] font-medium text-[#333333]">
                  Range
                </th>
                <th className="border border-[#A3A3A3] px-8 py-2 text-[14px] font-medium text-[#333333]">
                  Price
                </th>

                <th className="border border-[#4B5563] px-8 py-2 text-[14px] font-medium text-[#333333]">
                  Zone
                </th>
                <th className="border border-[#4B5563] px-8 py-2 text-[14px] font-medium text-[#333333]">
                  Price
                </th>

                <th className="border border-[#A3A3A3] px-8 py-2 text-[14px] font-medium text-[#333333]">
                  Type
                </th>
                <th className="border border-[#A3A3A3] px-8 py-2 text-[14px] font-medium text-[#333333]">
                  Price
                </th>
              </tr>
            </thead>

            <tbody>
              {Array.from({
                length: Math.max(
                  weightCharges.length,
                  distanceCharges.length,
                  deliveryCharges.length,
                ),
              }).map((_, index) => (
                <tr key={index}>
                  {/* Weight */}
                  <td className="border border-[#A3A3A3] px-8 py-3 text-[14px] text-[#333333]">
                    {weightCharges[index]?.range || ""}
                  </td>
                  <td className="border border-[#A3A3A3] px-8 py-3 text-[14px] text-[#333333]">
                    {weightCharges[index]?.price || ""}
                  </td>

                  {/* Distance */}
                  <td className="border border-[#4B5563] px-8 py-3 text-[14px] text-[#333333]">
                    {distanceCharges[index]?.range || ""}
                  </td>
                  <td className="border border-[#4B5563] px-8 py-3 text-[14px] text-[#333333]">
                    {distanceCharges[index]?.price || ""}
                  </td>

                  {/* Type of Delivery */}
                  <td className="border border-[#A3A3A3] px-8 py-3 text-[14px] text-[#333333]">
                    {deliveryCharges[index]?.type || ""}
                  </td>
                  <td className="border border-[#A3A3A3] px-8 py-3 text-[14px] text-[#333333]">
                    {deliveryCharges[index]?.price || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
