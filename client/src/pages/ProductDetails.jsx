// import React from "react";
// import product from "../assets/ProductDetails1.jpg";
// import Button from "../components/Button";
// import { useState } from "react";
// import { ShoppingCart, Truck } from "lucide-react";
// import Ratings from "../components/Ratings";
// import Reviews from "../components/Reviews";
// import CustomerReview from "../components/CustomerReview";
// import FilterCard from "../components/FilterCard";
// import art1 from "../assets/Art1.webp";
// import art2 from "../assets/Art2.png";
// import art3 from "../assets/Art3.jpg";
// import art4 from "../assets/Art4.webp";
// import policy from "../assets/Return.png";
// import Navbar from "../components/Navbar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import Footer from "../sections/Footer";
// import ProductQuickView from "../components/ProductQuickView";

// const arts = [
//   {
//     title: "Lord Krishna Hindu Deity Metal Wall Art",
//     price: "₹4,989",
//     discount: "68% off",
//     img: art1,
//     category: "lordkrishna",
//     date: "2024-06-16",
//     rating: 4.5,
//   },
//   {
//     title: "Lord Ganesh Hindu Deity Metal Wall Art",
//     price: "₹5,919",
//     discount: "68% off",
//     img: art2,
//     category: "lordganesha",
//     date: "2024-06-05",
//     rating: 5,
//   },
//   {
//     title: "Lord Shiva Hindu Deity Metal Wall Art",
//     price: "₹3,969",
//     discount: "68% off",
//     img: art3,
//     category: "lordshiva",
//     date: "2024-06-18",
//     rating: 4.7,
//   },
//   {
//     title: "Lord Hanuman Hindu Deity Metal Wall Art",
//     price: "₹8,999",
//     discount: "68% off",
//     img: art4,
//     category: "lordhanuman",
//     date: "2024-06-15",
//     rating: 4.8,
//   },
//   {
//     title: "Lord Krishna Hindu Deity Metal Wall Art",
//     price: "₹4,989",
//     discount: "68% off",
//     img: art1,
//     category: "lordkrishna",
//     date: "2024-06-16",
//     rating: 4.5,
//   },
// ];

// function ProductDetails() {
//   const [selected, setSelected] = useState(false);

//   return (
//     <>
//       <Navbar></Navbar>
//       <Breadcrumbs></Breadcrumbs>
//       <section className="lg:px-20 md:px-[60px] px-4">
//         <div className="flex justify-between">
//           <div className="">
//             <div className="flex flex-col xl:gap-4 gap-2">
//               <img
//                 className="xl:w-[200px] xl:h-[200px] w-[170px] h-[170px] rounded-sm"
//                 src={product}
//                 alt=""
//               />
//               <img
//                 className="xl:w-[200px] xl:h-[200px] w-[170px] h-[170px] rounded-sm"
//                 src={product}
//                 alt=""
//               />
//               <img
//                 className="xl:w-[200px] xl:h-[200px] w-[170px] h-[170px] rounded-sm"
//                 src={product}
//                 alt=""
//               />
//               <img
//                 className="xl:w-[200px] xl:h-[200px] w-[170px] h-[170px] rounded-sm"
//                 src={product}
//                 alt=""
//               />
//             </div>
//           </div>
//           <div className="relative ">
//             <img
//               className="xl:w-[600px] xl:h-[600px] min-w-[460px] h-[460px]"
//               src={product}
//               alt=""
//             />
//             <div className="absolute top-4 right-4 bg-white w-9 h-9 flex justify-center items-center p-1 rounded-full">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 fill="currentColor"
//                 className="bi bi-heart"
//                 viewBox="0 0 16 16"
//               >
//                 <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
//               </svg>
//             </div>
//             <div className="absolute top-16 right-4 bg-white w-9 h-9 flex justify-center items-center p-1  rounded-full">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 shapeRendering="geometricPrecision"
//                 textRendering="geometricPrecision"
//                 imageRendering="optimizeQuality"
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 viewBox="0 0 500 511.79"
//                 className="w-4"
//               >
//                 <path
//                   fillRule="nonzero"
//                   d="m269.99 365.32 16.43-107.39c-47.97 4.32-101.98 15.61-147.47 47.71C89.7 340.4 49.89 400.13 37.64 502.98c-.64 5.46-5.62 9.38-11.09 8.74-4.2-.5-7.48-3.55-8.49-7.42-10.98-32.88-16.63-63.92-17.81-93-3.28-79.5 26.44-144.41 70.29-193.89 43.54-49.13 101.12-83 154.02-100.77 21.76-7.31 42.82-11.95 61.87-13.82l-16.4-91.11c-.97-5.4 2.64-10.59 8.05-11.55 2.99-.54 5.91.33 8.08 2.13l210.22 173.9c4.24 3.51 4.84 9.81 1.34 14.05l-1.15 1.17-210.18 183.11c-4.16 3.62-10.48 3.18-14.1-.97a9.937 9.937 0 0 1-2.3-8.23zm38.07-116.86-14.25 93.1L474.6 184.07 294.45 35.01l13.7 76.58c.21 5.5-4.08 10.14-9.57 10.35-20.04.82-43.33 5.38-67.71 13.59-49.98 16.79-104.35 48.75-145.41 95.07-40.73 45.96-68.33 106.22-65.3 179.92.59 14.3 2.33 29.15 5.35 44.5 18.32-82.22 56.38-133.53 101.96-165.7 53.19-37.54 116.13-48.57 169.79-52.27l2.41.06c5.44.81 9.2 5.91 8.39 11.35z"
//                 />
//               </svg>
//             </div>
//           </div>
//           <div className="w-[597px]">
//             {/* Title */}
//             <h1 className="lg:text-[30px]">
//               Adiyogi Shiva Metal Wall Art | Sculpture For Home Living Room |
//               Aesthetic Classic Stylish Hanging Decoration
//             </h1>

