import design from "../../assets/Design.png";
import design2 from "../../assets/Design2.png";
import Title from "../Title";
import products from "../../data/products.json";
import banner from "../../data/banner.json";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAnimation, motion, easeInOut } from "framer-motion";
import { useNavigate } from "react-router";
import BannerVideo from "../../assets/TopBannerImg/BannerVideo.mp4";

function Design() {
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);
  const navigate = useNavigate();
  const product1 = banner[0];
  const product2 = banner[1];
  const product3 = banner[2];
  const controls = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  useEffect(() => {
    if (!isHovered) return;
    let index = 0;

    const interval = setInterval(() => {
      controls.start({
        x: `-${index * 100}%`,
        transition: { duration: 0.5, ease: "easeInOut" },
      });
      index = (index + 1) % product1.image.length;
    }, 1500);

    return () => clearInterval(interval);
  }, [controls, product1.image.length, isHovered]);

  useEffect(() => {
    if (!isHovered2) return;
    let index = 0;
    const interval = setInterval(() => {
      controls2.start({
        x: `-${index * 100}%`,
        opacity: 100,
        transition: { duration: 0.5, ease: "easeInOut" },
      });
      index = (index + 1) % 4;
    }, 1500);

    return () => clearInterval(interval);
  }, [controls, isHovered2]);

  useEffect(() => {
    if (!isHovered3) return;
    let index = 0;
    const interval = setInterval(() => {
      controls3.start({
        x: `-${index * 100}%`,
        opacity: 100,
        transition: { duration: 0.5, ease: "easeInOut" },
      });
      index = (index + 1) % 4;
    }, 1500);

    return () => clearInterval(interval);
  }, [controls, isHovered3]);

  //   useEffect(() => {

  //   let index = 0;
  //   const interval = setInterval(() => {
  //     controls.start({
  //       x: `-${index * 100}%`,
  //       transition: { duration: 0.5, ease: "easeInOut" },
  //     });
  //     index = (index + 1) % product1.image.length;
  //   }, 2500);

  //   return () => clearInterval(interval);
  // }, [product1.image.length, controls]);
  return (
    <section className="lg:px-0 md:px-0 px-0 py-0">
      {/* <div className="flex flex-col lg:flex-row gap-2.5 lg:h-[600px]">
        <div className="relative group overflow-hidden w-full lg:w-1/2 rounded-md">
          <motion.div
            animate={controls3}
            onMouseEnter={() => setIsHovered3(true)}
            onMouseLeave={() => setIsHovered3(false)}
            className="min-w-full flex h-full"
          >
            {product3.image.map((img) => (
              <div className="w-full flex-shrink-0 rounded-md" key={img}>
                <img
                  className="w-full h-[300px] md:h-[500px] lg:h-full object-cover rounded-md object-top"
                  src={img}
                  alt="Top"
                />
              </div>
            ))}
          </motion.div>
          <div className="absolute lg:opacity-0 group-hover:opacity-100 bottom-0 bg-[#D5E5F5] m-3 p-3 rounded-md shadow-md transition-all ease-in">
            <h2 className="text-lg sm:text-xl md:text-2xl text-gray-800 md:line-clamp-none line-clamp-2 font-sans font-medium tracking-tight !leading-tight">
              {product3.title}
            </h2>
            <p className="text-sm hidden lg:block sm:text-base md:text-lg text-gray-800">
              {product3.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/2 gap-2.5 lg:mt-0">
          <div className="grid grid-cols-2 h-[50%]  sm:min-h-max gap-2.5 overflow-hidden rounded-md">
            <div className="relative group overflow-hidden w-full h-full  object-cover rounded-md">
              <motion.div
                animate={controls}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="min-w-full h-full flex "
              >
                {product1.image.map((img) => (
                  <div className="w-full flex-shrink-0 rounded-md" key={img}>
                    <img className="object-cover h-full" src={img} alt="Top" />
                  </div>
                ))}
              </motion.div>
              <div className="absolute lg:opacity-0 group-hover:opacity-100 bottom-0 bg-[#D5E5F5] m-3 p-3 rounded-md shadow-md transition-all ease-in">
                <h3 className="text-xs md:line-clamp-none line-clamp-2 sm:text-lg md:text-xl lg:text-2xl font-medium tracking-tight !leading-tight">
                  {product1.title}
                </h3>
                <p className="text-xs hidden lg:block sm:text-sm md:text-base text-gray-800">
                  {product1.description}
                </p>
              </div>
             
            </div>
            <div className="group relative overflow-hidden w-full h-max object-cover rounded-md">
              <motion.div
                animate={controls2}
                onMouseEnter={() => setIsHovered2(true)}
                onMouseLeave={() => setIsHovered2(false)}
                className="min-w-full flex "
              >
                {product2.image.map((img) => (
                  <div className="w-full flex-shrink-0 rounded-md" key={img}>
                    <img className="object-co min-h-full" src={img} alt="Top" />
                  </div>
                ))}
              </motion.div>
              <div className="absolute lg:opacity-0 group-hover:opacity-100 bottom-0 bg-[#D5E5F5] m-3 p-3 rounded-md shadow-md transition-all ease-in">
                <h3 className="text-xs md:line-clamp-none line-clamp-2 sm:text-lg md:text-xl lg:text-2xl  font-medium tracking-tight !leading-tight">
                  {product2.title}
                </h3>
                <p className="text-xs hidden lg:block sm:text-sm md:text-base text-gray-800">
                  {product2.description}
                </p>
              </div>
             
            </div>
          </div>
          

          <div className="relative h-full bg-[#1C3753] border border-[#FFECD9] text-[#FFFFFF] rounded-lg px-4 py-4 max-lg:py-10 flex flex-col gap-4 justify-center group max-sm:items-center max-sm:text-center">
            <h2 className="w-[90%] text-[24px] sm:text-3xl md:text-[2.5rem] lg:text-[3rem] font-imprima  tracking-tight font-medium md:leading-[0.9] leading-[1]">
              Elevate Your Walls with Precision
            </h2>
            <p className="text-[14px] text-[#FFFFFF] sm:text-[18px] w-[90%]">
              Precision laser-cut metal designs crafted with sharp detail and
              refined finishes, built to elevate living rooms, bedrooms, and
              statement walls.
            </p>

            {/* <div className="bg-black w-16 h-16 absolute top-4 right-4 rounded-lg text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300">
              <ChevronRight
                className="group-hover:-rotate-45 transition-all delay-150 duration-300"
                size={34}
              />
            </div> */}
      {/* </div>
        </div>
      </div> */}
      <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[800px] overflow-hidden  ">
        {/* Video */}
        <video
          className="w-full h-full absolute inset-0 object-cover"
          src={BannerVideo}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Optional dark overlay */}
        {/* <div className="absolute inset-0 bg-black/35" /> */}

        {/* <div className="absolute inset-0 z-10 flex items-center">
          <div className="px-4 sm:px-6 md:px-10 lg:px-12 w-full max-w-[100%]">
            <h1
              className="font-montez w-full 
          text-[28px] sm:text-[40px] md:text-[64px] lg:text-[96px]
          leading-[1.1] tracking-wide
          bg-gradient-to-r from-[#FD0019] via-[#0900FF] to-[#FD0019]
          bg-clip-text text-transparent
        "
            >
              Craft Your Own Masterpieces <br />
              with Premium Resin
            </h1>

            <p className="mt-4 text-[14px] sm:text-[20px] text-white/90 max-w-[800px] leading-6 font-light">
              Welcome to Happy Art Supplies, your trusted destination for
              premium resin art materials in Bangalore and across India. We are
              passionate about empowering artists, hobbyists, and small business
              owners with high-quality resin supplies that inspire creativity
              and bring artistic visions to life.
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
}

export default Design;

// import { useState, useEffect } from "react";
// import design from "../../assets/Design.png";
// import design2 from "../../assets/Design2.png";
// import Title from "../Title";

// function Design() {
//   const [activeSlide, setActiveSlide] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveSlide(prev => (prev === 0 ? 1 : 0));
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#D0A724] via-[#E1CC44] to-[#D1A816] py-12 md:py-16 lg:py-20">
//       <div className="container mx-auto px-4">
//         {/* Slide Indicators */}
//         <div className="flex justify-center mb-6 md:mb-8">
//           {[0, 1].map((index) => (
//             <button
//               key={index}
//               className={`h-2 w-8 mx-1 rounded-full transition-all duration-300 ${
//                 activeSlide === index ? "bg-white" : "bg-white/50"
//               }`}
//               onClick={() => setActiveSlide(index)}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>

