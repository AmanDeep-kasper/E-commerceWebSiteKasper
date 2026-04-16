import React from "react";
import { Link } from "react-router-dom";


const shipingData = [
  {
    Title: "Within City (ZONE A)",
    des: "Applies when warehouse and delivery are in the same city",
    amount: "25"
  },
  {
    Title: "Within City (ZONE B)",
    des: "Applies when the delivery is in the same state but different cities",
    amount: "40",
  },
  {
    Title: "Within City (ZONE C)",
    des: "Applies when the delivery cities are metro cities",
    amount: "60"
  },
  {
    Title: "Within City (ZONE D)",
    des: "Applies to all other delivery locations not covered",
    amount: "80"
  },
  {
    Title: "Within City (ZONE E)",
    des: "Applies to North-East states, Jammu & Kashmir and special regions",
    amount: "120"
  }
];

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

  const metroCitiesZones = [
    {
      state: "Delhi",
    },
    {
      state: "Mumbai",
    },
    {
      state: "Bengaluru",
    },
    {
      state: "Chennai",
    },
    {
      state: "Kolkata",
    },
    {
      state: "Hydrabad",
    },
    {
      state: "Pune",
    },
    {
      state: "Ahemadabad",
    }
  ]

  const specialRegionsZones = [
    {
      state: "Assam"
    },
    {
      state: "Andaman & nicobar"
    },
    {
      state: "Mizoram"
    },
    {
      state: " Meghalaya"
    },
    {
      state: "Nagaland"
    },
    {
      state: "Jammmu & Kashmir"
    },
    {
      state: "Ladakh"
    },
    {
      state: "Arunachal Pradesh"
    },
  ]

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
          <button className="bg-[#1800AC] text-white text-[13px] font-medium px-4 py-2 rounded-[6px]">
            Edit
          </button>
        </Link>
      </div>

      {/* Section Title */}
      <h2 className="text-[18px] font-medium text-[#222222] mb-3">
        Shipping Charges
      </h2>

      {/* Table Card */}
      {/* <div className="bg-white rounded-[14px] p-3 shadow-sm ">
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
                   
                  <td className="border border-[#A3A3A3] px-8 py-3 text-[14px] text-[#333333]">
                    {weightCharges[index]?.range || ""}
                  </td>
                  <td className="border border-[#A3A3A3] px-8 py-3 text-[14px] text-[#333333]">
                    {weightCharges[index]?.price || ""}
                  </td>

                  
                  <td className="border border-[#4B5563] px-8 py-3 text-[14px] text-[#333333]">
                    {distanceCharges[index]?.range || ""}
                  </td>
                  <td className="border border-[#4B5563] px-8 py-3 text-[14px] text-[#333333]">
                    {distanceCharges[index]?.price || ""}
                  </td>

                  
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
      </div> */}
      <div className="mt-4 rounded-lg p-4 bg-white ">
        <div className="flex flex-col">
          <span className="text-[16px] text-[#1C1C1C] font-regular">Zone Based</span>
          <span className="text-[12px] text-[#686868] font-regular">Different Zones Based</span>
        </div>
        {shipingData.map((item) => (
          <div key={item.Title} className="flex justify-between items-center mt-3 border-b border-[#DEDEDE] px-2 py-2">
            <div className="flex flex-col gap-1">
              <span className="text-[#1C1C1C] text-[16px] font-regular">{item.Title}</span>
              <span className="text-[12px] text-[#686868] font-regular">{item.des}</span>
            </div>
            <div>
              <span className="font-medium text-[#1C1C1C] text-[18px]">₹ {item.amount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* <==================-------------- Zone Configration -----------------=================> */}
      <div className="mt-5">
        <span className="text-[16px] text-[#1C1C1C] text-medium">Zone Configuration</span>
        <div className="bg-white p-4 rounded-lg mt-3">
          <span className="text-[16px] text-[#1C1C1C] text-medium">Metro Cities</span>

          <div className="mt-4 flex flex-wrap gap-2">
            {metroCitiesZones.map((item) => (
              <span
                key={item}
                className="rounded-full bg-[#F0EEFF] px-4 py-2"
              >
                {item.state}
              </span>
            ))}
          </div>


          <div className="mt-4">
            <span className="text-[16px] text-[#1C1C1C] text-medium">Special Regions</span>
            <div className="mt-4 flex flex-wrap gap-2">
              {specialRegionsZones.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#F0EEFF] px-4 py-2"
                >
                  {item.state}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <span className="text-[16px] text-[#1C1C1C] text-medium">Other Details</span>
        </div>
        <div className="bg-white p-4 rounded-lg mt-3">
          <div className="flex justify-between items-center border-b border-[#DEDEDE] py-3 px-2">
            <div className="flex flex-col">
              <span className="text-[#1C1C1C] text-[16px] font-regular">Free Delivery Above</span>
              <span className="text-[#686868] text-[12px] font-regular">If the total cart value is above  ₹1,999</span>
            </div>
            <div>
              <span className="text-[#1C1C1C] text-[18px] font-medium">₹1,999</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 px-2">
            <div className="flex flex-col">
              <span className="text-[#1C1C1C] text-[16px] font-regular">Platform Fee</span>
              <span className="text-[#686868] text-[12px] font-regular">A samll Fee Charged by the Platform</span>
            </div>
            <div>
              <span className="text-[#1C1C1C] text-[18px] font-medium">₹ 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
