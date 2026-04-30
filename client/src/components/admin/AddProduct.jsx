import { useState, useEffect, useRef, useMemo } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
// import { addProduct, updateProduct } from "../../redux/cart/productSlice";
import { v4 as uuidv4 } from "uuid";
// import product from "../../data/products.json";
import imageCompression from "browser-image-compression";
// import { IoIosArrowForward } from "react-icons/io";
import { FiUpload } from "react-icons/fi";

import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
// import AddCategoryPopUp from "./AddCategoryPopUp";
// import AddSubCategoryPopup from "./AddSubCategoryPopup";
import DisplayVariantImg from "./DisplayVariantImg";
import CategoriesPopOnClick from "../../pages/admin/CategoriesPopOnClick";
import { LuAArrowDown, LuDelete } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

const AddProduct = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [newVariants, setNewVariants] = useState([]);
  const [isProductDraft, setIsProductDraft] = useState(false);
  // const { loading, error } = useSelector((state) => state.product);
  // const { uuid } = useParams();

  const createInitialState = () => ({
    productTittle: "",
    description: "",
    status: "ACTIVE",
    category: "",
    subcategory: "",
    variants: [
      {
        variantColor: "",
        variantName: "",
        variantWeight: "",
        variantWeightUnit: "kg",
        variantSkuId: "",
        variantImage: [],
        variantMrp: "",
        variantCostPrice: "",
        variantGST: "",
        variantDiscount: "",
        variantDiscountUnit: "%",
        variantSellingPrice: "",
        variantAvailableStock: "",
        variantLowStockAlertStock: "",
        isSelected: false,
      },
    ],
  });

  const [formData, setFormData] = useState(createInitialState);
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState(null);

  // variants
  const emptyVariant = () => ({
    variantId: uuidv4(),
    variantColor: "",
    variantName: "",
    variantDimensionunit: "In", // default
    variantWeight: "",
    variantWeightUnit: "kg", // default
    variantSkuId: "",
    variantImage: [],
    variantMrp: "",
    variantCostPrice: "",
    variantSellingPrice: "",
    variantDiscount: "",
    variantDiscountUnit: "%", // default
    variantAvailableStock: "",
    variantLowStockAlertStock: "",
    variantGST: "",
    isSelected: false,
    isNew: true,
  });
  const addVariantRow = () => {
    let productSKU = formData.SKU?.trim();

    // If no SKU exists, create one from product title
    if (!productSKU && formData.productTittle) {
      const words = formData.productTittle.trim().split(" ");
      const initials = words
        .slice(0, 3)
        .map((w) => w[0]?.toUpperCase())
        .join("");
      const randomNum = Math.floor(100 + Math.random() * 900);
      productSKU = `${initials}-ART-${randomNum}`;

      // Update the main SKU in formData
      setFormData((prev) => ({ ...prev, SKU: productSKU }));
    }

    if (!productSKU) {
      toast.error("Please enter a product name first!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newVariant = {
      ...emptyVariant(),
      variantSkuId: `${productSKU}-V-${randomNum}`,
      isNew: true,
      isExisting: false, // Explicitly mark as not existing
    };

    // For add mode, always add to formData.variants
    // For edit mode, add to newVariants
    if (isEditing) {
      setNewVariants((prev) => [...prev, newVariant]);
    } else {
      setFormData((prev) => ({
        ...prev,
        variants: [...prev.variants, newVariant],
      }));
    }
  };

  // edit product added new here(akash)
  // const [isEditing, setIsEditing] = useState(false);
  const [productId, setProductId] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [draftId, setDraftId] = useState(null);
  // for editning status
  const [status, setStatus] = useState("active");
  const [selectedVariants, setSelectedVariants] = useState([]);
  // Fetch product for editing from API
  useEffect(() => {
    // console.log("Fetching product for edit. ID:", id);
    const fetchProductForEdit = async () => {
      if (!id) {
        // console.log("No ID provided, skipping fetch");
        return;
      }

      try {
        setLoadingProduct(true);
        const response = await axiosInstance.get(
          `/product/admin/get-product-details/${id}`,
        );
        // console.log("Product to edit:", response.data);

        let productData = null;
        if (response.data?.success && response.data?.data) {
          productData = response.data.data;
        } else if (response.data) {
          productData = response.data;
        }

        if (productData) {
          let categoryId = "";
          if (productData.category && productData.category !== "") {
            if (typeof productData.category === "object") {
              categoryId =
                productData.category._id || productData.category.id || "";
            } else {
              categoryId = productData.category;
            }
          }
          else {
            categoryId = "";
          }

          let subcategoryId = "";
          if (productData.subcategory && productData.subcategory !== "") {
            if (typeof productData.subcategory === "object") {
              subcategoryId =
                productData.subcategory._id || productData.subcategory.id || "";
            } else {
              subcategoryId = productData.subcategory;
            }
          }
          // If subcategory is empty string, keep it as empty string
          else {
            subcategoryId = "";
          }

          const mappedVariants = (productData.variants || []).map((variant) => ({
            variantColor: variant.variantColor || "",
            variantName: variant.variantName || "",
            variantWeight: variant.variantWeight || "",
            variantWeightUnit: variant.variantWeightUnit || "kg",
            variantSkuId: variant.variantSkuId || "",
            variantImage: variant.variantImage || [],
            variantMrp: variant.variantMrp || "",
            variantCostPrice: variant.variantCostPrice || "",
            variantGST: variant.variantGST || "",
            variantDiscount: variant.variantDiscount || "",
            variantDiscountUnit: "%",
            variantSellingPrice: variant.variantSellingPrice || "",
            variantAvailableStock: variant.variantAvailableStock || "",
            variantLowStockAlertStock: variant.variantLowStockAlertStock || "",
            isSelected: variant.isSelected || false,
            isNew: false, // Mark existing variants(read only)
            isExisting: true, // flag for exisitng variant
          }));

          setFormData({
            productTittle: productData.productTittle || "",
            description: productData.description || "",
            status: productData.isActive ? "ACTIVE" : "INACTIVE",
            category: categoryId,
            subcategory: subcategoryId,
            SKU: productData.SKU || "",
            variants: mappedVariants,
          });
          setIsProductDraft(productData.isDraft === true);

          setStatus(productData.isActive ? "active" : "inactive");


          if (productData.SKU) {
            setFormData((prev) => ({ ...prev, SKU: productData.SKU }));
          }

          setProductId(productData._id);
          if (productData.isDraft) {
            setDraftId(productData._id);
          }
          // Clear any pending new variants since we're loading from DB
          setNewVariants([]);
          // setIsEditing(true);
        }
      } catch (error) {
        // console.error("Error fetching product:", error);
        toast.error("Failed to load product data");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProductForEdit();
  }, [id]);


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
    // Auto-generate SKU when title changes
    // -----------------------------------
    if (name === "productTittle") {
      const words = value.trim().split(" ");
      // Remove extra spaces
      const cleanValue = value.replace(/\s+/g, " ").trimStart();

      // Allow only letters + numbers + space
      if (!/^[a-zA-Z0-9 ]*$/.test(cleanValue)) return;

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

      // First variant SKU = Product SKU
      updated.variants = updated.variants.map((v, i) =>
        i === 0 ? { ...v, variantSkuId: sku } : v,
      );
    }

    // Convert to numbers
    const mrp = parseFloat(updated.mrp) || 0;
    const sellingPrice = parseFloat(updated.sellingPrice) || 0;
    const costPrice = parseFloat(updated.costPrice) || 0;

    // -----------------------------------
    // Discount calculation
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

    // Profit Amount
    // if (sellingPrice > 0 && costPrice > 0) {
    //   const profitAmount = sellingPrice - costPrice;
    //   updated.profitAmount = profitAmount.toFixed(2);

    //   // Profit Margin %
    //   const profitMargin = (profitAmount / sellingPrice) * 100;
    //   updated.profitMargin = profitMargin.toFixed(2);
    // } else {
    //   updated.profitAmount = "";
    //   updated.profitMargin = "";
    // }

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
  // Handle field change for a specific variant
  const handleVariantChange = (index, field, value) => {
    // For add mode, always update formData.variants directly
    if (!isEditing) {
      // ADD MODE - Update formData.variants
      setFormData((prev) => {
        const variants = [...prev.variants];
        const v = { ...variants[index], [field]: value };

        const mrp = Number(v.variantMrp) || 0;
        const cost = Number(v.variantCostPrice) || 0;

        // Auto-calculate selling price when discount changes
        if (field === "variantDiscount") {
          const discount = Number(value);
          if (mrp > 0 && discount >= 0 && discount <= 100) {
            const calculatedSellingPrice = (mrp * (1 - discount / 100)).toFixed(2);
            v.variantSellingPrice = calculatedSellingPrice;
            v.variantDiscount = discount.toFixed(2);
          }
        }

        // Auto-calculate discount when selling price changes
        else if (field === "variantSellingPrice") {
          const selling = Number(value);
          if (mrp > 0 && selling > 0 && selling <= mrp) {
            const calculatedDiscount = (((mrp - selling) / mrp) * 100).toFixed(2);
            v.variantDiscount = calculatedDiscount;
          }
        }

        // Auto-calculate when MRP changes (recalculate discount if selling price exists)
        else if (field === "variantMrp" && mrp > 0) {
          const selling = Number(v.variantSellingPrice) || 0;
          if (selling > 0 && selling <= mrp) {
            const calculatedDiscount = (((mrp - selling) / mrp) * 100).toFixed(2);
            v.variantDiscount = calculatedDiscount;
          }
        }

        // Calculate profit
        const selling = Number(v.variantSellingPrice) || 0;
        if (selling > 0 && cost > 0) {
          v.variantProfit = (selling - cost).toFixed(2);
        } else {
          v.variantProfit = "";
        }

        variants[index] = v;
        return { ...prev, variants };
      });
      return;
    }

    // EDIT MODE logic below...
    const isNewVariant = index >= formData.variants.length;

    if (isNewVariant) {
      // EDIT MODE - New variant in newVariants array
      const newVariantIndex = index - formData.variants.length;
      const updated = [...newVariants];

      updated[newVariantIndex] = {
        ...updated[newVariantIndex],
        [field]: value,
      };

      const currentVariant = updated[newVariantIndex];
      const mrp = Number(currentVariant.variantMrp) || 0;
      const discount = Number(currentVariant.variantDiscount) || 0;
      const sellingPrice = Number(currentVariant.variantSellingPrice) || 0;

      if (field === "variantDiscount" && mrp > 0) {
        const calculatedSellingPrice = (mrp * (1 - discount / 100)).toFixed(2);
        updated[newVariantIndex].variantSellingPrice = calculatedSellingPrice;
      }

      if (field === "variantSellingPrice" && mrp > 0 && sellingPrice > 0) {
        const calculatedDiscount = (((mrp - sellingPrice) / mrp) * 100).toFixed(2);
        updated[newVariantIndex].variantDiscount = calculatedDiscount;
      }

      setNewVariants(updated);
    } else {
      // EDIT MODE - Existing variant
      setFormData((prev) => {
        const variants = [...prev.variants];
        const v = { ...variants[index], [field]: value };

        const mrp = Number(v.variantMrp) || 0;
        const cost = Number(v.variantCostPrice) || 0;

        if (field === "variantDiscount") {
          const discount = Number(value);
          if (mrp > 0 && discount >= 0 && discount <= 100) {
            v.variantSellingPrice = (mrp * (1 - discount / 100)).toFixed(2);
            v.variantDiscount = discount.toFixed(2);
          }
        }

        if (field === "variantSellingPrice") {
          const selling = Number(value);
          if (mrp > 0 && selling > 0 && selling <= mrp) {
            v.variantDiscount = (((mrp - selling) / mrp) * 100).toFixed(2);
          }
        }

        const selling = Number(v.variantSellingPrice) || 0;
        if (selling > 0 && cost > 0) {
          v.variantProfit = (selling - cost).toFixed(2);
        } else {
          v.variantProfit = "";
        }

        variants[index] = v;
        return { ...prev, variants };
      });
    }
  };
  const allVariants = useMemo(() => [...formData.variants, ...newVariants], [
    formData.variants,
    newVariants,
  ]);

  //  Handle image upload per variant
  const handleVariantImageChange = async (e, index) => {
    let files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingVariantIndex(index);

    try {
      const formDataObj = new FormData();

      for (let file of files) {
        const compressedBlob = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
        });

        const compressed = blobToFile(compressedBlob, file.name);
        formDataObj.append("productImages", compressed);
      }

      const res = await axiosInstance.post(
        "/product/admin/add-product-images",
        formDataObj,
      );

      const uploadedImages = res.data.data;

      // For add mode: all variants are in formData.variants
      // For edit mode: check if index is beyond original variants length
      const isNewVariant = isEditing ? index >= formData.variants.length : false;

      if (isNewVariant && isEditing) {
        // EDIT MODE - New variant
        const newVariantIndex = index - formData.variants.length;
        const updated = [...newVariants];
        const existingImages = updated[newVariantIndex]?.variantImage || [];
        updated[newVariantIndex] = {
          ...updated[newVariantIndex],
          variantImage: [...existingImages, ...uploadedImages].slice(0, 10),
        };
        setNewVariants(updated);
      } else {
        // ADD MODE OR EDIT MODE EXISTING - Update formData.variants
        setFormData((prev) => {
          const updatedVariants = [...prev.variants];
          const existingImages = updatedVariants[index]?.variantImage || [];
          updatedVariants[index] = {
            ...updatedVariants[index],
            variantImage: [...existingImages, ...uploadedImages].slice(0, 10),
          };
          return { ...prev, variants: updatedVariants };
        });
      }

      toast.success("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      if (err.code === "ECONNABORTED") {
        toast.error("Upload timeout - please try again with smaller images");
      } else if (err.response?.status === 413) {
        toast.error("Images too large - please use smaller images");
      } else {
        toast.error("Image upload failed - please try again");
      }
    } finally {
      setUploadingVariantIndex(null);
      e.target.value = "";
    }
  };

  //  Remove a specific image from a specific variant
  const removeVariantImage = (variantIndex, imgIndex) => {
    // Determine if this is a new variant or existing
    const isNewVariant = isEditing ? variantIndex >= formData.variants.length : false;

    if (isNewVariant && isEditing) {
      // Remove from newVariants
      const newVariantIndex = variantIndex - formData.variants.length;
      const updated = [...newVariants];
      const updatedImages = [...updated[newVariantIndex].variantImage];
      updatedImages.splice(imgIndex, 1);
      updated[newVariantIndex].variantImage = updatedImages;
      setNewVariants(updated);
    } else {
      // Remove from formData variants
      setFormData((prev) => {
        const updatedVariants = [...prev.variants];
        if (!updatedVariants[variantIndex]) return prev;

        const updatedImages = [...updatedVariants[variantIndex].variantImage];
        updatedImages.splice(imgIndex, 1);
        updatedVariants[variantIndex].variantImage = updatedImages;
        return { ...prev, variants: updatedVariants };
      });
    }

    // Update modal state
    setSelectedImages((prev) => {
      const newImages = prev.filter((_, i) => i !== imgIndex);
      if (newImages.length > 0) {
        const nextIndex = imgIndex < newImages.length ? imgIndex : newImages.length - 1;
        const img = newImages[nextIndex];
        const nextImage = typeof img === "string" ? img : img.url || img.preview || "";
        setCurrentImage(nextImage);
      } else {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    //   console.log("=== Submit Debug ===");
    // console.log("isEditing:", isEditing);
    // console.log("productId:", productId);
    // console.log("isProductDraft:", isProductDraft);
    // console.log("draftId:", draftId);

    if (!formData.productTittle.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!formData.category.trim()) {
      toast.error("Category is required");
      return;
    }
    // Combine existing variants with new variants
    const allVariantsToSubmit = [...formData.variants, ...newVariants];

    for (let i = 0; i < allVariantsToSubmit.length; i++) {
      const variant = allVariantsToSubmit[i];

      const hasAnyVariantInput =
        variant.variantColor?.trim() ||
        variant.variantName?.trim() ||
        String(variant.variantWeight || "").trim() ||
        variant.variantSkuId?.trim() ||
        String(variant.variantMrp || "").trim() ||
        String(variant.variantSellingPrice || "").trim() ||
        String(variant.variantLowStockAlertStock || "").trim() ||
        (variant.variantImage && variant.variantImage.length > 0);

      if (hasAnyVariantInput) {
        if (!variant.variantSkuId?.trim()) {
          toast.error(`Variant ${i + 1}: Variant SKU ID is required`);
          return;
        }

        if (!variant.variantImage || variant.variantImage.length === 0) {
          toast.error(`Variant ${i + 1}: At least one image is required`);
          return;
        }

        if (!String(variant.variantMrp || "").trim()) {
          toast.error(`Variant ${i + 1}: MRP is required`);
          return;
        }

        if (!String(variant.variantSellingPrice || "").trim()) {
          toast.error(`Variant ${i + 1}: Selling Price is required`);
          return;
        }

        if (!String(variant.variantLowStockAlertStock || "").trim()) {
          toast.error(`Variant ${i + 1}: Low Stock Alert is required`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    // Prepare payload - same structure for both add and edit
    const payload = {
      productTittle: formData.productTittle,
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory,
      isActive: status === "active",
      variants: allVariantsToSubmit.map((v) => ({
        variantColor: v.variantColor,
        variantName: v.variantName,
        variantWeight: v.variantWeight,
        variantWeightUnit: v.variantWeightUnit,
        variantSkuId: v.variantSkuId,
        variantImage: v.variantImage,
        variantMrp: Number(v.variantMrp) || 0,
        variantCostPrice: Number(v.variantCostPrice) || 0,
        variantSellingPrice: Number(v.variantSellingPrice) || 0,
        variantGST: Number(v.variantGST) || 0,
        variantDiscount: Number(v.variantDiscount) || 0,
        variantAvailableStock: Number(v.variantAvailableStock) || 0,
        variantLowStockAlertStock: Number(v.variantLowStockAlertStock) || 0,
        isSelected: v.isSelected || false,
      })),
    };

    try {
      let response;
      if (isEditing && productId) {
        // check of this is a draft being published
        const isPublishingDraft = isProductDraft === true;
        // UPDATE existing product
        response = await axiosInstance.patch(
          `/product/admin/update-product/${productId}`,
          {
            ...payload,
            action: "add",
            // If this is a draft being published, explicitly set isDraft to false and isActive to true
            ...(isPublishingDraft && {
              isDraft: false,
              isActive: true,
            }),
          }
        );
        toast.success(isPublishingDraft ? "Product published successfully!" : "Product updated successfully!");
        // Clear newVariants after successful update
        setNewVariants([]);
      } else {
        // CREATE new product
        response = await axiosInstance.post(
          "/product/admin/add-product",
          {
            ...payload,
            action: "add",
          }
        );
        toast.success("Product added successfully!");
      }

      // setIsDraftEnabled(false);
      localStorage.removeItem("addProductDraft");
      setFormData(createInitialState());

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Error saving product!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // const generateVariantSKU = (variantIndex) => {
  //   const productSKU = formData.SKU?.trim();

  //   if (!productSKU) {
  //     toast.error("Generate product SKU first!", {
  //       position: "top-right",
  //       autoClose: 2000,
  //     });
  //     return;
  //   }

  //   const randomNum = Math.floor(100 + Math.random() * 900); // 3 digits

  //   const variantSKU = `${productSKU}-V-${randomNum}`;

  //   setFormData((prev) => {
  //     const variants = [...prev.variants];
  //     variants[variantIndex] = {
  //       ...variants[variantIndex],
  //       variantSkuId: variantSKU,
  //     };

  //     return { ...prev, variants };
  //   });
  // };

  // this is first drop down

  const generateVariantSKU = (variantIndex) => {
    // For edit mode, try to get SKU from formData or create one from product title
    let productSKU = formData.SKU?.trim();

    if (!productSKU && formData.productTittle) {
      // Create SKU from product title if not exists
      const words = formData.productTittle.trim().split(" ");
      const initials = words
        .slice(0, 3)
        .map((w) => w[0]?.toUpperCase())
        .join("");
      const randomNum = Math.floor(100 + Math.random() * 900);
      productSKU = `${initials}-ART-${randomNum}`;

      // Update the main SKU
      setFormData((prev) => ({ ...prev, SKU: productSKU }));
    }

    if (!productSKU) {
      toast.error("Please enter a product name first!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
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

  const [materialbtn, setmaterialbtn] = useState(false);
  const [materialdata, setMaterialData] = useState("Select Material Type");

  // toggal btn
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  // Modal for adding new category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showsubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

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

  // draft

  const [isDraftEnabled, setIsDraftEnabled] = useState(true);

  const handleSaveDraft = async () => {
    if (!formData.productTittle.trim() && !formData.category) {
      toast.error("Please enter product name and category before saving draft");
      return;
    }

    const allVariantsToSubmit = [...formData.variants, ...newVariants];

    try {
      const payload = {
        productTittle: formData.productTittle,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        variants: allVariantsToSubmit.map((v) => ({
          variantColor: v.variantColor,
          variantName: v.variantName,
          variantWeight: v.variantWeight,
          variantWeightUnit: v.variantWeightUnit,
          variantSkuId: v.variantSkuId,
          variantImage: v.variantImage || [],
          variantMrp: Number(v.variantMrp) || 0,
          variantCostPrice: Number(v.variantCostPrice) || 0,
          variantSellingPrice: Number(v.variantSellingPrice) || 0,
          variantGST: Number(v.variantGST) || 0,
          variantDiscount: Number(v.variantDiscount) || 0,
          variantAvailableStock: Number(v.variantAvailableStock) || 0,
          variantLowStockAlertStock: Number(v.variantLowStockAlertStock) || 0,
          isSelected: v.isSelected || false,
        })),
        action: "draft",
      };

      let response;
      let savedDraftId = draftId;

      if (draftId) {
        response = await axiosInstance.patch(
          `/product/admin/update-product/${draftId}`,
          payload
        );
        toast.success("Draft updated successfully!");
        savedDraftId = draftId;
        setNewVariants([]);
      } else {
        response = await axiosInstance.post("/product/admin/add-product", payload);
        savedDraftId = response.data.data._id;
        setDraftId(savedDraftId);
        toast.success("Draft saved successfully!");
      }

      // Store draft info in localStorage with the database ID
      const draftWithInfo = {
        ...formData,
        _id: savedDraftId,
        _lastSaved: new Date().toISOString()
      };
      localStorage.setItem("addProductDraft", JSON.stringify(draftWithInfo));
      localStorage.setItem("addProductDraft_lastSaved", new Date().toISOString());
      localStorage.setItem("addProductDraft_id", savedDraftId);
      setHasDraft(true);
    } catch (err) {
      // console.error("Draft save error:", err);
      toast.error(err?.response?.data?.message || "Failed to save draft");
    }
  };

  // useEffect(() => {
  //   const savedDraft = localStorage.getItem("addProductDraft");
  //   if (savedDraft) {
  //     try {
  //       const parsedData = JSON.parse(savedDraft);
  //       setFormData(parsedData);
  //       // setTimeout(() => {
  //       //   toast.success("Draft restored!");
  //       // }, 500);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    // If we have an ID in the URL and we're not editing, set editing mode
    if (id && !isEditing) {
      // This will trigger the fetchProductForEdit effect
      // The component will re-render with isEditing=true
    }
  }, [id]);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem("addProductDraft");

    if (savedDraft) {
      setHasDraft(true); // only mark, don't restore
    }
  }, []);


  const handleRestoreDraft = () => {
    const savedDraftId = localStorage.getItem("addProductDraft_id");
    if (savedDraftId) {
      // Navigate to the draft edit page
      navigate(`/admin/add-product/${savedDraftId}`);
      // Clear the localStorage draft after navigation to prevent confusion
      // Don't clear immediately - let the edit page load first
    } else {
      const savedDraft = localStorage.getItem("addProductDraft");
      if (savedDraft) {
        try {
          const parsedData = JSON.parse(savedDraft);
          if (parsedData._id) {
            navigate(`/admin/add-product/${parsedData._id}`);
          } else {
            // Fallback: restore to form
            delete parsedData._lastSaved;
            delete parsedData._id;
            delete parsedData.draftId;
            setFormData(parsedData);
            toast.success("Draft restored! Continue editing.");
            setHasDraft(false);
          }
        } catch (error) {
          console.error("Error restoring draft:", error);
          toast.error("Failed to restore draft");
        }
      }
    }
  };

  // ////////////////////

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
    // Determine if this is a new variant or existing
    const isNewVariant = isEditing ? variantIndex >= formData.variants.length : false;

    let imgs = [];
    if (isNewVariant && isEditing) {
      const newVariantIndex = variantIndex - formData.variants.length;
      imgs = newVariants[newVariantIndex]?.variantImage || [];
    } else {
      imgs = formData.variants[variantIndex]?.variantImage || [];
    }

    setActiveVariantIndex(variantIndex);
    setSelectedImages(imgs);

    const first = imgs.length > 0
      ? typeof imgs[0] === "string"
        ? imgs[0]
        : imgs[0].url || imgs[0].preview || ""
      : "";

    setCurrentImage(first);
    setIsModalOpen(true);
  };

  // single row select/unselect
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

  // select all
  const toggleSelectAllVariants = (checked) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => ({ ...v, isSelected: checked })),
    }));
  };

  // remove selected (at least 1 row keep)
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

  //
  const getImageSrc = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (img.url) return img.url;
    if (img.preview) return img.preview;
    return "";
  };

  // fetch the categories from backend
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // const fetchCategories = async () => {
  //   try {
  //     setLoading(true);
  //     let allCategories = [];
  //     let page = 1;
  //     let totalPages = 1;
  //     do {
  //       const res = await axiosInstance.get(`/category/admin/all-categories?page=${page}&limit=10`,);
  //       const data = res?.data?.category || [];
  //       totalPages = res?.data?.pagination?.pages || 1;
  //       allCategories = [...allCategories, ...data];

  //       page++;
  //     } while (page <= totalPages);
  //     setCategories(allCategories);
  //     setSubCategories([]);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to load categories");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Replace your existing fetchCategories function with this:
const fetchCategories = async () => {
  try {
    setLoading(true);
    // Use the new filter endpoint that returns ALL categories without pagination
    const response = await axiosInstance.get('/category/admin/all-categories-filter');
    
    if (response.data?.success) {
      setCategories(response.data.data || []);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to load categories");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchCategories();
  }, [setCategories]);

  // Load subcategories when category changes (for edit mode)
  useEffect(() => {
    const loadSubcategories = async () => {
      if (formData.category) {
        try {
          const selectedCategory = categories.find(
            (cat) => cat._id === formData.category,
          );
          if (selectedCategory) {
            setSubCategories(selectedCategory.subCategories || []);
          }
        } catch (error) {
          console.error("Error loading subcategories:", error);
        }
      }
    };

    loadSubcategories();
  }, [formData.category, categories]);
    // Load subcategories when editing a product with a category
  useEffect(() => {
    const loadSubcategoriesForEdit = async () => {
      if (isEditing && formData.category && categories.length > 0) {
        const selectedCategory = categories.find(
          (cat) => cat._id === formData.category
        );
        if (selectedCategory && selectedCategory.subCategories) {
          setSubCategories(selectedCategory.subCategories);
        }
      }
    };

    loadSubcategoriesForEdit();
  }, [isEditing, formData.category, categories]);

  // Debug effect for add mode
  useEffect(() => {
    if (!isEditing) {
      // console.log("=== Add Mode Variants Debug ===");
      formData.variants.forEach((v, i) => {
        // console.log(`Variant ${i}:`, {
        //   mrp: v.variantMrp,
        //   sellingPrice: v.variantSellingPrice,
        //   discount: v.variantDiscount,
        // });
      });
    }
  }, [formData.variants, isEditing]);

  // handle individual variant checkbox change
  const handleVariantCheckboxChange = (index, variantId) => {
    setSelectedVariants((prev) => {
      if(prev.includes(variantId)) {
        return prev.filter((id) => id !== variantId);
      }else {
        return [...prev, variantId];
      }
    })
  };

  // handle select all variants
  const handleSelectAllVariants = () => {
    if(selectedVariants.length === allVariants.length) {
      // if all are seelcted, deselect all
      setSelectedVariants([]);
    }else {
      // select all variants
      const allVariantIds = allVariants.map((_, idx) => idx);
      setSelectedVariants(allVariantIds);
    }
  }

  // delete selected variant
  const deleteSelectedVariants = () => {
    if(selectedVariants.length === 0) {
      toast.error("Please select at least one varinat to delete")
      return;
    }

 // Sort indices in descending order to delete from the end first
  const sortedIndices = [...selectedVariants].sort((a, b) => b - a);
  
  // Filter out variants from both formData.variants and newVariants
  let updatedFormDataVariants = [...formData.variants];
  let updatedNewVariants = [...newVariants];
  
  sortedIndices.forEach(index => {
    const isNewVariant = isEditing ? index >= formData.variants.length : false;
    
    if (isNewVariant && isEditing) {
      // Remove from newVariants
      const newVariantIndex = index - formData.variants.length;
      updatedNewVariants = updatedNewVariants.filter((_, idx) => idx !== newVariantIndex);
    } else {
      // Remove from formData.variants
      updatedFormDataVariants = updatedFormDataVariants.filter((_, idx) => idx !== index);
    }
  });
  
  // Ensure at least one variant exists
  if (updatedFormDataVariants.length === 0 && updatedNewVariants.length === 0) {
    updatedFormDataVariants = [emptyVariant()];
  }
  
  setFormData(prev => ({ ...prev, variants: updatedFormDataVariants }));
  setNewVariants(updatedNewVariants);
  setSelectedVariants([]);
  toast.success(`${selectedVariants.length} variant(s) deleted successfully`);
};


  if (loadingProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C3753] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

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

      <CategoriesPopOnClick
        open={showCategoryModal}
        onclose={() => setShowCategoryModal(false)}
        setNewCategory={setNewCategory}
        newCategory={newCategory}
        subcategories={subCategories}
        setSubcategories={setSubCategories}
      />

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
            {/* <Link to={`/admin/products`}>
              <ChevronLeft className="w-8 h-8 text-[#686868]" />
            </Link> */}
            <h1 className="text-[#1C1C1C] text-[20px] font-medium font-['Inter']">
              {isEditing ? "Edit Product" : "Add Product"}
            </h1>
          </div>

          <div className="flex items-center gap-4 px-2">
            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  navigate("/admin/products");
                } else {
                  if (hasDraft) {
                    if (window.confirm("You have an unsaved draft. Are you sure you want to discard it?")) {
                      localStorage.removeItem("addProductDraft");
                      localStorage.removeItem("addProductDraft_lastSaved");
                      localStorage.removeItem("addProductDraft_id");
                      setFormData(createInitialState());
                      setHasDraft(false);
                      setNewVariants([]);
                      toast.info("Draft cleared");
                      navigate("/admin/products");
                    }
                  } else {
                    navigate("/admin/products");
                  }
                }
              }}
              className="py-1 px-3 rounded border border-[#737373] text-[#737373] hover:bg-[#706f6f] hover:text-white bg-[#F6F8F9] font-medium"
            >
              Cancel
            </button>
            {!isEditing && (
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
            )}
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
        {/* Draft Banner - Add this right after header */}
        {!isEditing && hasDraft && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-600 text-xl">📝</span>
              <div>
                <span className="text-sm font-medium text-amber-800">You have an unfinished draft product.</span>
                <p className="text-xs text-amber-600 mt-0.5">Last saved: {new Date(localStorage.getItem("addProductDraft_lastSaved") || Date.now()).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRestoreDraft}
                className="px-3 py-1.5 text-sm bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
              >
                Resume Draft
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("addProductDraft");
                  localStorage.removeItem("addProductDraft_lastSaved");
                  localStorage.removeItem("addProductDraft_id");
                  setHasDraft(false);
                  setFormData(createInitialState());
                  setNewVariants([]);
                  toast.info("Draft discarded. You can start a new product.");
                }}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        )}

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
            text-[#686868] text-sm bg-[#F8FBFC] placeholder-[#686868]
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
                {/* for status editing */}
                {isEditing && (
                  <div
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: "white",
                      borderRadius: "12px",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <h2 className="text-black text-[18px] font-medium mb-4">
                      Product Status
                    </h2>

                    <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                      {/* Active */}
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#1d4ed8" }}>
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={status === "active"}
                          onChange={() => setStatus("active")}
                          style={{
                            width: "18px",
                            height: "18px",
                            accentColor: "#1d4ed8",
                            cursor: "pointer",
                          }}
                        />
                        Active
                      </label>

                      {/* Inactive */}
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#1d4ed8" }}>
                        <input
                          type="radio"
                          name="status"
                          value="inactive"
                          checked={status === "inactive"}
                          onChange={() => setStatus("inactive")}
                          style={{
                            width: "18px",
                            height: "18px",
                            accentColor: "#1d4ed8",
                            cursor: "pointer",
                          }}
                        />
                        Inactive
                      </label>
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-2xl p-4 border">
                  <h2 className="text-black text-[18px] font-medium mb-4">
                    Product Classification
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    {/* <div>
                      <label className="block text-black text-[14px] mb-2">
                        Category <span className="text-[#D53B35]">*</span>
                      </label>

                      <div className="relative w-full">
                        {isEditing ? (
                          <div className="w-full h-[48px] px-4 rounded-xl bg-gray-100 text-gray-600 flex items-center border border-gray-200">
                            {categories.find(
                              (cat) => cat._id === formData.category,
                            )?.name || "Not selected"}
                          </div>
                        ) : (
                          <select
                            name="category"
                            value={formData.category}
                            onChange={(e) => {
                              const selectedCategoryId = e.target.value;

                              const selectedCategory = categories.find(
                                (cat) => cat._id === selectedCategoryId,
                              );

                              setFormData((prev) => ({
                                ...prev,
                                category: selectedCategoryId,
                                subcategory: "",
                              }));

                              setSubCategories(
                                selectedCategory?.subCategories || [],
                              );
                            }}
                            className="w-full h-[48px] px-4 pr-10 rounded-xl bg-[#F8FBFC] border border-[#DEDEDE] text-[#6B7280] text-sm appearance-none outline-none focus:ring-2 focus:ring-[#1C3753]"
                          >
                            <option value="">Select category</option>

                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id} className="bg-white">
                                {cat.name}
                                
                              </option>
                            ))}
                          </select>
                        )}

                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                    </div> */}
                    <div>
                      <label className="block text-black text-[14px] mb-2">
                        Category <span className="text-[#D53B35]">*</span>
                      </label>

                      <div className="relative w-full">
                        {isEditing ? (
                          <select
                            name="category"
                            value={formData.category || ""}
                            onChange={(e) => {
                              const selectedCategoryId = e.target.value;

                              const selectedCategory = categories.find(
                                (cat) => cat._id === selectedCategoryId,
                              );

                              setFormData((prev) => ({
                                ...prev,
                                category: selectedCategoryId,
                                subcategory: "", // Reset subcategory when category changes
                              }));

                              setSubCategories(selectedCategory?.subCategories || []);
                            }}
                            className="w-full h-[48px] px-4 pr-10 rounded-xl bg-[#F8FBFC] border border-[#DEDEDE] text-[#6B7280] text-sm appearance-none outline-none focus:ring-2 focus:ring-[#1C3753]"
                          >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id} className="bg-white">
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          // Non-edit mode display (keep as is)
                          <select
                            name="category"
                            value={formData.category}
                            onChange={(e) => {
                              const selectedCategoryId = e.target.value;

                              const selectedCategory = categories.find(
                                (cat) => cat._id === selectedCategoryId,
                              );

                              setFormData((prev) => ({
                                ...prev,
                                category: selectedCategoryId,
                                subcategory: "",
                              }));

                              setSubCategories(selectedCategory?.subCategories || []);
                            }}
                            className="w-full h-[48px] px-4 pr-10 rounded-xl bg-[#F8FBFC] border border-[#DEDEDE] text-[#6B7280] text-sm appearance-none outline-none focus:ring-2 focus:ring-[#1C3753]"
                          >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id} className="bg-white">
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        )}

                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* <div>
                      <label className="block text-black text-[14px] mb-2">
                        Sub-Category
                      </label>

                      <div className="relative w-full">
                        {isEditing ? (
                          <div className="w-full h-[48px] px-4 rounded-xl bg-gray-100 text-gray-600 flex items-center border border-gray-200">
                            {subCategories.find(sub => sub._id === formData.subcategory)?.name || "Not selected"}
                          </div>
                        ) : (
                          <select
                            name="subcategory"
                            value={formData.subcategory || ""}
                            onChange={(e) => {
                              const selectedSubCategoryId = e.target.value;

                              if (
                                selectedSubCategoryId === "__add_subcategory__"
                              ) {
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
                                subcategory: selectedSubCategoryId, // save _id
                              }));
                            }}
                            className="w-full h-[48px] px-4 pr-10 rounded-xl bg-[#F8FBFC] border border-[#DEDEDE] text-[#6B7280] text-sm appearance-none outline-none focus:ring-2 focus:ring-[#1C3753]"
                          >
                            <option value="">Select sub-category</option>

                            {subCategories.map((sub) => (
                              <option key={sub._id} value={sub._id} className="bg-white">
                                {sub.name}
                              </option>
                            ))}
                          </select>
                        )}

                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                    </div> */}
                    <div>
                      <label className="block text-black text-[14px] mb-2">
                        Sub-Category
                      </label>

                      <div className="relative w-full">
                        {isEditing ? (
                          <select
                            name="subcategory"
                            value={formData.subcategory || ""}
                            onChange={(e) => {
                              const selectedSubCategoryId = e.target.value;

                              if (selectedSubCategoryId === "__add_subcategory__") {
                                if (!formData.category) {
                                  toast.error("Select category first!");
                                  return;
                                }
                                setShowSubCategoryModal(true);
                                return;
                              }

                              setFormData((prev) => ({
                                ...prev,
                                subcategory: selectedSubCategoryId,
                              }));
                            }}
                            className="w-full h-[48px] px-4 pr-10 rounded-xl bg-[#F8FBFC] border border-[#DEDEDE] text-[#6B7280] text-sm appearance-none outline-none focus:ring-2 focus:ring-[#1C3753]"
                          >
                            <option value="">Select sub-category</option>
                            {subCategories.map((sub) => (
                              <option key={sub._id} value={sub._id} className="bg-white">
                                {sub.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          // Non-edit mode select (keep as is)
                          <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={(e) => {
                              const selectedSubCategoryId = e.target.value;

                              if (selectedSubCategoryId === "__add_subcategory__") {
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
                                subcategory: selectedSubCategoryId,
                              }));
                            }}
                            className="w-full h-[48px] px-4 pr-10 rounded-xl bg-[#F8FBFC] border border-[#DEDEDE] text-[#6B7280] text-sm appearance-none outline-none focus:ring-2 focus:ring-[#1C3753]"
                          >
                            <option value="">Select sub-category</option>
                            {subCategories.map((sub) => (
                              <option key={sub._id} value={sub._id} className="bg-white">
                                {sub.name}
                              </option>
                            ))}
                          </select>
                        )}

                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {!isEditing && (
                      <div className="flex flex-col items-start gap-1">
                        <button
                          type="button"
                          onClick={() => setShowCategoryModal(true)}
                          className="text-[#1C3753] font-medium text-sm"
                        >
                          + Add Category
                        </button>
                        <span className="text-[#686868] text-xs">
                          Can’t find a category? Create one here
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <>
              <div className="w-full rounded-lg bg-white p-4 mt-4">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="text-lg font-semibold">Variant Listings</h1>
                  <div className="flex items-center justify-end gap-3">
                    {allVariants.length > 1 && selectedVariants.length > 0 && (
                      <button
                      type="button"
                      onClick={deleteSelectedVariants}
                      className="rounded-md bg-red-600 px-4 py-1 text-sm text-white hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
Delete Selected
{/* ({selectedVariants.length}) */}
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
                      <tr>
                        {allVariants.length > 1 && (
                       <th className="px-3 py-2 text-left font-medium w-10">
      <input
        type="checkbox"
        checked={allVariants.length > 0 && selectedVariants.length === allVariants.length}
        onChange={handleSelectAllVariants}
        className="w-4 h-4 cursor-pointer"
      />
    </th>
                        )}
                       
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
                        </th>
                        <th className="px-3 py-2 text-left font-medium">MRP</th>
                        <th className="px-3 py-2 text-left font-medium">
                          Cost Price
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Selling Price
                        </th>
                        <th className="px-3 py-2 text-left font-medium">GST</th>
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
                      {allVariants.map((variant, index) => {
                        const isExisting = variant.isExisting === true;
                        const isNewVariant = variant.isNew === true;
                        const isAddModeVariant = !isEditing && index > 0;
                        const isReadOnly = isExisting && !isProductDraft;
                        const actualIndex = index;
                        const showCheckbox = allVariants.length > 1;

                        // dont show delete button for first variant(keep at least one variant)
                        const canDelete = allVariants.length > 1;
                        return (
                          <tr
                            key={variant.variantSkuId || index}
                            className="hover:bg-gray-50 border-b-group"
                          >
{showCheckbox && (
          <td className="px-3 py-2 text-center">
            <input
              type="checkbox"
              checked={selectedVariants.includes(index)}
              onChange={() => handleVariantCheckboxChange(index, index)}
              className="w-4 h-4 cursor-pointer"
            />
          </td>
        )}
                            <td className="px-3 py-1">
                              {(isExisting && !isProductDraft) ? (
                                <div className="w-[140px] rounded-md border px-3 py-1 text-sm bg-gray-100 text-gray-600 min-h-[36px]">
                                  {variant.variantColor || "-"}
                                </div>
                              ) : (
                                // Editable for new variants
                                <div className="flex flex-wrap items-center gap-2 rounded-lg p-2 w-[140px]">
                                  <select
                                    value={variant.variantColor || ""}
                                    onChange={(e) => {
                                      if (isEditing && isNewVariant) {
                                        const updated = [...newVariants];
                                        updated[index - formData.variants.length] = {
                                          ...updated[index - formData.variants.length],
                                          variantColor: e.target.value,
                                        };
                                        setNewVariants(updated);
                                      } else {
                                        handleVariantChange(index, "variantColor", e.target.value);
                                      }
                                    }}
                                    className="w-[140px] rounded-md border px-3 py-1 text-sm focus:outline-none "
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
                              )}
                            </td>

                            <td className="px-3 py-1">
                              {(isExisting && !isProductDraft) ? (
                                <div className="border px-3 py-2 rounded bg-gray-100 text-gray-600 min-w-[120px]">
                                  {variant.variantName || "-"}
                                </div>
                              ) : (
                                <div className="flex gap-2 border px-3 py-2 rounded">
                                  <input
                                    type="text"
                                    value={variant.variantName || ""}
                                    onChange={(e) => {
                                      // in edit mode and this is new variant
                                      if (isEditing && isNewVariant) {
                                        const updated = [...newVariants];
                                        updated[index - formData.variants.length] = {
                                          ...updated[index - formData.variants.length],
                                          variantName: e.target.value
                                        };
                                        setNewVariants(updated);
                                      } else {
                                        handleVariantChange(actualIndex, "variantName", e.target.value);
                                      }
                                    }}
                                    placeholder="Enter Variant"
                                    className="outline-none placeholder:text-[#6B6B6B]"
                                  />
                                </div>
                              )}
                            </td>

                            <td className="px-3 py-1">
                              {(isExisting && !isProductDraft) ? (
                                <div className="flex items-center gap-2 border rounded px-3 py-1 bg-gray-100 text-gray-600 min-w-[140px]">
                                  <span>{variant.variantWeight || "-"} {variant.variantWeightUnit || "kg"}</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-2 border rounded px-3 py-1">
                                  {" "}
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={variant.variantWeight || ""}
                                    onChange={(e) => {
                                      if (isEditing && isNewVariant) {
                                        const updated = [...newVariants];
                                        updated[index - formData.variants.length] = {
                                          ...updated[index - formData.variants.length],
                                          variantWeight: e.target.value
                                        };
                                        setNewVariants(updated);
                                      }
                                      else {
                                        handleVariantChange(actualIndex, "variantWeight", e.target.value);
                                      }
                                    }
                                    }
                                    placeholder="Enter Weight"
                                    className="px-2 py-1 placeholder:text-[#6B6B6B] outline-none"
                                  />
                                  <select
                                    value={variant.variantWeightUnit || "kg"}
                                    onChange={(e) => {
                                      if (isEditing && isNewVariant) {
                                        const updated = [...newVariants];
                                        updated[index - formData.variants.length] = {
                                          ...updated[index - formData.variants.length],
                                          variantWeightUnit: e.target.value
                                        };
                                        setNewVariants(updated);
                                      }
                                      else {
                                        handleVariantChange(actualIndex, "variantWeightUnit", e.target.value);
                                      }
                                    }
                                    }
                                    className="border rounded-lg px-3 bg-[#264464] text-white text-sm"
                                  >
                                    <option value="kg">kg</option>
                                    <option value="gm">g</option>
                                  </select>
                                </div>
                              )}
                            </td>

                            <td className="px-3 py-2">
                              <div>
                                {(isExisting && !isProductDraft) ? (
                                  <div className="w-[274px] h-[28px] border rounded px-3 bg-gray-100 text-gray-600 flex items-center">
                                    {variant.variantSkuId || "N/A"}
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <input
                                      type="text"
                                      name="SKU"
                                      readOnly
                                      value={variant.variantSkuId || ""}
                                      // onChange={(e) =>
                                      //   handleVariantChange(
                                      //     index,
                                      //     "variantSkuId",
                                      //     e.target.value,
                                      //   )
                                      // }
                                      placeholder="Generate Variant SKU ID"
                                      className="w-[274px] h-[28px] border border-[#D0D0D0] rounded px-3 pr-28
              bg-[#F8FAFB] text-sm text-[#6B6B6B] placeholder-[#494848]
              "
                                    />
                                    {index !== 0 && (
                                      <button
                                        type="button"
                                        // onClick={() => generateVariantSKU(index)}
                                        onClick={() => {
                                          const productSKU = formData.SKU?.trim();
                                          const randomNum = Math.floor(100 + Math.random() * 900);
                                          const newSku = `${productSKU}-V-${randomNum}`;
                                          const updated = [...newVariants];
                                          updated[actualIndex - formData.variants.length] = {
                                            ...updated[actualIndex - formData.variants.length],
                                            variantSkuId: newSku
                                          };
                                          setNewVariants(updated);
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2
              h-[24px] px-4 bg-[#1C3753] text-white text-sm font-normal
              rounded-md hover:bg-[#264464] transition"
                                      >
                                        Generate
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                            {/* images */}
                            <td className="px-3 py-2">
                              {(isExisting && !isProductDraft) ? (
                                // VIEW-ONLY MODE FOR EXISTING VARIANTS
                                <div className="flex items-center gap-3">
                                  {variant.variantImage && variant.variantImage.length > 0 ? (
                                    <div className="flex items-center gap-2">
                                      <div className="h-9 w-9 rounded-md overflow-hidden border bg-gray-100">
                                        <img
                                          src={variant.variantImage[0]?.url || "/placeholder.png"}
                                          className="h-full w-full object-cover"
                                          alt="product"
                                        />
                                      </div>
                                      <span className="text-sm text-gray-500">
                                        {variant.variantImage.length} image{variant.variantImage.length !== 1 ? "s" : ""}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-400">No images</div>
                                  )}
                                </div>
                              ) : (
                                // EDITABLE FOR NEW VARIANTS
                                <div className="flex items-center gap-4 whitespace-nowrap">
                                  {(!variant.variantImage || variant.variantImage.length === 0) && (
                                    <button
                                      type="button"
                                      onClick={() => triggerVariantUpload(actualIndex)}
                                      disabled={uploadingVariantIndex === actualIndex}
                                      className="flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                      <div className="h-9 w-9 rounded-md border bg-[#EFEFEF] flex items-center justify-center">
                                        {uploadingVariantIndex === actualIndex ? (
                                          <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-[#1C3753] animate-spin" />
                                        ) : (
                                          <FiUpload className="h-5 w-5 text-[#1C3753]" />
                                        )}
                                      </div>
                                      <span className="text-sm text-[#1C3753]">
                                        {uploadingVariantIndex === actualIndex ? "Uploading..." : "Add Images"}
                                      </span>
                                    </button>
                                  )}

                                  {variant.variantImage && variant.variantImage.length > 0 && (
                                    <div className="flex items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={() => openVariantImages(actualIndex)}
                                        className="flex items-center gap-2"
                                      >
                                        <div className="h-9 w-9 rounded-md overflow-hidden border bg-gray-100">
                                          <img
                                            src={variant.variantImage[0]?.url || variant.variantImage[0]?.preview || "/placeholder.png"}
                                            alt=""
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                        <span className="text-sm text-[#1C3753]">
                                          {variant.variantImage.length} Image{variant.variantImage.length !== 1 ? "s" : ""}
                                        </span>
                                      </button>
                                      {/* Add re-upload button for new variants */}
                                      {/* <button
            type="button"
            onClick={() => triggerVariantUpload(actualIndex)}
            className="text-xs text-blue-500 underline"
          >
            Re-upload
          </button> */}
                                    </div>
                                  )}

                                  <input
                                    type="file"
                                    multiple
                                    accept=".png,.jpg,.jpeg,.webp,.svg"
                                    className="hidden"
                                    ref={(el) => (variantFileRefs.current[actualIndex] = el)}
                                    onChange={(e) => handleVariantImageChange(e, actualIndex)}
                                  />
                                </div>
                              )}
                            </td>

                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={variant.variantMrp || ""}
                                onChange={(e) => handleVariantChange(actualIndex, "variantMrp", e.target.value)}
                                className="rounded border px-2 py-1 placeholder:text-[#6B6B6B]"
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

                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={variant.variantSellingPrice || ""}
                                onChange={(e) => handleVariantChange(actualIndex, "variantSellingPrice", e.target.value)}
                                className="rounded border px-2 py-1 placeholder:text-[#6B6B6B]"
                                placeholder="Enter Selling Price"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={variant.variantGST || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "variantGST",
                                    e.target.value,
                                  )
                                }
                                placeholder="GST @ (%)"
                                className=" rounded border px-2 py-1 placeholder:text-[#6B6B6B]"
                              />
                            </td>

                            <td className="px-3 py-2">
                              <div className="flex items-center justify-center rounded-md gap-2 border px-3 py-1">
                                <input
                                  type="number"
                                  value={variant.variantDiscount || ""}
                                  onChange={(e) => handleVariantChange(actualIndex, "variantDiscount", e.target.value)}
                                  placeholder="Discount"
                                  className="placeholder:text-[#6B6B6B] bg-white w-20"
                                />
                                <div className="border rounded-lg px-3 bg-[#264464] text-white text-sm">
                                  %
                                </div>
                              </div>
                            </td>

                            {/* Available Stock */}
                            <td className="px-3 py-2">
                              {(isExisting && !isProductDraft) ? (
                                <div className="rounded border px-2 py-1 bg-gray-100 text-gray-600">
                                  {variant.variantAvailableStock || 0}
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  value={variant.variantAvailableStock || ""}
                                  onChange={(e) => {
                                    if (isEditing && isNewVariant) {
                                      const updated = [...newVariants];
                                      updated[index - formData.variants.length] = {
                                        ...updated[index - formData.variants.length],
                                        variantAvailableStock: e.target.value
                                      };
                                      setNewVariants(updated);
                                    }
                                    else {
                                      handleVariantChange(actualIndex, "variantAvailableStock", e.target.value);
                                    }
                                  }
                                  }
                                  className="rounded border px-2 py-1 placeholder:text-[#6B6B6B]"
                                  placeholder="Enter Stock"
                                />
                              )}
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
                        );
                      })}
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
