import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct } from "../../redux/cart/productSlice";
import { v4 as uuidv4 } from "uuid";
import product from "../../data/products.json";
import imageCompression from "browser-image-compression";
// import { IoIosArrowForward } from "react-icons/io";
import { FiUpload } from "react-icons/fi";

import { ChevronLeft } from "lucide-react";
import { data, Link } from "react-router";
import AddCategoryPopUp from "./AddCategoryPopUp";
import AddSubCategoryPopup from "./AddSubCategoryPopup";
import DisplayVariantImg from "./DisplayVariantImg";
// import { RiDeleteBin6Line } from "react-icons/ri";
//  metariol ui

const AddProduct = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);
  const { uuid } = useParams();

  const [formData, setFormData] = useState({
    uuid: uuidv4(),
    productTittle: "",
    description: "",
    status: "ACTIVE",
    category: "",
    subcategory: "",
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
        variantId: uuidv4(),
        variantColor: "",
        variantName: "",
        variantDimensionunit: "In",
        variantWidth: "",
        variantWidthUnit: "kg",
        variantSkuId: "",
        variantImage: [],
        variantMrp: "",
        variantCostPrice: "",
        variantSellingPrice: "",
        variantDiscount: "",
        variantDiscountUnit: "",
        variantAvailableStock: "",
        variantLowStockAlertStock: "",
        isSelected: false,
      },
    ],
  });

  const badgeOptions = [
    "Festive",
    "Bestseller",
    "New Arrival",
    "Trending",
    "Featured",
    "Limited Edition",
    "Premium",
  ];

  const handleTagChange = (e) => {
    const value = e.target.value;

    if (!value) return;

    if (!formData.productTags.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        productTags: [...prev.productTags, value],
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      productTags: prev.productTags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // variants
  const emptyVariant = () => ({
    variantId: uuidv4(),
    variantColor: "",
    variantName: "",
    variantDimensionunit: "In", // default
    variantWidth: "",
    variantWidthUnit: "kg", // default
    variantSkuId: "",
    variantImage: [],
    variantMrp: "",
    variantCostPrice: "",
    variantSellingPrice: "",
    variantDiscount: "",
    variantDiscountUnit: "%", // default
    variantAvailableStock: "",
    variantLowStockAlertStock: "",
    isSelected: false,
  });

  const addVariantRow = () => {
    const productSKU = formData.SKU?.trim();

    if (!productSKU) {
      toast.error("Generate Product SKU first!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newVariant = {
      ...emptyVariant(),
      variantSkuId: `${productSKU}-V-${randomNum}`, // ✅ auto
    };

    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
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
      updated.route = `/product/${sku.toLowerCase()}`;

      // ✅ First variant SKU = Product SKU
      updated.variants = updated.variants.map((v, i) =>
        i === 0 ? { ...v, variantSkuId: sku } : v,
      );
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

  const [categories, setCategories] = useState([
    "Wall Art",
    "Religious",
    "Modern",
  ]);

  const [subCategories, setSubCategories] = useState({
    "Wall Art": ["Metal Tree", "Abstract Line"],
    Religious: ["Krishna", "Shiva"],
    Modern: ["Minimal", "Geometric"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Proper validation block
    if (!formData.productTittle.trim() || !formData.category) {
      toast.error("Please fill in all required fields!", {
        position: "top-right",
        autoClose: 2000,
        className: "bg-red-700 text-white rounded-lg",
      });
      return;
    }

    setIsSubmitting(true);

    // ✅ Add UUID to product + variants
    const formDataWithUUID = {
      ...formData,
      uuid: formData.uuid || uuidv4(),
      variants: formData.variants.map((v) => ({
        ...v,
        variantId: v.variantId || uuidv4(),
      })),
    };

    const formDataObj = new FormData();

    // append all normal fields except variants
    Object.entries(formDataWithUUID).forEach(([key, value]) => {
      if (key === "variants") return;
      if (value === undefined || value === null) return;
      formDataObj.append(key, value);
    });

    // ✅ send variants as JSON string
    formDataObj.append("variants", JSON.stringify(formDataWithUUID.variants));

    // ✅ send images separately per variant index
    formDataWithUUID.variants.forEach((v, i) => {
      (v.variantImage || []).forEach((file) => {
        formDataObj.append(`variantImages_${i}`, file);
      });
    });
    try {
      await axiosInstance.post("/products/add-product", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        isEditing
          ? "Product updated successfully!"
          : "Product added successfully!",
      );
      // console.log(response)

      localStorage.setItem("addProductForm", JSON.stringify(formDataWithUUID));

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (err) {
      toast.error("Error uploading product!");
      console.log(err);
    } finally {
      setIsSubmitting(false);
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

  // ✅ single row select/unselect
  const toggleVariantSelect = (index) => {
    setFormData((prev) => {
      const variants = [...prev.variants];
      variants[index] = {
        ...variants[index],
        isSelected: !variants[index].isSelected,
      };
      return { ...prev, variants };
    });
  };

  // ✅ select all
  const toggleSelectAllVariants = (checked) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => ({ ...v, isSelected: checked })),
    }));
  };

  // ✅ remove selected (at least 1 row keep)
  const removeSelectedVariants = () => {
    setFormData((prev) => {
      const remaining = prev.variants.filter((v) => !v.isSelected);
      return {
        ...prev,
        variants: remaining.length ? remaining : [emptyVariant()],
      };
    });
  };

  const isAnyVariantSelected = formData.variants.some((v) => v.isSelected);

  // Loader

  const [isSubmitting, setIsSubmitting] = useState(false);

  const descriptionRef = useRef(null);

  const handleDescriptionChange = (e) => {
    handleChange(e);

    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [formData.description]);

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl px-6 py-4 flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-[#1C3753] animate-spin" />
            <p className="text-sm font-medium text-gray-800">
              Uploading product, please wait...
            </p>
          </div>
        </div>
      )}
      {showCategoryModal && (
        <AddCategoryPopUp
          setNewCategory={setNewCategory}
          newCategory={newCategory}
          setShowCategoryModal={setShowCategoryModal}
          categories={categories}
          setCategories={setCategories}
          subcategories={subCategories}
          setSubcategories={setSubCategories}
          setFormData={setFormData}
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
          subcategories={subCategories}
          setSubcategories={setSubCategories}
          setFormData={setFormData}
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
              disabled={isSubmitting}
              className={`py-1 px-3 rounded border font-medium
    ${isSubmitting ? "cursor-not-allowed opacity-60" : ""}
    border-[#737373] text-[#737373] hover:bg-[#706f6f] hover:text-white bg-[#F6F8F9]`}
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-1 px-3 rounded-lg font-medium 
    ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#1C3753]"} 
    text-[#FFFFFF]`}
            >
              {isSubmitting
                ? "Uploading..."
                : isEditing
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </div>

        {/* Product Info Grid */}
        <div className="w-full">
          {/* Basic Details Section */}

          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border p-4 flex flex-col">
                <h2 className="text-[18px] font-medium font-['Inter'] mb-4">
                  Basic Details
                </h2>

                <div className="flex flex-col gap-5 flex-1">
                  <div>
                    <div className="flex items-start gap-1">
                      <label className="block text-black text-[14px] mb-2">
                        Product Name
                      </label>
                      <span className="text-[#D53B35]">*</span>
                    </div>

                    <input
                      type="text"
                      name="productTittle"
                      value={formData.productTittle}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3
            text-[#686868] text-sm bg-[#F8FAFB] placeholder-[#686868]
            focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#686868]"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <label className="block text-black text-[14px] font-normal mb-2">
                      Description
                    </label>
                    <textarea
                      ref={descriptionRef}
                      placeholder="Write a description of the product"
                      name="description"
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      rows={3}
                      className="w-full min-h-[100px] max-h-[300px] border border-[#D0D0D0] rounded-lg px-3 py-2
  text-[#686868] text-sm bg-[#F8FAFB] placeholder-[#686868]
  focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
  resize-none overflow-hidden transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <div className="bg-white rounded-2xl p-4 border">
                  <h2 className="text-black text-[18px] font-medium mb-4">
                    Product Classification
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    <div>
                      <label className="block text-black text-[14px] mb-2">
                        Category <span className="text-[#D53B35]">*</span>
                      </label>

                      <select
                        name="category"
                        value={formData.category}
                        onChange={(e) => {
                          const val = e.target.value;

                          // ✅ if user clicked add option
                          if (val === "__add_category__") {
                            setShowCategoryModal(true);

                            // reset category selection (so dropdown doesn't stay on add option)
                            setFormData((prev) => ({
                              ...prev,
                              category: "",
                              subcategory: "",
                            }));
                            return;
                          }

                          // ✅ normal category select
                          setFormData((prev) => ({
                            ...prev,
                            category: val,
                            subcategory: "", // reset subcategory when category changes
                          }));
                        }}
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3
    text-sm bg-[#F8FAFB]
    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      >
                        <option value="">Select category</option>

                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}

                        {/* ✅ Add option inside dropdown */}
                        <option value="__add_category__">+ Add Category</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-black text-[14px] mb-2">
                        Sub-Category
                      </label>

                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={(e) => {
                          const val = e.target.value;

                          if (val === "__add_subcategory__") {
                            if (!formData.category) {
                              toast.error("Select category first!");
                              setFormData((prev) => ({
                                ...prev,
                                subcategory: "",
                              }));
                              return;
                            }

                            setShowSubCategoryModal(true);
                            setFormData((prev) => ({
                              ...prev,
                              subcategory: "",
                            }));
                            return;
                          }

                          setFormData((prev) => ({
                            ...prev,
                            subcategory: val,
                          }));
                        }}
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3
    text-sm bg-[#F8FAFB]
    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      >
                        <option value="">Select sub-category</option>

                        {(subCategories[formData.category] || []).map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}

                        {/* ✅ Add option inside dropdown */}
                        <option value="__add_subcategory__">
                          + Add Subcategory
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <>
              <div className="w-full rounded-lg bg-white p-4 mt-4">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="text-lg font-semibold">Variant Listings</h1>
                  <div className="flex items-center justify-end gap-3">
                    {isAnyVariantSelected && (
                      <button
                        type="button"
                        onClick={removeSelectedVariants}
                        className="rounded-md border border-red-500 px-4 py-1 text-sm text-red-600"
                      >
                        Remove Selected
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={addVariantRow}
                      className="rounded-md bg-[#1C3753] px-4 py-1 text-sm text-white"
                    >
                      + Add Variant
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-t-xl">
                  <table className="w-full min-w-[1200px] text-sm">
                    <thead className="bg-[#F5F8FA]">
                      <tr className="">
                        <th className="px-3 py-2 text-left">
                          <input
                            type="checkbox"
                            checked={
                              formData.variants.length > 0 &&
                              formData.variants.every((v) => v.isSelected)
                            }
                            onChange={(e) =>
                              toggleSelectAllVariants(e.target.checked)
                            }
                          />
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Color
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Variant Name
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Weight
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Variant SKU ID
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Images
                        </th>{" "}
                        <th className="px-3 py-2 text-left font-medium">MRP</th>
                        <th className="px-3 py-2 text-left font-medium">
                          Cost Price
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Selling Price
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Discount
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Available Stock
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Low Stock Alert
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {formData.variants.map((variant, index) => (
                        <tr
                          key={variant.variantId}
                          className="hover:bg-gray-50 border-b"
                        >
                          {/* Checkbox */}
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={!!variant.isSelected}
                              onChange={() => toggleVariantSelect(index)}
                            />
                          </td>

                          <td className="px-3 py-1">
                            <div className="flex flex-wrap items-center gap-2 rounded-lg p-2 w-[140px]">
                              <select
                                value={variant.variantColor || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "variantColor",
                                    e.target.value,
                                  )
                                }
                                className="w-[140px] rounded-md border px-3 py-1 text-sm focus:outline-none "
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

                          <td  className="px-3 py-1">
                            <div className="flex gap-2 border px-3 py-2 rounded">
                              <input
                                type="text"
                                value={variant.variantName || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "variantName",
                                    e.target.value,
                                  )
                                }
                                placeholder="Enter Variant"
                                className="outline-none placeholder:text-[#6B6B6B]"
                              />
                            </div>
                          </td>

                          <td  className="px-3 py-1">
                            <div className="flex items-center justify-center gap-2 border rounded px-3 py-1">
                              {" "}
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
                                className="px-2 py-1 placeholder:text-[#6B6B6B] outline-none"
                              />
                              <select
                                value={variant.variantWidthUnit || "kg"}
                                onChange={(e) => {
                                  handleVariantChange(
                                    index,
                                    "variantWidthUnit",
                                    e.target.value,
                                  );
                                }}
                                className="border rounded-lg px-3 bg-[#264464] text-white text-sm"
                              >
                                <option value="kg">kg</option>
                                <option value="gm">g</option>
                              </select>
                            </div>
                          </td>

                          <td className="px-3 py-2">
                            <div>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="SKU"
                                  readOnly
                                  value={variant.variantSkuId || ""}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "variantSkuId",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Generate Variant SKU ID"
                                  className="w-[274px] h-[28px] border border-[#D0D0D0] rounded px-3 pr-28
              bg-[#F8FAFB] text-sm text-[#6B6B6B] placeholder-[#494848]
              "
                                />
                                {index !== 0 && (
                                  <button
                                    type="button"
                                    onClick={() => generateVariantSKU(index)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2
              h-[24px] px-4 bg-[#1C3753] text-white text-sm font-normal
              rounded-md hover:bg-[#264464] transition"
                                  >
                                    Generate
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-2">
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

                          <td className="px-3 py-2">
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
                              className=" rounded border px-2 py-1 placeholder:text-[#6B6B6B]"
                              placeholder="Enter MRP"
                            />
                          </td>

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
                              className=" rounded border px-2 py-1 placeholder:text-[#6B6B6B]"
                              placeholder="Enter Cost Price"
                            />
                          </td>

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
                              className=" rounded border px-2 py-1 placeholder:text-[#6B6B6B]"
                              placeholder="Enter Selling Price"
                            />
                          </td>

                          <td className="">
                            <div className="flex items-center justify-center rounded-md gap-2 border px-3 py-1">
                              <input
                                type="number"
                                value={variant.variantDiscount || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "variantDiscount",
                                    e.target.value,
                                  )
                                }
                                placeholder="Discount"
                                className=" placeholder:text-[#6B6B6B]"
                              />

                              <select
                                value={variant.variantDiscountUnit || "%"}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "variantDiscountUnit",
                                    e.target.value,
                                  )
                                }
                                className="border rounded-lg px-3 bg-[#264464] text-white text-sm"
                              >
                                <option value="%">%</option>
                                <option value="₹">₹</option>
                              </select>
                            </div>
                          </td>

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
                              className="rounded border px-2 py-1 placeholder:text-[#6B6B6B]"
                              placeholder="Enter Available Stock"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={variant.variantLowStockAlertStock || ""}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "variantLowStockAlertStock",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter Low Stock Alert"
                              className=" rounded border px-2 py-1 placeholder:text-[#6B6B6B]"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          </>
        </div>
      </form>
    </>
  );
};

export default AddProduct;
