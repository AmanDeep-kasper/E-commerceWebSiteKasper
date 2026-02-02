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

import { ChevronDown, ChevronLeft, Trash } from "lucide-react";
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
            (img) => img.name === file.name && img.size === file.size
          )
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
      formData.variants.length - 1 === 0 ? false : prevOpen
    );
  };

  const [step, setStep] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [preview, setPreview] = useState(null);

  const PayrollData = [
    {
      id: 1,
      pageName: "Basic Details",
    },
    {
      id: 2,
      pageName: "Product Details",
    },
    {
      id: 3,
      pageName: "Pricing",
    },
    {
      id: 4,
      pageName: "Variants",
    },
    {
      id: 5,
      pageName: "Shipping",
    },
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
        className="rounded-md min-h-screen"
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
          <div className="d-flex flex-column gap-2 rounded-2 p-4">
            {/* <div className="my-0 p-3">
              <h6 className="m-0 d-flex align-items-center gap-2">
                <span>{currentStep - 1}/3</span>
                <span className="d-none d-md-flex"> Completed</span>
              </h6>
            </div> */}

            <div className="flex flex-row w-100 flex-md-column gap-3 gap-md-2">
              {PayrollData.map((stepItem, index) => {
                const stepNumber = stepItem.id;
                const isCompleted = currentStep > stepNumber;
                const isActive = currentStep === stepNumber;

                return (
                  <div
                    key={stepItem.id}
                    className="d-flex align-items-center gap-3"
                  >
                    {/* Completed ✔ */}
                    {isCompleted ? (
                      <span
                        className="badge-success d-flex align-items-center justify-content-center"
                        style={{
                          height: "2rem",
                          width: "2rem",
                          borderRadius: "50%",
                          border: "2px solid #07aaff",
                        }}
                      >
                        <LuCheck />
                      </span>
                    ) : isActive ? (
                      <div className="d-flex align-items-center justify-content-center"></div>
                    ) : (
                      // Inactive step
                      <div className="d-flex align-items-center justify-content-center"></div>
                    )}

                    <div className="d-none d-md-flex flex-column">
                      <h6 className="my-0 text-[#778798]">
                        {stepItem.pageName}
                      </h6>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Info Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Section */}
          <div className="bg-white rounded-2xl border p-4 h-full flex flex-col">
            {/* Header */}
            <h2 className="text-[18px] font-medium font-['Inter'] mb-4">
              Basic Details
            </h2>

            {/* Content */}
            <div className="flex flex-col gap-5 flex-1">
              {/* Product Title */}
              <div>
                <label className="block text-black text-[14px] mb-2">
                  Enter Product Name
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3
          text-[#686868] text-sm bg-[#F8FAFB] placeholder-[#686868]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#686868] "
                />
              </div>

              {/* Description */}
              <div className="flex flex-col flex-1">
                <label className="block text-black text-[14px] font-normal mb-2">
                  Write a description of the product
                </label>
                <textarea
                  placeholder="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full flex-1 min-h-[120px] border border-[#D0D0D0] rounded-lg px-3 py-2
          text-[#686868] text-sm bg-[#F8FAFB] placeholder-[#686868]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border">
            <h1 className="text-[16px] font-medium mb-3">Upload Images</h1>

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
                  <FiUpload className="text-[#1C3753] w-5 h-5" /> Upload Images
                </button>

                <div className="text-center text-[#686868] text-[12px]">
                  <p>Max. Size is 5MB</p>
                  <p>Only *.png, *.jpg and *.jpeg image files are accepted</p>
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
                    <p>Only *.png, *.jpg and *.jpeg image files are accepted</p>
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

          {/* /////////////////////////////////////////// */}
          {/* Right Section */}

          <div className="bg-white rounded-2xl p-4 border">
            <h2 className="text-[#1C1C1C] text-[18px] font-medium mb-4">
              Product Details
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
                <label className="block text-sm font-normal mb-2">Stock</label>
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
                <label className="block text-sm font-normal mb-2">Color</label>
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
            <h2 className="text-black text-[18px] font-medium mb-4">
              Product Category
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-1 gap-6">
              <div>
                <label className="block text-black text-[14px] mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter Category"
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
                  placeholder="Enter Sub-Category"
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
                  placeholder="Enter Material"
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3
          text-[#6B6B6B] text-sm bg-[#F8FAFB] placeholder-[#686868]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-2xl  p-4 mt-6 border">
          <h2 className="text-black text-xl font-medium mb-4">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <label className="block text-sm font-normal mb-2">MRP</label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                placeholder="Enter MRP"
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm text-[#686868] focus:outline-none placeholder-[#686868]"
              />
            </div>
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
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm text-[#686868] focus:outline-none placeholder-[#686868]"
              />
            </div>
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
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm text-gray-600 focus:outline-none placeholder-[#686868]"
              />
            </div>
            <div>
              <label className="block text-sm font-normal mb-2">Profit</label>
              <input
                type="number"
                name="profit"
                value={formData.profit}
                readOnly
                // onChange={handleChange}
                placeholder="Profit (₹)"
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm text-gray-600 focus:outline-none placeholder-[#686868]"
              />
            </div>
            <div>
              <label className="block text-sm font-normal mb-2">Discount</label>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-row">
                  <input
                    type="text"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleChange}
                    placeholder="Enter Discount (%)"
                    className="flex-1 border border-[#D0D0D0] rounded-lg  px-3 w-[140px] h-[45px] bg-[#F8FAFB] text-sm text-[#6B6B6B] placeholder-[#686868] focus:outline-none"
                  />
                </div>
                <div className="flex flex-row">
                  <input
                    type="text"
                    name="discountAmount"
                    value={formData.discountAmount}
                    onChange={handleChange}
                    placeholder="Enter Discount (₹)"
                    className="flex-1 border border-[#D0D0D0] rounded-lg px-3 w-[140px] h-[45px] bg-[#F8FAFB] text-sm text-[#6B6B6B] placeholder-[#686868] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="">
              {/* Label */}
              <label className="block text-sm font-normal mb-2">
                GST Tax Rates
              </label>

              {/* Dropdown */}
              <div className="relative inline-block w-full h-[45px]">
                <button
                  type="button"
                  onClick={() => setOpenGstBox((prev) => !prev)}
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-4 flex items-center justify-between
        bg-[#F8FAFB] text-sm text-[#686868] focus:outline-none "
                >
                  <span>{formData.taxPercent || "Select GST (%)"}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#686868] transition-transform duration-200 ${
                      opengstbosx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {opengstbosx && (
                  <ul className="absolute z-10 w-full mt-1 border rounded-lg bg-white shadow-md max-h-60 overflow-y-auto text-sm">
                    {gstRateList.map((p, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, taxPercent: p }));
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
          </div>
        </div>
        
        {!itemsOpenvar && savedVariants.length > 0 && (
          <div className="mb-4 mt-6 border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-4">
              <h1 className="text-[16px]">Variant</h1>
              <button
                type="button"
                onClick={addVariant}
                className="bg-[#DD851F] text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
              >
                + Add Variants
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-[#F5F8FA] text-left text-[16px]">
                <tr>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 font-medium">Color</th>
                  <th className="px-3 py-2 font-medium">Dimension</th>
                  <th className="px-3 py-2 font-medium">Variant Type</th>
                  <th className="px-3 py-2 font-medium">Selling Price</th>
                  <th className="px-3 py-2 font-medium">Stock</th>
                  <th className="px-3 py-2 font-medium">Reorder Limit</th>
                  <th className="px-3 py-2 font-medium">Action btn</th>
                </tr>
              </thead>

              <tbody>
                {savedVariants.map((v, i) => (
                  <tr key={i} className="border-t text-[16px]">
                    <td className="px-3 py-2">{v.variantSkuId}</td>
                    <td className="px-3 py-2">{v.variantColor}</td>
                    <td className="px-3 py-2">{`${v.variantWidth}x${v.variantHeight}`}</td>
                    <td className="px-3 py-2">{v.variantFrameType}</td>
                    <td className="px-3 py-2">{v.variantSellingPrice}</td>
                    <td className="px-3 py-2">{v.variantStockQuantity}</td>
                    <td className="px-3 py-2">{v.variantReorderLimit}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="p-2 rounded hover:bg-red-100 transition"
                      >
                        <Trash className="w-[27px] h-[27px] text-red-700" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* </div> */}
        <div className="bg-white rounded-2xl  px-3 py-4 mt-6 border">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-[20px] font-medium">Variant</h1>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={addVariant}
                className="bg-[#DD851F] text-white px-4 py-2 rounded-md"
              >
                + Add Variant
              </button>
            </div>
          </div>

          {/* {itemsOpenvar && editingVariant && ( */}

          {/* {itemsOpenvar && editingVariant && ( */}
          {itemsOpenvar && editingVariant && (
            <div className="bg-white rounded-2xl mt-4 transition-all">
              <h1 className="text-[18px]">Variant Details</h1>

              {formData.variants.map((variant, index) => (
                <div key={index} className="mb-8 border-b pb-6">
                  {/* ===== BASIC DETAILS ===== */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Enter Color
                      </label>
                      <input
                        value={variant.variantColor}
                        placeholder="Enter Color"
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantColor",
                            e.target.value
                          )
                        }
                        className="w-full h-[45px] border rounded-lg px-3 bg-[#F8FBFC]"
                      />
                    </div>

                    {/* Dimension */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Dimension
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Width"
                          value={variant.variantWidth || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "variantWidth",
                              e.target.value
                            )
                          }
                          className="w-full h-[45px] border rounded-lg px-3 bg-[#F8FBFC]"
                        />
                        <input
                          type="number"
                          placeholder="Height"
                          value={variant.variantHeight || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "variantHeight",
                              e.target.value
                            )
                          }
                          className="w-full h-[45px] border rounded-lg px-3 bg-[#F8FBFC]"
                        />
                      </div>
                    </div>
                    <div>
                      {" "}
                      <label className="block text-sm font-medium mb-2">
                        {" "}
                        Frame Type{" "}
                      </label>{" "}
                      <button
                        type="button"
                        onClick={() =>
                          setVariantTypeOpen(
                            variantTypeOpen === index ? null : index
                          )
                        }
                        className="w-full h-[45px] border rounded-lg px-4 bg-[#F8FBFC] flex justify-between items-center"
                      >
                        {" "}
                        <span className="text-[#686868]">
                          {" "}
                          {variant.variantFrameType || "Select Frame Type"}{" "}
                        </span>{" "}
                        <ChevronDown className="text-[#686868]" size={18} />{" "}
                      </button>{" "}
                      {variantTypeOpen === index && (
                        <ul className="border mt-1 rounded-lg bg-white shadow absolute">
                          {" "}
                          {variantsType.map((opt, i) => (
                            <li
                              key={i}
                              onClick={() => {
                                handleVariantChange(
                                  index,
                                  "variantFrameType",
                                  opt
                                );
                                setVariantTypeOpen(null);
                              }}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {" "}
                              {opt}{" "}
                            </li>
                          ))}{" "}
                        </ul>
                      )}{" "}
                    </div>

                    {/* ===== SKU WITH GENERATE ===== */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        SKU ID <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <input
                          value={variant.variantSkuId}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "variantSkuId",
                              e.target.value
                            )
                          }
                          placeholder="Enter Variant SKU ID"
                          className="w-full h-[45px] border rounded-lg px-3 pr-24 bg-[#F8FAFB]"
                        />

                        <button
                          type="button"
                          onClick={() => generateVariantSKU(index)}
                          className="absolute right-2 top-1/2 -translate-y-1/2
                  h-[32px] px-4 bg-[#1C3753] text-white text-sm rounded-md"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                    <div>
                      {" "}
                      <label className="block text-sm font-medium mb-2">
                        {" "}
                        Stock Quantity{" "}
                      </label>{" "}
                      <input
                        type="number"
                        name="variantStockQuantity"
                        value={variant.variantStockQuantity}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantStockQuantity",
                            e.target.value
                          )
                        }
                        placeholder="Enter Stock Quantity"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm text-gray-600 placeholder-[#686868]"
                      />{" "}
                    </div>
                    <div>
                      {" "}
                      <label className="block text-sm font-medium mb-2">
                        {" "}
                        Reorder Limit{" "}
                      </label>{" "}
                      <input
                        type="number"
                        name="variantReorderLimit"
                        value={variant.variantReorderLimit}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantReorderLimit",
                            e.target.value
                          )
                        }
                        placeholder="Enter Reorder Limit"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 py-2 bg-[#F8FAFB] text-sm text-gray-600 placeholder-[#686868]"
                      />{" "}
                    </div>
                  </div>

                  {/* ===== PRICING ===== */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-2 mt-4">
                    <div>
                      {" "}
                      <label className="block text-sm font-medium mb-2">
                        {" "}
                        MRP{" "}
                      </label>{" "}
                      <input
                        type="number"
                        name="variantMrp"
                        placeholder="Enter MRP"
                        value={variant.variantMrp || ""}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantMrp",
                            e.target.value
                          )
                        }
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 placeholder-[#686868]"
                      />{" "}
                    </div>

                    <div>
                      {" "}
                      <label className="block text-sm font-medium mb-2">
                        {" "}
                        Selling Price{" "}
                      </label>{" "}
                      <input
                        type="number"
                        name="variantSellingPrice"
                        placeholder="Enter Selling Price"
                        value={variant.variantSellingPrice || ""}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantSellingPrice",
                            e.target.value
                          )
                        }
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 placeholder-[#686868]"
                      />{" "}
                    </div>

                    <div>
                      {" "}
                      <label className="block text-sm font-medium mb-2">
                        {" "}
                        Cost Price{" "}
                      </label>{" "}
                      <input
                        type="number"
                        name="variantCostPrice"
                        placeholder="Enter Cost Price"
                        value={variant.variantCostPrice || ""}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantCostPrice",
                            e.target.value
                          )
                        }
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 placeholder-[#686868]"
                      />{" "}
                    </div>

                    {/* PROFIT (AUTO) */}
                    <div>
                      {" "}
                      <label className="block text-sm font-medium mb-2">
                        {" "}
                        Profit{" "}
                      </label>{" "}
                      <input
                        type="number"
                        name="variantProfit"
                        placeholder="Profit"
                        value={variant.variantProfit}
                        readOnly
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantDiscount",
                            e.target.value
                          )
                        }
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 placeholder-[#686868]"
                      />{" "}
                    </div>

                    {/* DISCOUNT (USER EDITABLE) */}
                    <div>
                      {" "}
                      <label className="block text-sm font-medium mb-2">
                        {" "}
                        Discount{" "}
                      </label>{" "}
                      <input
                        type="number"
                        name="variantDiscount"
                        placeholder="Enter Discount (%)"
                        value={variant.variantDiscount || ""}
                        onChange={(e) =>
                          handleVariantChange(index, "height", e.target.value)
                        }
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 placeholder-[#686868]"
                      />{" "}
                    </div>
                  </div>


                  {/* ===== UPLOAD VARIANT IMAGES ===== */}
                  <div className="p-2 mt-4">
                    <h1 className="mb-3 text-[14px]">Upload Variant Images</h1>

                    <div className="flex gap-3">
                      {variant.variantImage?.map((img, imgIndex) => {
                        const imgSrc =
                          typeof img === "string"
                            ? img
                            : img.preview || URL.createObjectURL(img);

                        return (
                          <img
                            key={imgIndex}
                            src={imgSrc}
                            alt={`variant-${imgIndex}`}
                            className="w-[70px] h-[70px] object-cover rounded-lg border cursor-pointer"
                            onClick={() => {
                              setSelectedImages(variant.variantImage);
                              setCurrentImage(imgSrc);
                              setActiveVariantIndex(index);
                              setIsModalOpen(true);
                            }}
                          />
                        );
                      })}

                      {variant.variantImage.length < 10 && (
                        <label
                          htmlFor={`variantImage-${index}`}
                          className="w-[70px] h-[70px] flex items-center justify-center
                  border rounded-lg cursor-pointer"
                        >
                          <input
                            id={`variantImage-${index}`}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleVariantImageChange(e, index)}
                          />
                          <FiUpload className="text-gray-500 text-[30px]" />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* ===== SAVE BUTTON ===== */}
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => handleSaveVariant(index)}
                      className="bg-[#F8FAFB] px-6 py-2 text-black rounded-md"
                    >
                      Save Variants
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* )} */}

          {/* // )} */}
        </div>
      </form>
    </>
  );
};

export default AddProduct;

// Add product image old code aman

//  <div>
//               <label className="block text-black text-sm font-medium mb-2">
//                 Product Image
//               </label>

//               <div className="flex flex-wrap gap-3 items-start">
//                 {Array.isArray(formData.images) &&
//                   formData.images.map((img, i) => {
//                     const imgSrc =
//                       img instanceof File
//                         ? URL.createObjectURL(img)
//                         : typeof img === "string"
//                         ? img
//                         : null;

//                     if (!imgSrc) return null;

//                     return (
//                       <div key={i} className="relative group">
//                         <img
//                           src={imgSrc}
//                           alt={`preview ${i}`}
//                           className="w-[134px] h-[134px] object-cover rounded-lg border border-neutral-200"
//                         />

//                         {/* Overlay */}
//                         <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition rounded-lg"></div>

//                         {/* Remove button */}
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               images: prev.images.filter(
//                                 (_, index) => index !== i
//                               ),
//                             }))
//                           }
//                           className="absolute top-2 right-2 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
//                         >
//                           <Trash size={20} />
//                         </button>
//                       </div>
//                     );
//                   })}

//                 {/* Upload Box */}
//                 {formData.images.length < 10 && (
//                   <label
//                     htmlFor="productImage"
//                     className="w-[137px] h-[137px] bg-[#ECECF0] border border-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
//                   >
//                     <input
//                       id="productImage"
//                       type="file"
//                       multiple
//                       accept=".png,.jpg,.jpeg,.webp,.svg"
//                       className="hidden"
//                       onChange={handleFileChange}
//                     />
//                     <div className="w-12 h-12 flex items-center justify-center rounded-full border border-[#D0D0D0] bg-white">
//                       <Plus className="text-[#5F5F5F] w-6 h-6" />
//                     </div>
//                   </label>
//                 )}
//               </div>
//             </div>

{
  /* <div className="flex gap-6 mb-5 ">
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
            </div> */
}

{
  /* Return Eligible Checkbox */
}
{
  /* <div className="mt-5 flex items-center gap-2">
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
            </div> */
}

//  the action delete btn
{
  /* Action (Trash) */
}
// <div className="flex flex-col items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//   <label className="block text-sm font-medium mb-2">
//     Action
//   </label>
//   <button
//     type="button"
//     onClick={() => removeVariant(index)}
//     className="p-2 rounded hover:bg-red-100 transition"
//   >
//     <Trash className="w-[27px] h-[27px] text-red-700" />
//   </button>
// </div>

// // Add varitan photo
//  <div className=" w-full">
//                               {variant.variantImage?.length > 0 ? (
//                                 <div className="flex-wrap w-[70px] h-[70px] flex mb-2">
//                                   <img
//                                     src={
//                                       typeof variant.variantImage[0] ===
//                                       "string"
//                                         ? variant.variantImage[0]
//                                         : variant.variantImage[0].preview ||
//                                           URL.createObjectURL(
//                                             variant.variantImage[0]
//                                           )
//                                     }
//                                     alt="Variant"
//                                     className="w-[70px] h-[70px] object-cover rounded-lg border border-neutral-200 cursor-pointer"
//                                     onClick={() => {
//                                       setSelectedImages(variant.variantImage);
//                                       const first =
//                                         typeof variant.variantImage[0] ===
//                                         "string"
//                                           ? variant.variantImage[0]
//                                           : variant.variantImage[0].preview ||
//                                             URL.createObjectURL(
//                                               variant.variantImage[0]
//                                             );
//                                       setCurrentImage(first);
//                                       setIsModalOpen(true);
//                                       setActiveVariantIndex(index);
//                                     }}
//                                   />
//                                   {/* +1 over lay */}
//                                   {/* {variant.variantImage.length > 1 && (
//                                     <div
//                                       onClick={() => {
//                                         setSelectedImages(variant.variantImage);
//                                         const first =
//                                           typeof variant.variantImage[0] ===
//                                           "string"
//                                             ? variant.variantImage[0]
//                                             : variant.variantImage[0].preview ||
//                                               URL.createObjectURL(
//                                                 variant.variantImage[0]
//                                               );
//                                         setCurrentImage(first);
//                                         setActiveVariantIndex(index);
//                                         setIsModalOpen(true);
//                                       }}
//                                       className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-medium rounded-lg cursor-pointer"
//                                     >
//                                       +{variant.variantImage.length - 1}
//                                     </div>
//                                   )} */}

//                                   <div className="flex items-center justify-evenly gap-2">
//                                     {variant.variantImage.map(
//                                       (img, imgIndex) => {
//                                         const imgSrc =
//                                           typeof img === "string"
//                                             ? img
//                                             : img.preview ||
//                                               URL.createObjectURL(img);

//                                         return (
//                                           <img
//                                             key={imgIndex}
//                                             src={imgSrc}
//                                             className="w-[60px] h-[60px] object-cover rounded-lg border cursor-pointer hover:opacity-80 transition"
//                                             alt={`variant-${imgIndex}`}
//                                             onClick={() => {
//                                               setSelectedImages(
//                                                 variant.variantImage
//                                               );
//                                               setCurrentImage(imgSrc);
//                                               setActiveVariantIndex(index);
//                                               setIsModalOpen(true);
//                                             }}
//                                           />
//                                         );
//                                       }
//                                     )}
//                                   </div>

//                                   {variant.variantImage.length < 10 && (
//                                     <label
//                                       htmlFor={`variantImage-${index}`}
//                                       className="absolute bottom-4 left-24 -top-1  w-[75px] h-[75px] bg-[#FFFFFF] border border-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#DEDEDE]"
//                                     >
//                                       <input
//                                         id={`variantImage-${index}`}
//                                         type="file"
//                                         accept="image/*"
//                                         multiple
//                                         className="hidden"
//                                         onChange={(e) =>
//                                           handleVariantImageChange(e, index)
//                                         }
//                                       />
//                                       {/* <Plus className="text-gray-500 w-3 h-3" /> */}
//                                       <div>
//                                         <BiImageAdd className="text-gray-500 text-[35px] hover:text-blue-600 transition" />
//                                       </div>
//                                     </label>
//                                   )}
//                                 </div>

//                               ) : (
//                                 <label
//                                   htmlFor={`variantImage-${index}`}
//                                   className="w-[80px] h-[80px] bg-[#FFFFFF] border border-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#DEDEDE]"
//                                 >
//                                   <input
//                                     id={`variantImage-${index}`}
//                                     type="file"
//                                     accept="image/*"
//                                     multiple
//                                     className="hidden"
//                                     onChange={(e) =>
//                                       handleVariantImageChange(e, index)
//                                     }
//                                   />
//                                   {/* <div className="w-[20px] h-[20px] flex items-center justify-center rounded-full border border-[#D0D0D0] bg-white"> */}
//                                   <div>
//                                     <BiImageAdd className="text-gray-500 text-[35px] hover:text-blue-600 transition" />
//                                   </div>
//                                 </label>
//                               )}
//                             </div>
// /////////////////////////
{
  /* <div className="flex items-center justify-center text-[14px] gap-3">
            <Link to={`/admin/products`}>
              <h1 className="text-[#686868]">All Product</h1>
            </Link>
            <IoIosArrowForward />
            <h1 className="text-[#1626FF] font-normal cursor-pointer">
              Add Product
            </h1>
          </div> */
}
// //////////////////////////// variant aimages
{
  /* <div className="flex items-start justify-start gap-16  "> */
}
{
  /* 6️ Variant Image */
}
{
  /* <div className="flex flex-col items-start justify-start ">
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
                      </div> */
}
{
  /* </div> */
}
{
  /*  Action (Trash) */
}
{
  /* <div className="flex flex-col items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                    </div> */
}