//             {/* Ratings */}
//             <div className="border border-b-[#C7C7C7] border-t-0 border-l-0 border-r-0 pb-2 flex">
//               <span>3.8&ensp;</span>
//               <Ratings />
//               <span className="text-[#828282]">
//                 &ensp;&#124;&ensp;286 Ratings{" "}
//               </span>
//             </div>

//             {/* Amazon Price and product details */}
//             <div className="border border-b-[#C7C7C7] border-t-0 border-l-0 border-r-0 py-2 ">
//               <h1 className="text-[#AA2F1F] text-[14px] font-medium">
//                 <span>₹2,500</span>
//                 Amazon Price{" "}
//               </h1>
//               <p className="text-[14px] text-[#6C6B6B]">
//                 Product Dimensions -{" "}
//                 <span className="text-[#171515]">60L x 60W CM</span>
//               </p>
//               <p className="text-[14px] text-[#6C6B6B]">
//                 Item Weight - <span className="text-[#171515]">300 Grams</span>
//               </p>
//               <p className="text-[14px] text-[#6C6B6B]">
//                 Type - <span className="text-[#171515]">Unframed</span>
//               </p>
//             </div>

//             {/* Color */}
//             <div>
//               <p>Color</p>
//               <div className="w-2 p-2 rounded-full bg-black"></div>
//             </div>

//             {/* Quantity */}
//             <div className="border border-b-[#C7C7C7] border-t-0 border-l-0 border-r-0 py-2">
//               Quantity
//               <div className="flex gap-2 items-center">
//                 <span className="text-xl">-</span>
//                 <span>0</span>
//                 <span className="text-xl">+</span>
//               </div>
//             </div>

//             {/* Availablility */}
//             <div className="border border-b-[#C7C7C7] border-t-0 border-l-0 border-r-0 py-2 flex flex-col gap-2">
//               <h1 className="text-[#0A8E45] text-[14px] font-medium">
//                 Currently Available{" "}
//                 <span className="text-[#AA2F1F]">( Only 3 Left )</span>
//               </h1>
//               <div className="flex gap-2">
//                 <div className="relative border w-max p-1 group">
//                   <img
//                     className="w-[100px]"
//                     src={art3}
//                     alt="Lord shiva image"
//                   />
//                   <div className="pl-2">
//                     <h1>₹2,030</h1>
//                     <p className="text-[14px] line-through text-[#A2A2A2]">
//                       ₹5,999
//                     </p>
//                   </div>
//                   <div className="absolute z-20 group-hover:block hidden">
//                     <ProductQuickView
//                       dimensions="60L x 60W CM"
//                       weight="300"
//                       price="₹2,500"
//                     />
//                   </div>
//                 </div>
//                 <div className="relative border w-max p-1 group">
//                   <img
//                     className="w-[100px]"
//                     src={art3}
//                     alt="Lord shiva image"
//                   />
//                   <div className="pl-2">
//                     <h1>₹2,800</h1>
//                     <p className="text-[14px] line-through text-[#A2A2A2]">
//                       ₹5,999
//                     </p>
//                   </div>
//                   <div className="absolute z-20 group-hover:block hidden">
//                     <ProductQuickView
//                       dimensions="75L x 75W CM"
//                       weight="400"
//                       price="₹3,100"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <h1 className="text-[#0A8E45] text-[14px]">
//                 inclusive of all taxes
//               </h1>
//             </div>

