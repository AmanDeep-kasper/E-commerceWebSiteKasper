import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/cart/productSlice";
import {
  ArrowLeft,
  ChevronDown,
  IndianRupee,
  IndianRupeeIcon,
  Package,
  Percent,
  PercentCircle,
  Plus,
} from "lucide-react";
import { Link } from "react-router";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    SKU: "",
    dimension: "",
    basePrice: "",
    amazonPrice: "",
    discountPercent: "",
    materialType: "",
    stockQuantity: "",
    color: "",
    returnPolicy: "",
    weight: "",
    type: "Framed",
    description: "",
    tags: "",
    deliverBy: "3", // default 3 days
    bulletPoints: "", // pipe (|) separated string
  });

  const [images, setImages] = useState([]);

  // handle text fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle image files
  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // create FormData for multipart
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    // append multiple images
    if (images.length > 0) {
      images.forEach((file) => {
        formDataObj.append("images", file);
      });
    }

    // dispatch thunk
    dispatch(addProduct(formDataObj));
  };

  return (
    <div className=" rounded-md min-h-screen ">
      {/* Header */}
      <Link to={`/admin/products`}>
        <div className="h-16 bg-white rounded-lg  flex items-center gap-3 px-4">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
          <h1 className="text-black text-[20px] font-medium font-['Inter']">
            Add Product
          </h1>
        </div>
      </Link>

      {/* Product Info Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mt-4">
        {/* Left Section */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="flex items-center gap-2 text-[20px] font-medium font-['Inter'] mb-4">
            <Package className="w-6 h-6 text-gray-700" />
            Basic Information
          </h2>

          <div className="flex gap-6 mb-5 ">
            {["Framed", "Unframed"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="frameType"
                  value="Framed"
                  className="scale-125 text-blue-600 border-gray-300 focus:ring-blue-500"
                />

                <span className="text-stone-600 text-sm font-normal">
                  {option}
                </span>
              </label>
            ))}
          </div>
          {/* Product Title */}
          <div className="mb-5">
            <label className="block text-black text-[14px] font-medium mb-2">
              Product Title
            </label>
            <input
              type="text"
              placeholder="Enter Product Name"
              className="w-full h-[45px] border border-[#D0D0D0] rounded-md px-3 py-2
          text-[#6B6B6B] text-sm font-normal bg-[#FAFAFA]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-black text-[14px] font-medium mb-2">
              Description
            </label>
            <textarea
              placeholder="Description"
              rows="3"
              className="w-full border border-[#D0D0D0] rounded-md px-3 py-2
          text-[#6B6B6B] text-sm font-normal bg-[#FAFAFA]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
            ></textarea>
          </div>

          {/* Product Image Upload */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Product Image
            </label>

            <label
              htmlFor="productImage"
              className="w-36 h-36 bg-[#ECECF0] border border-neutral-200 rounded-lg 
      flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
            >
              <input
                id="productImage"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 flex items-center justify-center rounded-full border border-[#D0D0D0] bg-white">
                <Plus className="text-[#5F5F5F] w-6 h-6" />
              </div>
            </label>
          </div>
        </div>

        {/* /////////////////////////////////////////// */}
        {/* Right Section */}

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-black text-[20px] font-medium mb-4">
            Product Details
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* SKU ID */}
            <div>
              <label className="block text-sm font-medium mb-2">SKU ID</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Generate SKU ID"
                  className="flex-1 border border-[#D0D0D0] rounded-l-lg h-[45px] px-3  bg-[#FAFAFA] text-sm text-[#6B6B6B] placeholder-[#6B6B6B] focus:outline-none"
                />
                <button className="bg-amber-600 text-white px-4 rounded-r-lg hover:bg-amber-700">
                  Generate
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="relative w-full ">
                <select
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] 
      text-sm text-gray-700 focus:outline-none focus:ring-2  appearance-none cursor-pointer "
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Select Category
                  </option>
                  <option>Spiritual & Religious Art</option>
                  <option>Nature & Wildlife</option>
                  <option>Geometric & Abstract</option>
                  <option>Typography & Symbols</option>
                  <option>Clones</option>
                  <option>Festival & Occasion</option>
                  <option>Reflection Art</option>
                </select>

                {/* Chevron icon */}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Sub Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Sub Category
              </label>
              <div className="relative w-full">
                <select
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] 
      text-sm text-[#6B6B6B] focus:outline-none focus:ring-2  appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Select Subcategory
                  </option>
                  <option>Lord Ganesha</option>
                  <option>Lord Shiva (Natraja/Trishul)</option>
                  <option>Buddha</option>
                  <option>Om Symbol</option>
                  <option>Mandala Art</option>
                  <option>Tree of Life</option>
                  <option>Islamic Calligraphy (Bismillah, Ayatul Kursi)</option>
                  <option>Jesus / cross / Angel</option>
                </select>

                {/* Chevron icon */}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="relative w-full">
                <select
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] 
      text-sm text-[#6B6B6B] focus:outline-none focus:ring-2  appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Select Tags
                  </option>
                  <option>Bestseller</option>
                  <option>Spiritual</option>
                  <option>Gift</option>
                </select>

                {/* Chevron icon */}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Material Type
              </label>
              <div className="relative w-full">
                <select
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] 
      text-sm text-[#6B6B6B] focus:outline-none focus:ring-2  appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Select Material Type
                  </option>
                  <option>Metal</option>
                </select>

                {/* Chevron icon */}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium mb-2">Weight</label>
              <input
                type="text"
                placeholder="Enter Product Weight"
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm placeholder-[#6B6B6B] text-gray-600 focus:outline-none"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                placeholder="Enter Total Quantity"
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm placeholder-[#6B6B6B] text-gray-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Return Eligible Checkbox */}
          <div className="mt-5 flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-black">
              Eligible for return
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white rounded-2xl border p-6 mt-6">
        <h2 className="text-black text-xl font-medium mb-4">Pricing</h2>
        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">MRP</label>
            <input
              type="number"
              placeholder="Enter MRP"
              className="w-[380px] h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Selling Price (₹)
            </label>
            <input
              type="number"
              placeholder="Enter Selling Price"
              className="w-[380px] h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Cost Price (₹)
            </label>
            <input
              type="number"
              placeholder="Enter Cost Price"
              className="w-[380px] h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Profit</label>
            <input
              type="number"
              placeholder="Auto calculated"
              className="w-[380px] h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discount</label>
            <div className="flex  items-center gap-2">
              <div className="flex flex-row">
                <input
                  type="text"
                  placeholder="Discount %"
                  className="flex-1 border border-[#D0D0D0] rounded-l-lg  px-3 w-[170px] h-[45px] bg-[#FAFAFA] text-sm text-[#6B6B6B] placeholder-[#6B6B6B] focus:outline-none"
                />
                <div className="bg-[#D0D0D0] text-[#000000] px-4  py-[13px] w-[46px] rounded-r-lg">
                  <PercentCircle size={"16px"} />
                </div>
              </div>
              <div className="flex flex-row">
                <input
                  type="text"
                  placeholder="Discount ₹"
                  className="flex-1 border border-[#D0D0D0] rounded-l-lg px-3 w-[170px] h-[45px] bg-[#FAFAFA] text-sm text-[#6B6B6B] placeholder-[#6B6B6B] focus:outline-none"
                />
                <div className="bg-[#D0D0D0] text-[#000000]  px-4 py-[13px] w-[46px] rounded-r-lg ">
                  <IndianRupeeIcon size={"16px"} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-6">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <input
                type="checkbox"
                className="w-4 h-4  cursor-pointer"
              />
             It includesTax?
            </label>

            <input
              type="number"
              placeholder="Enter Cost Price"
              className="w-[243px] h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button className="px-6 py-2 bg-gray-200 rounded-lg text-gray-800 font-medium hover:bg-gray-300">
          Cancel
        </button>
        <button className="px-6 py-2 bg-lime-600 rounded-lg text-white font-medium hover:bg-lime-700">
          Save
        </button>
      </div>
    </div>
  );
};

export default AddProduct;

//  <form
//       onSubmit={handleSubmit}
//       encType="multipart/form-data"
//       className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md h-[800px] overflow-y-auto"
//     >
//       <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
//         Add New Product
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Column 1 */}
//         <div className="space-y-4">
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Title
//             </label>
//             <input
//               name="title"
//               onChange={handleChange}
//               placeholder="Product title"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Category
//             </label>
//             <input
//               name="category"
//               onChange={handleChange}
//               placeholder="Category"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* Subcategory */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Subcategory
//             </label>
//             <input
//               name="subcategory"
//               onChange={handleChange}
//               placeholder="Subcategory"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* SKU */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               SKU
//             </label>
//             <input
//               name="SKU"
//               onChange={handleChange}
//               placeholder="SKU"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* Dimension */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Dimension
//             </label>
//             <input
//               name="dimension"
//               onChange={handleChange}
//               placeholder="Dimension"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* Base Price */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Base Price ($)
//             </label>
//             <input
//               name="basePrice"
//               type="number"
//               onChange={handleChange}
//               placeholder="0.00"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* Amazon Price */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Amazon Price ($)
//             </label>
//             <input
//               name="amazonPrice"
//               type="number"
//               onChange={handleChange}
//               placeholder="0.00"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>
//         </div>

//         {/* Column 2 */}
//         <div className="space-y-4">
//           {/* Discount */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Discount %
//             </label>
//             <input
//               name="discountPercent"
//               type="number"
//               onChange={handleChange}
//               placeholder="0"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* Material Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Material Type
//             </label>
//             <input
//               name="materialType"
//               onChange={handleChange}
//               placeholder="Comma separated materials"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* Stock Quantity */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Stock Quantity
//             </label>
//             <input
//               name="stockQuantity"
//               type="number"
//               onChange={handleChange}
//               placeholder="0"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* Color */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Color
//             </label>
//             <input
//               name="color"
//               onChange={handleChange}
//               placeholder="Comma separated colors"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* Return Policy */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Return Policy
//             </label>
//             <input
//               name="returnPolicy"
//               onChange={handleChange}
//               placeholder="Return policy details"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* Weight */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Weight
//             </label>
//             <input
//               name="weight"
//               onChange={handleChange}
//               placeholder="Product weight"
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           {/* Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Type
//             </label>
//             <select
//               name="type"
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md"
//             >
//               <option value="Framed">Framed</option>
//               <option value="Unframed">Unframed</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Full width fields */}
//       <div className="mt-6 space-y-4">
//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Description
//           </label>
//           <textarea
//             name="description"
//             onChange={handleChange}
//             placeholder="Product description"
//             rows={4}
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>

//         {/* Tags */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Tags
//           </label>
//           <input
//             name="tags"
//             onChange={handleChange}
//             placeholder="Comma separated tags"
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>

//         {/* Bullet Points */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Bullet Points (separate with "|")
//           </label>
//           <input
//             name="bulletPoints"
//             onChange={handleChange}
//             placeholder="Point 1 | Point 2 | Point 3"
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>

//         {/* Deliver By */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Deliver By (days)
//           </label>
//           <input
//             name="deliverBy"
//             type="number"
//             onChange={handleChange}
//             value={formData.deliverBy}
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>

//         {/* Images */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Product Images
//           </label>
//           <input
//             type="file"
//             multiple
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
//             file:rounded-md file:border-0 file:text-sm file:font-semibold
//             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//           />
//         </div>
//       </div>

//       {/* Submit button */}
//       <button
//         type="submit"
//         className="mt-8 w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         Add Product
//       </button>
//     </form>
