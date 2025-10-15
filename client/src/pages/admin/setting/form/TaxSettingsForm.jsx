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

function TaxSettingsForm() {
  const [form, setForm] = useState({
    enableTax: false,
    includedInPrice: false,
    gst: false,
    vat: false,
    salesTax: false,
  });

  const update = (k) => setForm((f) => ({ ...f, [k]: !f[k] }));

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold mb-6">Tax Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        {/* Enable Tax */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Enable Tax Calculation
          </label>
          <div className="flex items-center justify-between border rounded-md px-3 py-2">
            <span className="text-gray-600">On/Off</span>
            <Toggle
              checked={form.enableTax}
              onChange={() => update("enableTax")}
            />
          </div>
        </div>

        {/* Tax Included in Price */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Tax Included in Price
          </label>
          <div className="flex items-center justify-between border rounded-md px-3 py-2">
            <span className="text-gray-600">On/Off</span>
            <Toggle
              checked={form.includedInPrice}
              onChange={() => update("includedInPrice")}
            />
          </div>
        </div>
      </div>

      {/* Tax System */}
      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-2">Tax System</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["gst", "vat", "salesTax"].map((tax) => (
            <div
              key={tax}
              className="flex items-center justify-between border rounded-md px-3 py-2"
            >
              <span className="capitalize">
                {tax === "gst" ? "GST" : tax === "vat" ? "VAT" : "Sales Tax"}
              </span>
              <Toggle checked={form[tax]} onChange={() => update(tax)} />
            </div>
          ))}
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

export default TaxSettingsForm;
