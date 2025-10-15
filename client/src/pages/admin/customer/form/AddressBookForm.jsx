import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Label = ({ children }) => (
  <label className="text-[13px] font-medium text-gray-700">{children}</label>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 ${className}`}
    {...props}
  />
);

const Select = ({ options, value, onChange, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full h-9 appearance-none rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
  </div>
);

function AddressBookForm() {
  const [form, setForm] = useState({
    name: "Neha Pal",
    phone: "8448******",
    email: "neha@gmail.com",
    address: "",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    postal: "110034",
    usedOrders: "05 times",
    tag: "Home",
    type: { shipping: false, billing: false },
    default: false,
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="p-4 lg:p-6">
      {/* Default Shipping Address */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Full Name</Label>
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div>
          <Label>Email Address</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="col-span-3">
          <Label>Address</Label>
          <Input
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Add Address"
          />
        </div>
        <div>
          <Label>City</Label>
          <Select
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            options={["Delhi", "Noida", "Gurgaon"]}
          />
        </div>
        <div>
          <Label>State</Label>
          <Input value={form.state} readOnly />
        </div>
        <div>
          <Label>Country</Label>
          <Select
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            options={["India", "USA", "UK"]}
          />
        </div>
        <div>
          <Label>Postal Code (PIN)</Label>
          <Input
            value={form.postal}
            onChange={(e) => update("postal", e.target.value)}
          />
        </div>
        <div>
          <Label>Used in Orders</Label>
          <Input
            value={form.usedOrders}
            onChange={(e) => update("usedOrders", e.target.value)}
          />
        </div>
      </div>

      {/* Address Tags */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <Label>Address Tag</Label>
          <div className="flex gap-4 mt-2">
            {["Home", "Work", "Other"].map((t) => (
              <label key={t} className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="tag"
                  value={t}
                  checked={form.tag === t}
                  onChange={(e) => update("tag", e.target.value)}
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label>Address Type</Label>
          <div className="flex gap-4 mt-2">
            {["Shipping", "Billing"].map((t) => (
              <label key={t} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.type[t.toLowerCase()]}
                  onChange={(e) =>
                    update("type", {
                      ...form.type,
                      [t.toLowerCase()]: e.target.checked,
                    })
                  }
                />
                {t}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Default checkbox */}
      <div className="mt-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.default}
            onChange={(e) => update("default", e.target.checked)}
          />
          Set as Default make this my Additional Address
        </label>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-end gap-2">
        <button className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600">
          Save
        </button>
        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          Reset Form
        </button>
      </div>
    </div>
  );
}

export default AddressBookForm;
