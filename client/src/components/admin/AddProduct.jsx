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
import AddCategoryPopUp from "./AddCategoryPopUp";
import AddSubCategoryPopup from "./AddSubCategoryPopup";
import DisplayVariantImg from "./DisplayVariantImg";
import { RiDeleteBin6Line } from "react-icons/ri";
//  metariol ui

const AddProduct = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);
  const { uuid } = useParams(); // the use to fetch the data in params

  const [formData, setFormData] = useState({
    uuid: uuidv4(),
    productTittle: "",
    description: "",
    status: "ACTIVE",
    category: [],
    subcategory: [],
    materialType: "",
    productcolor: "",
    ProductWidthValue: "",
    ProductWidthUnit: "",
    ProductHeightValue: "",
    ProductDimensionUnit: "",
    SKU: "",
    stockQuantity: "",
    profitAmount: "",
    profitMargin: "",
    ReorderLimit: "",
    images: [],
    mrp: "",
    costPrice: "",
    sellingPrice: "",
    discountname: "",
    extradiscountamount: "",
    discountPercent: "",
    discountAmount: "",
    taxPercent: "",
    variantlistings: false,
    variants: [
      {
        variantId: "",
        variantColor: "",
        variantLength: "",
        variantBreadth: "",
        variantWidth: "",
        variantSkuId: "",
        variantImage: [],
        variantMrp: "",
        variantSellingPrice: "",
        variantCostPrice: "",
        variantAvailableStock: "",
      },
    ],
  });

  // variants
  const emptyVariant = () => ({
    variantId: uuidv4(),
    variantColor: "",
    variantLength: "",
    variantBreadth: "",
    variantWidth: "",
    variantSkuId: "",
    variantImage: [],
    variantMrp: "",
    variantSellingPrice: "",
    variantCostPrice: "",
    variantAvailableStock: "",
  });

  // ✅ Adds a new empty row in the table
  const addVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, emptyVariant()],
    }));
  };

  // edit product
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
    if (name === "productTittle") {
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
      // updated.uuid = sku.toLowerCase();
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

    // ✅ Profit Amount
    if (sellingPrice > 0 && costPrice > 0) {
      const profitAmount = sellingPrice - costPrice;
      updated.profitAmount = profitAmount.toFixed(2);

      // ✅ Profit Margin %
      const profitMargin = (profitAmount / sellingPrice) * 100;
      updated.profitMargin = profitMargin.toFixed(2);
    } else {
      updated.profitAmount = "";
      updated.profitMargin = "";
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

    if (formData.images.length + files.length > 7) {
      alert("Max 7 images allowed");
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
      variantId: "",
      variantColor: "",
      variantLength: "",
      variantBreadth: "",
      variantWidth: "",
      variantSkuId: "",
      variantImage: [],
      variantMrp: "",
      variantSellingPrice: "",
      variantCostPrice: "",
      variantAvailableStock: "",
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
    // if (!formData.productTittle.trim() || !formData.category.trim()) {
    if (!formData.productTittle.trim() || formData.category.length === 0) {
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
      // const response = await axiosInstance.post(
      //   "/products/add-product",
      //   formDataObj,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   },
      // );

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

  // sku id generated in random by product title
  const generatedSKU = () => {
    const title = formData.productTittle?.trim() || "";

    if (title.length < 3) {
      toast.error("Enter product title first!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const prefix = title.substring(0, 3).toUpperCase();
    const randomNum = String(Math.floor(Math.random() * 999)).padStart(3, "0"); // 000–999

    const newSKU = `${prefix}-ART-${randomNum}`;

    setFormData((prev) => ({ ...prev, SKU: newSKU }));
  };

  // generate variant sku
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
  const [selectedPriceRange, setSelectedPriceRange] =
    useState("Select Price Range");

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
  ];

  // save draft
  const handleSaveDraft = () => {
    setFormData((prev) => ({ ...prev, status: "DRAFT" }));
    handleSubmit({ preventDefault: () => {} });
  };

  //  step 4 in process

  const [isOn, setIsOn] = useState(false);

  //  in this code we are going to handle the toggle btn in variants listing

  const colors = [
    "Black",
    "Blue",
    "Red",
    "Green",
    "White",
    "Brown",
    "Green",
    "Gray",
    "Yellow",
    "Purple",
    "Orange",
    "Gold",
    "Silver",
    "Beige",
    "Cream",
    "Pink",
    "Violet",
    "Maroon",
    "Charcoal",
    "Burgundy",
    "Cooper",
    "Bronze",
    "Natural Wood",
  ];

  const [selectedColors, setSelectedColors] = useState([]);

  const handleSelect = (e) => {
    const value = e.target.value;
    if (!selectedColors.includes(value)) {
      setSelectedColors([...selectedColors, value]);
    }
  };

  const removeItem = (item) => {
    setSelectedColors(selectedColors.filter((i) => i !== item));
  };

  // dimesnsion

  const [dimension, setDimension] = useState({ length: "", breadth: "" });
  const [sizes, setSizes] = useState([]); // ["20X10", "30X20"]

  const onDimChange = (e) => {
    const { name, value } = e.target;
    setDimension((prev) => ({ ...prev, [name]: value }));
  };

  const addSize = () => {
    const l = String(dimension.length).trim();
    const b = String(dimension.breadth).trim();

    if (!l || !b) return;

    const length = Number(l);
    const breadth = Number(b);
    if (
      !Number.isFinite(length) ||
      !Number.isFinite(breadth) ||
      length <= 0 ||
      breadth <= 0
    )
      return;

    const chip = `${length}X${breadth}`;

    if (sizes.includes(chip)) {
      setDimension({ length: "", breadth: "" });
      return;
    }

    setSizes((prev) => [...prev, chip]);
    setDimension({ length: "", breadth: "" });
  };

  const removeSize = (chip) => {
    setSizes((prev) => prev.filter((x) => x !== chip));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSize();
    }
  };

  // variant image
  const variantFileRefs = useRef([]);

  const triggerVariantUpload = (variantIndex) => {
    variantFileRefs.current[variantIndex]?.click();
  };

  const openVariantImages = (variantIndex) => {
    const imgs = formData.variants[variantIndex]?.variantImage || [];

    setActiveVariantIndex(variantIndex);
    setSelectedImages(imgs);

    const first =
      imgs.length > 0
        ? typeof imgs[0] === "string"
          ? imgs[0]
          : imgs[0].preview || URL.createObjectURL(imgs[0])
        : "";

    setCurrentImage(first);
    setIsModalOpen(true);
  };

  // extra discount in step 3 add state is toggle btn
  const [discounttoggle, setDiscounttoggle] = useState(false);

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
        className="p-6 bg-[#F6F8F9] min-h-screen"
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
              type="button"
              onClick={handleSaveDraft}
              className="py-1 px-3 rounded border border-[#737373] text-[#737373] hover:bg-[#706f6f] hover:text-white bg-[#F6F8F9] font-medium"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="py-1 px-3 rounded-lg bg-[#1C3753] text-[#FFFFFF] font-medium"
            >
              {isEditing ? "Update Product" : "Add Product"}
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
                ? "bg-[#D5E5F5] text-[#4EA7FF]"
                : isActive
                  ? "bg-[#FFFFFF] text-[#1C3753] border border-1"
                  : "bg-gray-200 text-gray-600"
            }`}
                  >
                    {isCompleted ? <LucideCheck size={16} /> : item.id}
                  </div>

                  <span
                    className={`text-sm ${
                      isActive ? "text-[#4EA7FF] font-medium" : "text-gray-500"
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
        <div className="w-full">
          {/* Basic Details Section */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border p-4 h-fit flex flex-col">
                  <h2 className="text-[18px] font-medium font-['Inter'] mb-4">
                    Basic Details
                  </h2>

                  <div className="flex flex-col gap-5 flex-1">
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
                        name="productTittle"
                        value={formData.productTittle}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3
          text-[#686868] text-sm bg-[#F8FAFB] placeholder-[#686868]
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#686868] "
                      />
                    </div>

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

                <div className="flex flex-col space-y-3">
                  <div className="bg-white rounded-2xl p-4 border">
                    <h2 className="text-black text-[18px] font-medium mb-4">
                      Product Status
                    </h2>
                    <div className="flex items-center justify-start gap-4">
                      <div className="flex items-center gap-3">
                        <label htmlFor="Active">
                          <input
                            type="radio"
                            id="Active"
                            name="status"
                            value="ACTIVE"
                            checked={formData.status === "ACTIVE"}
                            onChange={handleChange}
                          />
                          <span> Active</span>
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <label htmlFor="Archived">
                          <input
                            type="radio"
                            id="Archived"
                            name="status"
                            value="ARCHIVED"
                            checked={formData.status === "ARCHIVED"}
                            onChange={handleChange}
                          />
                          <span> Archived</span>
                        </label>
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
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="bg-white rounded-xl p-6 border">
                    <h2 className="text-[16px] font-medium mb-4">
                      Product Details
                    </h2>

                    <div className="mb-4">
                      <label className="text-sm mb-2 block">
                        Product Color <span className="text-[#D53B35]">*</span>
                      </label>
                      <select className="w-full h-[44px] border rounded-lg px-3 bg-[#F8FAFB] text-sm">
                        <option>Select color</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm mb-2 block">
                          Product Weight{" "}
                          <span className="text-[#D53B35]">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter product weight"
                            className="w-full h-[44px] border rounded-lg px-3 bg-[#F8FAFB] text-sm"
                          />
                          <select className="h-[44px] border rounded-lg px-3 bg-[#F8FAFB] text-sm">
                            <option>kg</option>
                          </select>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm mb-2 block">
                          Dimension<span className="text-[#D53B35]">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Length"
                            className="w-full h-[44px] border rounded-lg px-3 bg-[#F8FAFB] text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Breadth"
                            className="w-full h-[44px] border rounded-lg px-3 bg-[#F8FAFB] text-sm"
                          />
                          <select className="h-[44px] border rounded-lg px-3 bg-[#F8FAFB] text-sm">
                            <option>In</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* inventory */}
                  <div className="bg-white rounded-2xl p-4 border">
                    <h2 className="text-[#1C1C1C] text-[18px] font-medium mb-4">
                      Inventory
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      {/* SKU ID */}
                      <div>
                        <label className="block text-sm font-normal mb-2">
                          Product SKU ID{" "}
                          <span className="text-[#D53B35]">*</span>
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
                          Available Stock
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
                      {/* Low stock alert */}
                      <div>
                        <label className="block text-sm font-normal mb-2">
                          Low stock alert{" "}
                          <span className="text-[#D53B35]">*</span>
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
                    </div>
                  </div>
                </div>
                {/* uploded images */}
                <div className=" rounded-2xl p-4 border  flex flex-col h-fit bg-white">
                  <h1 className="text-[16px] font-medium mb-3">
                    Upload Images <span>*</span>
                  </h1>

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
                            Only *.png, *.jpg and *.jpeg image files are
                            accepted
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
              </div>
            </>
          )}

          {step == 3 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <div className="bg-white rounded-2xl p-4 border">
                  <h2 className="text-black text-xl font-medium mb-4">
                    Pricing
                  </h2>
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
                        Cost Price <span className="text-[#D53B35]">*</span>
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
                        Selling Price <span className="text-[#D53B35]">*</span>
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
                          value={`${formData.discountPercent}%`}
                          onChange={handleChange}
                          placeholder="(%)"
                          className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB]"
                        />
                        <input
                          type="text"
                          name="discountAmount"
                          value={`${formData.discountAmount} ₹`}
                          onChange={handleChange}
                          placeholder="(₹)"
                          className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* right section in profit detalis */}

                <div className="bg-[#EFF6EE] rounded-2xl space-y-6 p-4 border border-[#00A63E]">
                  <h2 className="text-black text-xl font-medium mb-4">
                    Profit Analysis
                  </h2>

                  <div className="bg-[#F8FBFC] rounded-lg">
                    <div className="border-[1px] border-[#DEDEDE]  px-4 py-2  rounded-lg">
                      <label className="block text-[14px] text-[#686868] font-normal mb-2">
                        Profit Margin
                      </label>
                      <input
                        type="text"
                        name="profit"
                        value={`${formData.profitMargin}%`}
                        readOnly
                        placeholder="Profit (₹)"
                        className="w-full h-[45px] rounded-lg bg-[#F8FBFC]   text-[24px] text-[#00A63E] focus:outline-none placeholder-[#686868]"
                      />
                    </div>
                  </div>
                  <div className="bg-[#F8FBFC] rounded-lg">
                    <div className="border-[1px] border-[#DEDEDE] rounded-lg px-4 py-2 ">
                      <label className="block text-[14px] text-[#686868] font-normal mb-2">
                        Profit Amount
                      </label>
                      <input
                        type="text"
                        name="profit"
                        value={`₹ ${formData.profitAmount}`}
                        readOnly
                        placeholder="Profit (₹)"
                        className="w-full h-[45px] rounded-lg bg-[#F8FBFC] text-[24px] text-[#00A63E] focus:outline-none placeholder-[#686868]"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-black text-xl font-medium mb-4">
                      Additional Discounts
                    </h2>
                    {discounttoggle ? (
                      <button
                        type="button"
                        onClick={() => setDiscounttoggle(false)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDiscounttoggle(true)}
                        className="px-4 py-2 bg-[#1C3753] text-white rounded-lg"
                      >
                        + Add Discount
                      </button>
                    )}
                  </div>
                  {discounttoggle && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Discount Name */}
                      <div>
                        <label className="block text-sm font-normal mb-2">
                          Discount Name
                        </label>
                        <input
                          type="text"
                          name="discountname"
                          value={formData.discountname}
                          onChange={handleChange}
                          placeholder="e.g. Prepaid Order"
                          className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB]
                 text-sm text-[#686868] placeholder-[#686868] focus:outline-none"
                        />
                      </div>

                      {/* Discount Amount */}
                      <div>
                        <label className="block text-sm font-normal mb-2">
                          Discount Amount
                        </label>
                        <input
                          type="number"
                          name="discountamount"
                          value={formData.extradiscountamount}
                          onChange={handleChange}
                          placeholder="Enter amount (₹)"
                          className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB]
                 text-sm text-[#686868] placeholder-[#686868] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {step == 4 && (
            <>
              {/* toggle btn switch  */}
              <div className="bg-white p-[16px] rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-[16px]">
                    Does this Product has Variants?
                  </h1>
                  <button
                    type="button"
                    onClick={() => setIsOn(!isOn)}
                    className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300
        ${isOn ? "bg-[#1C3753]" : "bg-gray-300"}`}
                  >
                    <span
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
          ${isOn ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>
                <p className="text-sm text-[#686868]">
                  Enable this if your product comes in different sizes, colours,
                  or other options. If disabled, you'll only need to fill basic
                  product details.
                </p>
              </div>
              {/* Select Variants Types  */}
              {/* <div className="bg-white p-4 rounded-2xl space-y-4">
                <h1 className="text-lg font-semibold">Select Variant Types</h1>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="color"
                    name="variants"
                    value="color"
                    className="h-4 w-4 accent-black"
                  />
                  <label htmlFor="color" className="text-sm">
                    Color
                  </label>

                  <input
                    type="checkbox"
                    id="siDimensionze"
                    name="variants"
                    value="Dimension"
                    className="h-4 w-4 accent-black"
                  />
                  <label htmlFor="Dimension" className="text-sm">
                    Dimension
                  </label>
                </div>

                <div className="border-t-2">
                  <div>
                    <div className="w-full max-w-full space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Color
                        </label>
                        <p className="text-xs text-gray-500">
                          Add different color options
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 rounded-lg p-2 w-full">
                        <select
                          onChange={handleSelect}
                          className="rounded-md w-[288px] border px-3 py-2 text-sm focus:outline-none"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select color
                          </option>
                          {colors.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>

                        {selectedColors.map((item) => (
                          <span
                            key={item}
                            className="flex items-center gap-1 rounded-md border border-blue-400 bg-blue-50 px-3 py-1 text-sm text-blue-700"
                          >
                            {item}
                            <button
                              onClick={() => removeItem(item)}
                              className="ml-1 text-xs font-bold hover:text-red-500"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t-2">
                  <div>
                    <div className="w-full">
                      <div className="text-sm font-semibold text-gray-900">
                        Dimension
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        Add different Size options
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full">
                        <input
                          type="number"
                          name="length"
                          value={dimension.length}
                          onChange={onDimChange}
                          onKeyDown={onKeyDown}
                          placeholder="Length"
                          className="h-10 w-[120px] rounded-md border border-gray-200 px-3 text-sm focus:outline-none"
                        />

                        <input
                          type="number"
                          name="breadth"
                          value={dimension.breadth}
                          onChange={onDimChange}
                          onKeyDown={onKeyDown}
                          placeholder="Breadth"
                          className="h-10 w-[120px] rounded-md border border-gray-200 px-3 text-sm focus:outline-none"
                        />

                        {sizes.map((chip) => (
                          <span
                            key={chip}
                            className="flex h-10 items-center gap-2 rounded-md border border-slate-400 bg-slate-100 px-3 text-sm text-slate-900"
                          >
                            {chip}
                            <button
                              type="button"
                              onClick={() => removeSize(chip)}
                              className="text-base leading-none hover:text-red-500"
                              aria-label={`Remove ${chip}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="mt-1 text-[11px] text-gray-400">
                        Tip: Press "Enter" to add Dimension.
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-1 bg-[#1C3753] text-sm text-white rounded-md">
                    Create Variants
                  </button>
                </div>
              </div> */}

              {isOn && (
                <div className="w-full rounded-lg bg-white p-4 mt-4">
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Variant Listings</h1>
                    <button
                      type="button"
                      onClick={addVariantRow}
                      className="rounded-md bg-[#1C3753] px-4 py-1 text-sm text-white"
                    >
                      + Add Variant
                    </button>
                  </div>

                  {/* Table Wrapper */}
                  <div className="overflow-x-auto rounded-t-xl">
                    <table className="w-full min-w-[1200px] text-sm">
                      <thead className="bg-[#F5F8FA]">
                        <tr>
                          <th className="px-3 py-2 text-left"></th>
                          <th className="px-3 py-2 text-left">Color</th>
                          <th className="px-3 py-2 text-left">
                            Dimension (Inches)
                          </th>
                          <th className="px-3 py-2 text-left">Weight (Kg)</th>
                          <th className="px-3 py-2 text-left">
                            Variant SKU ID
                          </th>
                          <th className="px-3 py-2 text-left">Images</th>
                          <th className="px-3 py-2 text-left">MRP</th>
                          <th className="px-3 py-2 text-left">Selling Price</th>
                          <th className="px-3 py-2 text-left">Cost Price</th>
                          <th className="px-3 py-2 text-left">
                            Available Stock
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {formData.variants.map((variant, index) => (
                          <tr
                            key={variant.variantId || index}
                            className="hover:bg-gray-50 border-b"
                          >
                            {/* Checkbox */}
                            <td className=" px-3 py-2">
                              <input type="checkbox" />
                            </td>

                            {/* Color */}
                            <td className=" px-3 py-2">
                              <div className="flex flex-wrap items-center gap-2 rounded-lg p-2 w-[140px]">
                                <select
                                  value={variant.variantColor || ""}
                                  // onChange={handleSelect}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "variantColor",
                                      e.target.value,
                                    )
                                  }
                                  // className="rounded-md border px-3 py-2 text-sm focus:outline-none"
                                  className="w-[140px] rounded-md border px-3 py-2 text-sm focus:outline-none"
                                  defaultValue=""
                                >
                                  <option value="" disabled>
                                    Select color
                                  </option>
                                  {colors.map((color, index) => (
                                    <option key={index} value={color}>
                                      {color}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>

                            {/* Dimension */}
                            <td className=" px-3 py-2">
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={variant.variantLength || ""}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "variantLength",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter Length"
                                  className="w-32 rounded border px-2 py-1"
                                />
                                <input
                                  type="number"
                                  value={variant.variantBreadth || ""}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "variantBreadth",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter Breadth"
                                  className="w-32 rounded border px-2 py-1"
                                />
                              </div>
                            </td>

                            {/* Weight */}
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={variant.variantWidth || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "variantWidth",
                                    e.target.value,
                                  )
                                }
                                placeholder="Enter Weight"
                                className="w-32 rounded border px-2 py-1"
                              />
                            </td>

                            {/* SKU */}
                            <td className="px-3 py-2">
                              <div>
                                <div className="relative">
                                  <input
                                    type="text"
                                    name="SKU"
                                    value={variant.variantSkuId || ""}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        index,
                                        "variantSkuId",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Generate Variant SKU ID"
                                    className="w-full h-[35px] border border-[#D0D0D0] rounded-lg px-3 pr-28
              bg-[#F8FAFB] text-sm text-[#6B6B6B] placeholder-[#686868]
              focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => generateVariantSKU(index)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2
              h-[24px] px-4 bg-[#1C3753] text-white text-sm font-normal
              rounded-md hover:bg-[#264464] transition"
                                  >
                                    Generate
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Images Column */}
                            <td className=" px-3 py-2">
                              {(() => {
                                const imgs =
                                  formData.variants[index].variantImage || [];

                                const count = imgs.length;
                                const firstImg = imgs[0];

                                const thumbSrc = firstImg
                                  ? typeof firstImg === "string"
                                    ? firstImg
                                    : firstImg.preview ||
                                      URL.createObjectURL(firstImg)
                                  : "";

                                return (
                                  <div className="flex items-center gap-4 whitespace-nowrap">
                                    {/* CASE 1: No images → show Add Images */}
                                    {count === 0 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          triggerVariantUpload(index)
                                        }
                                        className="flex items-center gap-2"
                                      >
                                        <div className="h-9 w-9 rounded-md border bg-[#EFEFEF] flex items-center justify-center">
                                          <FiUpload className="h-5 w-5 text-[#1C3753]" />
                                        </div>
                                        <span className="text-sm text-[#1C3753]">
                                          Add Images
                                        </span>
                                      </button>
                                    )}

                                    {/* CASE 2: Images exist → show thumb + +N */}
                                    {count > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => openVariantImages(index)}
                                        className="flex items-center gap-2"
                                      >
                                        <div className="h-9 w-9 rounded-md overflow-hidden border bg-gray-100">
                                          <img
                                            src={thumbSrc}
                                            alt=""
                                            className="h-full w-full object-cover"
                                          />
                                        </div>

                                        <span className="text-sm text-[#1C3753]">
                                          +{count} Images
                                        </span>
                                      </button>
                                    )}

                                    {/* Hidden input (always present) */}
                                    <input
                                      type="file"
                                      multiple
                                      accept=".png,.jpg,.jpeg,.webp,.svg"
                                      className="hidden"
                                      ref={(el) =>
                                        (variantFileRefs.current[index] = el)
                                      }
                                      onChange={(e) =>
                                        handleVariantImageChange(e, index)
                                      }
                                    />
                                  </div>
                                );
                              })()}
                            </td>

                            {/* MRP */}
                            <td className=" px-3 py-2">
                              <input
                                type="number"
                                value={variant.variantMrp || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "variantMrp",
                                    e.target.value,
                                  )
                                }
                                className="w-24 rounded border px-2 py-1"
                                placeholder="₹1600"
                              />
                            </td>

                            {/* Selling Price */}
                            <td className=" px-3 py-2">
                              <input
                                type="number"
                                value={variant.variantSellingPrice || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "variantSellingPrice",
                                    e.target.value,
                                  )
                                }
                                className="w-24 rounded border px-2 py-1"
                                placeholder="₹1500"
                              />
                            </td>

                            {/* Cost Price */}
                            <td className=" px-3 py-2">
                              <input
                                type="number"
                                value={variant.variantCostPrice || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "variantCostPrice",
                                    e.target.value,
                                  )
                                }
                                className="w-24 rounded border px-2 py-1"
                                placeholder="₹800"
                              />
                            </td>

                            {/* Stock */}
                            <td className=" px-3 py-2">
                              <input
                                type="number"
                                value={variant.variantAvailableStock || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "variantAvailableStock",
                                    e.target.value,
                                  )
                                }
                                className="w-20 rounded border px-2 py-1"
                                placeholder="10"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-1 bg-[#F6F8F9] border border-[#1C3753] text-[#1C3753] font-medium rounded-md"
            >
              Next
            </button>
          ) : (
            // <button
            //   type="submit"
            //   className="px-4 py-2 bg-green-600 text-white rounded">
            //   Save Product
            // </button>
            ""
          )}
        </div>
      </form>
    </>
  );
};

export default AddProduct;
