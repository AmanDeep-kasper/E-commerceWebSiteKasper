import React, { useState } from "react";
import { toast } from "react-toastify";

const AddSubCategoryPopup = ({
  setShowSubCategoryModal,
  categories,
  subcategories,
  setSubcategories,
  setFormData,
  selectedCategory,
}) => {
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [categoryInput, setCategoryInput] = useState(selectedCategory || "");

  const handleSave = () => {
    const cat = String(categoryInput || "").trim();
    const sub = String(subCategoryInput || "").trim();

    if (!cat) {
      toast.error("Select/enter a Category first!", {
        className: "bg-red-700 text-white rounded-lg",
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!sub) {
      toast.error("Enter a Subcategory name!", {
        className: "bg-red-700 text-white rounded-lg",
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setSubcategories((prev) => {
      const obj = prev && typeof prev === "object" ? prev : {};
      const existing = Array.isArray(obj[cat]) ? obj[cat] : [];

      if (existing.includes(sub)) return obj; // no duplicates

      return {
        ...obj,
        [cat]: [...existing, sub],
      };
    });

    // optional: auto set in main form
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        category: cat,
        subcategory: sub,
      }));
    }

    toast.success("Subcategory added successfully!", {
      className: "bg-[#EEFFEF] text-black rounded-lg",
      position: "top-right",
      autoClose: 3000,
    });

    setShowSubCategoryModal(false);
    setSubCategoryInput("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-[40%] relative">
        <h2 className="text-xl font-semibold mb-4">Add SubCategory</h2>

        {/* Choose Category */}
        <label className="block text-black text-[14px] font-medium mb-2">
          Category
        </label>

        <select
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Select Category</option>
          {(categories || []).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Subcategory Input */}
        <label className="block text-black text-[14px] font-medium mb-2">
          Sub Category
        </label>
        <input
          type="text"
          placeholder="Sub Category Name"
          value={subCategoryInput}
          onChange={(e) => setSubCategoryInput(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            className="px-6 py-2 bg-gray-200 rounded-lg text-gray-800 font-medium hover:bg-gray-300"
            onClick={() => setShowSubCategoryModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-[#1C3753] rounded-lg text-white font-medium hover:bg-[#1C3753]"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryPopup;
