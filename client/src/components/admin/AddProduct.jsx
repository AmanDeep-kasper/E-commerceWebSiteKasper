import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct } from "../../redux/cart/productSlice";
import { v4 as uuidv4 } from "uuid";
import product from "../../data/products.json";
import imageCompression from "browser-image-compression";
import { IoIosArrowForward } from "react-icons/io";
import { FiUpload } from "react-icons/fi";

import { ChevronDown, ChevronLeft, LucideCheck, Trash } from "lucide-react";
import { data, Link } from "react-router";
// import AddCategoryPopUp from "./AddCategoryPopUp";
// import AddSubCategoryPopup from "./AddSubCategoryPopup";
// import DisplayVariantImg from "./DisplayVariantImg";

const AddProduct = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);
  const { uuid } = useParams(); // the use to fetch the data in params

  const [formData, setFormData] = useState({
    // Basic info
    uuid: uuidv4(),
    title: "",
    description: "",
    returnPolicy: false,

    // upload images
    images: [],

    // Product details
    SKU: "",
    stockQuantity: "",
    ReorderLimit: "",
    type: "",
    color: "",
    ProductDimensionWidth: "",
    ProductDimensionHeight: "",

    // category Section
    category: "",
    subcategory: "",
    materialType: "",

    // Pricing
    mrp: "",
    sellingPrice: "",
    costPrice: "",
    profit: "",
    discountPercent: "",
    discountAmount: "",
    taxPercent: "",

    // Product Variants
    hasVariants: false,
    variants: [
      {
        variantId: "",
        variantColor: "",
        variantWidth: "",
        variantHeight: "",
        variantFrameType: "",
        variantSkuId: "",
        variantStockQuantity: "",
        variantReorderLimit: "",

        variantMrp: "",
        variantSellingPrice: "",
        variantCostPrice: "",
        variantProfit: "",
        variantDiscount: "",
        variantImage: [],
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (uuid) {
      const productToEdit = product.find(
        (p) => p.uuid.toLowerCase() === uuid.toLowerCase(),
      );

      if (productToEdit) {
        setFormData(productToEdit);
        setIsEditing(true);
      } else {
        console.log("Product not found with uuid:", uuid);
      }
    }
  }, [uuid]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

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

  //  Handle field change for a specific variant
  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const variants = [...prev.variants];
      const v = { ...variants[index], [field]: value };

      const mrp = Number(v.variantMrp) || 0;
      const cost = Number(v.variantCostPrice) || 0;

      // 🟢 USER TYPES DISCOUNT → UPDATE SELLING PRICE
      if (field === "variantDiscount") {
        const discount = Number(value);

        if (mrp > 0 && discount >= 0 && discount <= 100) {
          v.variantSellingPrice = (mrp * (1 - discount / 100)).toFixed(2);
          v.variantDiscount = discount.toFixed(2);
        }
      }

      // 🟢 USER TYPES SELLING PRICE → UPDATE DISCOUNT
      if (field === "variantSellingPrice") {
        const selling = Number(value);

        if (mrp > 0 && selling > 0 && selling <= mrp) {
          v.variantDiscount = (((mrp - selling) / mrp) * 100).toFixed(2);
        }
      }

      // 🟢 PROFIT AUTO CALC
      const selling = Number(v.variantSellingPrice) || 0;
      if (selling > 0 && cost > 0) {
        v.variantProfit = (selling - cost).toFixed(2);
      } else {
        v.variantProfit = "";
      }

      variants[index] = v;

      return { ...prev, variants };
    });
  };

  //  Handle image upload per variant
  const handleVariantImageChange = async (e, index) => {
    let files = Array.from(e.target.files);
    const compressedFiles = [];

    for (let file of files) {
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
      });

      const compressed = blobToFile(compressedBlob, file.name);
      compressed.preview = URL.createObjectURL(compressed);
      compressedFiles.push(compressed);
    }

    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      const existingImages = updatedVariants[index].variantImage || [];

      // ✅ REMOVE DUPLICATES (name + size)
      const uniqueFiles = compressedFiles.filter(
        (file) =>
          !existingImages.some(
            (img) => img.name === file.name && img.size === file.size,
          ),
      );

      updatedVariants[index].variantImage = [
        ...existingImages,
        ...uniqueFiles,
      ].slice(0, 10);

      return { ...prev, variants: updatedVariants };
    });

    // ✅ VERY IMPORTANT: reset input
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
    setEditingVariant({
      variantColor: "",
      variantWidth: "",
      variantHeight: "",
      variantFrameType: "",
      variantSkuId: "",
      variantStockQuantity: "",
      variantReorderLimit: "",
      variantMrp: "",
      variantSellingPrice: "",
      variantCostPrice: "",
      variantProfit: "",
      variantDiscount: "",
      variantImage: [],
    });

    setItemsOpenVar(true);
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
            if (k === "variantImage") {
              v.forEach((file) => {
                formDataObj.append(`variants[${i}][variantImage]`, file);
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
        },
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
        },
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
  const generateVariantSKU = (variantIndex) => {
    const productSKU = formData.SKU?.trim();

    if (!productSKU) {
      toast.error("Generate product SKU first!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900); // 3 digits

    const variantSKU = `${productSKU}-V-${randomNum}`;

    setFormData((prev) => {
      const variants = [...prev.variants];
      variants[variantIndex] = {
        ...variants[variantIndex],
        variantSkuId: variantSKU,
      };

      return { ...prev, variants };
    });
  };

  // this is first drop down
  const [categoriesopen, setCategoriesOpen] = useState(false);
  // selected option
  const [selected, setSelected] = useState("Select Price Range");

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

  const gstRateList = ["GST 0%", "GST 5%", "GST 12%", "GST 18%"];

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

  const removeVariant = (index) => {
    setSavedVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const [itemsOpenvar, setItemsOpenVar] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [savedVariants, setSavedVariants] = useState([]);

  const handleSaveVariant = (index) => {
    const variant = formData.variants[index];

    if (!variant.variantSkuId || !variant.variantSellingPrice) {
      alert("Please fill required fields");
      return;
    }

    setSavedVariants((prev) => [...prev, variant]);

    // remove saved variant from form list
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));

    // close form if no variants left
    setItemsOpenVar((prevOpen) =>
      formData.variants.length - 1 === 0 ? false : prevOpen,
    );
  };

  const [step, setStep] = useState(1);
  // const [currentStep, setCurrentStep] = useState(1);
  const [preview, setPreview] = useState(null);

  const PayrollData = [
    { id: 1, pageName: "Basic Details" },
    { id: 2, pageName: "Product Details" },
    { id: 3, pageName: "Pricing" },
    { id: 4, pageName: "Variants" },
    { id: 5, pageName: "Shipping" },
  ];

  return (
    <>
      {/* {showCategoryModal && (
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
      /> */}

      <form
        className="p-[24px] bg-[#F6F8F9] min-h-screen"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Header */}

        <div className="flex items-center justify-between h-16 w-full rounded-lg">
          <div className="flex items-center justify-between">
            <Link to={`/admin/products`}>
              <ChevronLeft className="w-8 h-8 text-[#686868]" />
            </Link>
            <h1 className="text-[#1C1C1C] text-[20px] font-medium font-['Inter']">
              Add Product
            </h1>
          </div>

          <div className="flex items-center gap-4 px-2">
            <button
              type="button"
              className="py-1 px-3 rounded border border-[#737373] text-[#737373] hover:bg-[#706f6f] hover:text-white bg-[#F6F8F9] font-medium"
            >
              Discard
            </button>
            <button
              type="submit"
              className="py-1 px-3 rounded-lg bg-[#1C3753] text-[#FFFFFF] font-medium"
            >
              {isEditing ? "Update Product" : "Save"}
            </button>
          </div>
        </div>

        <div>
          <div className="flex gap-6 mb-6">
            {PayrollData.map((item) => {
              const isCompleted = step > item.id;
              const isActive = step === item.id;

              return (
                <div key={item.id} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${
              isCompleted
                ? "bg-[#CBFFC5] text-[#00A63E]"
                : isActive
                  ? "bg-[#FFFFFF] text-[#1C3753] border border-1"
                  : "bg-gray-200 text-gray-600"
            }`}
                  >
                    {isCompleted ? <LucideCheck size={16} /> : item.id}
                  </div>

                  <span
                    className={`text-sm ${
                      isActive ? "text-[#1C3753] font-medium" : "text-gray-500"
                    }`}
                  >
                    {item.pageName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Info Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Basic Details Section */}
          {step === 1 && (
            <>
              {/* start */}

              <div className="bg-white rounded-2xl border p-4 h-full flex flex-col">
                {/* Header */}
                <h2 className="text-[18px] font-medium font-['Inter'] mb-4">
                  Basic Details
                </h2>

                {/* Content */}
                <div className="flex flex-col gap-5 flex-1">
                  {/* Product Title */}
                  <div>
                    <div className="flex items-start gap-1">
                      {" "}
                      <label className="block text-black text-[14px] mb-2">
                        Product Name
                      </label>
                      <span className="">*</span>
                    </div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3
          text-[#686868] text-sm bg-[#F8FAFB] placeholder-[#686868]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#686868] "
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col flex-1">
                    <label className="block text-black text-[14px] font-normal mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Write a description of the product"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full flex-1 min-h-[120px] border border-[#D0D0D0] rounded-lg px-3 py-2
          text-[#686868] text-sm bg-[#F8FAFB] placeholder-[#686868]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none "
                    />
                  </div>
                </div>
              </div>

              {/* Product   */}
              <div className="flex flex-col space-y-3">
                <div className="bg-white rounded-2xl p-4 border">
                  <h2 className="text-black text-[18px] font-medium mb-4">
                    Product Status
                  </h2>
                  <div className="flex items-center justify-start gap-4">
                    <div className="flex items-center gap-3">
                      <input type="radio" id="Active" name="status" />
                      <label htmlFor="Active">Active</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="radio" id="Archived" name="status" />
                      <label htmlFor="Archived">Archived</label>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border">
                  <h2 className="text-black text-[18px] font-medium mb-4">
                    Product Classification
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    <div>
                      <label className="block text-black text-[14px] mb-2">
                        Category <span className="text-[#D53B35]">*</span>
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Select category"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3
          text-[#6B6B6B] text-sm bg-[#F8FAFB] placeholder-[#686868]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-black text-[14px] mb-2">
                        Sub-Category
                      </label>
                      <input
                        type="text"
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        placeholder="Select sub-category"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3
          text-[#6B6B6B] text-sm bg-[#F8FAFB] placeholder-[#686868]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-black text-[14px] mb-2">
                        Material
                      </label>
                      <input
                        type="text"
                        name="materialType"
                        value={formData.materialType}
                        onChange={handleChange}
                        placeholder="Enter material"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3
          text-[#6B6B6B] text-sm bg-[#F8FAFB] placeholder-[#686868]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-white rounded-2xl p-4 border">
                <h2 className="text-[#1C1C1C] text-[18px] font-medium mb-4">
                  Product Details
                </h2>

                {/* SKU ID */}
                <div className="mb-6">
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      Product Color <span className="text-[#D53B35]">*</span>
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      placeholder="Enter Total Stock Quantity"
                      className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm placeholder-[#686868] text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      placeholder="Enter Total Stock Quantity"
                      className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm placeholder-[#686868] text-gray-600 focus:outline-none"
                    />
                  </div>
                  {/* Sub Category */}
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      Reorder Limit
                    </label>
                    <input
                      type="number"
                      name="ReorderLimit"
                      value={formData.ReorderLimit}
                      onChange={handleChange}
                      placeholder="Enter Total Stock Quantity"
                      className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm placeholder-[#686868] text-gray-600 focus:outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div ref={dropdownRefCategory}>
                    <div className="relative inline-block w-full">
                      <label className="block text-sm font-normal mb-2">
                        Frame Type
                      </label>

                      <button
                        type="button"
                        onClick={() => setCategoriesOpen((prev) => !prev)}
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-4
      flex items-center justify-between bg-[#F8FAFB]
      text-sm text-[#6B6B6B] focus:outline-none"
                      >
                        <span>{formData.type || "Select Frame Type"}</span>

                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            categoriesopen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {categoriesopen && (
                        <ul className="absolute z-20 mt-1 w-full border rounded-lg bg-white shadow-md text-sm">
                          {variantsType.map((option) => (
                            <li
                              key={option}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  type: option, // ✅ CORRECT FIELD
                                }));
                                setCategoriesOpen(false);
                              }}
                              className={`px-4 py-2 cursor-pointer hover:bg-[#FFEAD2]
              ${
                formData.type === option
                  ? "bg-[#FFF5E5] font-medium text-[#1C3753]"
                  : "text-[#6B6B6B]"
              }`}
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      Frame Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Enter Color"
                      className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm placeholder-[#686868] text-gray-600 focus:outline-none"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      Dimension
                    </label>
                    <div className="flex items-center justify-center gap-3">
                      <input
                        type="text"
                        name="ProductDimensionWidth"
                        value={formData.ProductDimensionWidth}
                        onChange={handleChange}
                        placeholder="Enter Width (In)"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm placeholder-[#686868] text-gray-600 focus:outline-none"
                      />
                      <input
                        type="text"
                        name="ProductDimensionHeight"
                        value={formData.ProductDimensionHeight}
                        onChange={handleChange}
                        placeholder="Enter Height (In)"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm placeholder-[#686868] text-gray-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border">
                <h1 className="text-[16px] font-medium mb-3">Upload Images <span>*</span></h1>

                {/* Thumbnails */}
                {formData.images.length > 0 && (
                  <div className="flex gap-3 mb-4">
                    {formData.images.slice(0, 5).map((img, index) => {
                      const imgSrc =
                        typeof img === "string"
                          ? img
                          : img.preview || URL.createObjectURL(img);

                      const remaining = formData.images.length - 5;

                      return (
                        <div
                          key={index}
                          className="relative w-[120px] h-[120px] rounded-lg overflow-hidden border border-neutral-200 bg-gray-100"
                        >
                          <img
                            src={imgSrc}
                            alt={`preview-${index}`}
                            className="w-full h-full object-cover"
                          />

                          {/* +N overlay */}
                          {index === 4 && remaining > 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold">
                              +{remaining}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upload box (ONLY when no images) */}
                {formData.images.length === 0 && (
                  <div className="bg-[#F8FAFB] border border-dashed h-[250px] border-[#C4C4C4] rounded-lg px-6 py-[90px] flex flex-col items-center gap-3 space-y-3">
                    <button
                      type="button"
                      onClick={handleButtonClick}
                      className="px-4 py-1 flex items-center justify-center gap-2 border border-[#686868] text-[#1C3753] rounded-md bg-[#E4E5E6]  font-normal hover:bg-[#dddfe0] transition"
                    >
                      <FiUpload className="text-[#1C3753] w-5 h-5" /> Upload
                      Images
                    </button>

                    <div className="text-center text-[#686868] text-[12px]">
                      <p>Max. Size is 5MB</p>
                      <p>
                        Only *.png, *.jpg and *.jpeg image files are accepted
                      </p>
                    </div>
                  </div>
                )}

                {/* Add More Images button (when images exist) */}
                {formData.images.length > 0 && (
                  <div className="flex flex-col space-y-4 justify-center items-center">
                    <button
                      type="button"
                      onClick={handleButtonClick}
                      className="px-4 py-2 border border-[#1C3753] text-[#1C3753] rounded-md text-sm font-medium hover:bg-blue-50 transition"
                    >
                      Upload More Images
                    </button>
                    <div>
                      <div className="text-center text-[#686868] text-[12px]">
                        <p>Max. Size is 5MB</p>
                        <p>
                          Only *.png, *.jpg and *.jpeg image files are accepted
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.svg"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="bg-white rounded-2xl p-4 border">
                <h2 className="text-[#1C1C1C] text-[18px] font-medium mb-4">
                  Inventory
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {/* SKU ID */}
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      Product SKU ID <span className="text-[#D53B35]">*</span>
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        name="SKU"
                        value={formData.SKU}
                        onChange={handleChange}
                        placeholder="Enter SKU ID"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 pr-28
        bg-[#F8FAFB] text-sm text-[#6B6B6B] placeholder-[#686868]
        focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />

                      <button
                        type="button"
                        onClick={generatedSKU}
                        className="absolute right-2 top-1/2 -translate-y-1/2
        h-[32px] px-4 bg-[#1C3753] text-white text-sm font-normal
        rounded-md hover:bg-[#264464] transition"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      placeholder="Enter Total Stock Quantity"
                      className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm placeholder-[#686868] text-gray-600 focus:outline-none"
                    />
                  </div>
                  {/* Sub Category */}
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      Low stock alert <span className="text-[#D53B35]">*</span>
                    </label>
                    <input
                      type="number"
                      name="ReorderLimit"
                      value={formData.ReorderLimit}
                      onChange={handleChange}
                      placeholder="Enter Total Stock Quantity"
                      className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm placeholder-[#686868] text-gray-600 focus:outline-none"
                    />
                  </div>
                  <div ref={dropdownRefCategory}>
                    {/* <div className="relative inline-block w-full">
                      <label className="block text-sm font-normal mb-2">
                        Limit per Order
                      </label>

                      <button
                        type="button"
                        onClick={() => setCategoriesOpen((prev) => !prev)}
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-4
      flex items-center justify-between bg-[#F8FAFB]
      text-sm text-[#6B6B6B] focus:outline-none"
                      >
                        <span>{formData.type || "Select Frame Type"}</span>

                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            categoriesopen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {categoriesopen && (
                        <ul className="absolute z-20 mt-1 w-full border rounded-lg bg-white shadow-md text-sm">
                          {variantsType.map((option) => (
                            <li
                              key={option}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  type: option, // ✅ CORRECT FIELD
                                }));
                                setCategoriesOpen(false);
                              }}
                              className={`px-4 py-2 cursor-pointer hover:bg-[#FFEAD2]
              ${
                formData.type === option
                  ? "bg-[#FFF5E5] font-medium text-[#1C3753]"
                  : "text-[#6B6B6B]"
              }`}
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div> */}
                  </div>
                </div>
              </div>
            </>
          )}

          {step == 3 && (
            <>
              <div className="bg-white rounded-2xl  p-4 mt-6 border">
                <h2 className="text-black text-xl font-medium mb-4">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* MRP */}
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      MRP
                    </label>
                    <input
                      type="number"
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleChange}
                      placeholder="Enter MRP"
                      className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB]
                 text-sm text-[#686868] placeholder-[#686868] focus:outline-none"
                    />
                  </div>

                  {/* Cost Price */}
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      Cost Price (₹)
                    </label>
                    <input
                      type="number"
                      name="costPrice"
                      value={formData.costPrice}
                      onChange={handleChange}
                      placeholder="Enter Cost Price"
                      className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB]
                 text-sm text-[#686868] placeholder-[#686868] focus:outline-none"
                    />
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      placeholder="Enter Selling Price"
                      className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB]
                 text-sm text-[#686868] placeholder-[#686868] focus:outline-none"
                    />
                  </div>

                  {/* GST */}
                  <div>
                    <label className="block text-sm font-normal mb-2">
                      GST Tax Rates
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenGstBox((prev) => !prev)}
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-4
                   flex items-center justify-between bg-[#F8FAFB]
                   text-sm text-[#686868] focus:outline-none"
                      >
                        <span>{formData.taxPercent || "Select GST (%)"}</span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            opengstbosx ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {opengstbosx && (
                        <ul
                          className="absolute z-10 w-full mt-1 border border-[#D0D0D0]
                       rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-sm"
                        >
                          {gstRateList.map((p, i) => (
                            <li
                              key={i}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  taxPercent: p,
                                }));
                                setOpenGstBox(false);
                              }}
                              className="px-4 py-2 hover:bg-[#FFEAD2] cursor-pointer"
                            >
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-normal mb-2">
                      Discount
                    </label>

                    <div className="flex gap-4">
                      <input
                        type="text"
                        name="discountPercent"
                        value={formData.discountPercent}
                        onChange={handleChange}
                        placeholder="Discount (%)"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB]"
                      />
                      <input
                        type="text"
                        name="discountAmount"
                        value={formData.discountAmount}
                        onChange={handleChange}
                        placeholder="Discount (₹)"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#EFF6EE] rounded-2xl space-y-6 p-4 mt-6 border border-[#00A63E]">
                <h2 className="text-black text-xl font-medium mb-4">
                  Profit Analysis
                </h2>

                <div className="bg-[#fff] rounded-lg">
                  <div className="border-[1px] border-[#DEDEDE]  px-4 py-2  rounded-lg">
                    <label className="block text-[14px] text-[#686868] font-normal mb-2">
                      Profit Amount / Profit Margin
                    </label>
                    <input
                      type="text"
                      name="profit"
                      value={`% ${formData.profit}`}
                      readOnly
                      // onChange={handleChange}
                      placeholder="Profit (₹)"
                      className="w-full h-[45px] rounded-lg   text-[24px] text-[#00A63E] focus:outline-none placeholder-[#686868]"
                    />
                  </div>
                </div>
                <div className="bg-[#fff] rounded-lg">
                  <div className="border-[1px] border-[#DEDEDE] rounded-lg px-4 py-2 ">
                    <label className="block text-[14px] text-[#686868] font-normal mb-2">
                      Profit Amount
                    </label>
                    <input
                      type="text"
                      name="profit"
                      value={`₹ ${formData.profit}`}
                      readOnly
                      // onChange={handleChange}
                      placeholder="Profit (₹)"
                      className="w-full h-[45px] rounded-lg   text-[24px] text-[#00A63E] focus:outline-none placeholder-[#686868]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-end justify-end gap-4 mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-1 bg-[#F6F8F9] border border-[#1C3753] text-[#1C3753] font-medium rounded-md"
            >
              Previous
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-1 bg-[#F6F8F9] border border-[#1C3753] text-[#1C3753] font-medium rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save Product
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default AddProduct;
