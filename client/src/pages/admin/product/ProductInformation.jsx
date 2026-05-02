import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import products from "../../../data/products.json";
import { ChevronLeft, Search, Eye, Pin, Circle } from "lucide-react";
import ReviewIcon from "../../../assets/review.svg";
import Ratings from "../../../components/Ratings";
import Reviews from "../../../components/Reviews";
import axiosInstance from "../../../api/axiosInstance";
import { GoReply } from "react-icons/go";
import { Send } from "lucide-react";

function ProductInformation() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

      // Reply states
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // const response = await axiosInstance.get(`/product/${uuid}`);
        const response = await axiosInstance.get(
          `/product/admin/get-product-details/${uuid}`,
        );
        // console.log("Product Details Response from admin:", response.data);

        let productData = null;
        if (response.data?.success && response.data?.data) {
          productData = response.data.data;
        } else if (response.data) {
          productData = response.data;
        }

        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchProduct();
    }
  }, [uuid]);

 // Fetch reviews separately when product is loaded
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?._id) {
        setReviews([]);
        return;
      }

      try {
        setReviewsLoading(true);
        const response = await axiosInstance.get(
          `/review/all-product-reviews/${product._id}`
        );
        
        if (response.data?.success && response.data?.data) {
          setReviews(response.data.data);
        } else if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product?._id]);

  // Handle reply submission
  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) {
      alert("Please enter a reply");
      return;
    }

    try {
      setSubmittingReply(true);
      const response = await axiosInstance.post(
        `/review/add-reply/${reviewId}`,
        { replyText: replyText.trim() }
      );

      if (response.data?.success) {
        // Update the review in the local state with the new reply
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review._id === reviewId 
              ? { 
                  ...review, 
                  replies: [...(review.replies || []), response.data.data],
                  adminReplied: true 
                }
              : review
          )
        );
        
        // Reset reply form
        setReplyingTo(null);
        setReplyText("");
        
        // Show success message
        alert("Reply added successfully!");
      }
    } catch (err) {
      console.error("Error submitting reply:", err);
      alert(err.response?.data?.message || "Failed to submit reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  // Get default variant
  const defaultVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find((v) => v.isSelected) || product.variants[0];
  }, [product]);

  // console.log(product)

  /////////////////////////

  // const [reviews, setReviews] = useState(product?.reviews || []);
  // // console.log("Product:", product);
  // // console.log("Reviews:", reviews);

  // ////////////////////////////////
  // const avgRating =
  //   products?.reviews?.length > 0
  //     ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
  //       product.reviews.length
  //     : 0;

  /////////////////////////

  // console.log(product)

  const [selectedType, setSelectedType] = useState("product");
  const [selectedVariant, setSelectedVariant] = useState(null);
  // search define
  const [searchData, setSearchData] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchData);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchData]);

  // Calculate average rating
