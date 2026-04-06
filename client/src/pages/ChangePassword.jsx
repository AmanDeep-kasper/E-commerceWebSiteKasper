import React from "react";

const ChangePassword = ({ showPasswordModal, setShowPasswordModal }) => {
  return (
    <>
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            {/* Current Password */}
            <label>Current Password</label>
            <input
              type="password"
              placeholder="Current Password"
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />

            {/* New Password */}
            <label>New Password</label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />

            {/* Confirm Password */}
            <label>Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-4 px-4 py-2 border rounded-lg"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPasswordModal(false);
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPasswordModal(false);
                }}
                className="px-4 py-2 bg-[#1C3753] text-white rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
