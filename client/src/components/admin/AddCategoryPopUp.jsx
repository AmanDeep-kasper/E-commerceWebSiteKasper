import React, { useState } from "react";
import { toast } from "react-toastify";

const AddCategoryPopUp = ({
  setShowCategoryModal,
  categories,
  setCategories,
  subcategories,
  setSubcategories,
}) => {
  const [categoryInput, setCategoryInput] = useState(""); // Local state for input
  const [subCategoryInput, setSubCategoryInput] = useState("");

  const handleSave = () => {
    if (categoryInput.trim()) {
      setCategories([...categories, categoryInput.trim()]); // Add to array
    }
    if (subCategoryInput.trim()) {
      setSubcategories([...subcategories, subCategoryInput.trim()]); // Add to array
    }

    if (!categoryInput.trim() || !subCategoryInput.trim()) {
      toast.error("Please fill in all fields!", {
        className: "bg-red-700 text-white rounded-lg",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    toast.success("Category added successfully!", {
      className: "bg-[#EEFFEF] text-black rounded-lg",
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setShowCategoryModal(false); // Close popup
    setCategoryInput(""); // Clear input
    setSubCategoryInput("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-[40%] relative">
        <h2 className="text-xl font-semibold mb-4">Add Category</h2>

        <label className="block text-black text-[14px] font-medium mb-2">
          Category Name
        </label>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4"
        />

        <label className="block text-black text-[14px] font-medium mb-2">
          Sub Category
        </label>
        <input
          type="text"
          placeholder="Sub Category Name"
          value={subCategoryInput}
          onChange={(e) => setSubCategoryInput(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4"
        />

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-6 py-2 bg-gray-200 rounded-lg text-gray-800 font-medium hover:bg-gray-300"
            onClick={() => setShowCategoryModal(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-lime-600 rounded-lg text-white font-medium hover:bg-lime-700"
            onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPopUp;
