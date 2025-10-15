import React, { useState } from "react";
import { Link } from "react-router";

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

  const tabs = [
    "General Settings",
    "Notification Settings",
    "Payment Settings",
    "Taxes Settings",
    "Product Settings",
  ];

  const settings = {
    name: "Laser Cut Metal Wall Art",
    url: "https://www.lasercutmetalwallart.com",
    language: "English",
    currency: "INR",
  };

  return (
    <div className="bg-white ">
      {/* Tabs */}

      {/* General Settings Content */}

      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-lg font-medium text-pink-600">
            L
          </div>
          <div>
            <h3 className="text-sm font-medium">{settings.name}</h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-gray-500">Website URL</span>
            <p className="font-medium text-blue-600 truncate">{settings.url}</p>
          </div>
          <div>
            <span className="text-gray-500">Language</span>
            <p className="font-medium">{settings.language}</p>
          </div>
          <div>
            <span className="text-gray-500">Currency</span>
            <p className="font-medium">{settings.currency}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-end gap-2">
        <Link to={'/admin/settings/general-form'} className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          Edit
        </Link>
        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          Cancel
        </button>
        <button className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600">
          Delete
        </button>
      </div>
    </div>
  );
}


export default GeneralSettings