//         {/* Slides Container */}
//         <div className="relative h-[400px] md:h-[450px] lg:h-[500px]">
//           {/* Slide 1 */}
//           <div
//             className={`absolute inset-0 flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 transition-opacity duration-500 ${
//               activeSlide === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
//             }`}
//           >
//             <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6 lg:pr-10">
//               <Title
//                 heading="text-[#3D3D3D] font-bold font-playfair text-2xl md:text-3xl lg:text-4xl leading-tight mb-4"
//                 subHeading="text-[#616161] text-sm md:text-base lg:text-lg"
//                 subtitle="From butterflies to blessings — upload your idea or choose elements you love, and we'll craft it into stunning laser-cut art."
//               >
//                 Design Your Own Metal Masterpiece
//               </Title>

//               <button className="bg-[#1F1A18] text-white px-6 py-3 rounded-lg text-sm md:text-base font-medium mt-4 hover:bg-[#3D3D3D] transition-colors">
//                 Start Customizing Now
//               </button>
//             </div>

//             <div className="md:w-1/2 flex justify-center">
//               <div className="relative">
//                 <div className="absolute -inset-4 bg-gradient-to-r from-[#D0A724] to-[#D1A816] rounded-2xl transform rotate-3"></div>
//                 <img
//                   src={design}
//                   alt="Custom metal design example"
//                   className="relative z-10 w-full max-w-xs md:max-w-sm object-contain transform -rotate-2"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Slide 2 */}
//           <div
//             className={`absolute inset-0 flex flex-col md:flex-row-reverse items-center justify-between bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 transition-opacity duration-500 ${
//               activeSlide === 1 ? "opacity-100 z-10" : "opacity-0 z-0"
//             }`}
//           >
//             <div className="md:w-1/2 mb-6 md:mb-0 md:pl-6 lg:pl-10">
//               <Title
//                 heading="text-[#3D3D3D] font-bold font-playfair text-2xl md:text-3xl lg:text-4xl leading-tight mb-4"
//                 subHeading="text-[#616161] text-sm md:text-base lg:text-lg"
//                 subtitle="Celebrate love, life, and the beauty of togetherness with handcrafted wall art that speaks your story."
//               >
//                 This Is Us — A Story Etched in Metal
//               </Title>

