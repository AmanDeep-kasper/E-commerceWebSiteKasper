// import React, { useState } from "react";

// const CategoriesPopOnClick = ({ open, onclose }) => {
//   const [category, setCategory] = useState("");
//   const [subcategory, setSubCategory] = useState("");
//   const [status, setStatus] = useState("Active");

//   if (!open) return null;

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const payload = {
//       name: category,
//       name: subcategory,
//       status: status,
//     };

//     console.log(payload);

//     setCategory("");
//     setSubCategory("");
//     setStatus("Active");
//     onclose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//       <div className="bg-white w-[380px] rounded-xl p-4">
//         <h2 className="text-lg font-medium mb-4">Add Category</h2>
//         <div className="mb-3">
//           <p className="text-sm font-medium mb-2">Category Status</p>
//           <div className="flex gap-6">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 checked={status === "Active"}
//                 onChange={() => setStatus("Active")}
//               />
//               <span className="text-[#1C3753] font-medium">Active</span>
//             </label>

//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 checked={status === "Inactive"}
//                 onChange={() => setStatus("Inactive")}
//               />
//               <span className="text-[#1C3753] font-medium">Inactive</span>
//             </label>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="">
//           <div className="mb-2">
//             <label className="text-sm  mb-2" htmlFor="Category Name">
//               Category Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter Category name"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full border px-3 py-2 rounded-lg"
//               required
//             />
//           </div>
//           <div>
//             <label className="text-sm  mb-2" htmlFor="Category Name">
//               Add Sub-Category Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter Category name"
//               value={subcategory}
//               onChange={(e) => setSubCategory(e.target.value)}
//               className="w-full border px-3 py-2 rounded-lg"
//               required
//             />
//             <button className="text-[#006EE1] text-[12px] hover:underline">
//               <span>+</span> Add more sub-category
//             </button>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-2 pt-2">
//             <button
//               type="submit"
//               className="flex-1 text-sm  bg-[#1C3753] text-white py-2 rounded-lg"
//             >
//               Save Category
//             </button>

//             <button
//               type="button"
//               onClick={onclose}
//               className="flex-1 text-sm  border py-2 rounded-lg"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CategoriesPopOnClick;

import React, { useState } from "react";
import { CgSoftwareUpload } from "react-icons/cg";
const CategoriesPopOnClick = ({ open, onclose }) => {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null);

  // one input for typing + array to store many subcategories
  const [subInput, setSubInput] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  if (!open) return null;

  const addSubcategory = (e) => {
    e.preventDefault(); // stop form submit
    const value = subInput.trim();
    if (!value) return;

    // avoid duplicates (optional)
    if (subcategories.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setSubInput("");
      return;
    }

    setSubcategories((prev) => [...prev, value]);
    setSubInput("");
  };

  const removeSubcategory = (index) => {
    setSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // if user typed a subcategory but didn’t click "Add", include it
    const finalSubs = [...subcategories];
    const typed = subInput.trim();
    if (typed) finalSubs.push(typed);

    const payload = {
      name: category.trim(),
      status,
      subcategories: finalSubs,
    };

    console.log(payload);

    // reset
    setCategory("");
    setStatus("Active");
    setSubInput("");
    setSubcategories([]);
    onclose();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const removeImage = (e) => {
    e.stopPropagation(); // prevent opening file input
    setImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[380px] rounded-xl p-4">
        <h2 className="text-lg font-medium mb-4">Add Category</h2>

        {/* Status */}
        <div className="mb-3">
          <p className="text-sm font-medium mb-2">Category Status</p>
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
          <div className="flex flex-col gap-1 mt-3">
            <span>Category Image</span>
            <label className="border border-[#DEDEDE] bg-[#efefef] w-[50px] h-[50px] rounded-lg flex justify-center items-center cursor-pointer overflow-hidden">

              {/* Show icon if no image */}
              {!image && (
                <CgSoftwareUpload className="text-[24px] text-[#1C3753]" />
              )}

              {/* Show image after upload */}
              {image && (
                <img
                  src={image}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              )}
              

              {/* Hidden file input */}
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
          {/* Category */}
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

          {/* Subcategory input + add button */}
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

              <button
                type="button"
                onClick={addSubcategory}
                className=" text-start  text-[#006EE1] text-sm"
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
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F8FBFC] text-sm border"
                  >
                    {sub}
                    {/* <button
                      type="button"
                      onClick={() => removeSubcategory(idx)}
                      className="text-red-500 font-bold"
                      aria-label="Remove"
                    >
                      ×
                    </button> */}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
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
