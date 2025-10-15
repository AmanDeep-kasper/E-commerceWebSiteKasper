import React, { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";

const Label = ({ children }) => (
  <label className="text-[13px] font-medium text-gray-700">{children}</label>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 ${className}`}
    {...props}
  />
);

const Select = ({ options, value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full h-9 appearance-none rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
  </div>
);

const DateInput = ({ value, onChange }) => (
  <div className="relative">
    <Input type="text" value={value} onChange={onChange} />
    <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
  </div>
);

function StockEditForm() {
  const [form, setForm] = useState({
    product: "Adiyogi Shiva",
    category: "Spiritual & Religious",
    sku: "SHIVA001",
    addQty: "15",
    unitPrice: "₹2,030",
    units: "12",
    reorder: "15",
    status: "In stock",
    updated: "15 Jul 2025",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <Label>Product Name</Label>
          <Select
            value={form.product}
            onChange={(e) => update("product", e.target.value)}
            options={["Adiyogi Shiva", "Tree of Life", "Mandala Art"]}
          />
        </div>
        <div>
          <Label>Category Name</Label>
          <Select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            options={["Spiritual & Religious", "Nature & Wildlife", "Abstract"]}
          />
        </div>

        <div>
          <Label>SKU Code</Label>
          <Input
            value={form.sku}
            onChange={(e) => update("sku", e.target.value)}
          />
        </div>
        <div>
          <Label>Unit in Stock</Label>
          <Input
            value={form.units}
            onChange={(e) => update("units", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Add Quantity</Label>
            <Input
              value={form.addQty}
              onChange={(e) => update("addQty", e.target.value)}
            />
          </div>
          <div>
            <Label>Unit Price (₹)</Label>
            <Input
              value={form.unitPrice}
              onChange={(e) => update("unitPrice", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Reorder Level</Label>
          <Input
            value={form.reorder}
            onChange={(e) => update("reorder", e.target.value)}
          />
        </div>

        <div>
          <Label>Status</Label>
          <Select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            options={["In stock", "Low stock", "Out of stock"]}
          />
        </div>

        <div>
          <Label>Last Update</Label>
          <DateInput
            value={form.updated}
            onChange={(e) => update("updated", e.target.value)}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-end gap-2">
        <button className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600">
          Save
        </button>
        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default StockEditForm;
