import React, { useState } from "react";
import { ChevronDown, Upload } from "lucide-react";

const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 ${className}`}
    {...props}
  />
);

const Select = ({ options, value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full h-10 appearance-none rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
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

function GeneralSettingsForm() {
  const [form, setForm] = useState({
    websiteName: "Laser cut metal art",
    websiteUrl: "https://www.lasercutmetalwallart.com",
    language: "English",
    currency: "INR",
    logo: null,
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold mb-6">General Settings</h2>

      <div className="space-y-6">
        <div>
          <Label>Website Name</Label>
          <Input
            value={form.websiteName}
            onChange={(e) => update("websiteName", e.target.value)}
          />
        </div>

        <div>
          <Label>Website URL</Label>
          <Input
            type="url"
            value={form.websiteUrl}
            onChange={(e) => update("websiteUrl", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label>Language</Label>
            <Select
              options={["English", "Hindi", "French", "Spanish"]}
              value={form.language}
              onChange={(e) => update("language", e.target.value)}
            />
          </div>
          <div>
            <Label>Currency</Label>
            <Select
              options={["INR", "USD", "EUR", "GBP"]}
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Upload Logo</Label>
          <div className="relative flex items-center">
            <Input
              type="file"
              className="hidden"
              id="logoUpload"
              onChange={(e) => update("logo", e.target.files[0]?.name || null)}
            />
            <label
              htmlFor="logoUpload"
              className="flex w-full h-10 items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
            >
              {form.logo || "Choose File"}
              <Upload className="h-4 w-4 text-gray-500" />
            </label>
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

export default GeneralSettingsForm;
