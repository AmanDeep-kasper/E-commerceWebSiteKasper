// import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import hero1 from "../assets/hero1.png";
import hero3 from "../assets/hero3.png";
import hero4 from "../assets/hero4.png";
import hero2 from "../assets/heroIcon2.png";
import Offer from "../components/Offer";
import { motion, useAnimation } from "framer-motion";
import products from "../data/products.json";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import { useEffect } from "react";

// const heros = [
//   {
//     id: 1,
//     title: "Bismillah Wall Art",
//     subtitle: "Grace Your Space with the Beauty of Bismillah.",
//     img: hero1,
//     size: "lg:h-[600px] md:h-[432px] md:object-top object-top-left w-full h-[300px]",
//     align: "md:top-[20%] md:left-[55%] top-[35%] left-[20%]",
//     btn: "md:left-[55%] right-4 top-[85%]",
//   },
//   {
//     id: 2,
//     title: "Crafted in Metal. Designed for Your Space.",
//     subtitle:
//       "Explore premium laser-cut wall art that brings life to your walls.",
//     img: hero2,
//     color: "bg-[#F0E7E0] md:justify-end ",
//     size: "lg:w-[547px] lg:h-[547px] md:w-[388px] md:h-[388px] w-[167px] h-[167px] mt-4 mr-12",
//     align: "md:top-12 top-[58%] left-12",
//     btn: "md:left-12 right-4 top-[85%]",
//   },
//   {
//     id: 3,
//     title: "Art rooms Adiyogi Shiva Metal Wall Art",
//     subtitle: "Transform walls into Sanctuaries of Peace & Power.",
//     img: hero3,
//     color: "bg-[#C2E0E4] md:justify-start",
//     size: "lg:w-[511px] lg:h-[499px] md:w-[363px] md:h-[355px] w-[277px] h-[271px] lg:mt-28 md:mt-20 md:ml-8 mt-8  bg-[#FEDAB8B2]/70 rounded-t-full",
//     align: "md:top-[20%] md:left-[50%] left-12 top-2",
//     btn: "right-4 top-[85%]",
//   },
//   {
//     id: 4,
//     title: "Elevate Your Wall with Graceful Motion ",
//     subtitle:
//       "Explore our elegant 3-Bird Metal Wall Art handcrafted for timeless beauty.",
//     img: hero4,
//     size: "lg:h-[600px] md:h-[516px] w-full h-[298px] object-[50%] md:object-left-top",
//     align: "md:top-[20%] md:left-[50%] left-12 top-2",
//     btn: "right-4 top-[85%]",
//   },
// ];

