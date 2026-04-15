import React, { useState } from "react";
import { Link } from "react-router-dom";

const Toggle = ({ checked, onChange }) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={onChange}
    />
    <div className="w-10 h-5 bg-gray-200 rounded-full relative transition">
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition ${
          checked ? "translate-x-5 bg-amber-500" : ""
        }`}
      />
    </div>
  </label>
);

function GeneralSettings() {
  const [tab, setTab] = useState("General");
  const [form, setForm] = useState({
    emailNoti: false,
    smsNoti: false,
    adminEmail: false,
    adminSMS: false,
    adminBoth: false,
    custEmail: false,
    custSMS: false,
    custBoth: false,
  });

  const update = (k) => setForm((f) => ({ ...f, [k]: !f[k] }));

  const settings = {
    name: "Laser Cut Metal Wall Art",
    url: "https://www.lasercutmetalwallart.com",
    language: "English",
    currency: "INR",
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-[20px] mb-3">Business Details</h1>
          <span className="text-[#686868] text-[14px]">
            Business Identity and related information
          </span>
        </div>
        <div>
          <Link
            to={"/admin/settings/general-form"}
            className="inline-flex items-center bg-[#1C3753] text-white gap-2 rounded-md border px-5 py-1.5 text-sm hover:bg-gray-500 hover:text-black"
          >
            Edit
          </Link>
        </div>
      </div>
      <h1 className="font-semibold text-[16px] mb-3 mt-4">Business Information</h1>
      <div className="bg-[#FFFFFF] p-4 rounded-lg space-y-5">
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Business Name</h1>
            <span className="text-[#686868] text-[14px]">
              Displayed on storefront, invoices and customer facing documents.
            </span>
          </div>
          <div>LAZERCUT</div>
        </div>
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Business Logo</h1>
            <span className="text-[#686868] text-[14px]">
              Displayed on storefront, invoices and customer facing documents.
            </span>
          </div>
          <div>imgae</div>
        </div>
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Registered Company Number</h1>
            <span className="text-[#686868] text-[14px]">CIN number</span>
          </div>
          <div>U72200DL2022PTC123456</div>
        </div>
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>GST Registration Number</h1>
            <span className="text-[#686868] text-[14px]">Used on invoices and tax reports.</span>
          </div>
          <div>22AAAAA0000A1Z5</div>
        </div>
      </div>
      <h1 className="font-semibold mt-4">Registered Address</h1>
      <div className="bg-[#FFFFFF] p-4 rounded-lg mt-2">
        <div className="border p-3 rounded-lg">
          <p  className="font-semibold">
            Shop No.61, Huda market, Sec 46, Near Axis Bank, Gurugram, Haryana,
            122002, India
          </p>
        </div>
      </div>
      <h1  className="font-semibold mt-4">Contact Information</h1>
      <div className="bg-[#FFFFFF] p-4 rounded-lg space-y-5 mt-2">
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Email Address</h1>
            <span>
              Used for customer communication and system notifications.
            </span>
          </div>
          <div className="p-2 border rounded-lg bg-[#F8FBFC]">
            info.lazercut@example.com
          </div>
        </div>
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Primary Phone Number</h1>
            <span>Main contact number for customers and support.</span>
          </div>
          <div className="p-2 border rounded-lg bg-[#F8FBFC]">
            +91 5256826823
          </div>
        </div>
        {/* <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Registered Company Number</h1>
            <span>CIN number</span>
          </div>
          <div className="p-2 border rounded-lg bg-[#F8FBFC]">
           +91 3581265825
          </div>
        </div> */}
      </div>
    </>
  );
}

export default GeneralSettings;