//             {/* Cart and Buy Now */}
//             <div className="border border-b-[#C7C7C7] border-t-0 border-l-0 border-r-0 flex gap-2 justify-start py-6 ">
//               <Button
//                 className="lg:w-[200px] py-2 px-[10px] text-[15px] flex justify-center"
//                 icon={false}
//               >
//                 Add to Cart
//               </Button>
//               <Button
//                 className="lg:w-[200px] text-[#E2B000] flex justify-center rounded-[5px] "
//                 cart={true}
//               >
//                 Buy now
//               </Button>
//             </div>

//             {/* Delivery Options */}
//             <div className="border border-b-[#C7C7C7] border-t-0 border-l-0 border-r-0 py-[10px]">
//               <div className="flex flex-col gap-4 pb-2">
//                 <div className="flex gap-4 ">
//                   <h1 className="text-[18px]">Delivery Options</h1>
//                   <span>
//                     <Truck strokeWidth={2} />
//                   </span>
//                 </div>
//                 <div className="lg:w-[319px] border border-[#828282] py-[8px] px-[15px] rounded-[4px] flex justify-between">
//                   <input
//                     className="outline-0 font-extralight text-black text-[16px]"
//                     type="text"
//                     placeholder="Enter Pin Code"
//                   />
//                   <span className="text-[#D6AE1F]">Check</span>
//                 </div>
//                 <p className="text-[14px]">
//                   Please enter PIN code to check delivery time & Pay on Delivery
//                   Availability
//                 </p>
//               </div>
//               <div className="text-[15px] text-[#171515]">
//                 <p>100% Original Products</p>
//                 <p>Pay on delivery might be available</p>
//                 <p>Easy 14 days returns and exchanges</p>
//               </div>
//             </div>

//             {/* Specifications */}
//             <div className="border border-b-[#C7C7C7] border-t-0 border-l-0 border-r-0 flex flex-col gap-4 py-2">
//               <h1 className="underline text-[18px]">Specifications</h1>
//               <p>
//                 Product Description: (Size: 60L x 60W cm) (Adiyogi Shiv Ji 2
//                 Feet)
//               </p>

//               <div className=" text-[14px]">
//                 <p>
//                   <span className="text-[#6C6B6B]">Product Dimensions</span> -
//                   60L x 60W Centimeters
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Item Weight</span> - 300
//                   Grams
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Orientation</span> -
//                   Landscape
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Shape</span> - Round
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Theme</span> - Religious
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">
//                     Recommended Uses for Product
//                   </span>{" "}
//                   - Living Room
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Material</span> - Metal
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Frame Type</span> - Unframed
//                 </p>
//               </div>

//               <p>
//                 Product Description: (Size: 75L x 75W cm) (Adiyogi Shiv Ji 2
//                 Feet)
//               </p>

//               <div className=" text-[14px]">
//                 <p>
//                   <span className="text-[#6C6B6B]">Product Dimensions</span> -
//                   60L x 60W Centimeters
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Item Weight</span> - 300
//                   Grams
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Orientation</span> -
//                   Landscape
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Shape</span> - Round
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Theme</span> - Religious
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">
//                     Recommended Uses for Product
//                   </span>{" "}
//                   - Living Room
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Material</span> - Metal
//                 </p>
//                 <p>
//                   <span className="text-[#6C6B6B]">Frame Type</span> - Unframed
//                 </p>
//               </div>
//             </div>

//             {/* About Item */}
//             <div className="border border-b-[#C7C7C7] border-t-0 border-l-0 border-r-0 flex flex-col gap-4 py-2 text-[18px ]">
//               <h1 className="underline">About this item</h1>
//               <p className="text-[#6C6B6B] text-[12px]">
//                 Metal Sculpture Wall Art exemplifies craftsmanship at its
//                 finest. Each piece is meticulously crafted from high-quality
//                 metal, ensuring durability and longevity. The intricate
//                 detailing and artistic contours breathe life into the design,
//                 creating a captivating focal point for any room.
//               </p>
//               <p className="text-[#6C6B6B] text-[12px]">
//                 Metal Sculpture Wall Art is its versatility in placement.
//                 Designed for wall mounting, it effortlessly enhances the
//                 ambiance of any space. Whether adorning a prominent wall in the
//                 living room, adding flair to a bedroom, providing a focal point
//                 in a kitchen, or lending sophistication to an office
//                 environment.
//               </p>
//               <p className="text-[#6C6B6B] text-[12px]">
//                 Metal Sculpture Wall Art is crafted with durability in mind. The
//                 metal construction ensures resilience against wear and tear,
//                 making it suitable for long-term display without compromising on
//                 quality. The black finish not only enhances its visual appeal
//                 but also contributes to its resistance to fading
//               </p>
//               <p className="text-[#6C6B6B] text-[12px]">
//                 Metal Sculpture Wall Art excels in this regard. Its abstract
//                 design encourages interpretation, allowing viewers to derive
//                 personal meaning from its form and contours.
//               </p>
//               <p className="text-[#6C6B6B] text-[12px]">
//                 Idea Gift - Metal wall art can be used as gifts for Birthday,
//                 Mother&#39;s Day, Father&#39;s Day,Thanksgiving, Christmas,
//                 Teacher&#39;s Day. The variety of wall art piece each one is
//                 lifelike and very unique, you can give it to your family,
//                 mother, father, sister, friend, teacher, they will love it.
//               </p>
//             </div>

//             {/* Return policy */}
//             <div className="border border-b-[#C7C7C7] border-t-0 border-l-0 border-r-0 py-2 ">
//               <div className="flex gap-4">
//                 <img className="w-12 h-12" src={policy} alt="" />
//                 <p className="w-[174px] text-[14px] text-[#6C6B6B]">
//                   <span className="text-[16px] text-black ">
//                     Return within 14days{" "}
//                   </span>
//                   of receiving your order
//                 </p>
//               </div>
//             </div>

//             {/* Reviews */}
//             <div className="pt-2">
//               <div className="flex gap-4">
//                 <h1>Customer Reviews</h1>
//                 <span>
//                   <svg
//                     width="18"
//                     height="22"
//                     viewBox="0 0 18 22"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M6.99031 16L6.01531 16.474C4.03531 17.022 3.04431 17.296 2.51031 16.719C1.97631 16.143 2.25231 15.099 2.80531 13.009L2.94731 12.469C3.10431 11.874 3.18331 11.578 3.14431 11.283C3.10431 10.989 2.95131 10.73 2.64531 10.213L2.36731 9.743C1.29031 7.922 0.752311 7.012 1.11031 6.287C1.47031 5.563 2.48931 5.504 4.52831 5.387L5.05531 5.357C5.63531 5.323 5.92431 5.307 6.17731 5.172C6.42931 5.037 6.61631 4.8 6.99031 4.324L7.33031 3.892C8.64631 2.219 9.30431 1.383 10.0603 1.512C10.8163 1.641 11.1703 2.649 11.8773 4.666L12.0603 5.188C12.2613 5.761 12.3623 6.048 12.5573 6.258C12.7533 6.47 13.0213 6.582 13.5583 6.805L14.0473 7.009C15.9373 7.795 16.8823 8.18899 16.9893 8.99199C17.0813 9.67799 16.5123 10.275 15.3493 11.282"
//                       stroke="black"
//                       strokeWidth="1.5"
//                     />
//                     <path
//                       d="M12.2522 10.189C11.2652 9.00896 10.7722 8.41896 10.2042 8.50896C9.63723 8.59996 9.37223 9.31196 8.84223 10.736L8.70423 11.104C8.55423 11.509 8.47823 11.711 8.33123 11.86C8.18523 12.009 7.98323 12.088 7.58123 12.246L7.21423 12.389C5.79723 12.944 5.08823 13.222 5.00723 13.789C4.92623 14.356 5.52723 14.838 6.72823 15.8L7.03823 16.05C7.38023 16.323 7.55123 16.46 7.64923 16.647C7.74923 16.834 7.76423 17.051 7.79523 17.484L7.82423 17.878C7.93423 19.401 7.99023 20.163 8.50723 20.423C9.02423 20.683 9.66123 20.268 10.9342 19.44L11.2632 19.225C11.6252 18.99 11.8062 18.872 12.0132 18.838C12.2212 18.805 12.4332 18.86 12.8542 18.97L13.2392 19.07C14.7242 19.456 15.4672 19.65 15.8682 19.243C16.2692 18.836 16.0612 18.099 15.6472 16.623L15.5392 16.243C15.4222 15.823 15.3632 15.613 15.3922 15.406C15.4222 15.198 15.5372 15.016 15.7662 14.65L15.9762 14.318C16.7832 13.033 17.1862 12.391 16.9162 11.88C16.6472 11.369 15.8832 11.327 14.3542 11.245L13.9582 11.223C13.5242 11.2 13.3062 11.188 13.1172 11.093C12.9272 10.998 12.7872 10.83 12.5072 10.494L12.2522 10.189Z"
//                       stroke="black"
//                       strokeWidth="1.5"
//                     />
//                   </svg>
//                 </span>
//               </div>

//               <div className="flex justify-between border border-b-[#C7C7C7] border-t-0 border-l-0 border-r-0 pt-4 pb-2">
//                 <div>
//                   <span className="flex text-xl">
//                     4.5&ensp;
//                     <Ratings />
//                   </span>
//                   <span className="text-[#6C6B6B] text-[12px]">
//                     519 Verified Buyers
//                   </span>
//                 </div>
//                 <Reviews />
//               </div>
//             </div>

//             {/* Customer Reviews */}
//             <CustomerReview />
//             <div className="border border-b-[#C7C7C7] border-t-0 border-l-0 border-r-0 pt-2">
//               <p className="underline text-[#D6AE1F] text-[14px]">
//                 View all 239 reviews
//               </p>
//               <div className="flex justify-between items-center py-4">
//                 <div className="flex flex-col justify-between">
//                   <p className="text-[15px] text-[#3D3D3D]">
//                     Share your Experience
//                   </p>
//                   <Ratings />
//                 </div>
//                 <div>
//                   <Button className="px-6 py-2">Submit Reviews</Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Similar Products */}
//         <div>
//           <h1 className="py-2">Similar Product</h1>
//           <div>
//             <FilterCard cardData={arts}></FilterCard>
//           </div>
//         </div>

//         {/* Recent Products */}
//         <div className=" pb-12">
//           <h1 className="py-2">Latest Product</h1>
//           <div>
//             <FilterCard cardData={arts}></FilterCard>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </>
//   );
// }

// export default ProductDetails;

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import products from "../data/products.json";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../sections/Footer";
import Ratings from "../components/Ratings";
import Reviews from "../components/Reviews";
import CustomerReview from "../components/CustomerReview";
import Card from "../components/Card";
import Button from "../components/Button";
import {
  Heart,
  Minus,
  Package,
  Package2,
  PackageOpen,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
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

function ProductDetails() {
  // const { uuid } = useParams();
  const { sku } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [mainImageIndex, setMainImageIndex] = React.useState(0);
  const [thumbsSwiper, setThumbsSwiper] = React.useState(null);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const { cartItems, totalItems } = useSelector((s) => s.cart);
  const { wishlistItems } = useSelector((s) => s.wishlist);

  // find product by uuid
  // const product = useMemo(() => products.find((p) => p.uuid === uuid), [uuid]);
  const product = useMemo(() => products.find((p) => p.sku === sku), [sku]);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  // const [inCart, setInCart] = useState(
  //   cartItems.some(
  //     (item) =>
  //       item.uuid === uuid && item.variantId === selectedVariant.variantId
  //   )
  const [inCart, setInCart] = useState(
    cartItems.some(
      (item) => item.sku === sku && item.variantId === selectedVariant.variantId
    )
  );
  if (!product) {
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
  const outOfStock = product.stockQuantity <= 0;

  // fallback similar products (same category)
  const similar = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.uuid !== product.uuid && p.category === product.category)
      .slice(0, 10);
  }, [product]);

  // Unique option lists
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const dimensions = [...new Set(product.variants.map((v) => v.dimension))];
  const types = [...new Set(product.variants.map((v) => v.type))];

  const avgRating =
    product?.reviews?.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  const handleBuyNow = (product) => {
    dispatch(buyNow(product)); // adds single item, sets buyNowMode
    navigate("/checkout/payment");
  };

  const handleVariantSelect = (optionKey, value) => {
    const matched = product.variants.find((v) => {
      return (
        (optionKey === "color" ? v.color === value : true) &&
        (optionKey === "dimension" ? v.dimension === value : true) &&
        (optionKey === "type" ? v.type === value : true)
      );
    });

    if (matched) {
      setSelectedVariant(matched);
      window.scrollTo(0, 0);
    } else {
      console.warn("No matching variant found");
    }
  };

  useEffect(() => {
    const isInWishlist = wishlistItems.some(
      (item) =>
        item.sku === product.sku && item.variantId === selectedVariant.variantId
    );
    setInWishlist(isInWishlist);
  }, [wishlistItems, product.sku, selectedVariant.variantId]);

  // useEffect(() => {
  //   const isInWishlist = wishlistItems.some(
  //     (item) =>
  //       item.uuid === product.uuid &&
  //       item.variantId === selectedVariant.variantId
  //   );
  //   setInWishlist(isInWishlist);
  // }, [wishlistItems, product.uuid, selectedVariant.variantId]);

  useEffect(() => {
    setInCart(
      cartItems.some(
        (item) =>
          item.sku === product.sku &&
          item.variantId === selectedVariant.variantId
      )
    );
  }, [cartItems, product.sku, selectedVariant.variantId]);
  // useEffect(() => {
  //   setInCart(
  //     cartItems.some(
  //       (item) =>
  //         item.uuid === product.uuid &&
  //         item.variantId === selectedVariant.variantId
  //     )
  //   );
  // }, [cartItems, product.uuid, selectedVariant.variantId]);

  useEffect(() => {
    const found = cartItems.find(
      (item) =>
        item.sku === product.sku && item.variantId === selectedVariant.variantId
    );
    setTotalCartItems(found ? found.quantity : 0);
  }, [cartItems, product.sku, selectedVariant.variantId]);
  // useEffect(() => {
  //   const found = cartItems.find(
  //     (item) =>
  //       item.uuid === product.uuid &&
  //       item.variantId === selectedVariant.variantId
  //   );
  //   setTotalCartItems(found ? found.quantity : 0);
  // }, [cartItems, product.uuid, selectedVariant.variantId]);

  return (
    <>
      <Navbar />
      <Breadcrumbs
        category={product.category}
        subcategory={product.subcategory}
        title={product.title}
      />
      <section className="lg:px-20 md:px-[60px] px-4 py-6 ">
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
                className="!w-full !h-auto md:!h-[460px]">
                {selectedVariant.images?.map((img, idx) => (
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
                      }}>
                      <div className="w-full h-full overflow-hidden rounded-md">
                        <img
                          src={
                            img.startsWith("/")
                              ? img
                              : `http://localhost:5000${img}`
                          }
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
                thumbs={{ swiper: thumbsSwiper }}
                spaceBetween={10}
                loop={false} // ✅ make sure this is false
                onSlideChange={(swiper) =>
                  setMainImageIndex(swiper.activeIndex)
                }
                initialSlide={mainImageIndex}
                className="xl:min-w-[600px] xl:h-[600px] md:!w-[500px] w-full">
                {selectedVariant.images?.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={
                        img.startsWith("/")
                          ? img
                          : `http://localhost:5000${img}`
                      }
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
                  const inWishlist = wishlistItems.some(
                    (i) =>
                      i.uuid === product.uuid &&
                      i.variantId === selectedVariant.variantId
                  );
                  if (inWishlist) {
                    dispatch(
                      removeFromWishlist({
                        uuid: product.uuid,
                        variantId: selectedVariant.variantId,
                      })
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
                        image: selectedVariant.images[0],
                        deliverBy: product.deliverBy,
                        selectedOptions: {
                          color: selectedVariant.color,
                          type: selectedVariant.type,
                          dimension: selectedVariant.dimension,
                        },
                      })
                    );
                  }
                }}>
                <Heart
                  className="w-8 h-8 p-1 cursor-pointer"
                  fill={
                    wishlistItems.some(
                      (i) =>
                        i.uuid === product.uuid &&
                        i.variantId === selectedVariant.variantId
                    )
                      ? "red"
                      : "white"
                  }
                  stroke={
                    wishlistItems.some(
                      (i) =>
                        i.uuid === product.uuid &&
                        i.variantId === selectedVariant.variantId
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
            {product?.reviews && (
              <div className="border-b border-gray-200 pb-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-semibold text-gray-900">
                    {avgRating ?? "—"}
                  </span>
                  <span className="text-gray-500 text-sm">/5</span>
                </div>

                <div className="flex flex-col gap-1">
                  <Ratings size={20} avgRating={avgRating} />{" "}
                  {/* Assuming your Ratings component accepts a size prop */}
                  <span className="text-sm text-gray-500">
                    {product.reviews?.length ?? 0}{" "}
                    {product.reviews?.length === 1 ? "Rating" : "Ratings"}
                  </span>
                </div>

                <div className="h-6 w-px bg-gray-300"></div>

                <button
                  className="text-sm font-medium text-[#D49A06] hover:text-[#B78605] transition-colors underline"
                  onClick={() =>
                    document.getElementById("reviews-section").scrollIntoView()
                  }>
                  See all reviews
                </button>
              </div>
            )}

            {/* Product Price & details */}
            <div className="py-2 border-b">
              <div className="text-neural-700 text-2xl font-medium">
                <span className="mr-2">
                  ₹
                  {selectedVariant.price -
                    (product.discountPercent / 100) * selectedVariant.price}
                </span>
                <span className="line-through text-[#787878] font-normal text-sm">
                  {selectedVariant.price ? `₹${selectedVariant.price}` : ""}
                </span>
                {product.discountPercent ? (
                  <span className="ml-2 text-base text-white px-2 py-1 rounded-md bg-green-700">
                    {product.discountPercent}% Off
                  </span>
                ) : null}
              </div>

              <p className="text-[14px] text-[#6C6B6B] mt-2">
                Product Dimensions -{" "}
                <span className="text-[#171515]">
                  {selectedVariant.dimension || "-"}
                </span>
              </p>
              <p className="text-[14px] text-[#6C6B6B]">
                Item Weight -{" "}
                <span className="text-[#171515] capitalize">
                  {product.weight || "-"}
                </span>
              </p>
              <p className="text-[14px] text-[#6C6B6B]">
                Type -{" "}
                <span className="text-[#171515] capitalize">
                  {selectedVariant.type || "-"}
                </span>
              </p>
              <p className="text-[14px] text-[#6C6B6B]">
                Color -{" "}
                <span className="text-[#171515] capitalize">
                  {selectedVariant.color || "-"}
                </span>
              </p>
            </div>

            {/* Color Options */}
            <div className="mt-5">
              <h3 className="font-medium">Color</h3>
              <div className="flex gap-2 mt-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`px-3 py-1 rounded-full border text-sm
            ${
              selectedVariant.color === color
                ? "border-2 border-gray-900 bg-gray-900 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }
          `}
                    onClick={() => handleVariantSelect("color", color)}>
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension Options */}
            <div className="mt-5">
              <h3 className="font-medium">Dimension</h3>
              <div className="flex gap-2 mt-2 flex-wrap">
                {dimensions.map((dimension) => (
                  <button
                    key={dimension}
                    className={`px-3 py-1 rounded-full border text-sm
            ${
              selectedVariant.dimension === dimension
                ? "border-2 border-gray-900 text-gray-900 font-medium"
                : "bg-gray-100 hover:bg-gray-200"
            }
          `}
                    onClick={() => handleVariantSelect("dimension", dimension)}>
                    {dimension}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Options */}
            <div className="mt-5">
              <h3 className="font-medium">Type</h3>
              <div className="flex gap-2 mt-2 flex-wrap">
                {types.map((t) => (
                  <button
                    key={t}
                    className={`px-3 py-1 rounded-full border text-sm
            ${
              selectedVariant.type === t
                ? "border-2 border-gray-900 bg-gray-900 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }
          `}
                    onClick={() => handleVariantSelect("type", t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              {selectedVariant.stockQuantity <= 0 ? (
                <button
                  disabled
                  className="px-6 py-2 bg-gray-300 text-gray-600 rounded-full cursor-not-allowed">
                  Out of Stock
                </button>
              ) : inCart ? (
                <div className="flex items-center gap-3 px-2 border-[#D49A06] ring-2 ring-[#D49A06]/50 shadow-md p-1 rounded-full transition-all ease-in">
                  {/* ➖ Decrease */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        decreaseQty({
                          uuid: product.uuid,
                          variantId: selectedVariant.variantId,
                        })
                      );
                    }}
                    className="w-6 h-6 flex items-center justify-center"
                    disabled={isLoading}>
                    {cartItems.find(
                      (i) =>
                        i.uuid === product.uuid &&
                        i.variantId === selectedVariant.variantId
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
                        i.variantId === selectedVariant.variantId
                    )?.quantity || 0}
                  </span>

                  {/* ➕ Increase */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        increaseQty({
                          uuid: product.uuid,
                          variantId: selectedVariant.variantId,
                        })
                      );
                    }}
                    className="w-6 h-6 flex items-center justify-center"
                    disabled={isLoading}>
                    <Plus size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      dispatch(
                        addToCart({
                          uuid: product.uuid,
                          variantId: selectedVariant.variantId,
                          title: product.title,
                          basePrice: selectedVariant.price,
                          stockQuantity: selectedVariant.stockQuantity,
                          discountPercent: product.discountPercent,
                          image: selectedVariant.images[0],
                          deliverBy: product.deliverBy,
                          selectedOptions: {
                            color: selectedVariant.color,
                            type: selectedVariant.type,
                            dimension: selectedVariant.dimension,
                          },
                        })
                      );
                      setIsLoading(false);
                    }, 200);
                  }}
                  disabled={isLoading}
                  className="px-6 py-2 bg-[#ebb100] hover:bg-[#d9a300] text-black rounded-full">
                  {isLoading ? "Adding..." : "Add to Cart"}
                </button>
              )}

              {/* 🛒 Buy Now */}
              <button
                className="border border-gray-700 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50"
                onClick={() => handleBuyNow(product, selectedVariant)}
                disabled={selectedVariant.stockQuantity <= 0 || isLoading}>
                Buy now
              </button>
            </div>

            {/* Delivery */}
            <div className="py-5 border-b border-gray-200">
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
                      stroke="currentColor">
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

              {/* Delivery estimate could appear here after checking */}
              <div className="mt-3 p-3 bg-gradient-to-r from-green-100 to-transparent text-sm text-green-800 rounded-md">
                Delivery expected in {product.deliverBy} Days
              </div>
            </div>

            {/* Specifications */}
            <div className="py-4 border-b">
              <h3 className="underline">Specifications</h3>
              <div className="text-[14px] mt-2">
                <p className="capitalize">
                  <span className="text-[#6C6B6B]">SKU</span> -{" "}
                  {product.SKU || "-"}
                </p>
                <p className="capitalize">
                  <span className="text-[#6C6B6B]">Material</span> -{" "}
                  {product.materialType[0]}
                </p>
                <p className="capitalize">
                  <span className="text-[#6C6B6B]">Return Policy</span> -{" "}
                  {product.returnPolicy || "-"}
                </p>
                <p
                  className={`font-medium ${
                    product.stockQuantity > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                  <span className="text-[#6C6B6B]">Stock -</span>{" "}
                  {product.stockQuantity
                    ? `${product.stockQuantity} available`
                    : "Out of Stock"}
                </p>
              </div>
            </div>

            {/* About */}
            <div className="py-4">
              <h3 className="underline">About this item</h3>

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
              <h3 className="text-lg">Customer Reviews</h3>
              <div className="mt-2">
                <div className="mt-4">
                  <Reviews reviews={product?.reviews} avgRating={avgRating} />
                </div>
                <CustomerReview reviews={product?.reviews} id={sku} />
              </div>
            </div>
          </div>
        </div>

        {/* Similar & Latest */}
        {similar.length > 0 && (
          <div className="mt-8">
            <h2 className="py-2">Similar Products</h2>
            <Card cardData={similar} />
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default ProductDetails;
