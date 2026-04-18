import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const ChangePassword = ({ showPasswordModal, setShowPasswordModal }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setShowPasswordModal(false);
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (oldPassword === newPassword) {
      toast.error("New password must be different from old password");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await axiosInstance.patch("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      toast.success(
        res?.data?.message || "Password changed successfully"
      );

      handleClose();
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showPasswordModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            type="text"
            placeholder="Current Password"
            value={formData.oldPassword}
            onChange={(e) => handleChange("oldPassword", e.target.value)}
            className="w-full mb-3 px-4 py-2 border rounded-lg"
            disabled={isSubmitting}
          />

          <label className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            type="text"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            className="w-full mb-3 px-4 py-2 border rounded-lg"
            disabled={isSubmitting}
          />

          <label className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="text"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-lg"
            disabled={isSubmitting}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded-lg"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#1C3753] text-white rounded-lg disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;