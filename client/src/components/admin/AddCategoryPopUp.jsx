<<<<<<< HEAD
import React from "react";
=======
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
>>>>>>> 65c8902c9f20b8ea5111c298bd6ad90591de1fe5

  return (
<<<<<<< HEAD
    <div
      className="relative w-screen h-screen flex items-center justify-center bg-cover bg-center"
      style={{}}
    >
      <div>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-[350px]">
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
            Sign In
          </h2>
        </div>

         <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>
=======
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
>>>>>>> 65c8902c9f20b8ea5111c298bd6ad90591de1fe5
      </div>
    </div>
  );
};

export default AddCategoryPopUp;
