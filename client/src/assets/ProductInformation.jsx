import React, { use, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import products from "../../../data/products.json";

import { Package, ArrowLeft } from "lucide-react";

function ProductInformation() {
  // const { uuid } = useParams();
  const { uuid } = useParams();
  // console.log(products);

  const product = useMemo(() => {
    if (!products || products.length === 0) return undefined;
    return products.find((p) => p.uuid.toLowerCase() === uuid.toLowerCase());
  }, [products, uuid]);

  // console.log("UUID from useParams:", uuid);
  // console.log(
  //   "All product UUIDs:",
  //   products.map((p) => p.uuid)
  // );

  // console.log(product.images);

  /////////////////////////

  const [reviews, setReviews] = useState(product?.reviews || []);
  console.log("Product:", product);
  console.log("Reviews:", reviews);

  // if (!product) {
  //   <div className="p-6 text-center text-red-600">
  //     Product not found or still loading...
  //   </div>;
  // }
  return (
    <div className="min-h-screen  bg-gray-50">
      {/* Header */}
      <div className="h-16 bg-white rounded-lg flex items-center justify-between gap-3 px-4">
        <Link to="/admin/products" className="flex items-center gap-2">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
          <h1 className="text-black text-xl font-semibold">{product.title}</h1>
        </Link>
        <button className="bg-[#F8F8F8] px-5 py-1.5 border text-base rounded-lg">
          Edit
        </button>
      </div>

      {/* Product Info Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mt-4">
        {/* Left Section */}
        <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h2 className="flex items-center gap-2 text-lg font-medium">
              <Package className="w-6 h-6 text-gray-700" />
              Basic Information
            </h2>

            {/* {product.variants.map((item,i)=>( */}
            <div>
              <span className="bg-purple-100 px-3 py-1 rounded-full text-purple-700 text-sm font-medium">
                {product.type}
              </span>
            </div>
            {/* ))} */}
          </div>
          <div>
            <p className="text-[#797979] font-medium text-base">Description</p>
            <p className="text-[#2C2C2C] font-medium text-base">
              {product.description}
            </p>
          </div>
          <div>
            <label className="block text-[#797979] text-sm font-medium mb-2">
              Product Image
            </label>
            <div className="flex flex-wrap gap-3 items-start">
              {product.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`preview ${i}`}
                    className="w-[137px] h-[137px] object-cover rounded-lg border border-neutral-200"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white rounded-2xl border p-6 flex flex-col gap-2">
          <h2 className="text-black text-lg font-medium mb-2">
            Product Details
          </h2>

          <div className="grid grid-flow-row grid-cols-3 gap-14">
            <div className="flex flex-col flex-wrap justify-start space-y-[10px]">
              <div>
                <p className="text-base text-[#797979] font-medium">SKU-ID</p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  {product.SKU}
                </span>
              </div>
              <div>
                <p className="text-base text-[#797979] font-medium">
                  MaterialType
                </p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  {product.materialType}
                </span>
              </div>
              <div>
                <p className="text-base text-[#797979] font-medium">
                  Stock Quantity
                </p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  {product.stockQuantity}
                </span>
              </div>

              <div></div>
            </div>
            <div className="flex flex-col flex-wrap  justify-start space-y-[10px]">
              <div>
                <p className="text-base text-[#797979] font-medium">Category</p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  {product.category}
                </span>
              </div>
              <div className="text-start">
                <p className="text-base text-[#797979] font-medium">Weight</p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  {product.weight}
                </span>
              </div>
              <div>
                <p className="text-base text-[#797979] font-medium">Tags</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-[#2C2C2C] text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* <div></div> */}
            </div>
            <div className="flex flex-col flex-wrap items-center text-start justify-start space-y-[10px]">
              <div>
                <p className="text-base text-[#797979] font-medium">
                  Subcategory
                </p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  {product.subcategory}
                </span>
              </div>
              <div>
                <p className="text-base text-[#797979] font-medium">
                  Dimension
                </p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  55L x 35W cm
                </span>
              </div>
              {/* <div>
                <p className="text-base text-[#797979] font-medium">SKU-ID</p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  SRA-GAN-001
                </span>
              </div> */}

              <div></div>
            </div>
          </div>

          <h2 className="text-black text-lg font-medium mb-2">Pricing</h2>
          <div className="grid grid-flow-row grid-cols-3 gap-14">
            <div className="flex flex-col flex-wrap justify-start space-y-[10px]">
              <div>
                <p className="text-base text-[#797979] font-medium">MRP</p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  {product.mrp}
                </span>
              </div>
              <div>
                <p className="text-base text-[#797979] font-medium">Profit</p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  {product.profit}
                </span>
              </div>
              {/* <div>
                <p className="text-base text-[#797979] font-medium">
                Cost Price (₹)
                </p>
                <span className="text-base text-[#2C2C2C] font-medium">45</span>
              </div> */}

              <div></div>
            </div>
            <div className="flex flex-col flex-wrap   justify-start space-y-[10px]">
              <div>
                <p className="text-base text-[#797979] font-medium">
                  Selling Price (₹)
                </p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  {product.sellingPrice}
                </span>
              </div>
              <div className="text-start">
                <p className="text-base text-[#797979] font-medium">Discount</p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  <span>{product.discountPercent}%</span>
                </span>
              </div>
              {/* <div>
                  <p className="text-base text-[#797979] font-medium">Tags</p>
                  <span className="text-base text-[#2C2C2C] font-medium">
                    Bestseller
                  </span>
                </div> */}

              <div></div>
            </div>
            <div className="flex flex-col flex-wrap  justify-start space-y-[10px]">
              <div>
                <p className="text-base text-[#797979] font-medium">
                  Cost Price (₹)
                </p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  {product.costPrice}
                </span>
              </div>
              <div>
                <p className="text-base text-[#797979] font-medium">Tax</p>
                <span className="text-base text-[#2C2C2C] font-medium">
                  {product.taxPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="mt-6 bg-white rounded-xl p-4">
        <h2 className="text-lg font-medium mb-2">Variants</h2>
        <table className="w-full text-left text-gray-600">
          <thead className="bg-[#F8F8F8] h-[54px]">
            <tr className="text-[#777777] text-[18px]">
              <th className="px-4 py-3 font-normal">Image</th>
              <th className="px-4 py-3 font-normal">VariantName</th>
              <th className="px-4 py-3 font-normal">Variant Type</th>
              <th className="px-4 py-3 font-normal">Value</th>
              <th className="px-4 py-3 font-normal">Quantity</th>
              <th className="px-4 py-3 font-normal">Reorder Limit</th>
            </tr>
          </thead>
          <tbody className="">
            {product.variants.map((item, index) => {
              return (
                <tr
                  key={item.variantId || item.variantName}
                  className="border-t hover:bg-gray-50 transition group"
                >
                  <td className="px-0 py-4">
                    <div className="flex relative w-full items-center justify-start">
                      <div className="h-[50px] w-[50px] ml-2 bg-[#D9D9D9] rounded-md overflow-hidden">
                        {item.variantImage?.length > 0 ? (
                          <div className="relative">
                            <img
                              src={
                                typeof item.variantImage[0] === "string"
                                  ? item.variantImage[0] // If the image is a string (URL)
                                  : item.variantImage[0].preview || // If it's a file object, get preview
                                    URL.createObjectURL(item.variantImage[0]) // Otherwise, create a URL
                              }
                              className="w-full h-full object-cover rounded-lg border border-neutral-200"
                              alt={item.variantName}
                            />
                            {/* If there are more than 1 image, show the "+{N}" badge */}
                            {item.variantImage.length > 1 && (
                              <div
                                onClick={() => {
                                  setSelectedImages(item.variantImage); // Set selected images
                                  const first =
                                    typeof item.variantImage[0] === "string"
                                      ? item.variantImage[0]
                                      : item.variantImage[0].preview ||
                                        URL.createObjectURL(
                                          item.variantImage[0]
                                        );
                                  setCurrentImage(first); // Set the first image as the current image
                                  setIsModalOpen(true); // Open the modal
                                }}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium rounded-lg "
                              >
                                +{item.variantImage.length - 1}{" "}
                                {/* Display the number of extra images */}
                              </div>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Display variant details */}
                  <td className="px-4 py-3 text-base text-[#171028]">
                    {item.variantName}
                  </td>
                  <td className="px-4 py-3 text-base text-[#171028]">
                    {item.variantType}
                  </td>
                  <td className="px-4 py-3 text-base text-[#171028]">
                    {item.variantValue}
                  </td>
                  <td className="px-4 py-3 text-base text-[#171028]">
                    {item.stockQuantity}
                  </td>
                  <td className="px-4 py-3 text-base text-[#171028]">
                    {item.variantReorderLimit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Customer Reviews */}
      <div className="mt-6 bg-white rounded-xl p-4">
        <h2 className="text-lg font-medium mb-2">Customer Reviews</h2>

        {reviews && reviews.length > 0 ? (
          <div className="mt-4">
            <h2 className="text-lg font-medium mb-2">Customer Reviews</h2>
            <ul className="space-y-3">
              {reviews.map((rev, index) => (
                <li key={index} className="border-b pb-2">
                  <p className="font-semibold">⭐ {rev.rating}/5</p>
                  <p className="text-gray-700">{rev.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // <div className="py-8 flex flex-col items-center justify-center text-center">
          //   <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          //     <svg
          //       xmlns="http://www.w3.org/2000/svg"
          //       className="h-8 w-8 text-gray-500"
          //       fill="none"
          //       viewBox="0 0 24 24"
          //       stroke="currentColor"
          //     >
          //       <path
          //         strokeLinecap="round"
          //         strokeLinejoin="round"
          //         strokeWidth={2}
          //         d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          //       />
          //     </svg>
          //   </div>
          //   <h3 className="text-lg font-medium text-gray-700 mb-1">
          //     No Reviews Yet
          //   </h3>
          //   <p className="text-gray-500 text-sm max-w-md">
          //     Be the first to share your thoughts about this product.
          //   </p>
          // </div>
          "'lks;sks"
        )}

        {/* <h2 className="text-lg font-medium mb-2">Rating Breakdown</h2> */}
        {/* <div>
          <div>djldjldjldjljdl</div>
          <div>
            <h1 className="text-[18px] font-medium">Reviews</h1>
            <div>
              <div className="flex items-center justify-start gap-3">
                <div className="w-[45px] h-[45px] rounded-full bg-[#ECECF0] text-center flex items-center justify-center text-[16px]">
                  P
                </div>
                <div>
                  <p className="text-[16px]">Rajesh Sharma</p>
                  <div className="text-[14px]">
                    <span>stars</span>
                    <span className="text-[#717182]">•</span>
                    <span className="text-[#717182]">5 days ago</span>
                  </div>
                </div>
              </div>
              <h1 className="text-[#0A0A0A] text-[14px]">
                Beautiful craftsmanship and perfect for my living room
              </h1>
              <div></div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default ProductInformation;

// import { Link } from "react-router"; // ✅ use react-router-dom

// const EmptyState = ({
//   heading = "No Items Found",
//   description = "Looks like nothing is here yet.",
//   icon: Icon, // only Lucide icon components
//   ctaLabel = "Go Back",
//   ctaLink,
//   onClick, // optional
// }) => {
//   const buttonClasses =
//     "inline-block bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 \
//      text-gray-900 rounded-full md:px-8 md:py-3 px-4 py-2 text-sm md:text-base font-medium transition-all shadow-md hover:shadow-lg";

//   return (
//     <div className="h-[70vh] flex flex-col justify-center items-center text-center px-4 bg-white">
//       {/* Icon Circle */}
//       {Icon && (
//         <div className="mx-auto md:w-28 md:h-28 w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
//           <Icon className="md:w-14 md:h-14 w-8 h-8 text-amber-400" />
//         </div>
//       )}

//       {/* Heading */}
//       <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mb-3">
//         {heading}
//       </h3>

//       {/* Subtext */}
//       <p className="text-sm md:text-base text-gray-500 max-w-sm mb-4 md:mb-8">
//         {description}
//       </p>

//       {/* CTA: dynamic */}
//       {ctaLink ? (
//         <Link to={ctaLink} className={buttonClasses}>
//           {ctaLabel}
//         </Link>
//       ) : onClick ? (
//         <button onClick={onClick} className={buttonClasses}>
//           {ctaLabel}
//         </button>
//       ) : null}
//     </div>
//   );
// };

// export default EmptyState;