const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return total / reviews.length;
  }, [reviews]);

  // search logic
  const text = debouncedSearch?.toLowerCase() || "";

  // main
  const mainProductMatch =
    (defaultVariant?.variantSkuId || "").toLowerCase().includes(text) ||
    (product?.productTittle || "").toLowerCase().includes(text) ||
    (defaultVariant?.variantColor || "").toLowerCase().includes(text);

  // add kar ha size bhi

  // varinats
  const filterVariants = (product?.variants || [])
    .filter((v) => v._id !== defaultVariant?._id) // remove duplicate
    .filter((v) => {
      return (
        (v.variantSkuId || "").toLowerCase().includes(text) ||
        (v.variantName || "").toLowerCase().includes(text) ||
        (v.variantColor || "").toLowerCase().includes(text)
      );
    });

  const handleEdit = () => {
    navigate(`/admin/add-product/${product?._id || uuid}`);
  };

  if (loading) {
    return (
      <div className="p-[24px] bg-[#F6F8F9] rounded-md min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C3753] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const currentVariant =
    selectedType === "product" ? defaultVariant : selectedVariant;
  const currentImages =
    selectedType === "product"
      ? currentVariant?.variantImage?.map((img) => img.url) || []
      : currentVariant?.variantImage?.map((img) => img.url) || [];

  return (
    <div className="p-[24px] bg-[#F6F8F9] rounded-md min-h-screen">
      {/* Header */}
      <div className="rounded-lg flex items-center justify-between">
        <Link to="/admin/products" className="flex items-center gap-2">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
          <h1 className="text-black text-[20px] font-semibold">
            {product.productTittle || "Product Details"}
          </h1>
        </Link>
        <button
          onClick={handleEdit}
          className="px-5 py-1.5 text-[#1C3753] border border-[#1C3753] text-base rounded-lg"
        >
          Edit Product
        </button>
      </div>

      {/* Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 mt-4 items-start">
        <div className="bg-white px-4 py-4 rounded-2xl flex flex-col h-[calc(100vh-140px)]">
          <p className="text-[18px] font-semibold mb-3">Variants</p>

          {/* Search */}
          <div className="flex items-center bg-[#F8FBFC] border rounded-xl px-4 py-2 mb-4">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
              placeholder="Search by SKU ID, and Variant Value"
              className="outline-none flex-1 bg-transparent text-sm"
            />
          </div>

          {/* Variant List (Scrollable) */}
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
            {/* MAIN PRODUCT */}
            {(!debouncedSearch || mainProductMatch) && defaultVariant && (
              // <div
              //   onClick={() => {
              //     setSelectedType("product");
              //     setSelectedVariant(null);
              //   }}
              //   className={`flex items-center gap-4 bg-[#F5F8FA] border rounded-xl p-3 hover:border-gray-400 cursor-pointer transition ${
              //     selectedType === "product"
              //       ? "bg-blue-50 border-blue-400"
              //       : "bg-blue-50 border-blue-400"
              //   }`}
              // >
              //   <img
              //     className="w-10 h-10 rounded-md object-cover"
              //     src={
              //       defaultVariant?.variantImage?.[0]?.url || "/placeholder.png"
              //     }
              //     alt={product.productTittle}
              //   />

              //   <div className="flex-1">
              //     <div className="flex justify-between text-sm font-medium">
              //       <p>{defaultVariant?.variantSkuId || "N/A"}</p>
              //       <p>₹ {defaultVariant?.variantSellingPrice || 0}</p>
              //     </div>

              //     <div className="flex justify-between text-xs text-gray-600 mt-0.5">
              //       <div className="flex gap-2">
              //         {defaultVariant?.variantColor && (
              //           <p className="border border-[#495F75] px-1 rounded-md">
              //             {defaultVariant.variantColor}
              //           </p>
              //         )}
              //         <p className="border border-[#495F75] px-1 rounded-md">
              //           20×20
              //         </p>
              //       </div>
              //       <p>{defaultVariant?.variantAvailableStock || 0} in stock</p>
              //     </div>
              //   </div>
              // </div>
              // <></>
              <div
                onClick={() => {
                  setSelectedType("product");
                  setSelectedVariant(null);
                }}
                className={`flex items-center gap-4 bg-[#F5F8FA] border rounded-xl p-3 hover:border-gray-400 cursor-pointer transition ${selectedType === "product"
                  ? "bg-blue-50 border-blue-400"
                  : "bg-blue-50 border-blue-400"
                  }`}
              >
                <img
                  className="w-10 h-10 rounded-md object-cover"
                  src={
                    defaultVariant?.variantImage?.[0]?.url || "/placeholder.png"
                  }
                  alt={product.productTittle}
                />

                <div className="flex-1">
                  <div className="flex justify-between text-sm font-medium">
                    <p>{defaultVariant?.variantSkuId || "N/A"}</p>
                    <p>₹ {defaultVariant?.variantSellingPrice || 0}</p>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                    <div className="flex gap-2">
                      {currentVariant?.variantColor && (
                     <span className="border border-[#495F75] px-1 rounded-md">
                      {currentVariant?.variantColor 
                        ? `${currentVariant.variantColor}`
                        : ""}
                    </span>
                      )}
                    {currentVariant?.variantName && (
                     <span className="border border-[#495F75] px-1 rounded-md">
                      {currentVariant?.variantName 
                        ? `${currentVariant.variantName}`
                        : ""}
                    </span>
                      )}
                    {currentVariant?.variantWeight && (
                      <span className="border border-[#495F75] px-1 rounded-md">
                      {`${currentVariant.variantWeight} ${currentVariant.variantWeightUnit || 'kg'}`}
                    </span>
                    )}
                    </div>
                    <p>{defaultVariant?.variantAvailableStock || 0} in stock</p>
                  </div>
                </div>
              </div>
            )}

            {/* VARIANTS */}
            {filterVariants.map((item, index) => (
              <div
                key={item._id || index}
                onClick={() => {
                  setSelectedType("variant");
                  setSelectedVariant(item);
                }}
                className={`flex items-center gap-4 bg-[#F5F8FA] border rounded-xl p-3 hover:border-gray-400 cursor-pointer transition${selectedType === "variant" &&
                  selectedVariant?._id === item._id
                  ? "bg-blue-50 border-blue-400"
                  : "bg-[#F5F8FA]"
                  }`}
              >
                <img
                  className="w-10 h-10 rounded-md object-cover"
                  src={item.variantImage?.[0]?.url || "/placeholder.png"}
                  alt={item.variantName}
                />

                <div className="flex-1">
                  <div className="flex justify-between text-sm font-medium">
                    <p>{item.variantSkuId}</p>
                    <p>₹ {item.variantSellingPrice}</p>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                    <div className="flex gap-2">
                      {/* {item.variantColor && (
                        <p className="border border-[#495F75] px-1 rounded-md">
                          {item.variantColor}
                        </p>
                      )} */}

                      {/* <p className="border border-[#495F75] px-1 rounded-md">
                        20×20
                      </p> */}
                    </div>
                    <p>{item.variantAvailableStock || 0} in stock</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-4">
            <div className="flex gap-4 items-center">
              <h3 className="text-lg font-semibold mb-2">Basic Details</h3>

              <div>
                {product?.isActive ? (
                  <div className="flex items-center justify-center gap-2 bg-[#E0F4DE] py-1 px-3 rounded-lg text-sm text-[#00A63E]">
                    <Circle fill="#00A63E" color="#00A63E" size={"12px"} />
                    Active
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 bg-[#FFFBEB] py-1.5 px-3 rounded-lg text-sm text-[#F8A14A]">
                    <Circle fill="#F8A14A" color="#F8A14A" size={"12px"} />
                    Inactive
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="">Product Name</p>
              <span className="text-[#686868] text-sm">
                {/* {selectedType === "product"
                  ? product.productTittle
                  : selectedVariant?.variantName || "-"} */}
                  {product.productTittle || "-"}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-md font-medium mb-1">Description</p>
              <p className="text-[#2C2C2C] text-sm leading-relaxed break-words whitespace-pre-line">
                {product.description || "No description available"}
              </p>
            </div>
          </div>

          {/* Variant Details */}
          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-2">Variant Details</h3>

            <div>
              <p className="text-[14px] text-[#686868] text-sm mb-2">Images</p>
              <div className="flex flex-wrap gap-3 items-start">
                {currentImages.length > 0 ? (
                  currentImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`preview-${i}`}
                      className="w-[80px] h-[80px] object-cover rounded-lg border border-neutral-200"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No images available</p>
                )}
              </div>
              <div className="grid grid-flow-row grid-cols-3 gap-14 mt-4">
                <div className="flex flex-col flex-wrap justify-start space-y-[10px]">
                  <div>
                    <p className="text-sm text-[#686868] font-medium">SKU-ID</p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {currentVariant?.variantSkuId || "N/A"}
                    </span>
                  </div>
                  {/* <div className="text-start">
                    <p className="text-sm text-[#686868] font-medium">Weight</p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {product.weight}
                    </span>
                  </div> */}
                  {/* <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Dimension
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      55L x 35W cm
                    </span>
                  </div> */}
                  {currentVariant?.variantColor && (
                  <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Product Color
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {currentVariant?.variantColor}
                    </span>
                  </div>
                  )}
                </div>
                <div className="flex flex-col flex-wrap  justify-start space-y-[10px]">
                  {/* <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Available Stock
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                    {currentVariant?.variantAvailableStock || 0}
                    </span>
                  </div> */}

                  {/* <div className="text-start">
                    <p className="text-sm text-[#686868] font-medium">
                      Frame Color
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      Black
                    </span>
                  </div> */}
                  <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Subcategory
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {product?.subcategory?.name || "N/A"}
                    </span>
                  </div>
                  {currentVariant?.variantName && (
                  <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Variant Name
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {currentVariant?.variantName || ""}
                    </span>
                  </div>
                  )}
                  {/* <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Dimension
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                    </span>
                  </div> */}
                  {/* <div className="text-start">
                    <p className="text-sm text-[#686868] font-medium">Weight</p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {currentVariant?.variantWeight 
                        ? `${currentVariant.variantWeight} ${currentVariant.variantWeightUnit || 'kg'}`
                        : "N/A"}
                    </span>
                  </div> */}
                </div>
                <div className="flex flex-col flex-wrap items-start text-start justify-start space-y-[10px]">
                  <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Category
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {product.category?.name || "N/A"}
                    </span>
                  </div>
                  {/* <div className="">
                    <p className="text-sm  text-[#686868] font-medium">
                      Material
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {product.materialType}
                    </span>
                  </div> */}
                  {/* <div className="text-start">
                    <p className="text-sm text-[#686868] font-medium">Weight</p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {currentVariant?.variantWeight 
                        ? `${currentVariant.variantWeight} ${currentVariant.variantWeightUnit || 'kg'}`
                        : "N/A"}
                    </span>
                  </div> */}
                  {/* <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Product Color
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                    
                      Black
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-2">Pricing</h3>
            <div className="grid grid-flow-row grid-cols-3 gap-14">
              <div className="flex flex-col flex-wrap justify-start space-y-[10px]">
                <div>
                  <p className="text-sm text-[#797979] font-medium">MRP</p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                    ₹{currentVariant?.variantMrp || 0}
                  </span>
                </div>
                {/* <div>
                  <p className="text-sm text-[#797979] font-medium">Profit</p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                     ₹{(currentVariant?.variantSellingPrice || 0) - (currentVariant?.variantCostPrice || 0)}
                  </span>
                </div> */}
                <div className="text-start">
                  <p className="text-sm text-[#797979] font-medium">Discount</p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                    <span> {currentVariant?.variantDiscount || 0}%</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-wrap justify-start space-y-[10px]">
                <div>
                  <p className="text-sm text-[#797979] font-medium">
                    Selling Price
                  </p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                    ₹{currentVariant?.variantSellingPrice || 0}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-[#797979] font-medium">GST</p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                    {currentVariant?.variantGST || 0}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-wrap  justify-start space-y-[10px]">
                <div>
                  <p className="text-sm text-[#797979] font-medium">
                    Cost Price
                  </p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                    ₹{currentVariant?.variantCostPrice || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      {/* <div className="mt-6 bg-white rounded-xl p-4">
        <h2 className="text-lg font-medium mb-2">Rating & Reviews</h2>

        {product?.reviews && product.reviews.length > 0 ? (
          <div className="max-h-[450px] overflow-y-auto pr-2">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className="py-4 flex gap-3 flex-col border border-[#CBCACA] px-4 rounded-xl mb-4"
              >
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    {review.userImage ? (
                      <img
                        className="w-11 h-11 rounded-full"
                        src={review.userImage}
                        alt={`${review.user}'s avatar`}
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                        <h1 className="text-white">
                          {review.user?.charAt(0).toUpperCase() || "U"}
                        </h1>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <h1 className="text-[14px]">
                        {review.user || "Anonymous"}
                      </h1>
                      <div className="flex items-center gap-1">
                        <Ratings
                          reviews={product.reviews}
                          avgRating={review.rating}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm">{review.comment || "No comment"}</p>
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-3">
                    {review.images.map((img, imgIndex) => (
                      <img
                        className="w-[60px] h-[60px] rounded-md"
                        src={img}
                        alt="product"
                        key={imgIndex}
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-end justify-end gap-2 text-[#6C6B6B] text-[14px]">
                  <span className="text-[#6C6B6B] text-[12px]">
                    {review.createdAt
                      ? `Reviewed ${new Date(review.createdAt).toISOString().split("T")[0]}`
                      : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-[#FFF4EB] rounded-full flex items-center justify-center mb-4">
              <img src={ReviewIcon} alt="" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No Reviews Yet
            </h3>
          </div>
        )}
      </div> */}
       {/* Customer Reviews */}
     {/* Customer Reviews with Reply Feature */}
      <div className="mt-6 bg-white rounded-xl p-4">
        <h2 className="text-lg font-medium mb-2">Rating & Reviews</h2>

        {reviewsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C3753]"></div>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="max-h-[450px] overflow-y-auto pr-2">
            {reviews.map((review, index) => (
              <div
                key={review._id || index}
                className="py-4 flex gap-3 flex-col border border-[#CBCACA] px-4 rounded-xl mb-4"
              >
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                      <h1 className="text-white">
                        {(review.reviewerName || review.user || "U").charAt(0).toUpperCase()}
                      </h1>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-[14px] font-medium">
                          {review.reviewerName || review.user || "Anonymous"}
                        </h1>
                        <Ratings reviews={reviews} avgRating={review.rating} />
                        <span className="text-xs text-gray-400">
                          {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(review.createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700">{review.reviewText || review.comment || "No comment"}</p>

                {review.reviewImages && review.reviewImages.length > 0 && (
                  <div className="flex gap-3">
                    {review.reviewImages.map((img, imgIndex) => (
                      <img
                        className="w-[60px] h-[60px] rounded-md object-cover"
                        src={img.url || img}
                        alt="product review"
                        key={imgIndex}
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Display existing replies */}
               {/* Admin Replies (Redesigned) */}
{review.replies && review.replies.length > 0 && (
  <div className="ml-10 mt-3 space-y-2">
    {review.replies.map((reply, replyIndex) => (
      <div
        key={reply._id || replyIndex}
        className="bg-[#EEF2FF] border border-[#D9E1FF] p-3 rounded-lg"
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-[#1C3753]">
            Admin Reply
          </span>
          <span className="text-xs text-gray-400">
            {new Date(reply.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="text-sm text-gray-700">
          {reply.replyText}
        </p>
      </div>
    ))}
  </div>
)}

                {/* Reply button and form */}
             <div className="flex items-center justify-between mt-3">
  <button
    onClick={() =>
      setReplyingTo(replyingTo === review._id ? null : review._id)
    }
    className="text-sm text-gray-600 hover:text-[#1C3753] flex items-center gap-1"
  >
    <GoReply size={16} />
    {replyingTo === review._id ? "Cancel" : "Reply"}
  </button>
</div>

                {/* Reply input form */}
              {replyingTo === review._id && (
  <div className="mt-3 border rounded-xl bg-[#F9FAFB] p-3">
    <label className="text-sm text-gray-600 mb-1 block">Reply</label>

    <textarea
      value={replyText}
      onChange={(e) => setReplyText(e.target.value)}
      placeholder="Reply to customer’s review."
      className="w-full bg-transparent outline-none text-sm resize-none"
      rows={3}
    />

    <div className="flex justify-end gap-2 mt-3">
      <button
        onClick={() => setReplyingTo(null)}
        className="px-4 py-1.5 text-sm border border-[#1C3753] text-[#1C3753] rounded-md hover:bg-gray-100"
      >
        Cancel
      </button>

      <button
        onClick={() => handleReplySubmit(review._id)}
        disabled={!replyText || submittingReply}
        className="px-4 py-1.5 text-sm bg-[#1C3753] text-white rounded-md hover:bg-[#162c44] disabled:opacity-50"
      >
        {submittingReply ? "Replying..." : "Reply"}
      </button>
    </div>
  </div>
)}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-[#FFF4EB] rounded-full flex items-center justify-center mb-4">
              <img src={ReviewIcon} alt="" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No Reviews Yet
            </h3>
          </div>
        )}
      </div>
    </div>

  );
}

export default ProductInformation;
