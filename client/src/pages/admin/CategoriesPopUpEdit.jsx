import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const CategoriesPopUpEdit = ({ open, onClose, data }) => {
  const [editStatus, setEditStatus] = useState("Active");
  const [editCategory, setEditCategory] = useState("");
  const [editSubCategories, setEditSubCategories] = useState([]); // array

  useEffect(() => {
    if (open && data) {
      setEditStatus(data.status || "Active");
      setEditCategory(data.category || data.name || "");

      const subs = Array.isArray(data.subCategories)
        ? data.subCategories.map((s) => s.name) // extract names
        : [];

      // console.log(data);

      setEditSubCategories(subs);
    }
  }, [open, data]);

  if (!open) return null;

  // edit a subcategory at index
  const updateSubCategory = (idx, value) => {
    setEditSubCategories((prev) => prev.map((s, i) => (i === idx ? value : s)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleaned = editSubCategories
      .map((s) => (s || "").trim())
      .filter(Boolean);

    const unique = [];
    for (const s of cleaned) {
      if (!unique.some((u) => u.toLowerCase() === s.toLowerCase())) {
        unique.push(s);
      }
    }
    try {
      const payload = {
        // categoryId: data._id, // REQUIRED
        name: editCategory.trim(), // category update
        subCategories: unique, // correct key
        isActive: editStatus === "Active", // boolean
      };

      console.log("PATCH PAYLOAD:", payload);

      await axiosInstance.patch(
        `/category/admin/update-categoryOrSubcategory/${data._id}`,
        payload,
      );
      toast.success("Category and subcategories updated successfully");
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update category or subcategories",
      );
    }
  };

  console.log(data);
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-xl p-4">
        <h2 className="text-lg font-medium mb-4">Edit Category</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status */}
          <div>
            <p className="text-sm font-medium mb-2">Category Status</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={editStatus === "Active"}
                  onChange={() => setEditStatus("Active")}
                />
                <span className="text-[#1C3753] font-medium">Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={editStatus === "Inactive"}
                  onChange={() => setEditStatus("Inactive")}
                />
                <span className="text-[#1C3753] font-medium">Inactive</span>
              </label>
            </div>
          </div>

          {/* Category Name */}
          <div>
            <label className="block text-sm mb-1">Edit Category Name</label>
            <input
              type="text"
              placeholder="Enter Category name"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>

          {/* Edit existing Subcategories only */}
          <div>
            <label className="block text-sm mb-2">Edit Sub-Categories</label>

            {editSubCategories.length === 0 ? (
              <p className="text-sm text-gray-500">No sub-categories found.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {editSubCategories.map((sub, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={sub}
                    onChange={(e) => updateSubCategory(idx, e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg outline-none"
                    placeholder={`Sub-category ${idx + 1}`}
                    required
                  />
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              // onClick={handleSubmit}
              className="flex-1 text-sm bg-[#1C3753] text-white py-2 rounded-lg"
            >
              Save
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

export default CategoriesPopUpEdit;
