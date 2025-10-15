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

function PaymentSettingsForm() {
  const [form, setForm] = useState({
    onlinePayments: false,
    razorpay: false,
    creditCard: false,
    emi: false,
    cod: false,
  });

  const update = (k) => setForm((f) => ({ ...f, [k]: !f[k] }));

  return (
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold mb-6">Payment Settings</h2>

        <div className="space-y-6 text-sm">
          {/* Online Payments */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Online Payments
            </label>
            <div className="flex items-center justify-between border rounded-md px-3 py-2">
              <span className="text-gray-600">On/Off</span>
              <Toggle
                checked={form.onlinePayments}
                onChange={() => update("onlinePayments")}
              />
            </div>
          </div>

          {/* Online Payment Methods */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              Online Payment Methods
            </h3>
            <div className="space-y-2">
              {["razorpay", "creditCard", "emi", "cod"].map((method) => (
                <div
                  key={method}
                  className="flex items-center justify-between border rounded-md px-3 py-2"
                >
                  <span className="capitalize">
                    {method === "cod"
                      ? "Cash on Delivery (COD)"
                      : method === "emi"
                      ? "EMI"
                      : method === "creditCard"
                      ? "Credit Card"
                      : "Razorpay"}
                  </span>
                  <Toggle
                    checked={form[method]}
                    onChange={() => update(method)}
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

export default PaymentSettingsForm