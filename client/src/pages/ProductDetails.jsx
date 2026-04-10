import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { getPrices } from "../utils/homePageUtils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import EmptyState from "../components/EmptyState";
import axiosInstance from "../api/axiosInstance";
import AddReviewsModel from "../components/AddReviewsModel";

function ProductDetails() {
  const { uuid } = useParams();
  console.log("URL ID from useParams:", uuid);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);

  const { cartItems } = useSelector((s) => s.cart);
  const { wishlistItems } = useSelector((s) => s.wishlist);

  const [openAddReviewModal, setOpenAddReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const getSimilarProducts = (all, found, uuid) => {
    if (!found) return [];

    const normalize = (str) =>
      str
        ?.toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .trim() || "";

    const foundTitleWords = normalize(found.title).split(" ");

    const sameCategoryList = all.filter(
      (p) =>
        p.uuid !== uuid && normalize(p.category) === normalize(found.category),
    );

    const list = sameCategoryList;

    const sameSub = list.filter(
      (p) => normalize(p.subcategory) === normalize(found.subcategory),
    );
    if (sameSub.length > 0) return sameSub.slice(0, 10);

    const similarByTitle = list.filter((p) => {
      const title = normalize(p.title);
      return foundTitleWords.some((w) => title.includes(w));
    });

    if (similarByTitle.length > 0) return similarByTitle.slice(0, 10);

    return list.slice(0, 10);
  };

  // FETCH PRODUCT + SIMILAR PRODUCTS
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/products/all");
        const all = res.data;

        const found = all.find((p) => p._id === uuid || p.uuid === uuid);

        setProduct(found || null);

        if (found?.variants?.length > 0) {
          setSelectedVariant(found.variants[0]);
        }

        if (found) {
          const similar = getSimilarProducts(
            all,
            found,
            found.uuid || found._id,
          );
          setSimilarProducts(similar);
        }
      } catch (err) {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (uuid) fetchProduct();
    else setIsLoading(false);
  }, [uuid]);

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return img;
    return `http://localhost:5000${img}`;
  };

  const normalizeSize = (v) =>
    `${v?.variantLength}x${v?.variantBreadth} ${v?.variantDimensionunit || ""}`.trim();

  const findVariant = (color, sizeStr) => {
    return (product?.variants || []).find((v) => {
      const vColor = v?.variantColor || "";
      const vSize = normalizeSize(v);
      return (!color || vColor === color) && (!sizeStr || vSize === sizeStr);
    });
  };

  // ✅ SINGLE SOURCE OF TRUTH FOR VARIANT ID
  const variantId = selectedVariant?.variantId || selectedVariant?._id;

  const inCart = useMemo(() => {
    if (!selectedVariant || !product) return false;
    return cartItems.some(
      (i) => i.uuid === product.uuid && i.variantId === variantId,
    );
  }, [cartItems, product?.uuid, selectedVariant, variantId]);

  const qtyInCart =
    cartItems.find((i) => i.uuid === product?.uuid && i.variantId === variantId)
      ?.quantity || 0;

  const colorOptions = [
    ...new Set(
      (product?.variants || []).map((v) => v?.variantColor).filter(Boolean),
    ),
  ];

  const sizeOptions = [
    ...new Set(
      (product?.variants || [])
        .map((v) =>
          `${v.variantLength}x${v.variantBreadth} ${v.variantDimensionunit || ""}`.trim(),
        )
        .filter(Boolean),
    ),
  ];

  const onSelectColor = (color) => {
    setSelectedColor(color);
    const match = findVariant(color, selectedSize) || findVariant(color, null);
    if (match) {
      setSelectedVariant(match);
      setMainImageIndex(0);
      thumbsSwiper?.slideTo?.(0);
    }
  };

  const onSelectSize = (sizeStr) => {
    setSelectedSize(sizeStr);
    const match =
      findVariant(selectedColor, sizeStr) || findVariant(null, sizeStr);
    if (match) {
      setSelectedVariant(match);
      setMainImageIndex(0);
      thumbsSwiper?.slideTo?.(0);
    }
  };

  const isDemo = true;

  const handleOpenAddReview = () => {
    setSelectedReview(null);
    setOpenAddReviewModal(true);
  };

  const handleCloseReview = () => {
    setOpenAddReviewModal(false);
    setSelectedReview(null);
  };

  const images = selectedVariant?.variantImage?.length
    ? selectedVariant.variantImage
    : [];

  const mrp = Number(selectedVariant?.variantMrp || 0);
  const sp = Number(selectedVariant?.variantSellingPrice || 0);
  const discount = Number(selectedVariant?.variantDiscount || 0);

  const effectivePrice =
    sp > 0 ? sp : discount > 0 ? Math.round(mrp * (1 - discount / 100)) : mrp;

  const stock = Number(selectedVariant?.variantAvailableStock || 0);
  const outOfStock = stock <= 0;

  // ✅ IMPORTANT: this useEffect MUST be before any "return"
  useEffect(() => {
    if (!product?.variants?.length) return;

    // ✅ don't overwrite if already selected from fetch or user action
    if (selectedVariant) return;

    const v0 = product.variants[0];
    setSelectedVariant(v0);

    setSelectedColor(v0?.variantColor || null);
    setSelectedSize(normalizeSize(v0));

    setMainImageIndex(0);
    thumbsSwiper?.slideTo?.(0);
  }, [product, thumbsSwiper, selectedVariant]);

  // IF LOADING
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
          description="The product you’re looking for may have been removed, is out of stock, or the link is broken. Try browsing our categories or return to the home page.."
          icon={PackageOpen}
          ctaLabel="Go Home"
          ctaLink={"/"}
        />
        <Footer />
      </>
    );
  }

  const avgRating =
    product?.reviews?.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  const handleBuyNow = (product) => {
    dispatch(buyNow(product));
    navigate("/checkout/payment");
  };
  return (
    <>
      <Navbar />
      <Breadcrumbs
        category={product.category}
        subcategory={product.subcategory}
        title={product.title}
      />
      <section className="lg:px-40 md:px-[60px] px-4 py-6 bg-[#F6F8F9]">
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
                {images.map((img, idx) => (
                  <SwiperSlide key={idx} className="!w-auto !h-auto">
                    <div
                      className={`relative w-20 h-20 cursor-pointer transform transition duration-300 flex items-center justify-center
                          ${
                            mainImageIndex === idx
                              ? "border-2 border-[#977c2d] shadow-md rounded-md"
                              : "border-2 border-transparent hover:border-gray-200 rounded-md"
                          }`}
                      onClick={() => {
                        setMainImageIndex(idx);
                        thumbsSwiper?.slideTo?.(idx);
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
                ))}
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
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={getImageUrl(img)}
                      alt={`${product.title} ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Wishlist Button */}
              <button
                className="absolute bg-white shadow-md md:shadow-lg md:bg-white group-hover:block active:scale-110 transition-all ease-in-out duration-300 md:p-2 p-2 rounded-full text-xs top-1 right-1 z-20 cursor-default"
                onClick={(e) => {
                  e.stopPropagation();

                  const isInWishlist = wishlistItems.some(
                    (i) => i.uuid === product.uuid && i.variantId === variantId,
                  );

                  if (isInWishlist) {
                    dispatch(
                      removeFromWishlist({ uuid: product.uuid, variantId }),
                    );
                  } else {
                    dispatch(
                      addToWishlist({
                        uuid: product.uuid,
                        variantId,
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
                        i.uuid === product.uuid && i.variantId === variantId,
                    )
                      ? "red"
                      : "white"
                  }
                  stroke={
                    wishlistItems.some(
                      (i) =>
                        i.uuid === product.uuid && i.variantId === variantId,
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
            <h1 className="lg:text-2xl md:text-xl text-lg font-medium md:font-semibold text-gray-900 py-2 leading-7">
              {product.productTittle}
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
                {/* <div className="h-6 w-px bg-gray-300"></div>x
                <button
                  className="text-sm font-medium text-[#1C3753] hover:text-[#1C3753] transition-colors underline"
                  onClick={() =>
                    document
                      .getElementById("reviews-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  See all reviews
                </button> */}
              </div>
            )}

            {/* Product Price & details */}
            <div className="py-2 border-b">
              <div className="text-neural-700 font-medium">
                <span className="mr-2 text-[28px]">₹{effectivePrice}</span>
                {mrp > effectivePrice ? (
                  <span className="line-through text-[#787878] font-normal text-[16px]">
                    ₹{mrp}
                  </span>
                ) : null}
                {discount > 0 ? (
                  <span className="ml-2 text-[#168408] text-sm">
                    {Math.round(discount)}% Off
                  </span>
                ) : null}
              </div>
              <span className="text-[#686868] text-xs">
                inclusive of all taxes
              </span>
            </div>

            {/* Color Options */}
            {colorOptions.length > 0 && (
              <div className="mt-2">
                <h3 className="font-medium">
                  Weight:{" "}
                  <span className="text-[#1C1C1C] font-medium">
                    {selectedVariant?.variantColor || "-"}
                  </span>
                </h3>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      className={`px-3 py-1 rounded-md border border-[#B6AAFF] text-sm
            ${
              selectedVariant?.variantColor === c
                ? "border-2 border-[#1C3753] bg-[#F7F5FF] text-[#1800AC]"
                : "bg-white hover:bg-gray-200"
            }`}
                      onClick={() => onSelectColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* size Options */}
            {/* {sizeOptions.length > 0 && (
              <div className="mt-3 border-b pb-3">
                <h3 className="font-medium">
                  Size:{" "}
                  <span className="text-[#1C1C1C] font-medium">
                    {`${selectedVariant?.variantLength}x${selectedVariant?.variantBreadth} ${
                      selectedVariant?.variantDimensionunit || ""
                    }`}
                  </span>
                </h3>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {sizeOptions.map((s) => (
                    <button
                      key={s}
                      className={`px-3 py-1 rounded-md border border-[#1C3753] text-sm
            ${
              s === normalizeSize(selectedVariant)
                ? "border-2 border-[#1C3753] bg-[#D5E5F5] text-[#1C1C1C]"
                : "bg-white hover:bg-[#D5E5F5]"
            }`}
                      onClick={() => onSelectSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )} */}

            <div className="flex gap-3 py-4 border-b">
              {outOfStock ? (
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
                          decreaseQty({ uuid: product.uuid, variantId }),
                        );
                      }}
                      className="w-6 h-6 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {qtyInCart === 1 ? (
                        <Trash2 size={16} />
                      ) : (
                        <Minus size={16} />
                      )}
                    </button>

                    {/* Quantity */}
                    <span className="w-6 text-center">{qtyInCart}</span>

                    {/*  Increase */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                          increaseQty({ uuid: product.uuid, variantId }),
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
                      variantId,
                      selectedVariant,
                    });

                    const { base, effective, discountPercent } =
                      getPrices(product);

                    setIsLoading(true);
                    setTimeout(() => {
                      dispatch(
                        addToCart({
                          uuid: product.uuid,
                          variantId,
                          title: product.title,

                          basePrice: base,
                          effectivePrice: effective,
                          discountPercent,

                          stockQuantity:
                            selectedVariant.variantQuantity ?? 999999,

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
                  className="px-6 py-2 bg-[#F6F8F9] hover:bg-[#0C0057] hover:text-white 
transform transition-all duration-200 ease-in-out 
hover:scale-105 text-[#0C0057] border border-[#0C0057] rounded-md"
                >
                  {isLoading ? "Adding..." : "Add to Cart"}
                </button>
              )}

              {/* 🛒 Buy Now */}
              <button
                className="px-6 py-2 bg-[#0C0057] text-white hover:bg-[white] hover:text-[#0C0057] 
transform transition-all duration-200 ease-in-out 
hover:scale-105 border border-[#1C3753] rounded-md"
                onClick={() => handleBuyNow(product, selectedVariant)}
                disabled={outOfStock || isLoading}
              >
                Buy now
              </button>
            </div>

            {/* Specifications */}
            <div className="py-4 border-b">
              <h3 className="font-medium">Product Specifications</h3>
              <div className="text-[14px] mt-2">
                {/* <p className="text-[14px] text-[#6C6B6B] mt-2">
                  Product Size: -{" "}
                  <span className="text-[#171515]">
                    {normalizeSize(selectedVariant) || "-"}
                  </span>
                </p> */}
                <p className="text-[14px] text-[#1C1C1C]">
                  Item Weight -{" "}
                  <span className="text-[#686868] capitalize">
                    {selectedVariant?.variantWidth || "-"}
                    {selectedVariant?.variantWidthUnit || "-"}
                  </span>
                </p>

                {/* <p className="text-[14px] text-[#6C6B6B]">
                  Color:{" "}
                  <span className="text-[#171515] capitalize">
                    {selectedVariant?.variantColor || "-"}
                  </span>
                </p> */}
                {/* <p className="capitalize">
                  <span className="text-[#6C6B6B]">Material</span> -{" "}
                  {product.materialType}
                </p> */}
                <p className="capitalize">
                  <span className="text-[#1C1C1C]">Category:</span> -{" "}
                  <span className="text-[#686868]">
                    {" "}
                    {product.category || "-"}
                  </span>
                </p>
                <p className="capitalize">
                  <span className="text-[#1C1C1C]">Sub-Category:</span> -{" "}
                  <span className="text-[#686868]">
                    {product.subcategory || "-"}
                  </span>
                </p>
                {/* <p className="capitalize">
                  <span className="text-[#6C6B6B]">Return Policy</span> -{" "}
                  {product && true ? "Easy 7 days return available" : "-"}
                </p> */}
                {/* <p
                  className={`font-medium ${
                    stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className="text-[#6C6B6B]">Stock - </span>
                  {stock > 0 ? `${stock} available` : "Out of Stock"}
                </p> */}
              </div>
            </div>

            {/* About */}
            <div className="py-4">
              <h3 className="font-medium">Product Description</h3>

              {product.bulletPoints && product.bulletPoints.length > 0 ? (
                <ul className="list-disc list-inside text-[#6C6B6B] mt-2 space-y-1">
                  {product.bulletPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#1C1C1C] mt-2">{product.description}</p>
              )}
            </div>
          </div>
        </div>
        {/* Reviews */}
        <div className="p-4 bg-[#fcfbfb] rounded-lg mt-4" id="reviews-section">
          <h3 className="text-[24px] font-medium text-[#1C3753] uppercase font-marcellus">
            Rating & Reviews
          </h3>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[580px_minmax(0,1fr)] gap-6 items-start">
            <div className="w-full">
              <Reviews
                onAddReview={handleOpenAddReview}
                reviews={product?.reviews}
              />
            </div>

            <div className="w-full">
              <CustomerReview reviews={product?.reviews} id={product?._id} />
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