function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const [imageIndex, setImageIndex] = useState(0);

  const selectedProducts = products.filter(
    (item, index, self) =>
      index === self.findIndex((obj) => obj.category === item.category)
  );

  // useEffect(() => {
  //   let index = 0;
  //   const slideInterval = setInterval(() => {
  //     controls.start({
  //       x: `-${index * 100}%`,
  //       transition: { duration: 0.3, ease: "easeInOut" },
  //     });

  //     index = (index + 1) % heros.length;
  //   }, 2000);
  //   return () => clearInterval(slideInterval);
  // }, [controls, heros.length]);

  // Animate on imageIndex change
  useEffect(() => {
    controls.start({
      x: `-${imageIndex * 100}%`,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  }, [imageIndex, controls]);

  // Auto-slide
  useEffect(() => {
    if (isHovered || selectedProducts.length === 0) return;

    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % selectedProducts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isHovered, selectedProducts.length, imageIndex]);

  // Manual navigation
  const handlePrev = () => {
    setImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedProducts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % selectedProducts.length);
  };

  // md:mt-[74px] mt-[52px]

  return (
    // <section className="w-full  overflow-hidden">
    //   <motion.div className="flex" animate={controls}>
    //     {heros.map((hero) => (
    //       <div
    //         key={hero.id}
    //         className={twMerge(
    //           "relative min-w-full lg:h-[600px] md:h-[432px] h-[300px] flex justify-center ",
    //           hero.color[0]
    //         )}
    //       >
    //         <img
    //           className={twMerge("object-cover", hero.size)}
    //           src={hero.img}
    //           alt={hero.title}
    //         />
    //         <div className=" ">
    //           <div
    //             className={twMerge(
    //               "absolute lg:w-[626px] md:w-[445px] w-[300px] lg:leading-none md:leading-10  leading-7",
    //               hero.align
    //             )}
    //           >
    //             <h1 className="lg:text-[40px] md:text-[32px] text-[25px] text-[#393B36] drop-shadow-lg font-bold font-nova">
    //               {hero.title}
    //             </h1>
    //             <p className="lg:text-[20px] md:text-[15px] text-[10px] text-[#8C5310] drop-shadow-lg leading-4">
    //               {hero.subtitle}
    //             </p>
    //           </div>

    //         </div>
    //       </div>
    //     ))}
    //   </motion.div>
    // </section>

    // <section className="w-full mx-auto py-24 bg-gray-50">
    //   <div className=" mx-auto flex max-md:flex-col gap-8 justify-center items-center">
    //     <div className="lg:min-h-[500px] h-[300px] flex items-center justify-center rounded-lg border overflow-hidden bg-[#FFE0C3] shadow-lg">
    //       <div className="flex flex-col gap-4 lg:mx-8 mx-3">
    //         <h1 className="lg:text-[48px] md:text-[32px] text-[24px] w-[400px] font-sans hero-title tracking-tight leading-[1] font-medium">
    //           Modern Metal Art Designs
    //         </h1>
    //         <p className="lg:text-lg text-md font leading-relaxed text-gray-800 w-[400px]">
    //           Shop our exquisite collection of handcrafted metal designs.
    //         </p>
    //         <button className="w-max px-8 py-3 mt-4 text-lg bg-gray-900 text-white rounded-full flex items-center gap-2 transition-all hover:gap-4 hover:shadow-lg">
    //           Shop Collection <span className="text-sm">→</span>{" "}
    //         </button>
    //       </div>
    //       <div className="w-full max-md:hidden !h-[500px] bg-white flex items-center">
    //         <img
    //           className="w-full h-full object-cover"
    //           src="/tree1.jpg"
    //           alt=""
    //         />
    //       </div>
    //     </div>
    //     <div className="relative group w-[420px] overflow-hidden shadow-lg h-[500px] rounded-lg ">
    //       <motion.div animate={controls} className="flex h-full w-full">
    //         {selectedProducts.map((product) => (
    //           <div
    //             className="relative min-w-full"
    //             onMouseEnter={() => setIsHovered(true)}
    //             onMouseLeave={() => setIsHovered(false)}
    //             key={product.uuid}
    //           >
    //             <img
    //               className="h-full w-full object-cover mx-auto flex-shrink-0 "
    //               src={product.image[1]}
    //               alt=""
    //             />
    //             <Link
    //               className="absolute text-xl font-medium bottom-4 left-4 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-lg flex items-center gap-2"
    //               to={`/products/${encodeURIComponent(product.category)}`}
    //             >
    //               {product.category} <ChevronRight></ChevronRight>
    //             </Link>
    //           </div>
    //         ))}
    //       </motion.div>
    //       <button
    //         className="absolute group-hover:block hidden top-[40%] left-4"
    //         onClick={handlePrev}
    //       >
    //         <ChevronLeft size={80} strokeWidth={1} />
    //       </button>
    //       <button
    //         className="absolute group-hover:block hidden top-[40%] right-4"
    //         onClick={handleNext}
    //       >
    //         <ChevronRight size={80} strokeWidth={1} />
    //       </button>
    //       <div></div>
    //     </div>
    //   </div>
    // </section>
    <section className="w-full mx-auto sm:py-10 bg-gray-50 pb-1">
      <div className="mx-auto w-full flex flex-col-reverse md:flex-row md:gap-8 justify-center items-center px-0 sm:px-4 md:px-16 lg:px-20">
        {/* Left Section */}
        <div className="w-full min-h-max max-md:py-4 md:min-h-[500px] flex flex-col md:flex-row items-center justify-center lg:justify-between sm:rounded-lg border overflow-hidden bg-[#FFE0C3] shadow-sm">
          {/* Text Block */}
          <div className="flex flex-col gap-4 px-4 md:px-6 lg:px-8 text-center md:text-left">
            <h1 className="text-[24px] sm:text-3xl md:text-[2.5rem] lg:text-[3rem] font-sans hero-title tracking-tight font-medium lg:w-[400px] !leading-[0.9]">
              Modern Metal Art Designs
            </h1>
            <p className="text-[14px] sm:text-[18px] text-gray-800 lg:w-[400px]">
              Shop our exquisite collection of handcrafted metal designs.
            </p>
            <Link
              className="w-max px-4 sm:px-8 py-2 sm:py-3 mt-4 text-[14px] sm:text-lg bg-gray-900 text-white rounded-full flex items-center gap-2 transition-all hover:gap-4 hover:shadow-lg mx-auto md:mx-0"
              to={`products`}
            >
              Shop Collection <span className="text-sm">→</span>
            </Link>
          </div>

          {/* Image Block */}
          <div className="w-full max-lg:hidden lg:w-1/2 h-[250px] sm:h-[350px] md:h-[500px] bg-white flex items-center">
            <img
              className="w-full h-full object-cover"
              src="/tree1.jpg"
              alt="Metal Art"
            />
          </div>
        </div>

        {/* Right Section - Carousel */}
        {/* <div className="relative group w-full sm:min-w-[350px] lg:!w-[400px] xl:min-w-[420px] overflow-hidden shadow-sm h-[300px] sm:h-[400px] md:h-[500px] sm:rounded-lg max-sm:mx-8 ">
          <motion.div animate={controls} className="flex h-full w-full">
            {selectedProducts.map((product) => (
              <Link
                className="relative min-w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                key={product.uuid}
                to={`/products/${encodeURIComponent(product.category)}`}
              >
                <img
                  className="h-full w-full object-cover mx-auto flex-shrink-0"
                  src={product.image[1]}
                  alt={product.category}
                />
                <span className="absolute text-sm sm:text-lg font-medium bottom-4 left-4 bg-white px-4 sm:px-4 py-2 sm:py-2 rounded-full border border-gray-200 shadow-lg flex items-center gap-2">
                  {product.category}{" "}
                  
                </span>
              </Link>
            ))}
          </motion.div>

          <button
            className="absolute group-hover:block max-lg:block hidden top-[40%] left-4"
            onClick={handlePrev}
            onTouchEndCapture={handlePrev}
          >
            <ChevronLeft
              size={40}
              className="sm:size-[60px] md:size-[80px]"
              strokeWidth={1}
            />
          </button>
          <button
            className="absolute group-hover:block max-lg:block hidden top-[40%] right-4"
            onClick={handleNext}
          >
            <ChevronRight
              size={40}
              className="sm:size-[60px] md:size-[80px]"
              strokeWidth={1}
            />
          </button>
        </div> */}
        <div className="relative group w-full sm:min-w-[350px] lg:!w-[400px] xl:min-w-[420px] overflow-hidden shadow-sm h-[300px] sm:h-[400px] md:h-[500px] sm:rounded-lg max-sm:mx-8">
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            loop={true}
            navigation={{
              nextEl: ".swiper-next",
              prevEl: ".swiper-prev",
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            touchRatio={1} // swipe sensitivity (default 1)
            threshold={10} // min px to trigger swipe
            longSwipes={true} // enable smooth long swipe
            longSwipesRatio={0.5} // when swipe covers 50% slide → change
            longSwipesMs={300} // ms threshold for long swipe
            className="h-full w-full"
          >
            {selectedProducts.map((product) => (
              <SwiperSlide key={product.uuid}>
                <Link
                  to={`/products/${encodeURIComponent(product.category)}`}
                  className="relative w-full h-full block"
                >
                  <img
                    className="h-full w-full object-cover mx-auto flex-shrink-0"
                    src={product.image}
                    alt={product.category}
                  />
                  <span className="absolute text-sm sm:text-lg font-medium bottom-4 left-4 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-lg flex items-center gap-2">
                    {product.category}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons */}
          <button className="swiper-prev absolute group-hover:block max-lg:block hidden top-[40%] left-4 z-10">
            <ChevronLeft
              size={40}
              className="sm:size-[60px] md:size-[80px]"
              strokeWidth={1}
            />
          </button>
          <button className="swiper-next absolute group-hover:block max-lg:block hidden top-[40%] right-4 z-10">
            <ChevronRight
              size={40}
              className="sm:size-[60px] md:size-[80px]"
              strokeWidth={1}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;

// import { useState, useEffect } from 'react';
// import products from "../data/products.json"

// const Home = () => {
//   const [currentItem, setCurrentItem] = useState(0);

//   const items = [
//     {
//       image: "/human1.jpg",
//       title: "Geometric Deer Silhouette",
//       description: "Modern wall decor",
//       price: "₹89.99"
//     },
//     {
//       image: "/polygonAnimal1.jpg",
//       title: "Floral Pattern Screen",
//       description: "Room divider decorative panel",
//       price: "₹149.99"
//     },
//     {
//       image: "/name1.jpg",
//       title: "Custom Name Art",
//       description: "Personalized family name sign",
//       price: "₹119.99"
//     },
//     {
//       image: "/gratitude1.jpg",
//       title: "Animal Portrait",
//       description: "Detailed wildlife artwork",
//       price: "₹129.99"
//     }
//   ];

//   const selectedProducts = products.slice(0,12);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentItem(prev => (prev + 1) % selectedProducts.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [selectedProducts.length]);

//   return (
//     <section className="w-full mx-auto py-16 md:py-24 hero-gradient bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className=" mx-auto px-4">
//         <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
//           {/* Main Hero Card */}
//           <div className="relative w-full lg:w-2/3 min-h-[620px] flex flex-col lg:flex-row items-center justify-between bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
//             <div className="absolute top-4 right-4 flex gap-2">
//               <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">New</span>
//               <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm font-medium">Popular</span>
//             </div>

//             <div className="flex flex-col gap-6 items-start p-8 lg:p-12 lg:w-1/2">
//               <h1 className="text-6xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight hero-title tracking-tight">
//                 Transform Your Space with Elegant Laser Cut Metal Art
//               </h1>
//               <p className="text-lg text-gray-600 leading-relaxed hero-subtitle font-medium">
//                 Discover our exclusive collection of handcrafted metal designs that blend modern technology with artistic craftsmanship.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 mt-4 hero-button">
//                 <button className="px-8 py-3 text-lg bg-gray-900 text-white rounded-full flex items-center gap-2 transition-all hover:gap-4 hover:shadow-lg">
//                   Shop Collection <span className="text-sm">→</span>
//                 </button>
//                 <button className="px-8 py-3 text-lg border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50">
//                   View Gallery
//                 </button>
//               </div>

//               <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200 w-full">
//                 <div className="flex items-center gap-2">
//                   <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
//                     <span className="text-amber-600">🚚</span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">Free Shipping</p>
//                     <p className="text-xs text-gray-500">On orders over ₹1000</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                     <span className="text-blue-600">🛡️</span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">2-Year Warranty</p>
//                     <p className="text-xs text-gray-500">Quality guaranteed</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="lg:w-1./2 h-full flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-amber-100">
//               <div className="relative">
//                 <img
//                   className="w-full h-[400px] max-w-md object-contain rounded-lg shadow-md"
//                   src="/welcome4.jpg"
//                   alt="Elegant laser cut metal art decoration"
//                 />
//                 <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center">
//                   <img
//                     className="w-20 h-20 object-contain"
//                     src="/polygonAnimal2.jpg"
//                     alt="Sample art piece"
//                   />
//                 </div>
//                 <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center">
//                   <div className="text-center">
//                     <p className="text-2xl font-serif font-bold text-amber-600">30%</p>
//                     <p className="text-xs text-gray-600">OFF</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Gallery Slider */}
//           <div className="lg:w-1/3 !h-[620px] ">
//             <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
//               <div className="p-5 border-b border-gray-200">
//                 <h3 className="font-serif font-bold text-xl text-gray-900">Featured Collection</h3>
//                 <p className="text-sm text-gray-500">Handpicked designs for your home</p>
//               </div>

//               <div className="relative overflow-hidden">
//                 <div key={currentItem} className="card-hover flex flex-col animate-fadeIn">
//                   <div className="h-3/5 bg-gray-100 flex items-center justify-center">
//                     <img
//                       className="!h-[350px] w-full object-contain"
//                       src={selectedProducts[currentItem].image[0]}
//                       alt={selectedProducts[currentItem].title}
//                     />
//                   </div>
//                   <div className="h-3/5 p-4 flex flex-col justify-between">
//                     <div>
//                       <h4 className="font-medium text-gray-900">{selectedProducts[currentItem].title}</h4>
//                       <p className="text-sm text-gray-500 mt-1">{selectedProducts[currentItem].description}</p>
//                     </div>
//                     <div className="flex justify-between items-center mt-3">
//                       <span className="text-lg font-bold text-amber-600">₹{selectedProducts[currentItem].basePrice}</span>
//                       <button className="text-xs px-3 py-1 bg-gray-900 text-white rounded-full" onClick={() => Navigate()}>View</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 flex justify-center gap-2 border-t border-gray-200">
//                 {selectedProducts.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentItem(index)}
//                     className={`w-2 h-2 rounded-full ${index === currentItem ? 'w-5 bg-amber-400' : 'bg-gray-300'}`}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Feature Highlights */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
//           <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg">
//             <div className="w-14 h-14 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mb-4">
//               <span className="text-white text-2xl">🎨</span>
//             </div>
//             <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Custom Designs</h3>
//             <p className="text-gray-600">Commission unique pieces tailored to your specific style and space requirements.</p>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg">
//             <div className="w-14 h-14 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mb-4">
//               <span className="text-white text-2xl">🏆</span>
//             </div>
//             <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Premium Quality</h3>
//             <p className="text-gray-600">Crafted from high-grade stainless steel with precision laser cutting technology.</p>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg">
//             <div className="w-14 h-14 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mb-4">
//               <span className="text-white text-2xl">📦</span>
//             </div>
//             <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Fast Shipping</h3>
//             <p className="text-gray-600">Most orders are processed within 48 hours and delivered with care.</p>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .hero-gradient {
//           background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.8s ease-out forwards;
//         }
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </section>
//   );
// };

// export default Home;
