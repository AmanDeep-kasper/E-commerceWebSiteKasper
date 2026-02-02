import React, { useState } from "react";

const SubCategoriesPopOnClick = ({ open, onClose }) => {
  const [subcategory, setSubCategory] = useState("");
  const [status, setStatus] = useState("Active");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: subcategory,
      status: status,
    };

    console.log(payload);

    setSubCategory("");
    setStatus("Active");
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[380px] rounded-xl p-4">
        <h2 className="text-lg font-medium mb-4">Add Sub-Category</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="Category Name">Add Sub-Category</label>
          <input
            type="text"
            placeholder="Enter Sub-Category Name"
            value={subcategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />

          <div>
            <p className="text-sm font-medium mb-2">Sub-Category Status</p>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={status === "Active"}
                  onChange={() => setStatus("Active")}
                />
                <span className="text-[#1C3753] font-medium">Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={status === "Inactive"}
                  onChange={() => setStatus("Inactive")}
                />
                <span className="text-[#1C3753] font-medium">Inactive</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#1C3753] text-sm text-white py-2 rounded-lg">
              Save Sub-Category
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm border py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCategoriesPopOnClick;
