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

function NotificationSettings() {
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

  return (
    <div className="bg-white">
      <div>
        {/* Toggles */}
        <div className="grid grid-cols-2 gap-6 text-sm mb-6">
          <div>
            <span className="text-gray-700 font-medium">
              Email Notifications
            </span>
            <div className="mt-2">
              <Toggle
                checked={form.emailNoti}
                onChange={() => update("emailNoti")}
              />
            </div>
          </div>
          <div>
            <span className="text-gray-700 font-medium">SMS Notifications</span>
            <div className="mt-2">
              <Toggle
                checked={form.smsNoti}
                onChange={() => update("smsNoti")}
              />
            </div>
          </div>
        </div>

        {/* Admin Alerts */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Admin Alerts for New Orders:
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span>Email</span>
              <Toggle
                checked={form.adminEmail}
                onChange={() => update("adminEmail")}
              />
            </div>
            <div className="flex items-center gap-2">
              <span>SMS</span>
              <Toggle
                checked={form.adminSMS}
                onChange={() => update("adminSMS")}
              />
            </div>
            <div className="flex items-center gap-2">
              <span>Both</span>
              <Toggle
                checked={form.adminBoth}
                onChange={() => update("adminBoth")}
              />
            </div>
          </div>
        </div>

        {/* Customer Confirmation */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Customer Order Confirmation:
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span>Email</span>
              <Toggle
                checked={form.custEmail}
                onChange={() => update("custEmail")}
              />
            </div>
            <div className="flex items-center gap-2">
              <span>SMS</span>
              <Toggle
                checked={form.custSMS}
                onChange={() => update("custSMS")}
              />
            </div>
            <div className="flex items-center gap-2">
              <span>Both</span>
              <Toggle
                checked={form.custBoth}
                onChange={() => update("custBoth")}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-8 flex items-center justify-end gap-2">
        <Link
          to={"/admin/settings/notification-form"}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
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

export default NotificationSettings;
