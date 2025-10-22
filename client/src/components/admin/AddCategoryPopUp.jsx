import React from "react";

const AddCategoryPopUp = ({
  setNewCategory,
  newCategory,
  setShowCategoryModal,
}) => {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg w-[40%] relative">
          {/* <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowCategoryModal(false)}>
              ✖
            </button> */}
          <h2 className="text-xl font-semibold mb-4">Add Category</h2>
          <label className="block text-black text-[14px] font-medium mb-2">
            Category Name
          </label>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />
          <label className="block text-black text-[14px] font-medium mb-2">
            Sub Category
          </label>
          <input
            type="text"
            placeholder="Sub Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />
          <div className="flex justify-end gap-4 mt-6">
            <button
              className="px-6 py-2 bg-gray-200 rounded-lg text-gray-800 font-medium hover:bg-gray-300"
              onClick={() => setShowCategoryModal(false)}>
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-lime-600 rounded-lg text-white font-medium hover:bg-lime-700">
              Save
            </button>
          </div>
          {/* <button
              className="bg-[#DD851F] text-white px-3 py-2 rounded-md w-full hover:bg-orange-600"
              onClick={() => {
                if (newCategory.trim()) {
                  setPrice((prev) => [...prev, newCategory.trim()]); // Add new category
                  setFormData((prev) => ({
                    ...prev,
                    category: newCategory.trim(),
                  })); // Select it
                  setNewCategory("");
                  setShowCategoryModal(false);
                  setOpen(false); // Close dropdown
                }
              }}>
              Save Category
            </button> */}
        </div>
      </div>
    </>
  );
};

export default AddCategoryPopUp;
