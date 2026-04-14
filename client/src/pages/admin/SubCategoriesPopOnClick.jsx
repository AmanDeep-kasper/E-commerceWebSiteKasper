import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const SubCategoriesPopOnClick = ({
  open,
  onClose,
  categoryName,
  categoryId,
}) => {
  const [subInput, setSubInput] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [status, setStatus] = useState("Active");

  // reset when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSubInput("");
      setSubcategories([]);
      setStatus("Active");
    }
  }, [open]);

  if (!open) return null;

  const addSubcategory = () => {
    const value = subInput.trim();
    if (!value) return;

    // prevent duplicates (case-insensitive)
    const exists = subcategories.some(
      (s) => s.toLowerCase() === value.toLowerCase(),
    );
    if (exists) {
      setSubInput("");
      return;
    }

    setSubcategories((prev) => [...prev, value]);
    setSubInput("");
  };

  const removeSubcategory = (idx) => {
    setSubcategories((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pending = subInput.trim();
    let finalSubs = [...subcategories];

    if (pending) {
      const exists = finalSubs.some(
        (s) => s.toLowerCase() === pending.toLowerCase(),
      );
      if (!exists) finalSubs.push(pending);
    }

    if (finalSubs.length === 0) return;

    try {
      const payload = {
        categoryId,
        subCategoryName: finalSubs, // ✅ IMPORTANT
      };

      console.log("Sending payload:", payload);

      await axiosInstance.post(
        "/category/admin/createOrUpdate-category",
        payload,
      );

      onClose();
      toast.success("Sub-category added successfully");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to add sub-category");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-xl p-4">
        <h2 className="text-lg font-medium mb-4">Add Sub-Category</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name (Default/ReadOnly) */}
          <div>
            <label className="block text-sm mb-1">Category Name</label>
            <input
              type="text"
              value={categoryName}
              readOnly
              className="w-full border px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Add multiple subcategories */}
          <div className="mb-2">
            <label className="text-sm mb-2 block">Add Sub-Category Name</label>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Enter sub-category name"
                value={subInput}
                onChange={(e) => setSubInput(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSubcategory();
                  }
                }}
              />

              <button
                type="button"
                onClick={addSubcategory}
                className="text-start text-[#006EE1] text-sm"
              >
                + Add more sub-category
              </button>
            </div>

            {/* Show added subcategories */}
            {subcategories.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {subcategories.map((sub, idx) => (
                  <span
                    key={`${sub}-${idx}`}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#F8FBFC] text-sm border"
                  >
                    {sub}
                    <button
                      type="button"
                      onClick={() => removeSubcategory(idx)}
                      className="text-red-500 font-bold"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#1C3753] text-sm text-white py-2 rounded-lg"
            >
              Save Sub-Categories
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm border py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCategoriesPopOnClick;
