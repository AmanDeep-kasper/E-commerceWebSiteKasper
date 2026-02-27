import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../sections/Footer";
import Ratings from "../components/Ratings";
import Reviews from "../components/Reviews";
import CustomerReview from "../components/CustomerReview";
import Card from "../components/Card";
import { Heart, Minus, PackageOpen, Plus, Trash2 } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  buyNow,
  decreaseQty,
  increaseQty,
} from "../redux/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/cart/wishlistSlice";
import { formatPrice, getPrices } from "../utils/homePageUtils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import EmptyState from "../components/EmptyState";
import axiosInstance from "../api/axiosInstance";
import AddReviewsModel from "../components/AddReviewsModel";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null); // change
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = React.useState(0);
  const [thumbsSwiper, setThumbsSwiper] = React.useState(null);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const { cartItems, totalItems } = useSelector((s) => s.cart);
  const { wishlistItems, setwishlistItems } = useSelector((s) => s.wishlist);

  // open add reviews model
  const [openAddReviewModal, setOpenAddReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null); // optional if editing

  const getSimilarProducts = (all, found, uuid) => {
    if (!found) return [];

    // Normalize text for matching
    const normalize = (str) =>
      str
        ?.toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .trim() || "";

    const foundTitleWords = normalize(found.title).split(" ");

    // 🔥 Step 0: Filter products only from same category
    const sameCategoryList = all.filter(
      (p) =>
        p.uuid !== uuid && normalize(p.category) === normalize(found.category),
    );

    // Now use ONLY same-category products for similarity
    const list = sameCategoryList;

    // Same subcategory
    const sameSub = list.filter(
      (p) => normalize(p.subcategory) === normalize(found.subcategory),
    );
    if (sameSub.length > 0) return sameSub.slice(0, 10);

    // Title keyword matching
    const similarByTitle = list.filter((p) => {
      const title = normalize(p.title);
      return foundTitleWords.some((w) => title.includes(w));
    });

    if (similarByTitle.length > 0) return similarByTitle.slice(0, 10);

    // Fallback (never empty), but still within same category
    return list.slice(0, 10);
  };

  // FETCH PRODUCT + SIMILAR PRODUCTS
  useEffect(() => {
  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching product with ID:", id);
      const res = await axiosInstance.get(`/api/products/product/${id}`);
      
      console.log("=== API DEBUG ===");
      console.log("Status:", res.status);
      console.log("Headers:", res.headers);
      console.log("Full response:", res);
      console.log("Response data:", res.data);
      console.log("Data structure:", Object.keys(res.data || {}));
      
      // Try different possible response structures
      const found = res.data?.data?.product || 
                   res.data?.data || 
                   res.data?.product || 
                   res.data;
      
      console.log("Extracted product:", found);
      
      if (found) {
        console.log("Product properties:", Object.keys(found));
        console.log("Product variants:", found.variants);
        console.log("Product images:", found.images);
      }
      
      setProduct(found);
      setSelectedVariant(found?.variants?.[0] || null);
      
    } catch (err) {
      console.log("Product fetch error:", err);
      console.log("Error response:", err.response);
      console.log("Error message:", err.message);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (id) fetchProduct();
}, [id]);
  // HOOK: inCart

  // const [inCart, setInCart] = useState(
  const inCart = useMemo(() => {
    if (!selectedVariant || !product) return false;
    return cartItems.some(
      (i) =>
        i.productId === product._id &&
        i.variantId === selectedVariant.variantId,
    );
  }, [cartItems, selectedVariant, product]);

  //  -----------------------------
  // HOOK: Wishlist
  // -----------------------------
  useEffect(() => {
    if (!selectedVariant || !product) return;

    const found = cartItems.find(
      (i) =>
        i.productId === product._id &&
        i.variantId === selectedVariant.variantId,
    );

    setTotalCartItems(found ? found.quantity : 0);
  }, [cartItems, selectedVariant, product]);

  // -----------------------------
  // HOOK: Quantity in Cart
  // -----------------------------
  useEffect(() => {
    if (!selectedVariant) return;
    const found = cartItems.find(
      (i) => i.uuid === uuid && i.variantId === selectedVariant.variantId,
    );
    setTotalCartItems(found ? found.quantity : 0);
  }, [cartItems, selectedVariant, id]);

  //  -----------------------------
  // IF LOADING
  // -----------------------------
  if (isLoading) {
    return (
      <>
        <Navbar />
        <EmptyState heading="Loading..." description="Fetching product..." />
        <Footer />
      </>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <>
        <Navbar />
        <Breadcrumbs title={"Not Found"} />
        <EmptyState
          heading="Not Found"
          description="The product you’re looking for may have been removed, is out of
              stock, or the link is broken. Try browsing our categories or
              return to the home page.."
          icon={PackageOpen}
          ctaLabel="Go Home"
          ctaLink={"/"}
        />
        <Footer />
      </>
    );
  }
  const outOfStock = selectedVariant.stockQuantity <= 0;

  const colors = [...new Set(product.variants.map((v) => v.variantValue))];
  const dimensions = [...new Set(product.variants.map((v) => v.dimension))];
  const types = [...new Set(product.variants.map((v) => v.variantType))];

  const avgRating =
    product?.reviews?.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  const handleBuyNow = (product) => {
    dispatch(buyNow(product)); // adds single item, sets buyNowMode
    navigate("/checkout/payment");
  };

  const handleVariantSelect = (key, value) => {
    const match = product.variants.find((v) => {
      return (
        (key === "color" ? v.variantValue === value : true) &&
        (key === "dimension" ? v.dimension === value : true) &&
        (key === "type" ? v.variantType === value : true)
      );
    });

    if (match) {
      setSelectedVariant(match);
      setMainImageIndex(0);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png";

    // Case 1: Full Cloudinary or external URL
    if (img.startsWith("http")) return img;

    // Case 2: Public folder asset (/Reflection1.jpg)
    if (img.startsWith("/")) return img;

    // Case 3: Server-stored images (uploads/image.png)
    return `http://localhost:5000${img}`;
  };



  const colorVariants = product.variants.filter(
    (v) => v.variantName === "Color",
  );
  const dimensionVariants = product.variants.filter(
    (v) => v.variantName === "Dimension",
  );

  // for demo

  const isDemo = true;

  const handleOpenAddReview = () => {
    setSelectedReview(null);
    setOpenAddReviewModal(true);
  };

  const handleCloseReview = () => {
    setOpenAddReviewModal(false);
    setSelectedReview(null);
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs
        category={product.category}
        subcategory={product.subcategory}
        title={product.title}
      />
      <section className="lg:px-20 md:px-[60px] px-4 py-6 ">
        <AddReviewsModel
          open={openAddReviewModal}
          review={selectedReview}
          product={{
            uuid: product?.uuid,
            title: product?.title,
            selectedVariant,
            image: getImageUrl(
              selectedVariant?.images?.[0] ||
                product?.images?.[0] ||
                selectedVariant?.variantImage?.[0],
            ),
          }}
          onClose={handleCloseReview}
          onSave={(newReviewOrUpdated) => {
            setProduct((prev) => ({
              ...prev,
              reviews: selectedReview
                ? prev.reviews.map((r) =>
                    r._id === newReviewOrUpdated._id ? newReviewOrUpdated : r,
                  )
                : [newReviewOrUpdated, ...(prev.reviews || [])],
            }));
            handleCloseReview();
          }}
        />
        <div className="flex lg:flex-row flex-col gap-8 items-start max-lg:items-center">
          {/* Thumbnails */}
          <div className="lg:sticky top-20 flex md:gap-8 gap-4 max-md:flex-col-reverse max-lg:w-full">
            {/* Thumbnails Swiper */}
            <div className="flex flex-col max-md:flex-row md:gap-4 max-md:justify-between rounded-lg">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView="auto"
                watchSlidesProgress
                direction="vertical"
                breakpoints={{
                  0: { direction: "horizontal", slidesPerView: 4 },
                  768: { direction: "vertical" },
                }}
                className="!w-full !h-auto md:!h-[460px]"
              >
                {(selectedVariant?.images ?? product?.images ?? []).map(
                  (img, idx) => (
                    <SwiperSlide key={idx} className="!w-auto !h-auto">
                      {/* Outer wrapper holds border + ring */}
                      <div
                        className={`relative w-20 h-20 cursor-pointer transform transition duration-300 flex items-center justify-center
                          ${
                            mainImageIndex === idx
                              ? "border-2 border-[#977c2d] shadow-md rounded-md"
                              : "border-2 border-transparent hover:border-gray-200 rounded-md"
                          }`}
                        onClick={() => {
                          setMainImageIndex(idx);
                          thumbsSwiper.slideTo(idx);
                        }}
                      >
                        <div className="w-full h-full overflow-hidden rounded-md">
                          <img
                            src={getImageUrl(img)}
                            alt={`${product.title} ${idx}`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>

                        {mainImageIndex === idx && (
                          <div className="absolute inset-0 bg-[#D49A06]/10 pointer-events-none transition-opacity duration-300 rounded-md" />
                        )}
                      </div>
                    </SwiperSlide>
                  ),
                )}
              </Swiper>
            </div>

            {/* Main Image Swiper */}
            <div className="relative">
              <Swiper
                modules={[Navigation, Thumbs]}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                spaceBetween={10}
                loop={false}
                onSlideChange={(swiper) =>
                  setMainImageIndex(swiper.activeIndex)
                }
                initialSlide={mainImageIndex}
                className="xl:min-w-[600px] xl:h-[600px] md:!w-[500px] w-full"
              >
                {(selectedVariant?.images ?? product?.images ?? []).map(
                  (img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={getImageUrl(img)}
                        alt={`${product.title} ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ),
                )}
              </Swiper>

              {/* Wishlist Button */}
              <button
                className="absolute bg-white shadow-md md:shadow-lg md:bg-white group-hover:block active:scale-110 transition-all ease-in-out duration-300 md:p-2 p-2 rounded-full text-xs top-1 right-1 z-20 cursor-default"
                onClick={(e) => {
                  e.stopPropagation();
                  const inWishlist = wishlistItems.some(
                    (i) =>
                      i.uuid === product.uuid &&
                      i.variantId === selectedVariant.variantId,
                  );
                  if (inWishlist) {
                    dispatch(
                      removeFromWishlist({
                        uuid: product.uuid,
                        variantId: selectedVariant.variantId,
                      }),
                    );
                  } else {
                    dispatch(
                      addToWishlist({
                        uuid: product.uuid,
                        variantId: selectedVariant.variantId,
                        title: product.title,
                        basePrice: selectedVariant.price,
                        stockQuantity: selectedVariant.stockQuantity,
                        discountPercent: product.discountPercent,
                        image: product.images,
                        deliverBy: product.deliverBy,
                        selectedOptions: {
                          color: selectedVariant.color,
                          type: selectedVariant.type,
                          dimension: selectedVariant.dimension,
                        },
                      }),
                    );
                  }
                }}
              >
                <Heart
                  className="w-8 h-8 p-1 cursor-pointer"
                  fill={
                    wishlistItems.some(
                      (i) =>
                        i.uuid === product.uuid &&
                        i.variantId === selectedVariant.variantId,
                    )
                      ? "red"
                      : "white"
                  }
                  stroke={
                    wishlistItems.some(
                      (i) =>
                        i.uuid === product.uuid &&
                        i.variantId === selectedVariant.variantId,
                    )
                      ? "red"
                      : "black"
                  }
                  strokeWidth={1}
                />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="w-full">
            <h1 className="lg:text-4xl md:text-3xl text-2xl font-medium md:font-semibold text-gray-900 py-2 leading-7">
              {product.title}
            </h1>
            {(isDemo || product?.reviews?.length > 0) && (
              <div className=" border-gray-200 pb-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-semibold text-gray-900">
                    {avgRating ?? "—"}
                  </span>
                  <span className="text-gray-500 text-sm">/5</span>
                </div>

                <div className="flex flex-col gap-1">
                  <Ratings size={20} avgRating={avgRating} />
                  <span className="text-sm text-gray-500">
                    <span>Based on </span>
                    {product?.reviews?.length ?? 0}{" "}
                    {product?.reviews?.length === 1 ? "review" : "reviews"}
                  </span>
                </div>

                <div className="h-6 w-px bg-gray-300"></div>
x
                <button
                  className="text-sm font-medium text-[#1C3753] hover:text-[#1C3753] transition-colors underline"
                  onClick={() =>
                    document
                      .getElementById("reviews-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  See all reviews
                </button>
              </div>
            )}

            {/* Product Price & details */}
            <div className="py-2 border-b">
              <div className="text-neural-700 font-medium">
                <span className="mr-2 text-[28px]">
                  ₹
                  {Math.round(
                    product.sellingPrice -
                      (product.discountPercent / 100) * product.sellingPrice,
                  )}
                </span>
                <span className="line-through text-[#787878] font-normal text-[16px]">
                  {product.sellingPrice ? `₹${product.sellingPrice}` : ""}
                </span>
                {product.discountPercent ? (
                  <span className="ml-2 text-[#168408] text-sm">
                    {Math.round(product.discountPercent)}% Off
                  </span>
                ) : null}
              </div>
              <span className="text-[#686868] text-xs">
                inclusive of all taxes
              </span>

              
            </div>

            {/* Color Options */}
            {colorVariants.length > 0 && (
              <div className="mt-2">
                <h3 className="font-medium">
                  Color:{" "}
                  <span className="text-[#1C1C1C] font-medium">{"Gold"}</span>
                </h3>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {colorVariants.map((v) => (
                    <button
                      key={v.variantId}
                      className={`px-3 py-1 rounded-md border border-[#1C3753] text-sm
            ${
              selectedVariant.variantId === v.variantId
                ? "border-2 border-[#1C3753] bg-[#D5E5F5] text-[#1C3753]"
                : "bg-white hover:bg-gray-200"
            }
          `}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.variantValue}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* size Options */}
            {dimensionVariants.length > 0 && (
              <div className="mt-3 border-b pb-3">
                <h3 className="font-medium">
                  Size:{" "}
                  <span className="text-[#1C1C1C] font-medium">
                    {"40X25 Inches"}
                  </span>
                </h3>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {dimensionVariants.map((v) => (
                    <button
                      key={v.variantId}
                      className={`px-3 py-1 rounded-md border border-[#1C3753] text-sm
            ${
              selectedVariant.variantId === v.variantId
                ? "border-2 border-[#1C3753] bg-[#D5E5F5] text-[#1C1C1C]"
                : "bg-white hover:bg-[#D5E5F5]"
            }
          `}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.variantValue}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Type Options */}
            {/* <div className="mt-5">
              <h3 className="font-medium">Type</h3>
              <div className="flex gap-2 mt-2 flex-wrap">
                {types.map((t, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded-full border text-sm
            ${
              selectedVariant.variantType === t
                ? "border-2 border-gray-900 bg-gray-900 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }
          `}
                    onClick={() => handleVariantSelect("type", t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div> */}

            <div className="flex gap-3 py-4 border-b">
              {selectedVariant.stockQuantity <= 0 ? (
                <button
                  disabled
                  className="px-6 py-2 bg-gray-300 text-gray-600 rounded-full cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : inCart ? (
                <>
                  <div className="flex items-center gap-3 px-4 border-[#1C3753] ring-1 ring-[#1C3753]/50 shadow-md p-1 rounded-md transition-all ease-in ">
                    {/* ➖ Decrease */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                          decreaseQty({
                            uuid: product.uuid,
                            variantId: selectedVariant.variantId,
                          }),
                        );
                      }}
                      className="w-6 h-6 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {cartItems.find(
                        (i) =>
                          i.uuid === product.uuid &&
                          i.variantId === selectedVariant.variantId,
                      )?.quantity === 1 ? (
                        <Trash2 size={16} />
                      ) : (
                        <Minus size={16} />
                      )}
                    </button>

                    {/* Quantity */}
                    <span className="w-6 text-center">
                      {cartItems.find(
                        (i) =>
                          i.uuid === product.uuid &&
                          i.variantId === selectedVariant.variantId,
                      )?.quantity || 0}
                    </span>

                    {/*  Increase */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // alert("ddsjg");
                        // console.log("Increase payload", {
                        //   uuid: product.uuid,
                        //   variantId: selectedVariant.variantId,
                        // });

                        // console.log("Current cart items:", cartItems);

                        dispatch(
                          increaseQty({
                            uuid: product.uuid,
                            variantId: selectedVariant.variantId,
                          }),
                        );
                      }}
                      className="w-6 h-6 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </>
              ) : (
                // add on cart
                <button
                  onClick={() => {
                    console.log("ADDING TO CART:", {
                      uuid: product.uuid,
                      variantId: selectedVariant.variantId,
                      selectedVariant,
                    });

                    const { base, effective, discountPercent } =
                      getPrices(product);

                    setIsLoading(true);
                    setTimeout(() => {
                      dispatch(
                        addToCart({
                          uuid: product.uuid,

                          variantId:
                            selectedVariant.variantId || selectedVariant._id,

                          title: product.title,

                          // ✅ Correct discount-aware pricing
                          basePrice: base,
                          effectivePrice: effective,
                          discountPercent,

                          // 🚀 Stock
                          stockQuantity:
                            selectedVariant.variantQuantity ?? 999999,

                          // 🚀 Image
                          image:
                            selectedVariant.variantImage?.[0] ||
                            "/placeholder.png",

                          deliverBy: product.deliverBy,

                          selectedOptions: {
                            color: selectedVariant.color,
                            type: selectedVariant.variantType,
                            dimension: selectedVariant.variantValue,
                          },
                        }),
                      );

                      setIsLoading(false);
                    }, 200);
                  }}
                  disabled={isLoading}
                  className="px-6 py-2 bg-white hover:bg-[#1C3753] hover:text-white 
transform transition-all duration-200 ease-in-out 
hover:scale-105 text-black border border-[#1C3753] rounded-md"
                >
                  {isLoading ? "Adding..." : "Add to Cart"}
                </button>
              )}

              {/* 🛒 Buy Now */}
              <button
                className="px-6 py-2 bg-[#1C3753] text-white hover:bg-[#1C3753] hover:text-white 
transform transition-all duration-200 ease-in-out 
hover:scale-105 border border-[#1C3753] rounded-md"
                onClick={() => handleBuyNow(product, selectedVariant)}
                disabled={selectedVariant.stockQuantity <= 0 || isLoading}
              >
                Buy now
              </button>
            </div>

            {/* Delivery */}
            {/* <div className="py-5 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Delivery Options
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enter your PIN code to check delivery time & COD
                    availability
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-[200px]">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#D6AE1F] focus:border-[#D6AE1F] outline-none transition-all"
                      placeholder="Enter PIN code"
                    />
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>

                  <button className="px-4 py-2 bg-[#D6AE1F] hover:bg-[#e2b659] text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1">
                    Check
                  </button>
                </div>
              </div>

              
              <div className="mt-3 p-3 bg-gradient-to-r from-green-100 to-transparent text-sm text-green-800 rounded-md">
                Delivery expected in {product.deliverBy} Days // This is not
                deffine
              </div>
            </div> */}

            {/* Specifications */}
            <div className="py-4 border-b">
              <h3 className="font-medium">Product Specifications</h3>
              <div className="text-[14px] mt-2">
                <p className="text-[14px] text-[#6C6B6B] mt-2">
                  Product Size: -{" "}
                  <span className="text-[#171515]">
                    {selectedVariant.variantValue || "-"}
                  </span>
                </p>
                <p className="text-[14px] text-[#6C6B6B]">
                  Item Weight -{" "}
                  <span className="text-[#171515] capitalize">
                    {product.weight || "-"}
                  </span>
                </p>
                <p className="text-[14px] text-[#6C6B6B]">
                  Color: -{" "}
                  <span className="text-[#171515] capitalize">
                    {product.color || "-"}
                  </span>
                </p>
                <p className="capitalize">
                  <span className="text-[#6C6B6B]">Material</span> -{" "}
                  {product.materialType}
                </p>
                <p className="capitalize">
                  <span className="text-[#6C6B6B]">Category:</span> -{" "}
                  {product.category || "-"}
                </p>
                <p className="capitalize">
                  <span className="text-[#6C6B6B]">Sub-Category:</span> -{" "}
                  {product.subcategory || "-"}
                </p>
                <p className="capitalize">
                  <span className="text-[#6C6B6B]">Return Policy</span> -{" "}
                  {product && true ? "Easy 7 days return available" : "-"}
                </p>
                <p
                  className={`font-medium ${
                    product.stockQuantity > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <span className="text-[#6C6B6B]">Stock -</span>{" "}
                  {product.stockQuantity
                    ? `${product.stockQuantity} available`
                    : "Out of Stock"}
                </p>
              </div>
            </div>

            {/* About */}
            <div className="py-4">
              <h3 className="font-medium">Product Description</h3>

              {/* If bulletPoints exist, show them as a list, else show description */}
              {product.bulletPoints && product.bulletPoints.length > 0 ? (
                <ul className="list-disc list-inside text-[#6C6B6B] mt-2 space-y-1">
                  {product.bulletPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#6C6B6B] mt-2">{product.description}</p>
              )}
            </div>

            {/* Reviews */}
            <div className="py-4" id="reviews-section">
              <h3 className="text-lg">Rating & Reviews</h3>
              <div className="mt-2">
                <div className="mt-4">
                  <Reviews
                    onAddReview={handleOpenAddReview}
                    reviews={product?.reviews}
                    avgRating={avgRating}
                  />
                </div>
                <CustomerReview reviews={product?.reviews} />
              </div>
            </div>
          </div>
        </div>

        {/* Similar & Latest */}
        {similarProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="py-2">Similar Products</h2>
            <Card cardData={similarProducts} />
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default ProductDetails;
