import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAdd } from "react-icons/md";



const NotificationSettingsForm = () => {

  const [addZones, setAddZones] = useState(false);
  const [addSpecialZones, setAddSpecialZones] = useState(false);
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


  const editShipingData = [
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


  const metroCitiesZonesEdit = [
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

  const specialRegionsZonesEdit = [
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
            <button className="border border-[#1800AC] text-[#1800AC] bg-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
              Cancel
            </button>
          </Link>
          <button className="bg-[#1800AC] text-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
            Save Changes
          </button>
        </div>
      </div>


      {/* <div className="bg-white border border-[#D9E2EC] rounded-[8px] p-4">
        <h2 className="text-[16px] font-medium text-[#222222] mb-4">
          Shipping Charges
        </h2> 

        Weight Based 
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

        Distance Based 
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

        Type Based 
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

        

      </div> */}
      <div className="mb-4">
      <span className="text-[#1C1C1C] text-[16px] font-medium mb-4">Shipping Charges</span>
      </div>
      <div className=" bg-white p-4 rounded-lg">
        <div className="mt-4 rounded-lg p-2 bg-white ">
          <div className="flex flex-col">
            <span className="text-[16px] text-[#1C1C1C] font-regular">Zone Based</span>
            <span className="text-[12px] text-[#686868] font-regular">Different Zones Based</span>
          </div>
          {editShipingData.map((item) => (
            <div key={item.Title} className="flex justify-between items-center mt-3 border-b border-[#DEDEDE] px-2 py-2">
              <div className="flex flex-col gap-1">
                <span className="text-[#1C1C1C] text-[16px] font-regular">{item.Title}</span>
                <span className="text-[12px] text-[#686868] font-regular">{item.des}</span>
              </div>
              <div className="p-2 bg-[#F8FBFC] border border-[#DEDEDE] rounded-lg flex items-center gap-2">
                <span className="text-[#1C1C1C] text-[16px] font-regular">₹</span>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="bg-transparent outline-none text-[#1C1C1C] text-[16px] font-regular w-24"
                />
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* <==================-------------- Zone Configration -----------------=================> */}
      <div className="mt-5">
        <span className="text-[#1C1C1C] text-[16px] font-medium">Zone Configuration</span>
        <div className="bg-white p-4 rounded-lg mt-3">
          <div className="flex justify-between items-center">
            <span className="text-[16px] text-[#1C1C1C] text-medium">Metro Cities</span>
            <button className="flex items-center px-4 py-2 bg-[#1800AC] text-white rounded-lg"
              onClick={() => setAddZones(true)}
            >
              <MdOutlineAdd size={20} />
              Add Metro Zones
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {metroCitiesZonesEdit.map((item) => (
              <span
                key={item}
                className="rounded-full bg-[#F0EEFF] px-4 py-2"
              >
                {item.state}
              </span>
            ))}
          </div>


          <div className="mt-4">
            <div className="flex justify-between items-center">
              <span className="text-[16px] text-[#1C1C1C] text-medium">Special Regions</span>
              <button className="flex items-center px-4 py-2 bg-[#1800AC] text-white rounded-lg"
                onClick={() => setAddSpecialZones(true)}
              >
                <MdOutlineAdd size={20} />
                Add Special Zones
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {specialRegionsZonesEdit.map((item) => (
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
            <div className="p-2 bg-[#F8FBFC] border border-[#DEDEDE] rounded-lg flex items-center gap-2">
              <input type="number"
              className="bg-[#F8FBFC]"
              />
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

      {addZones && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6"
          onClick={() => setAddZones(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg relative p-4 sm:p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-8 items-center">
              <div>
                <span className="text-[#1C1C1C] font-normal text-[18px]">Add New Metro City</span>
              </div>
            </div>
            <div className="flex flex-col mt-3 gap-1">
              <span className="text-[#1C1C1C] text-[14px]">
                City Name
              </span>
              <div className="p-2 bg-[#F8FBFC] border border-[#DEDEDE] rounded-lg flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter city Name"
                  className="outline-none border-none bg-[#F8FBFC] px-2 py-1 rounded text-[#1C1C1C] text-[16px] w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 items-center mt-3">
              <button className="border border-[#1800AC] text-[#1800AC] bg-white text-[12px] font-medium px-2.5 py-2 rounded-[4px]"
                onClick={() => setAddZones(false)}
              >
                Cancel
              </button>
              <button className="bg-[#1800AC] text-white text-[12px] font-medium px-2.5 py-2 rounded-[4px]">
                Add
              </button>
            </div>
          </div>

        </div>
      )}

      {addSpecialZones && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6"
          onClick={() => setAddSpecialZones(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg relative p-4 sm:p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-8 items-center">
              <div>
                <span className="text-[#1C1C1C] font-normal text-[18px]">Add Special Region</span>
              </div>
            </div>
            <div className="flex flex-col mt-3 gap-1">
              <span className="text-[#1C1C1C] text-[14px]">
                Special Region Name
              </span>
              <div className="p-2 bg-[#F8FBFC] border border-[#DEDEDE] rounded-lg flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Region Name"
                  className="outline-none border-none bg-[#F8FBFC] px-2 py-1 rounded text-[#1C1C1C] text-[16px] w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 items-center mt-3">
              <button className="border border-[#1800AC] text-[#1800AC] bg-white text-[12px] font-medium px-2.5 py-2 rounded-[4px]"
                onClick={() => setAddSpecialZones(false)}
              >
                Cancel
              </button>
              <button className="bg-[#1800AC] text-white text-[12px] font-medium px-2.5 py-2 rounded-[4px]">
                Add
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationSettingsForm;