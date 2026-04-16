// import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import { getCardImage } from "../../utils/homePageUtils";
// import axiosInstance from "../../api/axiosInstance";

// function CategoryProducts() {
//   const navigate = useNavigate();

//   const allcategory = useSelector((state) => state.products.products);
//   const [visibleCount, setVisibleCount] = useState(4);

//   // Fetch categories/products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axiosInstance.get("/products/all");
//         setAllCategory(res.data);
//         // console.log(res.data);
//       } catch (error) {
//         console.log("Fetch error:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Responsive grid items
//   useEffect(() => {
//     const updateCount = () => {
//       if (window.innerWidth >= 1024) setVisibleCount(8);
//       else if (window.innerWidth >= 640) setVisibleCount(9);
//       else setVisibleCount(9);
//     };

//     updateCount();
//     window.addEventListener("resize", updateCount);

//     return () => window.removeEventListener("resize", updateCount);
//   }, []);

//   // GROUPING ONLY AFTER DATA IS LOADED
//   const groupedProducts = allcategory.reduce((acc, product) => {
//     if (!acc[product.category]) acc[product.category] = [];
//     acc[product.category].push(product);
//     return acc;
//   }, {});

//   return (
//     <div>
//       {/* <Title className="md:items-start items-center">Art Across Styles</Title> */}
//       {/* subcategories */}
//       <div
//         className="grid
//         xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1
//         gap-2 md:gap-5 lg:gap-4 grid-flow-row
//         place-items-center"
//       >
//         {Object.entries(groupedProducts)
//           .slice(0, visibleCount)
//           .map(([category, items]) => (
//             <Link
//               key={category}
//               to={`/products/${encodeURIComponent(category)}`}
//               className="bg-gradient-to-b shadow-sm rounded-lg  bg-white py-2 px-3"
//             >
//               <div className="flex items-center justify-between">
//                 <h2 className="md:text-2xl text-[20px] py-[9px] font-semibold">
//                   {category}
//                 </h2>
//                 <button
//                   className="underline text-[#2C87E2] hover:text-blue-950 py-2 text-sm"
//                   onClick={() =>
//                     navigate(`/products/${encodeURIComponent(category)}`)
//                   }
//                 >
//                   view all
//                 </button>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {items.slice(0, 4).map((p, index) => (
//                   <div
//                     key={`${p.id || p.uuid || p.SKU || p.title}-${index}`}
//                     className="cursor-pointer flex flex-col items-center transition-all duration-300 hover:shadow-sm"
//                     // onClick={() => navigate(getProductHref(p))}
//                     onClick={() => navigate(`/product/${p._id}`)}
//                   >
//                     <div className="flex flex-col w-full h-full overflow-hidden">
//                       {/* Product Image */}
//                       <div className="relative w-full aspect-square rounded-md overflow-hidden">
//                         <img
//                           className="w-full h-full bg-white object-contain hover:scale-105 transition-transform duration-300"
//                           // src={getCardImage(p)}
//                           src={
//                             p?.variants?.[0]?.variantImage?.[0] ||
//                             p?.images?.[0] ||
//                             "/fallback.png"
//                           }
//                           alt={p.productTittle || p.category || "Product"}
//                           loading="lazy"
//                         />

//                         {/* Optional rating badge */}
//                         {typeof p?.reviews?.rating?.average === "number" && (
//                           <span className="absolute top-1 right-1 bg-yellow-400 text-gray-800 text-[10px] px-2 py-0.5 rounded-full shadow">
//                             {p.rating.average.toFixed(1)} ★
//                           </span>
//                         )}
//                       </div>

//                       <h3 className="text-xs py-2 bg-transparent line-clamp-1 h-6">
//                         {p.productTittle}
//                       </h3>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </Link>
//           ))}
//       </div>
//     </div>
//   );
// }

// export default CategoryProducts;

// // {subcategories.map((product, index) => (
// //           // <div
// //           //   key={category.title}
// //           //   className="relative w-full h-[264px] rounded-lg  overflow-hidden"
// //           //   // to={`/products/${encodeURIComponent(category.category)}/{${encodeURIComponent(category.subcategory)}}`}
// //           // >
// //           //   <img
// //           //     className="absolute w-full h-full lg:hover:scale-105 object-cover transition duration-300"
// //           //     src={category.image[0]}
// //           //     alt={category.title}
// //           //   />
// //           //   <div className="z-50 w-full rounded-b-[10px] absolute bottom-0 h-[120px] bg-gradient-to-b from-[#FFFFFF00] via-[#000000CC]/60 to-[#000000]/80 flex flex-col items-center justify-center gap-2">
// //           //     <p className="text-white text-sm md:text-lg font-medium text-center px-2 mb-2 line-clamp-1">
// //           //       {category.title}
// //           //     </p>
// //           //     <Link
// //           //       to={`/products/${encodeURIComponent(
// //           //         category.category
// //           //       )}/${encodeURIComponent(category.subcategory)}`}
// //           //     >
// //           //       <Button
// //           //         className="text-xs md:text-sm py-1 px-3 md:py-2 md:px-4"
// //           //       >
// //           //         Shop Now
// //           //       </Button>
// //           //     </Link>
// //           //   </div>
// //           // </div>
// //           <div
// //             key={product.title + index}
// //             className="cursor-pointer flex flex-col items-center transition-all duration-300 hover:shadow-sm p-2 bg-white"
// //             onClick={() =>
// //               navigate(
// //                 `/products/${encodeURIComponent(
// //                   product.category
// //                 )}/${encodeURIComponent(product.subcategory)}`
// //               )
// //             }
// //           >
// //             <div className="flex flex-col items-center w-full h-full bg-white overflow-hidden">
// //               {/* Product Image */}
// //               <div className="relative w-full aspect-square overflow-hidden">
// //                 <img
// //                   className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
// //                   src={product?.image[0]}
// //                   alt={product.name}
// //                 />
// //               </div>

