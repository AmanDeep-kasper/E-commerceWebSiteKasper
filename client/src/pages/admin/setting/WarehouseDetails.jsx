import React, { useState } from "react";
import { Link } from "react-router-dom";

function WarehouseDetails() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-[20px] mb-3">Warehouse Details</h1>
          <span className="text-[#686868] text-[14px]">
           Defines the location from where orders are packed and shipped
          </span>
        </div>
        <div>
          <Link
           to={"/admin/settings/tax-form"}
            className="inline-flex items-center bg-[#1C3753] text-white gap-2 rounded-md border px-5 py-1.5 text-sm hover:bg-gray-50"
          >
            Edit
          </Link>
        </div>
      </div>
      <h1 className="font-semibold text-[16px] mb-3 mt-4">
       Warehouse Details
      </h1>
      <div className="bg-[#FFFFFF] p-4 rounded-lg space-y-5">
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Warehouse Name</h1>
            <span className="text-[#686868] text-[14px]">
             Internal reference name for this warehouse.
            </span>
          </div>
          <div>Main Warehouse</div>
        </div>
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Phone Number</h1>
            <span className="text-[#686868] text-[14px]">
              Used by courier partners during pickup and delivery.
            </span>
          </div>
          <div>+91 5256826823</div>
        </div>
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Email Address</h1>
            <span className="text-[#686868] text-[14px]">CIN number</span>
          </div>
          <div>U72200DL2022PTC123456</div>
        </div>
      </div>
      <h1 className="font-semibold mt-4">Warehouse Location</h1>
      <div className="bg-[#FFFFFF] p-4 rounded-lg mt-2">
        <div className="border p-3 rounded-lg">
          <p className="font-semibold">
            Shop No.61, Huda market, Sec 46, Near Axis Bank, Gurugram, Haryana,
            122002, India
          </p>
        </div>
      </div>
    
    </>
  );
}

export default WarehouseDetails;
