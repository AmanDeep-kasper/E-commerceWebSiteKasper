import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct } from "../../redux/cart/productSlice";
import { v4 as uuidv4 } from "uuid";
import product from "../../data/products.json";
import imageCompression from "browser-image-compression";

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
  const { uuid } = useParams(); // the use to fetch the data in params

  const [formData, setFormData] = useState({
    // Basic info
    uuid: uuidv4(),
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
        variantId: uuidv4(), //  unique ID for this variant
        variantType: "",
        variantName: "",
        variantValue: "",
        variantQuantity: "",
        variantReorderLimit: "",
        variantImage: [],
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (uuid) {
      const productToEdit = product.find(
        (p) => p.uuid.toLowerCase() === uuid.toLowerCase()
      );

      if (productToEdit) {
        setFormData(productToEdit);
        setIsEditing(true);
      } else {
        console.log("Product not found with uuid:", uuid);
      }
    }
  }, [uuid]);

  // handle text fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updated = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // -----------------------------------
    // ✅ Auto-generate SKU when title changes
    // -----------------------------------
    if (name === "title") {
      const words = value.trim().split(" ");

      // Take first letters of first 3 words
      const initials = words
        .slice(0, 3)
        .map((w) => w[0]?.toUpperCase())
        .join("");

      // Random 3-digit number
      const randomNum = Math.floor(100 + Math.random() * 900);

      // SKU format: ABC-ART-123
      const sku = `${initials}-ART-${randomNum}`;

      updated.SKU = sku;
      updated.uuid = sku.toLowerCase();
      updated.route = `/product/${sku.toLowerCase()}`;
    }

    // Convert to numbers
    const mrp = parseFloat(updated.mrp) || 0;
    const sellingPrice = parseFloat(updated.sellingPrice) || 0;
    const costPrice = parseFloat(updated.costPrice) || 0;

    // -----------------------------------
    // ✅ Discount calculation
    // -----------------------------------
    if (mrp > 0 && sellingPrice > 0 && sellingPrice <= mrp) {
      const discountAmount = mrp - sellingPrice;
      const discountPercent = ((discountAmount / mrp) * 100).toFixed(2);

      updated.discountAmount = discountAmount.toFixed(2);
      updated.discountPercent = discountPercent;
    } else {
      updated.discountAmount = "";
      updated.discountPercent = "";
    }

    // -----------------------------------
    // ✅ Profit calculation
    // -----------------------------------
    if (sellingPrice > 0 && costPrice > 0) {
      const profit = sellingPrice - costPrice;
      updated.profit = profit.toFixed(2);
    } else {
      updated.profit = "";
    }

    setFormData(updated);
  };

  function blobToFile(theBlob, fileName) {
    return new File([theBlob], fileName, { type: theBlob.type });
  }

  const compressTo2MB = async (file) => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 2000,
      useWebWorker: true,
    };

    try {
      const compressed = await imageCompression(file, options);
      compressed.preview = URL.createObjectURL(compressed);
      return compressed;
    } catch (err) {
      console.error("Compression failed:", err);
      return file;
    }
  };

  // handle image files
  const handleFileChange = async (e) => {
    let files = Array.from(e.target.files);

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ];

    files = files.filter((file) => allowedTypes.includes(file.type));

    if (formData.images.length + files.length > 10) {
      alert("Max 10 images allowed");
      return;
    }

    const compressedFiles = [];
    for (let file of files) {
      let compressedBlob = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
      });

      const compressed = blobToFile(compressedBlob, file.name);

      compressed.preview = URL.createObjectURL(compressed);
      compressedFiles.push(compressed);
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...compressedFiles],
    }));

    e.target.value = "";
  };

  //variant image:

  const [variantImage, setVariantImage] = useState([]);

  const [downvariantopen, setDownVariantOpen] = useState(false);

  //the variants drop down
  const [variantopen, setVariantOpen] = useState(null); // track which dropdown is open
  const variantOptions = ["Color", "Dimension", "Size", "Material", "Weight"];

  //  Handle field change for a specific variant
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
      }

      // ✅ Always update other fields (even if variantName === "Dimension")
      if (!["width", "height"].includes(field)) {
        variant[field] = value;
      }

      updatedVariants[index] = variant;

      // ✅ Auto recalc total stock if quantity changes
      let updatedStock = prev.stockQuantity;
      if (field === "variantQuantity") {
        const totalVariantQty = updatedVariants.reduce((sum, v) => {
          const qty = Number(v.variantQuantity) || 0;
          return sum + qty;
        }, 0);

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

  //  Handle image upload per variant
  const handleVariantImageChange = async (e, index) => {
    let files = Array.from(e.target.files);
    const compressedFiles = [];

    for (let file of files) {
      let compressedBlob = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
      });

      const compressed = blobToFile(compressedBlob, file.name);
      compressed.preview = URL.createObjectURL(compressed);
      compressedFiles.push(compressed);
    }

    setFormData((prev) => {
      const updated = [...prev.variants];

      updated[index].variantImage = [
        ...updated[index].variantImage,
        ...compressedFiles,
      ].slice(0, 10);

      return { ...prev, variants: updated };
    });

    e.target.value = "";
  };

  //  Remove a specific image from a specific variant
  const removeVariantImage = (variantIndex, imgIndex) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];

      if (!updatedVariants[variantIndex]) return prev;

      const updatedImages = [...updatedVariants[variantIndex].variantImage];
      updatedImages.splice(imgIndex, 1); // remove that image

      updatedVariants[variantIndex].variantImage = updatedImages;

      return { ...prev, variants: updatedVariants };
    });

    // ✅ Update modal state
    setSelectedImages((prev) => {
      const newImages = prev.filter((_, i) => i !== imgIndex);

      // if the deleted image was the current one, show next (or previous)
      if (newImages.length > 0) {
        const nextIndex =
          imgIndex < newImages.length ? imgIndex : newImages.length - 1;

        const nextImage =
          typeof newImages[nextIndex] === "string"
            ? newImages[nextIndex]
            : newImages[nextIndex].preview ||
              URL.createObjectURL(newImages[nextIndex]);

        setCurrentImage(nextImage);
      } else {
        // No images left → close modal
        setIsModalOpen(false);
      }

      return newImages;
    });
  };

  //  Add new variant section dynamically
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // 🔹 Validation
  //   if (!formData.title.trim() || !formData.category.trim()) {
  //     toast.error("Please fill in all required fields!", {
  //       position: "top-right",
  //       autoClose: 2000,
  //       className: "bg-red-700 text-white rounded-lg",
  //     });
  //     return;
  //   }

  //   // 🔹 Ensure product UUID exists
  //   const formDataWithUUID = {
  //     ...formData,
  //     uuid: formData.uuid || uuidv4(),
  //     variants: formData.variants.map((v) => ({
  //       ...v,
  //       variantId: v.variantId || uuidv4(),
  //     })),
  //   };

  //   // 🔹 Build multipart FormData for backend
  //   const formDataObj = new FormData();

  //   Object.keys(formDataWithUUID).forEach((key) => {
  //     const value = formDataWithUUID[key];
  //     if (key === "variants") {
  //       value.forEach((variant, i) => {
  //         Object.entries(variant).forEach(([k, v]) => {
  //           if (Array.isArray(v)) {
  //             v.forEach((file) =>
  //               formDataObj.append(`variants[${i}][${k}]`, file)
  //             );
  //           } else {
  //             formDataObj.append(`variants[${i}][${k}]`, v);
  //           }
  //         });
  //       });
  //     } else if (Array.isArray(value)) {
  //       value.forEach((v) => formDataObj.append(key, v));
  //     } else {
  //       formDataObj.append(key, value);
  //     }
  //   });

  //   // 🔹 Dispatch correct action
  //   if (isEditing) {
  //     // Make sure to pass both id + formData to match your thunk definition
  //     dispatch(
  //       updateProduct({ id: formDataWithUUID.uuid, formData: formDataObj })
  //     )
  //       .unwrap()
  //       .then(() => {
  //         toast.success("✅ Product updated successfully!", {
  //           position: "top-right",
  //           autoClose: 2000,
  //           className: "bg-[#EEFFEF] text-black rounded-lg",
  //         });
  //         navigate("/admin/products");
  //       })
  //       .catch((err) => {
  //         toast.error(`Failed to update: ${err}`, {
  //           position: "top-right",
  //           autoClose: 2000,
  //           className: "bg-red-700 text-white rounded-lg",
  //         });
  //       });
  //   } else {
  //     // Add new product
  //     dispatch(addProduct(formDataObj))
  //       .unwrap()
  //       .then(() => {
  //         toast.success("✅ Product added successfully!", {
  //           position: "top-right",
  //           autoClose: 2000,
  //           className: "bg-[#EEFFEF] text-black rounded-lg",
  //         });
  //         navigate("/admin/products");
  //       })
  //       .catch((err) => {
  //         toast.error(`Failed to add: ${err}`, {
  //           position: "top-right",
  //           autoClose: 2000,
  //           className: "bg-red-700 text-white rounded-lg",
  //         });
  //       });
  //   }

  //   // Optional: local save for backup
  //   localStorage.setItem("addProductForm", JSON.stringify(formDataWithUUID));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim() || !formData.category.trim()) {
      toast.error("Please fill in all required fields!", {
        position: "top-right",
        autoClose: 2000,
        className: "bg-red-700 text-white rounded-lg",
      });
      return;
    }

    // Add UUID to product + variants
    const formDataWithUUID = {
      ...formData,
      uuid: formData.uuid || uuidv4(),
      variants: formData.variants.map((v) => ({
        ...v,
        variantId: v.variantId || uuidv4(),
      })),
    };

    // Convert data to multipart FormData
    const formDataObj = new FormData();

    Object.entries(formDataWithUUID).forEach(([key, value]) => {
      if (key === "variants") {
        value.forEach((variant, i) => {
          Object.entries(variant).forEach(([k, v]) => {
            // If variant images are files/array
            if (Array.isArray(v)) {
              v.forEach((item) => {
                formDataObj.append(`variants[${i}][${k}]`, item);
              });
            } else {
              formDataObj.append(`variants[${i}][${k}]`, v);
            }
          });
        });
      }

      // For arrays -> send each as value
      else if (Array.isArray(value)) {
        value.forEach((v) => formDataObj.append(key, v));
      }

      // For everything else
      else {
        formDataObj.append(key, value);
      }
    });

    try {
      // SEND TO BACKEND 
      const response = await axiosInstance.post(
        "/products/add-product",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("SERVER RESPONSE:", response.data);

      toast.success(
        isEditing
          ? "Product updated successfully!"
          : "Product added successfully!",
        {
          position: "top-right",
          autoClose: 2000,
          className: "bg-[#EEFFEF] text-black rounded-lg",
        }
      );

      localStorage.setItem("addProductForm", JSON.stringify(formDataWithUUID));

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (err) {
      console.log("AXIOS ERROR:", err);
      console.log("AXIOS ERROR DATA:", err.response?.data);
      console.log("AXIOS ERROR STATUS:", err.response?.status);

      toast.error("Error uploading product!", {
        position: "top-right",
        autoClose: 2000,
        className: "bg-red-700 text-white rounded-lg",
      });
    }
  };

  // sku id generated in random
  const generatedSKU = () => {
    const title = formData.title?.trim() || "";

    if (title.length < 3) {
      toast.error("Enter product title first!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const prefix = title.substring(0, 3).toUpperCase(); // First 3 letters of product name
    const randomNum = String(Math.floor(Math.random() * 999)).padStart(3, "0"); // 000–999

    const newSKU = `${prefix}-ART-${randomNum}`;

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
  const [activeVariantIndex, setActiveVariantIndex] = useState(null);

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
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
        setIsModalOpen={setIsModalOpen}
        variantIndex={activeVariantIndex}
        onRemoveImage={removeVariantImage}
      />
      <form
        className=" rounded-md min-h-screen"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Header */}

        <div className="h-16 bg-white rounded-lg flex items-center  px-4">
          <Link to={`/admin/products`}>
            <div className=" flex items-center gap-1">
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
          <div className="bg-white rounded-2xl p-6">
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
                {Array.isArray(formData.images) &&
                  formData.images.map((img, i) => {
                    const imgSrc =
                      img instanceof File
                        ? URL.createObjectURL(img) // new upload
                        : typeof img === "string"
                        ? img // existing image URL
                        : null;

                    if (!imgSrc) return null;

                    return (
                      <div key={i} className="relative group">
                        <img
                          src={imgSrc}
                          alt={`preview ${i}`}
                          className="w-[134px] h-[134px] object-cover rounded-lg border border-neutral-200"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition rounded-lg"></div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter(
                                (_, index) => index !== i
                              ),
                            }))
                          }
                          className="absolute top-2 right-2 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                    );
                  })}

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

          <div className="bg-white rounded-2xl  p-6">
            <h2 className="text-black text-[20px] font-medium mb-4">
              Product Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* SKU ID */}
              <div>
                <label className="block text-sm font-medium mb-2">SKU ID</label>
                <div className="flex relative">
                  <input
                    type="text"
                    name="SKU"
                    value={formData.SKU}
                    onChange={handleChange}
                    placeholder="Generate SKU ID"
                    className="w-full border border-[#D0D0D0] rounded-l-lg rounded-r-lg h-[45px] px-3  bg-[#FAFAFA] text-sm text-[#6B6B6B] placeholder-[#6B6B6B] focus:outline-none"
                  />
                  <button
                    type="button"
                    className="bg-amber-600 text-white px-3 rounded-r-lg rounded-l-lg hover:bg-amber-700 absolute right-0 h-full"
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
        <div className="bg-white rounded-2xl  p-6 mt-6">
          <h2 className="text-black text-xl font-medium mb-4">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <label className="block text-sm font-medium mb-2">MRP</label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                placeholder="Enter MRP"
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600 focus:outline-none"
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
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600 focus:outline-none"
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
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600 focus:outline-none"
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
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#FAFAFA] text-sm text-gray-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Discount</label>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-7">
              <label className="flex items-center justify-center gap-2 text-sm font-medium mb-2">
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
                <div className="relative inline-block w-[245px] h-[45px] ">
                  <button
                    type="button"
                    onClick={() => setOpenGstBox((prev) => !prev)}
                    className="w-full border rounded-lg px-4 h-[45px] flex items-center justify-between bg-[#FAFAFA] text-sm text-[#6B6B6B] focus:outline-none placeholder:text-[#6B6B6B]"
                  >
                    <span>{formData.taxPercent || "5%"}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#6B6B6B] transition-transform duration-200 ${
                        opengstbosx ? "rotate-180" : ""
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
        <div className="bg-white rounded-2xl  px-3 py-4 mt-6">
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
                    className="group flex flex-wrap justify-between items-center gap-4 mb-6 i hover:bg-[#FFF8F2] transition-all rounded-lg p-2"
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
                                  setActiveVariantIndex(index);
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
                                    setActiveVariantIndex(index); // ✅ store which variant is open
                                    setIsModalOpen(true);
                                  }}
                                  className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium rounded-lg cursor-pointer"
                                >
                                  +{variant.variantImage.length - 1}
                                </div>
                              )}

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
                    </div>
                    {/*  Action (Trash) */}
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
            {isEditing ? "Update Product" : "Save"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddProduct;
