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

const DateInput = ({ value, onChange }) => (
  <div className="relative">
    <Input type="text" value={value} onChange={onChange} />
    <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
      checked ? "bg-amber-600" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
        checked ? "translate-x-4" : "translate-x-0.5"
      }`}
    />
  </button>
);

function WishlistCartForm() {
  const [form, setForm] = useState({
    wishlistCount: "04",
    wishlistPreview: "Adiyogi Shiva",
    wishlistCategories: "Spiritual/Abstract/Clones/Etc.",
    wishlistUpdate: "12 July 2025, 4:30 PM",
    cartCount: "02",
    cartValue: "₹4,800",
    lastCartUpdate: "14 July 2025, 7:15 PM",
    lastAdded: "Lotus Mandala (₹2,500)",
    abandoned: false,
    duration: "3 days",
    lastEmail: "12 July 2025, 9:00 AM",
    expiry: "20 July 2025",
    coupon: "SUMMER25 (₹500 off)",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="p-4 lg:p-6">

        {/* Wishlist Info */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <Label>Wishlist Items Count</Label>
            <Input
              value={form.wishlistCount}
              onChange={(e) => update("wishlistCount", e.target.value)}
            />
          </div>
          <div>
            <Label>Wishlist Preview</Label>
            <Select
              value={form.wishlistPreview}
              onChange={(e) => update("wishlistPreview", e.target.value)}
              options={[
                "Adiyogi Shiva",
                "Tree of Life",
                "Custom Plate",
                "Floral Mandala",
              ]}
            />
          </div>
          <div>
            <Label>Wishlist Categories</Label>
            <Select
              value={form.wishlistCategories}
              onChange={(e) => update("wishlistCategories", e.target.value)}
              options={[
                "Spiritual",
                "Abstract",
                "Clones",
                "Typography & Quotes",
              ]}
            />
          </div>
          <div>
            <Label>Last Wishlist Update</Label>
            <Input value={form.wishlistUpdate} readOnly />
          </div>
        </div>

        <hr className="my-5 border-gray-200" />

        {/* Cart Info */}
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Cart Info</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Cart Items Count</Label>
            <Input
              value={form.cartCount}
              onChange={(e) => update("cartCount", e.target.value)}
            />
          </div>
          <div>
            <Label>Cart Value ( ₹ )</Label>
            <Input
              value={form.cartValue}
              onChange={(e) => update("cartValue", e.target.value)}
            />
          </div>
          <div>
            <Label>Last Cart Update</Label>
            <DateInput
              value={form.lastCartUpdate}
              onChange={(e) => update("lastCartUpdate", e.target.value)}
            />
          </div>
          <div>
            <Label>Last Added to Cart</Label>
            <Input
              value={form.lastAdded}
              onChange={(e) => update("lastAdded", e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Cart Abandonment Status</Label>
            <Toggle
              checked={form.abandoned}
              onChange={(v) => update("abandoned", v)}
            />
          </div>
          <div>
            <Label>Abandonment Duration</Label>
            <Select
              value={form.duration}
              onChange={(e) => update("duration", e.target.value)}
              options={["1 day", "3 days", "7 days"]}
            />
          </div>
          <div>
            <Label>Last Abandonment Email Sent</Label>
            <DateInput
              value={form.lastEmail}
              onChange={(e) => update("lastEmail", e.target.value)}
            />
          </div>
          <div>
            <Label>Cart Expiration Date</Label>
            <DateInput
              value={form.expiry}
              onChange={(e) => update("expiry", e.target.value)}
            />
          </div>
          <div>
            <Label>Used Coupon</Label>
            <Input
              value={form.coupon}
              onChange={(e) => update("coupon", e.target.value)}
            />
          </div>
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

export default WishlistCartForm;
