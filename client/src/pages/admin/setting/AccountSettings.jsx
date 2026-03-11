import React, { useState } from "react";
import { AlertTriangle, LogOut } from "lucide-react";
import { Link } from "react-router";

const AccountSettings = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showForcePopup, setShowForcePopup] = useState(false);
  const [showDisablePopup, setShowDisablePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const profileData = [
    {
      label: "Full Name",
      description: "Your name as it appears in admin records.",
      value: "Prateek Lamba",
      type: "text",
    },
    {
      label: "Profile Photo",
      description: "Used to visually identify your admin account.",
      value:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      type: "image",
    },
    {
      label: "Email Address",
      description: "Used to sign in and receive system notifications.",
      value: "info.lazercut@example.com",
      type: "text",
    },
    {
      label: "Password",
      description: "Account password.",
      value: "**********",
      type: "text",
    },
    {
      label: "Account Created On",
      description: "Date when this admin account was created.",
      value: "17/11/2024",
      type: "text",
    },
  ];

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

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleforceLogoutClick = () => {
    setShowForcePopup(true);
  };
  const handleforceLogoutcloseClick = () => {
    setShowForcePopup(false);
  };

  const handleClosePopup = () => {
    setShowLogoutPopup(false);
  };

  const handleConfirmLogout = () => {
    console.log("Force logout confirmed");
    setShowLogoutPopup(false);

    // yahan API call ya logout logic laga sakte ho
    // example:
    // navigate("/login");
  };

  return (
    <div className="w-full bg-[#F9FAFB] p-5 relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[28px] font-semibold text-[#222222]">
            Account Settings
          </h1>
          <p className="text-[14px] text-[#7B7B7B] mt-1">
            Manage your login, security, and account actions
          </p>
        </div>

        <Link to={"/admin/settings/AccountSettingsEdit-form"}>
          <button className="bg-[#1F3B5B] text-white text-[14px] font-medium px-5 py-2 rounded-[6px]">
            Edit
          </button>
        </Link>
      </div>

      {/* Admin Profile */}
      <div className="mb-6">
        <h2 className="text-[20px] font-medium text-[#2B2B2B] mb-3">
          Admin Profile
        </h2>

        <div className="bg-white rounded-[14px] border border-[#F0F0F0] overflow-hidden">
          {profileData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] last:border-b-0"
            >
              <div>
                <h3 className="text-[16px] font-medium text-[#222222]">
                  {item.label}
                </h3>
                <p className="text-[12px] text-[#8A8A8A] mt-1">
                  {item.description}
                </p>
              </div>

              <div className="text-right">
                {item.type === "image" ? (
                  <img
                    src={item.value}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-[16px] font-medium text-[#222222]">
                    {item.value}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Devices */}
      <div className="mb-6">
        <h2 className="text-[20px] font-medium text-[#2B2B2B] mb-3">
          Active Devices
        </h2>

        <div className="bg-white rounded-[14px] border border-[#F0F0F0] overflow-hidden p-4">
          {devices.map((device, index) => (
            <div
              key={device.id}
              className={`flex items-start justify-between py-3 ${
                index !== devices.length - 1 ? "border-b border-[#E5E7EB]" : ""
              }`}
            >
              <div>
                <h3 className="text-[16px] font-medium text-[#222222]">
                  {device.name}
                </h3>
                <p className="text-[13px] text-[#7B7B7B] mt-1">
                  {device.location}
                </p>
                <p className="text-[13px] text-[#7B7B7B] mt-1">
                  {device.activeText}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                {device.current && (
                  <span className="bg-[#E0F4DE] text-[#00A63E] text-[12px] font-medium px-3 py-1 rounded-[6px]">
                    Current
                  </span>
                )}

                {device.current && (
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-2 border border-[#1F3B5B] text-[#1F3B5B] text-[14px] font-medium px-4 py-1 rounded-[6px]"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button
              onClick={handleforceLogoutClick}
              className="flex items-center gap-2 border border-[#1F3B5B] text-[#1F3B5B] text-[14px] font-medium px-4 py-1 rounded-[6px]"
            >
              <LogOut size={16} />
              Force Log Out All Sessions
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div>
        <h2 className="text-[20px] font-medium text-[#2B2B2B] mb-3">
          Danger Zone
        </h2>

        <div className="bg-white rounded-[14px] border border-[#F0F0F0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <div>
              <h3 className="text-[16px] font-medium text-[#222222]">
                Disable Account
              </h3>
              <p className="text-[12px] text-[#8A8A8A] mt-1">
                Temporarily disables access to your account.
              </p>
            </div>

            <button
              onClick={() => {
                setShowDisablePopup(true);
              }}
              className="bg-[#D53B35] text-white text-[14px] font-medium px-4 py-2 rounded-[6px]"
            >
              Disable Account
            </button>
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h3 className="text-[16px] font-medium text-[#222222]">
                Delete Account
              </h3>
              <p className="text-[12px] text-[#8A8A8A] mt-1">
                Permanently deletes your account and all associated data.
              </p>
            </div>

            <button
              onClick={() => {
                setShowDeletePopup(true);
              }}
              className="bg-[#D53B35] text-white text-[14px] font-medium px-4 py-2 rounded-[6px]"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-[12px] shadow-lg px-6 py-5">
            <h2 className="text-[18px] font-semibold text-[#222222] mb-2">
              Are you sure you want to log out of your account?
            </h2>

            <p className="text-[14px] text-[#555555] mb-6">
              You can sign in again anytime.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleClosePopup}
                className="border border-[#A3A3A3] text-[#666666] text-[14px] font-medium px-6 py-2 rounded-[6px]"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmLogout}
                className="bg-[#1F3B5B] text-white text-[14px] font-medium px-6 py-2 rounded-[6px]"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* logout Popup force */}
      {showForcePopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-[12px] shadow-lg px-6 py-5">
            <h2 className="text-[18px] font-semibold text-[#222222] mb-2">
              Are you sure you want to force log out?
            </h2>

            <p className="text-[14px] text-[#555555] mb-6">
              This will make you log out from every device.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleforceLogoutcloseClick}
                className="border border-[#A3A3A3] text-[#666666] text-[14px] font-medium px-6 py-2 rounded-[6px]"
              >
                Cancel
              </button>

              <button
                // onClick={handleConfirmLogout}
                className="bg-[#1F3B5B] text-white text-[14px] font-medium px-6 py-2 rounded-[6px]"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {showDisablePopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-[560px] bg-white rounded-[14px] shadow-xl p-8">
            <h2 className="text-[22px] font-semibold text-[#222222] mb-6">
              Are you sure you want to Disable your Account?
            </h2>

            <div className="border border-[#EF4444] bg-[#FDECEC] rounded-[12px] px-4 py-4 flex gap-3 mb-6">
              <div className="pt-1">
                <AlertTriangle size={20} className="text-[#E53935]" />
              </div>

              <div>
                <h3 className="text-[16px] font-medium text-[#D93025] mb-1">
                  This action is permanent and Irreversible
                </h3>
                <p className="text-[15px] leading-[22px] text-[#E53935]">
                  All operations will be suspended, and your storefront will be
                  hidden from customers. You can re-enable your business at any
                  time.
                </p>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-[16px] text-[#222222]">
                Type <span className="font-semibold">DISABLE</span> to confirm
              </label>
            </div>

            <input
              type="text"
              // value={confirmText}
              // onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DISABLE to confirm"
              className="w-full h-[50px] rounded-[10px] border border-[#D1D5DB] px-4 text-[16px] outline-none focus:border-[#2563EB] mb-7"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDisablePopup(false);
                }}
                className="min-w-[120px] h-[44px] border border-[#7C8698] text-[#4B5563] text-[16px] font-medium rounded-[8px] bg-white"
              >
                Cancel
              </button>

              <button
                // onClick={handleConfirm}
                // disabled={!isMatched}
                className={`min-w-[155px] h-[44px] rounded-[8px] text-[16px] font-medium bg-[#D53B35] text-white`}
              >
                Disable Account
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-[560px] bg-white rounded-[14px] shadow-xl p-8">
            <h2 className="text-[22px] font-semibold text-[#222222] mb-6">
              Are you sure you want to Delete your Account?
            </h2>

            <div className="border border-[#EF4444] bg-[#FDECEC] rounded-[12px] px-4 py-4 flex gap-3 mb-6">
              <div className="pt-1">
                <AlertTriangle size={20} className="text-[#E53935]" />
              </div>

              <div>
                <h3 className="text-[16px] font-medium text-[#D93025] mb-1">
                  This action is permanent and Irreversible
                </h3>
                <p className="text-[15px] leading-[22px] text-[#E53935]">
                  Your entire account, including all data, settings, and access
                  will be permanently deleted. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-[16px] text-[#222222]">
                Type <span className="font-semibold">DELETE</span> to confirm
              </label>
            </div>

            <input
              type="text"
              // value={confirmText}
              // onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full h-[50px] rounded-[10px] border border-[#D1D5DB] px-4 text-[16px] outline-none focus:border-[#2563EB] mb-7"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                }}
                className="min-w-[120px] h-[44px] border border-[#7C8698] text-[#4B5563] text-[16px] font-medium rounded-[8px] bg-white"
              >
                Cancel
              </button>

              <button
                // onClick={handleConfirm}
                // disabled={!isMatched}
                className={`min-w-[155px] h-[44px] rounded-[8px] text-[16px] font-medium bg-[#D53B35] text-white`}
              >
                Disable Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