// //               {/* Product Info */}
// //               <div className="w-full p-3 flex flex-col items-center">
// //                 <p className="max-w-40 text-sm md:text-base text-gray-700 w-full mb-3 text-ellipsis whitespace-nowrap overflow-clip">
// //                   {product.title}
// //                 </p>
// //                 <p className="font-bold text-gray-900">Upto {product.discountPercent}% Off</p>
// //                 {/* Action Button */}
// //                 {/* <button
// //                   className="flex items-center justify-center bg-gray-900 text-white text-xs md:text-sm py-2 px-4
// //                         hover:bg-transparent hover:text-gray-900 border border-gray-900 transition-all duration-200 w-full"
// //                   onClick={() =>
// //                     navigate(
// //                       `/products/${encodeURIComponent(product.category)}`
// //                     )
// //                   }
// //                 >
// //                   Shop Now
// //                   <ArrowRight className="ml-1" size={16} />
// //                 </button> */}
// //               </div>
// //             </div>
// //           </div>
// //         ))}

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function CategoryProducts() {
    const [allProducts, setAllProducts] = useState([]);
  const [allcategory, setAllCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);

 // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/product/all", {
          params: {
            page: 1,
            limit: 100000, // Get more products
          }
        });
        
        // console.log("Products response:", response.data);
        
        // Extract products from response
        let products = [];
        if (response.data?.success && response.data?.data) {
          products = response.data.data;
        } else if (Array.isArray(response.data)) {
          products = response.data;
        }
        
        setAllProducts(products);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load products");
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) setVisibleCount(8);
      else if (window.innerWidth >= 640) setVisibleCount(9);
      else setVisibleCount(9);
    };

    updateCount();
    window.addEventListener("resize", updateCount);

    return () => window.removeEventListener("resize", updateCount);
  }, []);

  // const groupedProducts = allcategory.reduce((acc, product) => {
  //   const categoryName = product.category?.name || product.category || "Uncategorized";
  //   if (!acc[categoryName]) acc[categoryName] = [];
  //   acc[categoryName].push(product);
  //   return acc;
  // }, {});

  const getProductImage = (product) => {
    if(product.image) {
      return product.image;
    }
    if(product.variants?.[0]?.variantImage?.[0]?.url) {
      return product.variants[0]?.variantImage[0]?.url;
    }
    if(product.images?.[0]) {
      return product.images[0];
    }
    if(product.defaultImage) {
      return product.defaultImage;
    }
    return "/fallback"
  }
   const groupedProducts = allProducts.reduce((acc, product) => {
    // Check different possible category structures
    let categoryName = "Uncategorized";
    
    if (product.categoryName) {
      categoryName = product.categoryName;
    } else if (product.category?.name) {
      categoryName = product.category.name;
    }
    
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});


  if(allProducts.length === 0) {
    return (
      <div
      className='text-center text-gray-500 py-8'
      >
No Products available at the moment.
      </div>
    )
  }

  return (
    <div>
      <div
        className="grid 
        xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 
        gap-2 md:gap-5 lg:gap-4 grid-flow-row
        place-items-center lg:px-20 md:px-[60px] px-4 py-[23px]"
      >
        {Object.entries(groupedProducts)
          .slice(0, visibleCount)
          .map(([category, items]) => (
            <div
              key={category}
              className="bg-gradient-to-b shadow-sm rounded-lg bg-white py-2 px-3 w-full"
            >
              <div className="flex items-center justify-between">
                <h2 className="md:text-2xl text-[20px] py-[9px] font-light font-marcellus text-[#1800AC]">
                  {category}
                </h2>

                <Link
                  to={`/products/${encodeURIComponent(category)}`}
                  className="underline text-[#2C87E2] hover:text-blue-950 py-2 text-sm"
                >
                  view all
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {items.slice(0, 4).map((product, index) => (
                  <Link
                    // key={`${p.id || p.uuid || p.SKU || p.title}-${index}`}
                    key={product._id || index}
                    to={`/product/${product.slug || product._id}`}
                    className="cursor-pointer flex flex-col items-center transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="flex flex-col w-full h-full overflow-hidden">
                      <div className="relative w-full aspect-square rounded-md overflow-hidden">
                        <img
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                          src={getProductImage(product)}
                          alt={product.name || product.productTittle || "Product"}
                          loading="lazy"
                        />

                        {/* {typeof p?.reviews?.rating?.average === "number" && ( */}
                        {/* {product?.stats?.averageRating && (
                          <span className="absolute top-1 right-1 bg-yellow-400 text-gray-800 text-[10px] px-2 py-0.5 rounded-full shadow">
                            {product?.stats.averageRating.toFixed(1)} ★
                          </span>
                        )} */}
                      </div>

                      <h3 className="text-xs py-2 bg-transparent line-clamp-1 h-6">
                        {product.name || product.title || "United Product"}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default CategoryProducts;
//new one

// // import React, { useEffect, useState } from "react";
// import { useSelector } from 'react-redux';
// // import { Link, useNavigate } from "react-router-dom";
// // import { ArrowRight } from "lucide-react";
// // import { getCardImage } from "../../utils/homePageUtils";
// // import axiosInstance from "../../api/axiosInstance";

// // function CategoryProducts() {
// //   const navigate = useNavigate();

// //   const allcategory = useSelector((state) => state.products.products);
// //   const [visibleCount, setVisibleCount] = useState(4);

// //   // Fetch categories/products
// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       try {
// //         const res = await axiosInstance.get("/products/all");
// //         setAllCategory(res.data);
// //         // console.log(res.data);
// //       } catch (error) {
// //         console.log("Fetch error:", error);
// //       }
// //     };

// //     fetchProducts();
// //   }, []);

// //   // Responsive grid items
// //   useEffect(() => {
// //     const updateCount = () => {
// //       if (window.innerWidth >= 1024) setVisibleCount(8);
// //       else if (window.innerWidth >= 640) setVisibleCount(9);
// //       else setVisibleCount(9);
// //     };

// //     updateCount();
// //     window.addEventListener("resize", updateCount);

// //     return () => window.removeEventListener("resize", updateCount);
// //   }, []);

// //   // GROUPING ONLY AFTER DATA IS LOADED
// //   const groupedProducts = allcategory.reduce((acc, product) => {
// //     if (!acc[product.category]) acc[product.category] = [];
// //     acc[product.category].push(product);
// //     return acc;
// //   }, {});

// //   return (
// //     <div>
// //       {/* <Title className="md:items-start items-center">Art Across Styles</Title> */}
// //       {/* subcategories */}
// //       <div
// //         className="grid
// //         xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1
// //         gap-2 md:gap-5 lg:gap-4 grid-flow-row
// //         place-items-center"
// //       >
// //         {Object.entries(groupedProducts)
// //           .slice(0, visibleCount)
// //           .map(([category, items]) => (
// //             <Link
// //               key={category}
// //               to={`/products/${encodeURIComponent(category)}`}
// //               className="bg-gradient-to-b shadow-sm rounded-lg  bg-white py-2 px-3"
// //             >
// //               <div className="flex items-center justify-between">
// //                 <h2 className="md:text-2xl text-[20px] py-[9px] font-semibold">
// //                   {category}
// //                 </h2>
// //                 <button
// //                   className="underline text-[#2C87E2] hover:text-blue-950 py-2 text-sm"
// //                   onClick={() =>
// //                     navigate(`/products/${encodeURIComponent(category)}`)
// //                   }
// //                 >
// //                   view all
// //                 </button>
// //               </div>
// //               <div className="grid grid-cols-2 gap-4">
// //                 {items.slice(0, 4).map((p, index) => (
// //                   <div
// //                     key={`${p.id || p.uuid || p.SKU || p.title}-${index}`}
// //                     className="cursor-pointer flex flex-col items-center transition-all duration-300 hover:shadow-sm"
// //                     // onClick={() => navigate(getProductHref(p))}
// //                     onClick={() => navigate(`/product/${p._id}`)}
// //                   >
// //                     <div className="flex flex-col w-full h-full overflow-hidden">
// //                       {/* Product Image */}
// //                       <div className="relative w-full aspect-square rounded-md overflow-hidden">
// //                         <img
// //                           className="w-full h-full bg-white object-contain hover:scale-105 transition-transform duration-300"
// //                           // src={getCardImage(p)}
// //                           src={
// //                             p?.variants?.[0]?.variantImage?.[0] ||
// //                             p?.images?.[0] ||
// //                             "/fallback.png"
// //                           }
// //                           alt={p.productTittle || p.category || "Product"}
// //                           loading="lazy"
// //                         />

// //                         {/* Optional rating badge */}
// //                         {typeof p?.reviews?.rating?.average === "number" && (
// //                           <span className="absolute top-1 right-1 bg-yellow-400 text-gray-800 text-[10px] px-2 py-0.5 rounded-full shadow">
// //                             {p.rating.average.toFixed(1)} ★
// //                           </span>
// //                         )}
// //                       </div>

// //                       <h3 className="text-xs py-2 bg-transparent line-clamp-1 h-6">
// //                         {p.productTittle}
// //                       </h3>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </Link>
// //           ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default CategoryProducts;

// // // {subcategories.map((product, index) => (
// // //           // <div
// // //           //   key={category.title}
// // //           //   className="relative w-full h-[264px] rounded-lg  overflow-hidden"
// // //           //   // to={`/products/${encodeURIComponent(category.category)}/{${encodeURIComponent(category.subcategory)}}`}
// // //           // >
// // //           //   <img
// // //           //     className="absolute w-full h-full lg:hover:scale-105 object-cover transition duration-300"
// // //           //     src={category.image[0]}
// // //           //     alt={category.title}
// // //           //   />
// // //           //   <div className="z-50 w-full rounded-b-[10px] absolute bottom-0 h-[120px] bg-gradient-to-b from-[#FFFFFF00] via-[#000000CC]/60 to-[#000000]/80 flex flex-col items-center justify-center gap-2">
// // //           //     <p className="text-white text-sm md:text-lg font-medium text-center px-2 mb-2 line-clamp-1">
// // //           //       {category.title}
// // //           //     </p>
// // //           //     <Link
// // //           //       to={`/products/${encodeURIComponent(
// // //           //         category.category
// // //           //       )}/${encodeURIComponent(category.subcategory)}`}
// // //           //     >
// // //           //       <Button
// // //           //         className="text-xs md:text-sm py-1 px-3 md:py-2 md:px-4"
// // //           //       >
// // //           //         Shop Now
// // //           //       </Button>
// // //           //     </Link>
// // //           //   </div>
// // //           // </div>
// // //           <div
// // //             key={product.title + index}
// // //             className="cursor-pointer flex flex-col items-center transition-all duration-300 hover:shadow-sm p-2 bg-white"
// // //             onClick={() =>
// // //               navigate(
// // //                 `/products/${encodeURIComponent(
// // //                   product.category
// // //                 )}/${encodeURIComponent(product.subcategory)}`
// // //               )
// // //             }
// // //           >
// // //             <div className="flex flex-col items-center w-full h-full bg-white overflow-hidden">
// // //               {/* Product Image */}
// // //               <div className="relative w-full aspect-square overflow-hidden">
// // //                 <img
// // //                   className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
// // //                   src={product?.image[0]}
// // //                   alt={product.name}
// // //                 />
// // //               </div>

// // //               {/* Product Info */}
// // //               <div className="w-full p-3 flex flex-col items-center">
// // //                 <p className="max-w-40 text-sm md:text-base text-gray-700 w-full mb-3 text-ellipsis whitespace-nowrap overflow-clip">
// // //                   {product.title}
// // //                 </p>
// // //                 <p className="font-bold text-gray-900">Upto {product.discountPercent}% Off</p>
// // //                 {/* Action Button */}
// // //                 {/* <button
// // //                   className="flex items-center justify-center bg-gray-900 text-white text-xs md:text-sm py-2 px-4
// // //                         hover:bg-transparent hover:text-gray-900 border border-gray-900 transition-all duration-200 w-full"
// // //                   onClick={() =>
// // //                     navigate(
// // //                       `/products/${encodeURIComponent(product.category)}`
// // //                     )
// // //                   }
// // //                 >
// // //                   Shop Now
// // //                   <ArrowRight className="ml-1" size={16} />
// // //                 </button> */}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ))}

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axiosInstance from "../../api/axiosInstance";

// function CategoryProducts() {
//   const [allcategory, setAllCategory] = useState([]);
//   const [visibleCount, setVisibleCount] = useState(4);

//   // useEffect(() => {
//   //   const fetchProducts = async () => {
//   //     try {
//   //       const res = await axiosInstance.get("/products/all");
//   //       setAllCategory(Array.isArray(res.data) ? res.data : []);
//   //     } catch (error) {
//   //       console.log("Fetch error:", error);
//   //     }
//   //   };

//   //   fetchProducts();
//   // }, []);

//   useEffect(() => {
//     const updateCount = () => {
//       if (window.innerWidth >= 1024) setVisibleCount(8);
//       else if (window.innerWidth >= 640) setVisibleCount(9);
//       else setVisibleCount(9);
//     };

//     updateCount();
//     window.addEventListener("resize", updateCount);

//     return () => window.removeEventListener("resize", updateCount);
//   }, []);

//   const groupedProducts = allcategory.reduce((acc, product) => {
//     if (!acc[product.category]) acc[product.category] = [];
//     acc[product.category].push(product);
//     return acc;
//   }, {});

//   return (
//     <div>
//       <div
//         className="grid 
//         xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 
//         gap-2 md:gap-5 lg:gap-4 grid-flow-row
//         place-items-center lg:px-20 md:px-[60px] px-4 py-[23px]"
//       >
//         {Object.entries(groupedProducts)
//           .slice(0, visibleCount)
//           .map(([category, items]) => (
//             <div
//               key={category}
//               className="bg-gradient-to-b shadow-sm rounded-lg bg-white py-2 px-3 w-full"
//             >
//               <div className="flex items-center justify-between">
//                 <h2 className="md:text-2xl text-[20px] py-[9px] font-light font-marcellus text-[#1800AC]">
//                   {category}
//                 </h2>

//                 <Link
//                   to={`/products/${encodeURIComponent(category)}`}
//                   className="underline text-[#2C87E2] hover:text-blue-950 py-2 text-sm"
//                 >
//                   view all
//                 </Link>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 {items.slice(0, 4).map((p, index) => (
//                   <Link
//                     key={`${p.id || p.uuid || p.SKU || p.title}-${index}`}
//                     to={`/product/${p._id}`}
//                     className="cursor-pointer flex flex-col items-center transition-all duration-300 hover:shadow-sm"
//                   >
//                     <div className="flex flex-col w-full h-full overflow-hidden">
//                       <div className="relative w-full aspect-square rounded-md overflow-hidden">
//                         <img
//                           className="w-full h-full bg-white object-contain hover:scale-105 transition-transform duration-300"
//                           src={
//                             p?.variants?.[0]?.variantImage?.[0] ||
//                             p?.images?.[0] ||
//                             "/fallback.png"
//                           }
//                           alt={p.productTittle || p.category || "Product"}
//                           loading="lazy"
//                         />

//                         {typeof p?.reviews?.rating?.average === "number" && (
//                           <span className="absolute top-1 right-1 bg-yellow-400 text-gray-800 text-[10px] px-2 py-0.5 rounded-full shadow">
//                             {p.rating.average.toFixed(1)} ★
//                           </span>
//                         )}
//                       </div>

//                       <h3 className="text-xs py-2 bg-transparent line-clamp-1 h-6">
//                         {p.productTittle}
//                       </h3>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }

// export default CategoryProducts;
