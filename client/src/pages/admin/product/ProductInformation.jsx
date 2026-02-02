import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import products from "../../../data/products.json";
import { ChevronLeft, Search, Eye, Pin } from "lucide-react";
import ReviewIcon from "../../../assets/review.svg";
import Ratings from "../../../components/Ratings";
import Reviews from "../../../components/Reviews";

function ProductInformation() {
  const { uuid } = useParams();

  const navigate = useNavigate();

  const product = useMemo(() => {
    if (!products || products.length === 0) return undefined;
    return products.find((p) => p.uuid.toLowerCase() === uuid.toLowerCase());
  }, [products, uuid]);
  // console.log(product)

  /////////////////////////

  const [reviews, setReviews] = useState(product?.reviews || []);
  // console.log("Product:", product);
  // console.log("Reviews:", reviews);

  ////////////////////////////////
  const avgRating =
    products?.reviews?.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  /////////////////////////

  const handleEdit = () => {
    // if (!products.uuid) {
    //   alert("Product ID not found!");
    //   return;
    // }

    navigate(`/admin/add-product/${product.uuid}`);
  };

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

  // search logic
  const text = debouncedSearch?.toLowerCase() || "";

  // main
  const mainProductMatch =
    product?.SKU?.toLowerCase().includes(text) ||
    product?.title?.toLowerCase().includes(text) ||
    product?.ProductColor?.toLowerCase().includes(text);
    // add kar ha size bhi

  // varinats

  const filterVariants = (product?.variants || []).filter((v) => {
    return (
      v.variantId?.toLowerCase().includes(text) ||
      v.variantValue?.toLowerCase().includes(text) ||
      v.color?.toLowerCase().includes(text) ||
      v.size?.toLowerCase().includes(text)
    );
  });
  return (
    <div className="p-[24px] bg-[#F6F8F9] rounded-md min-h-screen">
      {/* Header */}
      <div className="rounded-lg flex items-center justify-between">
        <Link to="/admin/products" className="flex items-center gap-2">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
          <h1 className="text-black text-[20px] font-semibold">
            {product.title}
          </h1>
        </Link>
        <button
          onClick={handleEdit}
          className="px-5 py-1.5 text-[#1C3753] border border-[#1C3753] text-base rounded-lg">
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
              placeholder="Search by SKU, color, size"
              className="outline-none flex-1 bg-transparent text-sm"
            />
          </div>

          {/* Variant List (Scrollable) */}
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
            {/* MAIN PRODUCT */}
            {(!debouncedSearch || mainProductMatch) && (
              <div
                onClick={() => {
                  setSelectedType("product");
                  setSelectedVariant(null);
                }}
                className={`flex items-center gap-4 bg-[#F5F8FA] border rounded-xl p-3 hover:border-gray-400 cursor-pointer transition ${
                  selectedType === "product"
                    ? "bg-blue-50 border-blue-400"
                    : "bg-blue-50 border-blue-400"
                }`}>
                <img
                  className="w-10 h-10 rounded-md object-cover"
                  src={product.images?.[0]}
                  alt="product"
                />

                <div className="flex-1">
                  <div className="flex justify-between text-sm font-medium">
                    <p>{product.SKU}</p>
                    <p>₹ {product.sellingPrice}</p>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                    <div className="flex gap-2">
                      <p className="border border-[#495F75] px-1 rounded-md">
                        Black
                      </p>
                      <p className="border border-[#495F75] px-1 rounded-md">
                        20×20
                      </p>
                    </div>
                    <p>{product.variantQuantity} in stock</p>
                  </div>
                </div>
              </div>
            )}

            {/* VARIANTS */}
            {filterVariants.map((item, index) => (
              <div
                key={item.variantId || index}
                onClick={() => {
                  setSelectedType("variant");
                  setSelectedVariant(item);
                }}
                className={`flex items-center gap-4 bg-[#F5F8FA] border rounded-xl p-3 hover:border-gray-400 cursor-pointer transition${
                  selectedType === "variant"
                    ? "variant"
                    : "bg-[#F5F8FA] hover:border-gray-400"
                }`}>
                <img
                  className="w-10 h-10 rounded-md object-cover"
                  src={item.variantImage?.[0]}
                  alt="variant"
                />

                <div className="flex-1">
                  <div className="flex justify-between text-sm font-medium">
                    <p>{item.variantId}</p>
                    <p>₹ {product.sellingPrice}</p>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                    <div className="flex gap-2">
                      <p className="border border-[#495F75] px-1 rounded-md">
                        {item.variantValue}
                      </p>
                      <p className="border border-[#495F75] px-1 rounded-md">
                        20×20
                      </p>
                    </div>
                    <p>{item.variantQuantity} in stock</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-2">Basic Details</h3>

            <div>
              <p className="">Product Name</p>
              <span className="text-[#686868] text-sm">
                {selectedType === "product"
                  ? product.title
                  : selectedVariant?.variantName || "-"}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-md font-medium mb-1">Description</p>
              <p className="text-[#2C2C2C] text-sm leading-relaxed break-words whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Variant Details */}
          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-2">Variant Details</h3>

            <div>
              <p className="text-[14px] text-[#686868] text-sm mb-2">Images</p>
              <div className="flex flex-wrap gap-3 items-start">
                {(selectedType === "product"
                  ? product?.images || []
                  : selectedVariant?.variantImage || []
                ).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`preview-${i}`}
                    className="w-[80px] h-[80px] object-cover rounded-lg border border-neutral-200"
                  />
                ))}
              </div>
              <div className="grid grid-flow-row grid-cols-3 gap-14 mt-4">
                <div className="flex flex-col flex-wrap justify-start space-y-[10px]">
                  <div>
                    <p className="text-sm text-[#686868] font-medium">SKU-ID</p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {selectedType === "product"
                        ? product.SKU
                        : selectedVariant.variantId}
                    </span>
                  </div>
                  <div className="text-start">
                    <p className="text-sm text-[#686868] font-medium">Weight</p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {product.weight}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Category
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {product.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Dimension
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      55L x 35W cm
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-wrap  justify-start space-y-[10px]">
                  <div>
                    <p className="text-sm text-[#686868] font-medium">Stock</p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {/* {product.stockQuantity} */}
                      20
                    </span>
                  </div>

                  <div className="text-start">
                    <p className="text-sm text-[#686868] font-medium">
                      Frame Color
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      Black
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Subcategory
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {product.subcategory}
                    </span>
                  </div>
                  <div className="text-start">
                    <p className="text-sm text-[#686868] font-medium">Weight</p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {product.weight}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-wrap items-start text-start justify-start space-y-[10px]">
                  <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Low Stock Alert
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {/* {product.stockQuantity} */}
                      20
                    </span>
                  </div>
                  <div className="">
                    <p className="text-sm  text-[#686868] font-medium">
                      Material
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {product.materialType}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[#686868] font-medium">
                      Product Color
                    </p>
                    <span className="text-base text-[#2C2C2C] font-medium">
                      {/* {product.materialType} */}
                      Black
                    </span>
                  </div>
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
                    {product.mrp}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[#797979] font-medium">Profit</p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                    {product.profit}
                  </span>
                </div>

                <div></div>
              </div>
              <div className="flex flex-col flex-wrap   justify-start space-y-[10px]">
                <div>
                  <p className="text-sm text-[#797979] font-medium">
                    Selling Price
                  </p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                    {product.sellingPrice}
                  </span>
                </div>
                <div className="text-start">
                  <p className="text-sm text-[#797979] font-medium">Discount</p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                    <span>{product.discountPercent}%</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-wrap  justify-start space-y-[10px]">
                <div>
                  <p className="text-sm text-[#797979] font-medium">
                    Cost Price
                  </p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                    {product.costPrice}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[#797979] font-medium">GST</p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                    {product.taxPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="mt-6 bg-white rounded-xl p-4">
        <h2 className="text-lg font-medium mb-2">Rating & Reviews</h2>

        <Reviews reviews={product?.reviews} avgRating={avgRating} />
        {reviews && reviews.length > 0 ? (
          <div className="max-h-[450px] overflow-y-auto pr-2">
            {reviews.map(
              (
                {
                  user,
                  userImage,
                  comment,
                  rating,
                  // likes,
                  // dislike,
                  images,
                  // date,
                },
                index
              ) => (
                <div
                  key={index}
                  className="py-4 flex gap-3 flex-col border border-[#CBCACA] px-4 rounded-xl mb-4">
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      {userImage ? (
                        <img
                          className="w-11 h-11 rounded-full"
                          src={userImage}
                          alt={`${user}'s avatar`}
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                          <h1 className="text-white">
                            {user?.charAt(0).toUpperCase()}
                          </h1>
                        </div>
                      )}

                      <div className="flex flex-col">
                        <h1 className="text-[14px]">{user}</h1>
                        <div className="flex items-center gap-1">
                          <Ratings
                            reviews={product?.reviews}
                            avgRating={rating}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <button className="bg-gray-200 p-1 rounded-lg">
                        <Eye size={20} color="#1C1C1C" />
                      </button>
                      <button className="bg-gray-200 p-1 rounded-lg">
                        <Pin size={20} color="#1C1C1C" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm">{comment}</p>
                  {images && (
                    <div className="flex gap-3">
                      {images.map((img, index) => (
                        <img
                          className="w-[60px] h-[60px] rounded-md"
                          src={img}
                          alt="product"
                          key={index}
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex items-end justify-end gap-2 text-[#6C6B6B] text-[14px]">
                    {/* <span>
                      <ThumbsUp />
                    </span> */}

                    {/* <span>{likes}</span>
                    <span className="ml-4">
                      <ThumbsDownIcon />
                    </span>
                    <span>{dislike}</span> */}
                    {/* <span className="text-[#717182] text-sm">•</span> */}
                    <span className="text-[#6C6B6B] text-[12px]">
                      {`Reviewed ${new Date().toISOString().split("T")[0]}`}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className=" flex flex-col items-center justify-center text-center">
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
