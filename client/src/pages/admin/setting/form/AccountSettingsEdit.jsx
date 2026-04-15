import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const AccountSettingsEdit = () => {
  const [accountData, setAccountData] = useState({
    fullName: "Prateek Lamba",
    email: "info.lazercut@example.com",
    password: "L@zercut12",
    createdOn: "17/11/2024",
  });

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  );

  const devices = [
    {
      id: 1,
      name: "Chrome on MacBook Pro",
      location: "Gurugram, Haryana",
      activeText: "Last active 2 hours ago",
      current: true,
    },
    {
      id: 2,
      name: "Microsoft Edge on Lenovo Idea-pad",
      location: "Gurugram, Haryana",
      activeText: "Last active 2 days ago",
      current: false,
    },
  ];

  const handleChange = (field, value) => {
    setAccountData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const inputClass =
    "w-full h-[38px] rounded-[6px] border border-[#D1D5DB] bg-[#F9FAFB] px-3 text-[13px] text-[#222222] outline-none focus:border-[#2563EB]";

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full bg-[#F8FAFC] p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[#222222] leading-none">
            Account Settings
          </h1>
          <p className="text-[13px] text-[#7B7B7B] mt-1">
            Manage your login, security, and account actions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={"/admin/settings/AccountSettings"}>
            <button className="border border-[#1F3B5B] text-[#1F3B5B] bg-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
              Cancel
            </button>
          </Link>
          <button className="bg-[#1F3B5B] text-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
            Save Changes
          </button>
        </div>
      </div>

      {/* Account Information */}
      <div className="mb-5">
        <h2 className="text-[16px] font-medium text-[#222222] mb-3">
          Account Information
        </h2>

        <div className="bg-white rounded-[12px] border border-[#EEF2F6] overflow-hidden">
          {/* Full Name */}
          <div className="flex items-start justify-between gap-6 px-4 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[220px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                Full Name
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Your name as it appears in admin records.
              </p>
            </div>

            <div className="w-full max-w-[250px]">
              <input
                type="text"
                value={accountData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Profile Photo */}
          <div className="flex items-start justify-between gap-6 px-4 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[220px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                Profile Photo
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Used to visually identify your admin account.
              </p>
            </div>

            <div className="flex flex-col items-end">
              <img
                src={profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <label className="mt-2 text-[11px] text-[#2563EB] cursor-pointer font-medium">
                Change profile photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start justify-between gap-6 px-4 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[220px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                Email Address
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Used to sign in and receive system notifications.
              </p>
            </div>

            <div className="w-full max-w-[250px]">
              <input
                type="email"
                value={accountData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex items-start justify-between gap-6 px-4 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[220px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                Password
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Account password.
              </p>
            </div>

            <div className="w-full max-w-[250px] flex flex-col items-end">
              <input
                type="text"
                value={accountData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={inputClass}
              />
              <button
                onClick={() => setShowPassword((prev) => !prev)}
                className="mt-2 text-[11px] text-[#2563EB] font-medium">
                Change Password
              </button>
            </div>
          </div>

          {/* Created On */}
          <div className="flex items-start justify-between gap-6 px-4 py-4">
            <div className="min-w-[220px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                Account Created On
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Date when this admin account was created.
              </p>
            </div>

            <div className="text-[14px] font-medium text-[#222222]">
              {accountData.createdOn}
            </div>
          </div>
        </div>
      </div>

      {/* Active Devices */}
      {/* <div className="mb-5">
        <h2 className="text-[16px] font-medium text-[#222222] mb-3">
          Active Devices
        </h2>

        <div className="bg-white rounded-[12px] border border-[#EEF2F6] overflow-hidden p-4">
          {devices.map((device, index) => (
            <div
              key={device.id}
              className={`flex items-start justify-between py-3 ${
                index !== devices.length - 1 ? "border-b border-[#E5E7EB]" : ""
              }`}
            >
              <div>
                <h3 className="text-[14px] font-medium text-[#222222]">
                  {device.name}
                </h3>
                <p className="text-[11px] text-[#7B7B7B] mt-1">
                  {device.location}
                </p>
                <p className="text-[11px] text-[#7B7B7B] mt-1">
                  {device.activeText}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {device.current && (
                  <span className="bg-[#E0F4DE] text-[#00A63E] text-[11px] font-medium px-2.5 py-1 rounded-[6px]">
                    Current
                  </span>
                )}

                {device.current && (
                  <button className="flex items-center gap-1.5 border border-[#D1D5DB] bg-[#F3F4F6] text-[#6B7280] text-[12px] font-medium px-3 py-1 rounded-[6px]">
                    <LogOut size={14} />
                    Log Out
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button className="flex items-center gap-1.5 border border-[#D1D5DB] bg-[#F3F4F6] text-[#6B7280] text-[12px] font-medium px-3 py-1 rounded-[6px]">
              <LogOut size={14} />
              Force Log Out All Sessions
            </button>
          </div>
        </div>
      </div> */}

      {/* Danger Zone */}
      {/* <div>
        <h2 className="text-[16px] font-medium text-[#222222] mb-3">
          Danger Zone
        </h2>

        <div className="bg-white rounded-[12px] border border-[#EEF2F6] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#E5E7EB]">
            <div>
              <h3 className="text-[14px] font-medium text-[#222222]">
                Disable Account
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Temporarily disables access to your account.
              </p>
            </div>

            <button className="bg-[#F2A7A1] text-white text-[12px] font-medium px-4 py-1.5 rounded-[6px]">
              Disable Account
            </button>
          </div>

          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <h3 className="text-[14px] font-medium text-[#222222]">
                Delete Account
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Permanently deletes your account and all associated data.
              </p>
            </div>

            <button className="bg-[#F2A7A1] text-white text-[12px] font-medium px-4 py-1.5 rounded-[6px]">
              Delete Account
            </button>
          </div>
        </div>
      </div> */}

      {showPassword && (

        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPassword(false);
            }
          }}
        >
          <div
            className="bg-white rounded-xl shadow-lg relative p-4 sm:p-6 overflow-y-auto w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >

            <span className="text-[18px] font-medium text-[#1c1c1c]">Change Password</span>
            <div>
              <div className="flex flex-col gap-2 mt-3">
                <label htmlFor="currentPassword" className="text-[14px] font-medium text-[#1C1C1C]">Current Password</label>
                <input type="password" id="currentPassword" placeholder="Enter Your Current Password" className="w-full p-4 bg-[#F3F4F6] rounded-md" />
              </div>
              
              <div className="flex flex-col gap-2 mt-3">
                <label htmlFor="newPassword" className="text-[14px] font-medium text-[#1C1C1C]">New Password</label>
                <input type="password" id="newPassword" placeholder="Enter Your New Password" className="w-full p-4 bg-[#F3F4F6] rounded-md" />
              </div>

              
              <div className="flex flex-col gap-2 mt-3">
                <label htmlFor="confirmPassword" className="text-[14px] font-medium text-[#1C1C1C]">Confirm New Password</label>
                <input type="password" id="confirmPassword" placeholder="Enter Your Confirm Password" className="w-full p-4 bg-[#F3F4F6] rounded-md" />
              </div>
            </div>

            <div className="flex gap-4 items-center mt-4">
              <button className="bg-[#0C0057] text-white text-[12px] font-medium px-4 py-2.5 rounded-[6px]">
                Save
              </button>
              <button className="text-[#0C0057] border border-[#0C0057] text-[12px] font-medium px-4 py-2.5 rounded-[6px]" onClick={() => setShowPassword(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettingsEdit;