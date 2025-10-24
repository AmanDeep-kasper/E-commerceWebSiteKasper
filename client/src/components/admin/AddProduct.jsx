import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Navigate, useNavigate } from "react-router";
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
  Trash,
} from "lucide-react";
import { data, Link } from "react-router";
import AddCategoryPopUp from "./AddCategoryPopUp";

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    // Basic info
    type: "",
    title: "",
    description: "",
    images: [],

    // Product details
    SKU: "",
    category: "",
    subcategory: "",
    tags: "",
    materialType: "",
    weight: "",
    stockQuantity: "",
    returnPolicy: false,

    // Pricing
    mrp: "",
    sellingPrice: "",
    costPrice: "",
    profit: "",
    discountPercent: "",
    discountAmount: "",
    includesTax: false,
    taxPercent: "",

    // Product Variants
    hasVariants: false,
    variants: [
      {
        variantType: "",
        variantValue: "",
        variantQuantity: "",
        variantReorderLimit: "",
        variantImage: [],
      },
    ],
  });

  const [images, setImages] = useState([]);

  // handle text fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    const update = { ...formData, [name]: value };
    // Convert to numbers for calculation

    const mrp = parseFloat(update.mrp) || 0;
    const sellingPrice = parseFloat(update.sellingPrice) || 0;

    // Calculate discount only  MRP and Selling Price are valid
    if (mrp > 0 && sellingPrice >= 0 && sellingPrice <= mrp) {
      const discountAmount = mrp - sellingPrice;
      const discountPercent = ((discountAmount / mrp) * 100).toFixed(2);

      update.discountAmount = discountAmount.toFixed(2);
      update.discountPercent = discountPercent;
    } else {
      // reset if invalid
      update.discountAmount = "";
      update.discountPercent = "";
    }
    setFormData(update);

    // Convert inputs to numbers for calculation
    // // to generated in profit
    const sp = parseFloat(update.sellingPrice) || 0;
    const cp = parseFloat(update.costPrice) || 0;

    // ✅ Calculate Profit and Profit %

    if (sp > 0 && cp > 0) {
      const profit = sp - cp;
      update.profit = profit.toFixed(2);
    } else {
      update.profit = "";
    }
    setFormData(update);
  };

  // handle image files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // ✅ Allowed types

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ];

    // ✅ Filter invalid types
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      alert("Only PNG, JPG, JPEG, WEBP, and SVG formats are allowed.");
    }

    // ✅ Filter out duplicates by comparing the name and size (to ensure the same image isn't added twice)
    const newFiles = validFiles.filter(
      (file) =>
        !formData.images.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size
        )
    );

    // If we have more than 4 images already, prevent adding more
    if (formData.images.length + newFiles.length > 4) {
      alert("You can upload a maximum of 4 images.");
      return; // Prevent further action
    }

    // ✅ Combine current images with new valid files

    const updateImages = [...formData.images, ...newFiles];

    setFormData((prev) => ({
      ...prev,
      images: updateImages,
    }));
    e.target.value = "";
  };

  //variant image:

  const [variantImage, setVariantImage] = useState([]);

  const [downvariantopen, setDownVariantOpen] = useState(false);

  //the variants drop down
  const [variantopen, setVariantOpen] = useState(null); // track which dropdown is open
  const variantOptions = ["Size", "Color", "Weight", "Material"];

  // ✅ Handle field change for a specific variant
  const handleVariantChange = (index, field, value) => {
    const updateVariants = [...formData.variants];
    updateVariants[index][field] = value;
    setFormData((prev) => ({ ...prev, variants: updateVariants }));
  };

  // ✅ Handle image upload per variant
  const handleVariantImageChange = (e, index) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Add preview URLs only once
    const filesWithPreview = files.map((file) => {
      if (!file.preview) file.preview = URL.createObjectURL(file);
      return file;
    });

    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      const existing = updatedVariants[index].variantImage || [];

      // Filter duplicates by name + size
      const unique = [...existing, ...filesWithPreview].filter(
        (v, i, self) =>
          i === self.findIndex((t) => t.name === v.name && t.size === v.size)
      );

      updatedVariants[index].variantImage = unique.slice(0, 4);
      return { ...prev, variants: updatedVariants };
    });

    // Reset input so selecting same file again works
    e.target.value = "";
  };

  // ✅ Remove a specific image from a specific variant
  const removeVariantImage = (variantIndex, imgIndex) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      const images = [...updatedVariants[variantIndex].variantImage];

      // remove only the clicked image
      images.splice(imgIndex, 1);

      updatedVariants[variantIndex].variantImage = images;
      return { ...prev, variants: updatedVariants };
    });
  };

  // ✅ Add new variant section dynamically
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          variantType: "",
          variantValue: "",
          variantQuantity: "",
          variantReorderLimit: "",
          variantImage: [],
        },
      ],
    }));
  };

  // submit handler

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.category.trim() ||
      !formData.subcategory.trim()
    ) {
      toast.error("Please fill in all required fields!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-red-700 text-white rounded-lg",
      });
      return;
    }
    console.log("Form Data:", formData);

    // Create FormData object for multipart/form-data
    const formDataObj = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "variants") {
        formData.variants.forEach((variant, index) => {
          Object.keys(variant).forEach((vKey) => {
            if (variant[vKey] instanceof File) {
              formDataObj.append(`variants[${index}][${vKey}]`, variant[vKey]);
            } else {
              formDataObj.append(`variants[${index}][${vKey}]`, variant[vKey]);
            }
          });
        });
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => formDataObj.append(key, item));
      } else {
        formDataObj.append(key, formData[key]);
      }
    });

    // Dispatch thunk to save data
    dispatch(addProduct(formDataObj));

    // Save current form data to localStorage
    localStorage.setItem("addProductForm", JSON.stringify(formData));

    // Reset form
    setFormData({
      type: "",
      title: "",
      description: "",
      images: [],
      SKU: "",
      category: "",
      subcategory: "",
      tags: "",
      materialType: "",
      weight: "",
      stockQuantity: "",
      returnPolicy: false,
      mrp: "",
      sellingPrice: "",
      costPrice: "",
      profit: "",
      discountPercent: "",
      discountAmount: "",
      includesTax: false,
      taxPercent: "",
      hasVariants: false,
      variants: [
        {
          variantType: "",
          variantValue: "",
          variantQuantity: "",
          variantReorderLimit: "",
          variantImage: [],
        },
      ],
    });

    toast.success("Product added successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "bg-[#EEFFEF] text-black rounded-lg",
    });

    if (
      !formData.title.trim() ||
      !formData.category.trim() ||
      !formData.subcategory.trim()
    ) {
      toast.error("Please fill in all required fields!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-[#EEFFEF] text-white rounded-lg",
      });
      return;
    }

    setTimeout(() => {
      navigate("/admin/products"); // replace with your actual route
    }, 1000);
  };

  // sku id generated in random
  const generatedSKU = () => {
    // const prefix = "SKU";
    const random = Math.floor(100000 + Math.random() * 900000000000); // 6 randome digits
    const newSKU = `${random}`;
    setFormData((prev) => ({ ...prev, SKU: newSKU }));
  };

  // this is first drop down
  const [categoriesopen, setCategoriesOpen] = useState(false);
  // selected option
  const [selected, setSelected] = useState("Select Price Range");

  // sample data (you can replace this with dynamic data)

  const [categories, setCategories] = useState([
    "Spiritual & Religious Art",
    "Nature & Wildlife",
    "Geometric & Abstract",
    "Wall Arts",
    "Typography & Symbols",
    "Clones",
    "Festival & Occasion",
    "Reflection Art",
  ]);

  // Second drop down box

  const [subcategories, setSubcategories] = useState([
    "Lord Ganesha",
    "Lord Shiva (Natraja/Trishul)",
    "Buddha",
    "Om Symbol",
    "Mandala Art",
    "Tree of Life",
    "Islamic Calligraphy (Bismillah, Ayatul Kursi)",
    "Jesus / Cross / Angel",
  ]);

  const [subdropdown, setSubDropDown] = useState(false);

  const [subselected, setSubSelect] = useState("Select Subcategory");

  // tags drop down box

  const Tags = ["Bestseller", "Spiritual", "Gift"];

  const [tagsbtn, setTagsBtn] = useState(false);
  const [tags, setTagsDown] = useState("Select Tags");

  //Material Type drop down

  const material = ["Metal"];

  const [materialbtn, setmaterialbtn] = useState(false);
  const [materialdata, setMaterialData] = useState("Select Material Type");

  // toggal btn
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  // the hidden items in bottom

  const [itemsopen, setItemsOpen] = useState(false);

  // The dropdown in gst

  const [opengstbosx, setOpenGstBox] = useState(false);
  const [gastrate, setGstRate] = useState("5%");

  const gstRateList = [
    "0.1%(special Rate)",
    "3%(Jewelery,gold,etc)",
    "5%(Essential Goods)",
    "12%(Processed Goods)",
    "18%(Standard Rate)",
    "28%(Luxury items)",
  ];

  // Modal for adding new category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  return (
    <>
      {showCategoryModal && (
        <AddCategoryPopUp
          setNewCategory={setNewCategory}
          newCategory={newCategory}
          setShowCategoryModal={setShowCategoryModal}
          categories={categories}
          setCategories={setCategories}
          subcategories={subcategories}
          setSubcategories={setSubcategories}
        />
      )}

      <form
        className=" rounded-md min-h-screen "
        onSubmit={handleSubmit}
        encType="multipart/form-data">
        {/* Header */}
        <div className="h-16 bg-white rounded-lg  flex items-center gap-3 px-4">
          <Link to={`/admin/products`}>
            <div className=" flex items-center">
              <ArrowLeft className="w-6 h-6 text-gray-800" />
              <h1 className="text-black text-[20px] font-semibold font-['Inter']">
                Add Product
              </h1>
            </div>
          </Link>
        </div>

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
                  className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={option}
                    checked={formData.type === option}
                    onChange={handleChange}
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
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full border border-[#D0D0D0] rounded-md px-3 py-2
          text-[#6B6B6B] text-sm font-normal bg-[#FAFAFA]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"></textarea>
            </div>

            {/* Product Image Upload */}
            <div>
              <label className="block text-black text-sm font-medium mb-2">
                Product Image
              </label>

              <div className="flex flex-wrap gap-3 items-start">
                {/* Image Preview Section */}
                {formData.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview ${i}`}
                      className="w-[137px] h-[137px] object-cover rounded-lg border border-neutral-200"
                    />

                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition rounded-lg"></div>

                    {/*Overlay Remove button */}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, index) => index !== i),
                        }));
                      }}
                      className="absolute top-2 right-2 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Trash size={20} />
                    </button>
                  </div>
                ))}

                {/* Upload Box */}
                {formData.images.length < 4 && (
                  <label
                    htmlFor="productImage"
                    className="w-[137px] h-[137px] bg-[#ECECF0] border border-neutral-200 rounded-lg 
        flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                    <input
                      id="productImage"
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg,.webp,.svg"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="w-12 h-12 flex items-center justify-center rounded-full border border-[#D0D0D0] bg-white">
                      <Plus className="text-[#5F5F5F] w-6 h-6" />
                    </div>
                  </label>
                )}
              </div>
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
                    name="SKU"
                    value={formData.SKU}
                    onChange={handleChange}
                    placeholder="Generate SKU ID"
                    className="flex-1 border border-[#D0D0D0] rounded-l-lg h-[45px] px-3  bg-[#FAFAFA] text-sm text-[#6B6B6B] placeholder-[#6B6B6B] focus:outline-none"
                  />
                  <button
                    type="button"
                    className="bg-amber-600 text-white px-4 rounded-r-lg hover:bg-amber-700"
                    onClick={generatedSKU}>
                    Generate
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <div className="relative inline-block w-full">
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((prev) => !prev)}
                    className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B] focus:outline-none placeholder:text-[#6B6B6B]">
                    <span>{formData.category || "Select Category"}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#6B6B6B] transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Price Dropdown Menu */}
                  {categoriesopen && (
                    <ul className="absolute z-10 w-full border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-[15px]">
                      {categories.map((p, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, category: p }));
                            setCategoriesOpen(false);
                          }}
                          className={`flex items-center justify-between px-4 py-2 hover:bg-[#FFEAD2] cursor-pointer ${
                            formData.category === p
                              ? "bg-gray-100 text-[#6B6B6B]"
                              : ""
                          }`}>
                          <span>{p}</span>
                        </li>
                      ))}

                      {/* Add Category button inside dropdown */}
                      <li className="sticky bottom-0 bg-white px-1 py-2 flex justify-center">
                        <button
                          type="button"
                          className="bg-[#DD851F] text-white px-3 py-2 rounded-md hover:bg-orange-600 w-full"
                          onClick={() => setShowCategoryModal(true)}>
                          + Add Category
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Sub Category */}
              <div>
                <div className="relative inline-block w-full ">
                  <label className="block text-sm font-medium mb-2">
                    Sub Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setSubDropDown((prev) => !prev)}
                    className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B] focus:outline-none placeholder:text-[#6B6B6B]">
                    <span>{formData.subcategory || "Select Subcategory"}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#6B6B6B] transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Sub Dropdown Menu */}
                  {subdropdown && (
                    <ul className="absolute z-10 w-full border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-[15px]">
                      {subcategories.map((p, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              subcategory: p,
                            }));
                            setSubDropDown(false);
                          }}
                          className={`flex items-center justify-between px-4 py-2 hover:bg-[#FFEAD2] cursor-pointer ${
                            selected === p ? "bg-gray-100 text-[#6B6B6B]" : ""
                          }`}>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setTagsBtn((prev) => !prev)}
                    className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B] focus:outline-none placeholder:text-[#6B6B6B]">
                    <span>{formData.tags || "Select Tags"}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#6B6B6B] transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {tagsbtn && (
                    <ul className="absolute z-10 w-full border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-[15px]">
                      {Tags.map((p, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, tags: p }));
                            setTagsBtn(false);
                          }}
                          className={`flex items-center justify-between px-4 py-2 hover:bg-[#FFEAD2] cursor-pointer ${
                            selected === p ? "bg-gray-100 text-[#6B6B6B]" : ""
                          }`}>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Material */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Material Type
                </label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setmaterialbtn((prev) => !prev)}
                    className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B] focus:outline-none placeholder:text-[#6B6B6B]">
                    <span>
                      {formData.materialType || "Select Material Type"}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#6B6B6B] transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {materialbtn && (
                    <ul className="absolute z-10 w-full border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-[15px]">
                      {material.map((p, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              materialType: p,
                            }));
                            setmaterialbtn(false);
                          }}
                          className={`flex items-center justify-between px-4 py-2 hover:bg-[#FFEAD2] cursor-pointer ${
                            selected === p ? "bg-gray-100 text-[#6B6B6B]" : ""
                          }`}>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium mb-2">Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
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
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="Enter Total Quantity"
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm placeholder-[#6B6B6B] text-gray-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Return Eligible Checkbox */}
            <div className="mt-5 flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="returnPolicy"
                  checked={formData.returnPolicy}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Eligible for return
              </label>
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
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
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
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
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
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="Enter Cost Price"
                className="w-[380px] h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Profit</label>
              <input
                type="number"
                name="profit"
                value={formData.profit}
                readOnly
                // onChange={handleChange}
                placeholder="₹"
                className="w-[380px] h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Discount</label>
              <div className="flex  items-center gap-2">
                <div className="flex flex-row">
                  <input
                    type="text"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleChange}
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
                    name="discountAmount"
                    value={formData.discountAmount}
                    onChange={handleChange}
                    placeholder="Discount ₹"
                    className="flex-1 border border-[#D0D0D0] rounded-l-lg px-3 w-[170px] h-[45px] bg-[#FAFAFA] text-sm text-[#6B6B6B] placeholder-[#6B6B6B] focus:outline-none"
                  />
                  <div className="bg-[#D0D0D0] text-[#000000]  px-4 py-[13px] w-[46px] rounded-r-lg ">
                    <IndianRupeeIcon size={"16px"} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-7">
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <input
                  type="checkbox"
                  name="includesTax"
                  value={formData.includesTax}
                  onChange={handleChange}
                  className="w-4 h-4  cursor-pointer"
                />
                It includesTax?
              </label>
              <div>
                <div className="relative inline-block w-[243px] h-[45px] ">
                  <button
                    type="button"
                    onClick={() => setOpenGstBox((prev) => !prev)}
                    className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B] focus:outline-none placeholder:text-[#6B6B6B]">
                    <span>{formData.taxPercent || "5%"}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#6B6B6B] transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Sub Dropdown Menu */}
                  {opengstbosx && (
                    <ul className="absolute z-10 w-full border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-[15px]">
                      {gstRateList.map((p, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, taxPercent: p }));
                            setOpenGstBox(false);
                          }}
                          className={`flex items-center justify-between px-4 py-2 hover:bg-[#FFEAD2] cursor-pointer ${
                            selected === p ? "bg-gray-100 text-[#6B6B6B]" : ""
                          }`}>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border px-3 py-4 ">
          <div className="mb-5">
            <h1 className="text-[20px] font-medium">Product Variants</h1>
            <p className="text-[#727272] text-[16px] font-normal">
              Add Variants if the product comes in different option like size,
              color or material
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer select-none items-center">
              <div className="relative">
                <input
                  type="checkbox"
                  name="hasVariants"
                  checked={formData.hasVariants}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => ({ ...prev, hasVariants: checked }));
                    setItemsOpen(checked);
                  }}
                  className="sr-only"
                />
                <div
                  className={`block h-[18px] w-[34px] rounded-full transition-colors ${
                    formData.hasVariants ? "bg-[#5BB401]" : "bg-[#E5E7EB]"
                  }`}></div>
                <div
                  className={`absolute top-0.5 h-[13px] w-[13px] rounded-full bg-white transition-transform duration-200 ${
                    formData.hasVariants
                      ? "translate-x-[17px]"
                      : "translate-x-0"
                  }`}></div>
              </div>
            </label>
            <p className="text-[#2B2B2B] font-normal">
              This product has Variants
            </p>
          </div>

          {itemsopen && (
            <div>
              {formData.variants.map((variant, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border p-3 mt-6 transition-all">
                  <div className="grid grid-cols-5 gap-x-48">
                    {/* Variant Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Variants
                      </label>
                      <div className="relative w-[280px]">
                        <button
                          type="button"
                          onClick={() =>
                            setVariantOpen(variantopen === index ? null : index)
                          }
                          className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B]">
                          <span>{variant.variantType || "Select Option"}</span>
                          <ChevronDown
                            size={18}
                            className={`text-[#6B6B6B] transition-transform duration-200 ${
                              variantopen === index ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {variantopen === index && (
                          <ul className="absolute z-10 w-full border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-[15px]">
                            {variantOptions.map((opt, i) => (
                              <li
                                key={i}
                                onClick={() => {
                                  handleVariantChange(
                                    index,
                                    "variantType",
                                    opt
                                  );
                                  setVariantOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-[#FFEAD2] cursor-pointer">
                                {opt}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Value */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Value
                      </label>
                      <input
                        type="text"
                        // name="variantValue"
                        value={variant.variantValue}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantValue",
                            e.target.value
                          )
                        }
                        placeholder="Enter Value"
                        className="w-[280px] h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        // name="variantQuantity"
                        value={variant.variantQuantity}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantQuantity",
                            e.target.value
                          )
                        }
                        placeholder="Enter Quantity"
                        className="w-[280px] h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600"
                      />
                    </div>

                    {/* Reorder Limit */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Reorder Limit
                      </label>
                      <input
                        type="number"
                        // name="variantReorderLimit"
                        value={variant.variantReorderLimit}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantReorderLimit",
                            e.target.value
                          )
                        }
                        placeholder="Enter Reorder Limit"
                        className="w-[280px] h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600"
                      />
                    </div>

                    {/* Product Image */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Product Image
                      </label>

                      <div className="relative w-[60px] h-[60px]">
                        {/* ✅ Show first image if uploaded */}
                        {variant.variantImage?.length > 0 ? (
                          <div className="relative w-[60px] h-[60px]">
                            <img
                              src={
                                typeof variant.variantImage[0] === "string"
                                  ? variant.variantImage[0]
                                  : variant.variantImage[0].preview ||
                                    URL.createObjectURL(variant.variantImage[0])
                              }
                              alt="Variant"
                              className="w-[60px] h-[60px] object-cover rounded-lg border border-neutral-200"
                            />

                            {/* ✅ Overlay for extra images */}
                            {variant.variantImage.length > 1 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium rounded-lg">
                                +{variant.variantImage.length - 1}
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => removeVariantImage(index, 0)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                              ×
                            </button>

                            {/* ✅ Hide upload if already 4 images */}
                            {variant.variantImage.length < 4 && (
                              <label
                                htmlFor={`variantImage-${index}`}
                                className="absolute bottom-5 left-20 -translate-x-1/2 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100">
                                <input
                                  id={`variantImage-${index}`}
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) =>
                                    handleVariantImageChange(e, index)
                                  }
                                />
                                <Plus className="text-gray-500 w-3 h-3" />
                              </label>
                            )}
                          </div>
                        ) : (
                          // ✅ Upload button if no image yet
                          <label
                            htmlFor={`variantImage-${index}`}
                            className="w-[60px] h-[60px] bg-[#ECECF0] border border-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200">
                            <input
                              id={`variantImage-${index}`}
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) =>
                                handleVariantImageChange(e, index)
                              }
                            />
                            <div className="w-[22px] h-[22px] flex items-center justify-center rounded-full border border-[#D0D0D0] bg-white">
                              <Plus className="text-[#5F5F5F] w-[9px] h-[9px]" />
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Variant Button */}
              <div className="flex items-center justify-start mt-3">
                <button
                  type="button"
                  onClick={addVariant}
                  className="bg-[#DD851F] text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600">
                  + Add Variants
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button className="px-6 py-2 bg-gray-200 rounded-lg text-gray-800 font-medium hover:bg-gray-300">
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-lime-600 rounded-lg text-white font-medium hover:bg-lime-700">
            Save
          </button>
        </div>
      </form>
    </>
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
