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

function PaymentSettings() {
  const [form, setForm] = useState({
    onlinePayments: false,
    razorpay: false,
    creditCard: false,
    emi: false,
    cod: false,
  });

  const update = (k) => setForm((f) => ({ ...f, [k]: !f[k] }));

  return (
    <div className="bg-white">
      {/* Online Payments */}
      <div className="mb-6">
        <div className="flex items-center justify-between max-w-sm">
          <span className="text-gray-700 font-medium">Online Payments</span>
          <Toggle
            checked={form.onlinePayments}
            onChange={() => update("onlinePayments")}
          />
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Online Payment Methods:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-2">
            <span>Razorpay</span>
            <Toggle
              checked={form.razorpay}
              onChange={() => update("razorpay")}
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Credit Card</span>
            <Toggle
              checked={form.creditCard}
              onChange={() => update("creditCard")}
            />
          </div>
          <div className="flex items-center gap-2">
            <span>EMI</span>
            <Toggle checked={form.emi} onChange={() => update("emi")} />
          </div>
          <div className="flex items-center gap-2">
            <span>Cash on Delivery (COD)</span>
            <Toggle checked={form.cod} onChange={() => update("cod")} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-end gap-2">
        <Link
          to={"/admin/settings/payment-form"}
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

export default PaymentSettings;
