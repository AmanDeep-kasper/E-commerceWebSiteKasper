import React, { useState } from "react";

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

function NotificationSettingsForm() {
  const [form, setForm] = useState({
    emailNoti: false,
    smsNoti: false,
    adminEmail: false,
    adminSMS: false,
    adminBoth: false,
    adminNone: false,
    custEmail: false,
    custSMS: false,
    custBoth: false,
    custNone: false,
  });

  const update = (k) => setForm((f) => ({ ...f, [k]: !f[k] }));

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold mb-6">Notification Setting</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        {/* Email Notifications */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Email Notifications
          </label>
          <div className="flex items-center justify-between border rounded-md px-3 py-2">
            <span className="text-gray-600">On/Off</span>
            <Toggle
              checked={form.emailNoti}
              onChange={() => update("emailNoti")}
            />
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            SMS Notifications
          </label>
          <div className="flex items-center justify-between border rounded-md px-3 py-2">
            <span className="text-gray-600">On/Off</span>
            <Toggle checked={form.smsNoti} onChange={() => update("smsNoti")} />
          </div>
        </div>

        {/* Admin Alerts */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">
            Admin Alerts for New Orders
          </h3>
          <div className="space-y-2">
            {["Email", "SMS", "Both", "None"].map((opt) => (
              <div
                key={opt}
                className="flex items-center justify-between border rounded-md px-3 py-2"
              >
                <span className="text-gray-600">{opt}</span>
                <Toggle
                  checked={form[`admin${opt}`]}
                  onChange={() => update(`admin${opt}`)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Customer Confirmation */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">
            Customer Order Confirmation
          </h3>
          <div className="space-y-2">
            {["Email", "SMS", "Both", "None"].map((opt) => (
              <div
                key={opt}
                className="flex items-center justify-between border rounded-md px-3 py-2"
              >
                <span className="text-gray-600">{opt}</span>
                <Toggle
                  checked={form[`cust${opt}`]}
                  onChange={() => update(`cust${opt}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-end">
        <button className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default NotificationSettingsForm;