//               <button className="bg-[#1F1A18] text-white px-6 py-3 rounded-lg text-sm md:text-base font-medium mt-4 hover:bg-[#3D3D3D] transition-colors">
//                 Explore Personalized Art
//               </button>
//             </div>

//             <div className="md:w-1/2 flex justify-center">
//               <div className="relative">
//                 <div className="absolute -inset-4 bg-gradient-to-r from-[#D0A724] to-[#D1A816] rounded-2xl transform -rotate-3"></div>
//                 <img
//                   src={design2}
//                   alt="Family story metal art example"
//                   className="relative z-10 w-full max-w-xs md:max-w-sm object-contain transform rotate-2"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Decorative Elements */}
//         <div className="absolute top-10 left-10 w-24 h-24 opacity-10">
//           <svg viewBox="0 0 100 100" className="w-full h-full">
//             <path d="M50,0 L100,50 L50,100 L0,50 Z" stroke="white" strokeWidth="2" fill="none" />
//           </svg>
//         </div>
//         <div className="absolute bottom-8 right-12 w-16 h-16 opacity-10">
//           <svg viewBox="0 0 100 100" className="w-full h-full">
//             <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" fill="none" />
//           </svg>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Design;

// import { useState, useEffect } from "react";
// import design from "../../assets/Design.png";
// import design2 from "../../assets/Design2.png";
// import Title from "../Title";

// function Design() {
//   const [activeSlide, setActiveSlide] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveSlide(prev => (prev === 0 ? 1 : 0));
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="w-full bg-white py-16 md:py-24">
//       <div className="container mx-auto px-4 max-w-6xl">
//         {/* Slide Indicators */}
//         <div className="flex justify-center mb-12">
//           {[0, 1].map((index) => (
//             <button
//               key={index}
//               className={`h-1 w-8 mx-1 transition-all duration-300 ${
//                 activeSlide === index ? "bg-[#3D3D3D]" : "bg-gray-300"
//               }`}
//               onClick={() => setActiveSlide(index)}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>

//         {/* Slides Container */}
//         <div className="relative">
//           {/* Slide 1 */}
//           <div
//             className={`flex flex-col md:flex-row items-center justify-between transition-opacity duration-500 ${
//               activeSlide === 0 ? "opacity-100" : "opacity-0 absolute inset-0"
//             }`}
//           >
//             <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
//               <Title
//                 heading="text-[#3D3D3D] font-normal font-playfair text-3xl md:text-4xl leading-tight mb-6"
//                 subHeading="text-[#616161] text-base md:text-lg leading-relaxed"
//                 subtitle="From butterflies to blessings — upload your idea or choose elements you love, and we'll craft it into stunning laser-cut art."
//               >
//                 Design Your Own Metal Masterpiece
//               </Title>

//               <button className="border border-[#3D3D3D] text-[#3D3D3D] px-8 py-3 text-base font-light mt-6 hover:bg-[#3D3D3D] hover:text-white transition-all duration-300">
//                 Start Customizing
//               </button>
//             </div>

//             <div className="md:w-1/2 flex justify-center">
//               <img
//                 src={design}
//                 alt="Custom metal design example"
//                 className="w-full max-w-md object-contain"
//               />
//             </div>
//           </div>

//           {/* Slide 2 */}
//           <div
//             className={`flex flex-col md:flex-row items-center justify-between transition-opacity duration-500 ${
//               activeSlide === 1 ? "opacity-100" : "opacity-0 absolute inset-0"
//             }`}
//           >
//             <div className="md:w-1/2 order-2 md:order-1">
//               <img
//                 src={design2}
//                 alt="Family story metal art example"
//                 className="w-full max-w-md object-contain mx-auto"
//               />
//             </div>

//             <div className="md:w-1/2 mb-10 md:mb-0 md:pl-10 order-1 md:order-2">
//               <Title
//                 heading="text-[#3D3D3D] font-normal font-playfair text-3xl md:text-4xl leading-tight mb-6"
//                 subHeading="text-[#616161] text-base md:text-lg leading-relaxed"
//                 subtitle="Celebrate love, life, and the beauty of togetherness with handcrafted wall art that speaks your story."
//               >
//                 This Is Us — A Story Etched in Metal
//               </Title>

//               <button className="border border-[#3D3D3D] text-[#3D3D3D] px-8 py-3 text-base font-light mt-6 hover:bg-[#3D3D3D] hover:text-white transition-all duration-300">
//                 Explore Personalized Art
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Design;
