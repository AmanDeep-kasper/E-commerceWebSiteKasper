import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Navigate, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/cart/productSlice";
import { v4 as uuidv4 } from "uuid";

import {
  ArrowLeft,
  ChevronDown,
  IndianRupee,
  IndianRupeeIcon,
  Package,
  PencilLine,
  Percent,
  PercentCircle,
  Plus,
  Trash,
} from "lucide-react";
import { data, Link } from "react-router";
import AddCategoryPopUp from "./AddCategoryPopUp";
import AddSubCategoryPopup from "./AddSubCategoryPopup";
import DisplayVariantImg from "./DisplayVariantImg";

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    // Basic info
    uuid: uuidv4(), // ✅ unique product ID right from start
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
        variantId: uuidv4(), // ✅ unique ID for this variant
        variantType: "",
        variantName: "",
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
    if (formData.images.length + newFiles.length > 10) {
      alert("You can upload a maximum of 10 images.");
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
  const variantOptions = ["Color", "Dimension", "Size", "Material", "Weight"];

  // ✅ Handle field change for a specific variant
  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      const variant = { ...updatedVariants[index] };

      if (variant.variantName === "Dimension") {
        let width = variant.width || "";
        let height = variant.height || "";

        if (field === "width") width = value;
        if (field === "height") height = value;

        variant.width = width;
        variant.height = height;

        variant.variantValue =
          width && height ? `${width}*${height}cm` : width || height || "";
      } else {
        variant[field] = value;
      }

      updatedVariants[index] = variant;

      // Only calculate total if user is editing variantQuantity
      let updatedStock = prev.stockQuantity;

      if (field === "variantQuantity") {
        const totalVariantQty = updatedVariants.reduce((sum, v) => {
          const qty = Number(v.variantQuantity) || 0;
          return sum + qty;
        }, 0);

        // ✅ If any variantQuantity is entered, override the main stockQuantity
        if (totalVariantQty > 0) {
          updatedStock = totalVariantQty;
        }
      }

      return {
        ...prev,
        variants: updatedVariants,
        stockQuantity: updatedStock,
      };
    });
  };

  // ✅ Handle image upload per variant
  const handleVariantImageChange = (e, index) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const filesWithPreview = files.map((file) => {
      if (!file.preview) file.preview = URL.createObjectURL(file);
      return file;
    });

    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      const existing = updatedVariants[index].variantImage || [];

      const unique = [...existing, ...filesWithPreview].filter(
        (v, i, self) =>
          i === self.findIndex((t) => t.name === v.name && t.size === v.size)
      );

      if (unique.length > 10) {
        alert("You can upload up to 10 images only.");
      }

      updatedVariants[index].variantImage = unique.slice(0, 10);
      return { ...prev, variants: updatedVariants };
    });

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
          variantId: uuidv4(),
          variantType: "",
          variantName: "",
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

    // ✅ Validation
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

    // ✅ Add UUID for product & variant IDs
    const formDataWithUUID = {
      ...formData,
      uuid: formData.uuid || uuidv4(), // product-level unique ID (only if not already set)
      variants: formData.variants.map((variant) => ({
        ...variant,
        variantId: variant.variantId || uuidv4(), // add variant ID if missing
      })),
    };

    console.log("Form Data with UUID:", formDataWithUUID);

    // ✅ Prepare multipart form data
    const formDataObj = new FormData();

    Object.keys(formDataWithUUID).forEach((key) => {
      if (key === "variants") {
        formDataWithUUID.variants.forEach((variant, index) => {
          Object.keys(variant).forEach((vKey) => {
            const value = variant[vKey];
            if (Array.isArray(value)) {
              // Handle multiple images
              value.forEach((file) => {
                formDataObj.append(`variants[${index}][${vKey}]`, file);
              });
            } else {
              formDataObj.append(`variants[${index}][${vKey}]`, value);
            }
          });
        });
      } else if (Array.isArray(formDataWithUUID[key])) {
        formDataWithUUID[key].forEach((item) => formDataObj.append(key, item));
      } else {
        formDataObj.append(key, formDataWithUUID[key]);
      }
    });

    // ✅ Dispatch action
    dispatch(addProduct(formDataObj));

    // ✅ Store locally
    localStorage.setItem("addProductForm", JSON.stringify(formDataWithUUID));

    // ✅ Reset form
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
          variantId: uuidv4(), // <-- optional if you want blank variant pre-created
          variantType: "",
          variantName: "",
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

    // ✅ Navigate after success
    setTimeout(() => {
      navigate("/admin/products");
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
  const [showsubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // the new variants framed dropdown box

  const [variantTypeOpen, setVariantTypeOpen] = useState(null);

  const variantsType = ["Framed", "Unframed"];

  // auto close in sub category
  const dropdownRefSubCategory = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRefSubCategory.current &&
        !dropdownRefSubCategory.current.contains(event.target)
      ) {
        setSubDropDown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSubDropDown]);

  // auto close in  category

  const dropdownRefCategory = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRefCategory.current &&
        !dropdownRefCategory.current.contains(event.target)
      ) {
        setCategoriesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setCategoriesOpen]);

  // close automatically code

  const dropdownRefTag = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRefTag.current &&
        !dropdownRefTag.current.contains(event.target)
      ) {
        setTagsBtn(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setTagsBtn]);

  //auto close in materal

  const dropdownRefMateral = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRefMateral.current &&
        !dropdownRefMateral.current.contains(event.target)
      ) {
        setmaterialbtn(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setmaterialbtn]);

  // variants image pop up display all images

  // const handleOpenVariantPopup =()=>{
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState("");

  // the remove varinats in click in trash icon

  const removeVariant = (indexToRemove) => {
    // if (!window.confirm("Are you sure you want to delete this variant?"))
    //   return;
    setFormData((prev) => {
      const updatedVariants = prev.variants.filter(
        (_, i) => i !== indexToRemove
      );

      //  Optionally recalc total stock after removing a varia
      const totalVariantQty = updatedVariants.reduce((sum, v) => {
        const qt = Number(v.variantQuantity || 0);
        return sum + qt;
      }, 0);
      return {
        ...prev,
        variants: updatedVariants,
        stockQuantity:
          updatedVariants.length > 0 ? totalVariantQty : prev.stockQuantity,
      };
    });
  };

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

      {showsubCategoryModal && (
        <AddSubCategoryPopup
          setShowSubCategoryModal={setShowSubCategoryModal}
          setNewCategory={setNewCategory}
          newCategory={newCategory}
          setShowCategoryModal={setShowCategoryModal}
          categories={categories}
          setCategories={setCategories}
          subcategories={subcategories}
          setSubcategories={setSubcategories}
        />
      )}

      <DisplayVariantImg
        isModalOpen={isModalOpen}
        selectedImages={selectedImages}
        setIsModalOpen={setIsModalOpen}
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
      />
      <form
        className=" rounded-md min-h-screen "
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
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
                  className="flex items-center gap-2 cursor-pointer"
                >
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
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
              ></textarea>
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
                      className="w-[134px] h-[134px] object-cover rounded-lg border border-neutral-200"
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
                      className="absolute top-2 right-2 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                ))}

                {/* Upload Box */}
                {formData.images.length < 10 && (
                  <label
                    htmlFor="productImage"
                    className="w-[137px] h-[137px] bg-[#ECECF0] border border-neutral-200 rounded-lg 
        flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                  >
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
                    onClick={generatedSKU}
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Category */}
              <div ref={dropdownRefCategory}>
                <div className="relative inline-block w-full">
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((prev) => !prev)}
                    className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B] focus:outline-none placeholder:text-[#6B6B6B]"
                  >
                    <span>{formData.category || "Select Category"}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#6B6B6B] transition-transform duration-200 ${
                        categoriesopen ? "rotate-180" : ""
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
                          }`}
                        >
                          <span>{p}</span>
                        </li>
                      ))}

                      {/* Add Category button inside dropdown */}
                      <li className="sticky bottom-0 bg-white px-1 py-2 flex justify-center">
                        <button
                          type="button"
                          className="bg-[#DD851F] text-white px-3 py-2 rounded-md hover:bg-orange-600 w-full"
                          onClick={() => setShowCategoryModal(true)}
                        >
                          + Add Category
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Sub Category */}
              <div ref={dropdownRefSubCategory}>
                <div className="relative inline-block w-full">
                  <label className="block text-sm font-medium mb-2">
                    Sub Category
                  </label>

                  <button
                    type="button"
                    onClick={() => setSubDropDown((prev) => !prev)}
                    className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B] focus:outline-none placeholder:text-[#6B6B6B]"
                  >
                    <span>{formData.subcategory || "Select Subcategory"}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#6B6B6B] transform transition-transform duration-200 ${
                        subdropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
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
                          }`}
                        >
                          <span>{p}</span>
                        </li>
                      ))}
                      <li className="sticky bottom-0 bg-white px-1 py-2 flex justify-center">
                        <button
                          type="button"
                          className="bg-[#DD851F] text-white px-3 py-2 rounded-md hover:bg-orange-600 w-full"
                          onClick={() => setShowSubCategoryModal(true)}
                        >
                          + Add SubCategory
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div ref={dropdownRefTag}>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setTagsBtn((prev) => !prev)}
                    className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B] focus:outline-none placeholder:text-[#6B6B6B]"
                  >
                    <span>{formData.tags || "Select Tags"}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#6B6B6B] transition-transform duration-200 ${
                        tagsbtn ? "rotate-180" : ""
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
                          }`}
                        >
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Material */}
              <div ref={dropdownRefMateral}>
                <label className="block text-sm font-medium mb-2">
                  Material Type
                </label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setmaterialbtn((prev) => !prev)}
                    className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B] focus:outline-none placeholder:text-[#6B6B6B]"
                  >
                    <span>
                      {formData.materialType || "Select Material Type"}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#6B6B6B] transition-transform duration-200 ${
                        materialbtn ? "rotate-180" : ""
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
                          }`}
                        >
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
          <div className="grid  grid-cols-3 gap-x-44 gap-y-4">
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
                    className="flex-1 border border-[#D0D0D0] rounded-l-lg  px-3 w-[140px] h-[45px] bg-[#FAFAFA] text-sm text-[#6B6B6B] placeholder-[#6B6B6B] focus:outline-none"
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
                    className="flex-1 border border-[#D0D0D0] rounded-l-lg px-3 w-[140px] h-[45px] bg-[#FAFAFA] text-sm text-[#6B6B6B] placeholder-[#6B6B6B] focus:outline-none"
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
                    className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B] focus:outline-none placeholder:text-[#6B6B6B]"
                  >
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
                          }`}
                        >
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
        <div className="bg-white rounded-2xl border px-3 py-4 mt-6">
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
                  }`}
                ></div>
                <div
                  className={`absolute top-0.5 h-[13px] w-[13px] rounded-full bg-white transition-transform duration-200 ${
                    formData.hasVariants
                      ? "translate-x-[17px]"
                      : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>
            <p className="text-[#2B2B2B] font-normal">
              This product has Variants
            </p>
          </div>

          {itemsopen && (
            <div>
              <div className="bg-white rounded-2xl border p-3 mt-6 transition-all">
                {formData.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="group grid grid-cols-6 gap-4 mb-6 items-start hover:bg-[#FFF8F2] transition-all rounded-lg p-2"
                  >
                    {/* 1️⃣ Variant Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Variants Name
                      </label>
                      <div className="relative w-full">
                        <button
                          type="button"
                          onClick={() =>
                            setVariantOpen(variantopen === index ? null : index)
                          }
                          className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B]"
                        >
                          <span>{variant.variantName || "Select Option"}</span>
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
                                    "variantName",
                                    opt
                                  );
                                  setVariantOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-[#FFEAD2] cursor-pointer"
                              >
                                {opt}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* 2️ Variant Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Variant Type
                      </label>
                      <div className="relative w-full">
                        <button
                          type="button"
                          onClick={() =>
                            setVariantTypeOpen(
                              variantTypeOpen === index ? null : index
                            )
                          }
                          className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B]"
                        >
                          <span>
                            {variant.variantType || "Select Variant Type"}
                          </span>
                          <ChevronDown
                            size={18}
                            className={`text-[#6B6B6B] transition-transform duration-200 ${
                              variantTypeOpen === index ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {variantTypeOpen === index && (
                          <ul className="absolute z-10 w-full border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-[15px]">
                            {variantsType.map((opt, i) => (
                              <li
                                key={i}
                                onClick={() => {
                                  handleVariantChange(
                                    index,
                                    "variantType",
                                    opt
                                  );
                                  setVariantTypeOpen(null);
                                }}
                                className={`px-4 py-2 hover:bg-[#FFEAD2] cursor-pointer ${
                                  variant.variantType === opt
                                    ? "bg-[#FFF5E5]"
                                    : ""
                                }`}
                              >
                                {opt}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* 3️ Variant Value */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Value
                      </label>
                      {variant.variantName === "Dimension" ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Width (cm)"
                            value={variant.width || ""}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "width",
                                e.target.value
                              )
                            }
                            className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#FAFAFA] text-sm text-gray-600"
                          />
                          <span className="flex items-center text-gray-500 font-semibold">
                            ×
                          </span>
                          <input
                            type="number"
                            placeholder="Height (cm)"
                            value={variant.height || ""}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "height",
                                e.target.value
                              )
                            }
                            className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#FAFAFA] text-sm text-gray-600"
                          />
                        </div>
                      ) : variant.variantName === "Color" ? (
                        <input
                          type="text"
                          placeholder="Enter color name"
                          value={variant.variantValue || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "variantValue",
                              e.target.value
                            )
                          }
                          className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#FAFAFA] text-sm text-gray-600"
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={`Enter ${
                            variant.variantName || "value"
                          }`}
                          value={variant.variantValue || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "variantValue",
                              e.target.value
                            )
                          }
                          className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#FAFAFA] text-sm text-gray-600"
                        />
                      )}
                    </div>

                    {/* 4️ Variant Quantity */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={variant.variantQuantity}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantQuantity",
                            e.target.value
                          )
                        }
                        placeholder="Enter Quantity"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600"
                      />
                    </div>

                    {/* 5️ Reorder Limit */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Reorder Limit
                      </label>
                      <input
                        type="number"
                        value={variant.variantReorderLimit}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantReorderLimit",
                            e.target.value
                          )
                        }
                        placeholder="Enter Reorder Limit"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600"
                      />
                    </div>
                    <div className="flex items-start justify-start gap-16  ">
                      {/* 6️ Variant Image */}
                      <div className="flex flex-col items-start justify-start ">
                        <label className="block text-sm font-medium mb-2">
                          Images
                        </label>
                        <div className="relative w-full">
                          {variant.variantImage?.length > 0 ? (
                            <div className="relative w-[45px] h-[45px]">
                              <img
                                src={
                                  typeof variant.variantImage[0] === "string"
                                    ? variant.variantImage[0]
                                    : variant.variantImage[0].preview ||
                                      URL.createObjectURL(
                                        variant.variantImage[0]
                                      )
                                }
                                alt="Variant"
                                className="w-[45px] h-[45px] object-cover rounded-lg border border-neutral-200 cursor-pointer"
                                onClick={() => {
                                  setSelectedImages(variant.variantImage);
                                  const first =
                                    typeof variant.variantImage[0] === "string"
                                      ? variant.variantImage[0]
                                      : variant.variantImage[0].preview ||
                                        URL.createObjectURL(
                                          variant.variantImage[0]
                                        );
                                  setCurrentImage(first);
                                  setIsModalOpen(true);
                                }}
                              />

                              {variant.variantImage.length > 1 && (
                                <div
                                  onClick={() => {
                                    setSelectedImages(variant.variantImage);
                                    const first =
                                      typeof variant.variantImage[0] ===
                                      "string"
                                        ? variant.variantImage[0]
                                        : variant.variantImage[0].preview ||
                                          URL.createObjectURL(
                                            variant.variantImage[0]
                                          );
                                    setCurrentImage(first);
                                    setIsModalOpen(true);
                                  }}
                                  className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium rounded-lg cursor-pointer"
                                >
                                  +{variant.variantImage.length - 1}
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => removeVariantImage(index, 0)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                              >
                                ×
                              </button>

                              {variant.variantImage.length < 10 && (
                                <label
                                  htmlFor={`variantImage-${index}`}
                                  className="absolute bottom-4 left-16  -translate-x-1/2 w-5 h-5 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
                                >
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
                            <label
                              htmlFor={`variantImage-${index}`}
                              className="w-[45px] h-[45px] bg-[#ECECF0] border border-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            >
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
                              <div className="w-[20px] h-[20px] flex items-center justify-center rounded-full border border-[#D0D0D0] bg-white">
                                <Plus className="text-[#5F5F5F] w-[9px] h-[9px]" />
                              </div>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* 7️⃣ Action (Trash) */}
                      <div className="flex flex-col items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <label className="block text-sm font-medium mb-2">
                          Action
                        </label>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="p-2 rounded hover:bg-red-100 transition"
                        >
                          <Trash className="w-[27px] h-[27px] text-red-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Variant Button */}
              <div className="flex items-center justify-start mt-3">
                <button
                  type="button"
                  onClick={addVariant}
                  className="bg-[#DD851F] text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
                >
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
            className="px-6 py-2 bg-amber-600 rounded-lg text-white font-medium hover:bg-amber-600"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default AddProduct;
