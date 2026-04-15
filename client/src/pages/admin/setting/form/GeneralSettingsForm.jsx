import React, { useState } from "react";
import { Link } from "react-router-dom";

const GeneralSettingsForm = () => {
  const [formData, setFormData] = useState({
    businessName: "LAZERCUT",
    companyNumber: "U72200DL2022PTC123456",
    gstNumber: "22AAAAA0000A1Z5",
    addressLine: "Shop No.61, Huda market, Sec 46",
    pincode: "122002",
    landmark: "Near Axis Bank",
    city: "Gurugram",
    state: "Haryana",
    email: "info.lazercut@example.com",
    primaryPhone: "+91 5256826823",
    secondaryPhone: "+91 3581265825",
  });

  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[30px] font-semibold text-[#222222] leading-none">
            Business Details
          </h1>
          <p className="text-[14px] text-[#7B7B7B] mt-1">
            Business identity and related information
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to={"/admin/settings/general"}>
          <button className="border border-[#1F3B5B] text-[#1F3B5B] text-[13px] font-medium px-4 py-2 rounded-[6px] bg-white">
            Cancel
          </button></Link>
          <button className="bg-[#1F3B5B] text-white text-[13px] font-medium px-4 py-2 rounded-[6px]">
            Save Changes
          </button>
        </div>
      </div>

      {/* Business Information */}
      <div className="mb-4">
        <h2 className="text-[18px] font-medium text-[#222222] mb-3">
          Business Information
        </h2>

        <div className="bg-white rounded-[14px] border border-[#EEF2F6] overflow-hidden">
          {/* Business Name */}
          <div className="flex items-start justify-between gap-6 px-5 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[240px]">
              <h3 className="text-[16px] font-medium text-[#222222]">
                Business Name
              </h3>
              <p className="text-[12px] text-[#8A8A8A] mt-1">
                Displayed on storefront, invoices and customer facing documents.
              </p>
            </div>

            <div className="w-full max-w-[330px]">
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] text-[#222222] outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Business Logo */}
          <div className="flex items-start justify-between gap-6 px-5 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[240px]">
              <h3 className="text-[16px] font-medium text-[#222222]">
                Business Logo
              </h3>
              <p className="text-[12px] text-[#8A8A8A] mt-1">
                Displayed on storefront, invoices and customer facing documents.
              </p>
            </div>

            <div className="flex flex-col items-end">
              <div className="w-[140px] h-[44px] rounded-[8px] border border-[#D1D5DB] bg-[#F8FAFC] flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Business Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2 font-semibold text-[#1F3B5B] text-[18px]">
                    <span className="text-[18px]">🌀</span>
                    <span>LAZERCUT</span>
                  </div>
                )}
              </div>

              <label className="mt-2 text-[12px] text-[#2563EB] cursor-pointer font-medium">
                Change file
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Company Number */}
          <div className="flex items-start justify-between gap-6 px-5 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[240px]">
              <h3 className="text-[16px] font-medium text-[#222222]">
                Registered Company Number
              </h3>
              <p className="text-[12px] text-[#8A8A8A] mt-1">CIN number.</p>
            </div>

            <div className="text-[16px] font-medium text-[#222222] text-right">
              {formData.companyNumber}
            </div>
          </div>

          {/* GST Number */}
          <div className="flex items-start justify-between gap-6 px-5 py-4">
            <div className="min-w-[240px]">
              <h3 className="text-[16px] font-medium text-[#222222]">
                GST Registration Number
              </h3>
              <p className="text-[12px] text-[#8A8A8A] mt-1">
                Used on invoices and tax reports.
              </p>
            </div>

            <div className="text-[16px] font-medium text-[#222222] text-right">
              {formData.gstNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Registered Address */}
      <div className="mb-4">
        <h2 className="text-[18px] font-medium text-[#222222] mb-3">
          Registered Address
        </h2>

        <div className="bg-white rounded-[14px] border border-[#EEF2F6] p-4">
          <div className="border border-[#E5E7EB] rounded-[10px] overflow-hidden">
            {/* <div className="px-4 py-3">
              <button className="text-[#2563EB] text-[14px] font-medium">
                Edit Address
              </button>
            </div> */}

            <div className="px-4 pb-4">
              <div className="mb-4">
                <label className="block text-[12px] text-[#374151] mb-1">
                  Address (Flat no.,Street, and Area)
                </label>
                <textarea
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-[6px] border border-[#D1D5DB] px-3 py-3 text-[14px] outline-none resize-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[12px] text-[#374151] mb-1">
                    Pin-code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full h-[40px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-[#374151] mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full h-[40px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-[12px] text-[#374151] mb-1">
                    City/District/Town
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full h-[40px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-[#374151] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full h-[40px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* <button className="text-[13px] text-[#1F3B5B] font-medium">
                Close
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h2 className="text-[18px] font-medium text-[#222222] mb-3">
          Contact Information
        </h2>

        <div className="bg-white rounded-[14px] border border-[#EEF2F6] overflow-hidden">
          {/* Email */}
          <div className="flex items-start justify-between gap-6 px-5 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[240px]">
              <h3 className="text-[16px] font-medium text-[#222222]">
                Email Address
              </h3>
              <p className="text-[12px] text-[#8A8A8A] mt-1">
                Used for customer communication and system notifications.
              </p>
            </div>

            <div className="w-full max-w-[330px]">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] text-[#222222] outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Primary Phone */}
          <div className="flex items-start justify-between gap-6 px-5 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[240px]">
              <h3 className="text-[16px] font-medium text-[#222222]">
                Primary Phone Number
              </h3>
              <p className="text-[12px] text-[#8A8A8A] mt-1">
                Main contact number for customers and support.
              </p>
            </div>

            <div className="w-full max-w-[330px]">
              <input
                type="text"
                name="primaryPhone"
                value={formData.primaryPhone}
                onChange={handleChange}
                className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] text-[#222222] outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Secondary Phone */}
          <div className="flex items-start justify-between gap-6 px-5 py-4">
            <div className="min-w-[240px]">
              <h3 className="text-[16px] font-medium text-[#222222]">
                Secondary Phone Number
              </h3>
              <p className="text-[12px] text-[#8A8A8A] mt-1">
                Backup contact number used if the primary number is unreachable.
              </p>
            </div>

            {/* <div className="w-full max-w-[330px]">
              <input
                type="text"
                name="secondaryPhone"
                value={formData.secondaryPhone}
                onChange={handleChange}
                className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] text-[#222222] outline-none focus:border-[#2563EB]"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsForm;
