import React, { useState } from "react";

const CategoriesPopUpEdit = ({ open, onClose }) => {
  const [Editcategory, setEditCategory] = useState("");
  const [Editstatus, setEditStatus] = useState("Active");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: Editcategory,
      status: Editstatus,
    };

    console.log(payload);
    Editcategory("");
    Editstatus("Active");
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[380px] rounded-xl p-4">
        <h2 className="text-lg font-medium mb-4">Edit Category</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="Category Name">Edit Category Name</label>
          <input
            type="text"
            placeholder="Enter Category name"
            value={Editcategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />

          <div>
            <p className="text-sm font-medium mb-2">Category Status</p>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={Editstatus === "Active"}
                  onChange={() => setEditStatus("Active")}
                />
                <span className="text-[#1C3753] font-medium">Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={Editstatus === "Inactive"}
                  onChange={() => setEditStatus("Inactive")}
                />
                <span className="text-[#1C3753] font-medium">Inactive</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 text-sm  bg-[#1C3753] text-white py-2 rounded-lg">
              Save Category
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm  border py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriesPopUpEdit;
