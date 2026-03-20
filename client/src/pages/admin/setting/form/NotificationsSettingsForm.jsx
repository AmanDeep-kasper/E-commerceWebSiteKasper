import React, { useState } from "react";
import { Link } from "react-router";

const NotificationSettingsForm = () => {
  const [weightCharges, setWeightCharges] = useState([
    { range: "0-1 kg", price: "₹20" },
    { range: "1-5 kg", price: "₹30" },
    { range: "5-10 kg", price: "₹50" },
    { range: "", price: "" },
  ]);

  const [distanceCharges, setDistanceCharges] = useState([
    { range: "Delhi/NCR", price: "₹20" },
    { range: "North", price: "₹30" },
    { range: "Metro", price: "₹40" },
    { range: "Rural", price: "₹60" },
    { range: "North East", price: "₹80" },
    { range: "", price: "" },
  ]);

  const [typeCharges, setTypeCharges] = useState([
    { type: "Standard", price: "₹20" },
    { type: "Fast delivery", price: "₹30" },
    { type: "", price: "" },
  ]);

  const handleWeightChange = (index, field, value) => {
    const updated = [...weightCharges];
    updated[index][field] = value;
    setWeightCharges(updated);
  };

  const handleDistanceChange = (index, field, value) => {
    const updated = [...distanceCharges];
    updated[index][field] = value;
    setDistanceCharges(updated);
  };

  const handleTypeChange = (index, field, value) => {
    const updated = [...typeCharges];
    updated[index][field] = value;
    setTypeCharges(updated);
  };

  const inputClass =
    "w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[13px] text-[#222222] outline-none focus:border-[#2563EB] bg-white";

  return (
    <div className="w-full bg-[#F8FAFC] p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[#222222] leading-none">
            Shipping
          </h1>
          <p className="text-[13px] text-[#7B7B7B] mt-1">
            Controls how orders are shipped and delivered
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={"/admin/settings/notification"}>
          <button className="border border-[#1F3B5B] text-[#1F3B5B] bg-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
            Cancel
          </button>
          </Link>
          <button className="bg-[#1F3B5B] text-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#D9E2EC] rounded-[8px] p-4">
        <h2 className="text-[16px] font-medium text-[#222222] mb-4">
          Shipping Charges
        </h2>

        {/* Weight Based */}
        <div className="mb-6">
          <h3 className="text-[14px] font-medium text-[#222222]">
            Weight Based
          </h3>
          <p className="text-[11px] text-[#8A8A8A] mb-4">
            Different weight range for calculating shipping cost.
          </p>

          <div className="space-y-3">
            {weightCharges.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={item.range}
                  placeholder="Enter weight slab (kg)"
                  onChange={(e) =>
                    handleWeightChange(index, "range", e.target.value)
                  }
                  className={inputClass}
                />
                <input
                  type="text"
                  value={item.price}
                  placeholder="Enter shipping charge (₹)"
                  onChange={(e) =>
                    handleWeightChange(index, "price", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Distance Based */}
        <div className="mb-6">
          <h3 className="text-[14px] font-medium text-[#222222]">
            Distance Based
          </h3>
          <p className="text-[11px] text-[#8A8A8A] mb-4">
            Different distance range for calculating shipping cost.
          </p>

          <div className="space-y-3">
            {distanceCharges.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={item.range}
                  placeholder="Enter distance slab (km)"
                  onChange={(e) =>
                    handleDistanceChange(index, "range", e.target.value)
                  }
                  className={inputClass}
                />
                <input
                  type="text"
                  value={item.price}
                  placeholder="Enter shipping charge (₹)"
                  onChange={(e) =>
                    handleDistanceChange(index, "price", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Type Based */}
        <div>
          <h3 className="text-[14px] font-medium text-[#222222]">Type based</h3>
          <p className="text-[11px] text-[#8A8A8A] mb-4">
            Different delivery types for calculating shipping cost.
          </p>

          <div className="space-y-3">
            {typeCharges.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={item.type}
                  placeholder="Enter delivery type"
                  onChange={(e) =>
                    handleTypeChange(index, "type", e.target.value)
                  }
                  className={inputClass}
                />
                <input
                  type="text"
                  value={item.price}
                  placeholder="Enter shipping charge (₹)"
                  onChange={(e) =>
                    handleTypeChange(index, "price", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsForm;