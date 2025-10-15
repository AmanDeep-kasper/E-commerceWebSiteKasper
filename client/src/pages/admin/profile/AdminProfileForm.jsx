import React, { useState } from "react";
import { ChevronDown, Upload } from "lucide-react";

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

function AdminProfileForm() {
  const [form, setForm] = useState({
    name: "Rohit Sharma",
    mobile: "8448******",
    email: "rohitsharma@gmail.com",
    language: "English/Hindi",
    password: "********",
    joined: "12 Jan 2024",
    profileImage: null,
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h2 className="text-lg text-gray-900 font-semibold mb-6">Admin Profile Setting</h2>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <Label>Full Name</Label>
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <Label>Mobile Number</Label>
          <Input
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <Label>Email Address</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>

        <div>
          <Label>Language</Label>
          <Select
            value={form.language}
            onChange={(e) => update("language", e.target.value)}
            options={["English", "Hindi", "English/Hindi"]}
          />
        </div>
        <div>
          <Label>Change Password</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </div>

        <div>
          <Label>Admin Profile</Label>
          <div className="relative flex items-center">
            <Input
              type="file"
              className="hidden"
              id="profileUpload"
              onChange={(e) =>
                update("profileImage", e.target.files[0]?.name || null)
              }
            />
            <label
              htmlFor="profileUpload"
              className="flex w-full h-9 items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
            >
              {form.profileImage || "Upload Image"}
              <Upload className="h-4 w-4 text-gray-500" />
            </label>
          </div>
        </div>
        <div>
          <Label>Joined On</Label>
          <Input value={form.joined} readOnly />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-end gap-2">
        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          Delete
        </button>
        <button className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default AdminProfileForm;
