import React, { useState } from "react";
import { ChevronDown, Upload } from "lucide-react";

const Label = ({ children }) => (
  <label className="text-[13px] font-medium text-gray-700">{children}</label>
);

const Input = ({ className = "", ...props }) => (
  <input
    readOnly
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

function InformationForm() {
  
  const [form, setForm] = useState({
    fullName: "Neha Pal",
    email: "neha@gmail.com",
    phone: "8448******",
    dob: "",
    gender: "",
    customerId: "CUST1024",
    accountType: "Guest / Registered",
    status: "Active / Inactive / Banned",
    gmailVerified: false,
    phoneVerified: false,
    language: "English / Hindi / etc.",
    marketing: false,
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
        <div className="p-4 lg:p-6">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Full Name"
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Email Address"
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="Phone Number"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <Label>Date of Birth</Label>
              <Input
                value={form.dob}
                onChange={(e) => update("dob", e.target.value)}
                placeholder="MM/DD/YYYY"
              />
            </div>
            <div>
              <Label>Gender</Label>
              <Select
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
                placeholder="Female/Male/Others"
                options={["Female", "Male", "Others"]}
              />
            </div>
            <div>
              <Label>Profile Picture</Label>
              <div className="relative">
                <Input placeholder="Upload Image" className="pr-24" readOnly />
                <button
                  type="button"
                  className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-sm bg-white hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" /> Upload Image
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-5 border-gray-200" />

          {/* Account + Verification */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-3">Account Type:</h3>
              <div className="space-y-4">
                <div>
                  <Label>Customer ID</Label>
                  <Input value={form.customerId} readOnly />
                </div>
                <div>
                  <Label>Account Type</Label>
                  <Select
                    value={form.accountType}
                    onChange={(e) => update("accountType", e.target.value)}
                    placeholder="Guest / Registered"
                    options={["Guest", "Registered"]}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onChange={(e) => update("status", e.target.value)}
                    placeholder="Active / Inactive / Banned"
                    options={["Active", "Inactive", "Banned"]}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Verification</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Gmail Verified</Label>
                  <Toggle
                    checked={form.gmailVerified}
                    onChange={(v) => update("gmailVerified", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Phone Verified</Label>
                  <Toggle
                    checked={form.phoneVerified}
                    onChange={(v) => update("phoneVerified", v)}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Preferred Language</Label>
                  <Select
                    value={form.language}
                    onChange={(e) => update("language", e.target.value)}
                    placeholder="English / Hindi / etc."
                    options={["English", "Hindi", "Bengali", "Tamil", "Telugu"]}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Marketing Opt-in</Label>
                  <Input
                    value="Subscribed to Email Offers"
                    readOnly
                    className="opacity-60"
                  />
                </div>
              </div>
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

export default InformationForm;
