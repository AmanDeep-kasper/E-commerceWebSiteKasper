import React, { useState } from "react";
import { CgSoftwareUpload } from "react-icons/cg";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const CategoriesPopOnClick = ({
  open,
  onclose,
  newCategory,
  setNewCategory,
  subcategories: parentSubcategories,
  setSubcategories,
}) => {
  const location = useLocation();
  const [category, setCategory] = useState(newCategory || "");
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [subInput, setSubInput] = useState("");
  const [subcategories, setLocalSubcategories] = useState([]);

  if (!open) return null;

  const addSubcategory = (e) => {
    e.preventDefault();
    const value = subInput.trim();
    if (!value) return;

    if (subcategories.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setSubInput("");
      return;
    }

    setLocalSubcategories((prev) => [...prev, value]);
    setSubInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAddProductPage = location.pathname === "/admin/add-product";

    let finalSubs = [];
    const typed = subInput.trim();

    if (!category.trim()) {
      toast.error("Category name required");
      return;
    }

    if (isAddProductPage) {
      if (!typed) {
        toast.error("Sub-category name required");
        return;
      }
      finalSubs = [typed];
    } else {
      finalSubs = [...subcategories];
      if (typed) {
        const exists = finalSubs.some(
          (s) => s.toLowerCase() === typed.toLowerCase(),
        );
        if (!exists) finalSubs.push(typed);
      }

      if (finalSubs.length === 0) {
        toast.error("At least one subcategory required");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("name", category.trim());
      formData.append("isActive", status === "Active");
      formData.append("subCategories", JSON.stringify(finalSubs));

      if (imageFile) {
        formData.append("categoryImage", imageFile);
      }

      const res = await axiosInstance.post(
        "/category/admin/createOrUpdate-category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(res?.data?.message || "Category saved successfully");

      if (setNewCategory) {
        setNewCategory(category.trim());
      }

      setCategory("");
      setStatus("Active");
      setSubInput("");
      setLocalSubcategories([]);
      setImage(null);
      setImageFile(null);
      onclose();
    } catch (err) {
      console.error("CATEGORY API ERROR:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "API Error");
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // preview
      setImageFile(file); // 🔥 required for API
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onclose}
    >
      <div
        className="bg-white w-[380px] rounded-xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-medium mb-4">Add Category</h2>

        <div className="mb-3">
          <p className="text-sm font-medium mb-2">Category Status</p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="categoryStatus"
                checked={status === "Active"}
                onChange={() => setStatus("Active")}
              />
              <span className="text-[#1C3753] font-medium">Active</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="categoryStatus"
                checked={status === "Inactive"}
                onChange={() => setStatus("Inactive")}
              />
              <span className="text-[#1C3753] font-medium">Inactive</span>
            </label>
          </div>

          <div className="flex flex-col gap-1 mt-3">
            <span>Category Image</span>
            <label className="border border-[#DEDEDE] bg-[#efefef] w-[50px] h-[50px] rounded-lg flex justify-center items-center cursor-pointer overflow-hidden">
              {!image && (
                <CgSoftwareUpload className="text-[24px] text-[#1C3753]" />
              )}
              {image && (
                <img
                  src={image}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-sm mb-2 block">Category Name</label>
            <input
              type="text"
              placeholder="Enter Category name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg outline-none"
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-sm mb-2 block">Add Sub-Category Name</label>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Enter sub-category name"
                value={subInput}
                onChange={(e) => setSubInput(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg outline-none"
              />

              {location.pathname !== "/admin/add-product" && (
                <button
                  type="button"
                  onClick={addSubcategory}
                  className="text-start text-[#006EE1] text-sm"
                >
                  + Add more sub-category
                </button>
              )}
            </div>

            {subcategories.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {subcategories.map((sub, idx) => (
                  <span
                    key={`${sub}-${idx}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F8FBFC] text-sm border"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 text-sm bg-[#1C3753] text-white py-2 rounded-lg"
            >
              Save Category
            </button>

            <button
              type="button"
              onClick={onclose}
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

export default CategoriesPopOnClick;
