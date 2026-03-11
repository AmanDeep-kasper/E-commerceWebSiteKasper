import React, { useState } from "react";

const BannersSettings = () => {
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isBanner4ModalOpen, setIsBanner4ModalOpen] = useState(false);

  const banners = [
    { id: 1, name: "Banner 1" },
    { id: 2, name: "Banner 2" },
    { id: 3, name: "Banner 3" },
    { id: 4, name: "Banner 4" },
  ];

  const handleEditBanner = (banner) => {
    if (banner.id === 4) {
      setIsBanner4ModalOpen(true);
      setSelectedBanner(null);
    } else {
      setSelectedBanner(banner);
      setIsBanner4ModalOpen(false);
    }
  };

  const closeAll = () => {
    setSelectedBanner(null);
    setIsBanner4ModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-semibold text-[20px] mb-2">Banners</h1>
          <span className="text-[#686868] text-[14px]">
            Manage banners displayed on the customer homepage.
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB]">
              <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                Serial No.
              </th>
              <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                Banner Number
              </th>
              <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {banners.map((banner, index) => (
              <tr key={banner.id} className="border-b border-[#E5E7EB]">
                <td className="px-6 py-5 text-[14px] text-[#111827]">
                  {index + 1}.
                </td>
                <td className="px-6 py-5 text-[14px] text-[#111827]">
                  {banner.name}
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => handleEditBanner(banner)}
                    className="text-[#2563EB] text-[14px] font-medium hover:underline"
                  >
                    Edit Banner
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Banner 1,2,3 Form */}
      {selectedBanner && selectedBanner.id !== 4 && (
        <div className="mt-6 bg-white rounded-[8px] border border-[#E5E7EB] p-4 max-w-[600px]">
          
          <h2 className="text-[16px] font-semibold text-[#111827] mb-4">
            {selectedBanner.name}
          </h2>

          {/* Upload */}
          <div className="mb-4">
            <label className="w-[56px] h-[56px] border border-[#D1D5DB] rounded-[6px] flex items-center justify-center cursor-pointer hover:bg-gray-50">
              <input type="file" className="hidden" />
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <path d="M8 15l3-3 2 2 4-4"></path>
                <path d="M16 8h.01"></path>
                <path d="M12 5v4"></path>
                <path d="M10 7h4"></path>
              </svg>
            </label>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-[14px] text-[#374151] mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Write a title"
              className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-[14px] text-[#374151] mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Write a description"
              rows={4}
              className="w-full rounded-[6px] border border-[#D1D5DB] px-3 py-3 text-[14px] outline-none resize-none focus:border-[#2563EB]"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button className="bg-[#183B63] hover:bg-[#163556] text-white text-[14px] font-medium px-5 py-2 rounded-[6px]">
              Save
            </button>
            <button
              onClick={closeAll}
              className="border border-[#94A3B8] text-[#183B63] text-[14px] font-medium px-5 py-2 rounded-[6px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Banner 4 Modal */}
      {isBanner4ModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-[460px] bg-white rounded-[8px] shadow-lg p-4">
            <h2 className="text-[16px] font-semibold text-[#111827] mb-3">
              Banner 4
            </h2>

            {/* Title */}
            <div className="mb-3">
              <label className="block text-[14px] text-[#374151] mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Write a title"
                className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-[14px] text-[#374151] mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Write a description"
                rows={4}
                className="w-full rounded-[6px] border border-[#D1D5DB] px-3 py-3 text-[14px] outline-none resize-none focus:border-[#2563EB]"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button className="bg-[#183B63] hover:bg-[#163556] text-white text-[14px] font-medium px-5 py-2 rounded-[6px]">
                Save
              </button>
              <button
                onClick={closeAll}
                className="border border-[#94A3B8] text-[#183B63] text-[14px] font-medium px-5 py-2 rounded-[6px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BannersSettings;