import design from "../../assets/Design.png";
import design2 from "../../assets/Design2.png";
import Title from "../Title";
import products from "../../data/products.json";
import banner from "../../data/banner.json";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAnimation, motion, easeInOut } from "framer-motion";
import { useNavigate } from "react-router";

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
    // <section
    //   className=" relative lg:h-[478px] md:h-[320px] h-[200px] w-full overflow-hidden"
    //   style={{
    //     background:
    //       "linear-gradient(to right, #D0A724, #E1CC44, #D8AF30, #F6D759, #E2BE35, #D1A816)",
    //   }}
    // >
    //   {/* First Fade in then out */}
    //   <div className="md:animate-[fadeIn_8s_ease-in-out_infinite] z-20 absolute  right-[5px] pl-[30px] pr-[75px] top-[5px] bottom-[5px] left-[5px] mr-[15px] flex md:flex-row flex-row-reverse justify-between items-center bg-[#F2EFEB] ">
    //     <div>
    //       <img className="md:static absolute md:w-auto md:h-auto w-[224px] h-[158px] right-0 top-6 md:z-0 z-10 md:rotate-0 -rotate-[30deg]" src={design} alt="" />
    //     </div>
    //     <div className="w-[598px] lg:h-[308px] md:h-[217px] flex flex-col justify-between z-20">
    //       <Title
    //         heading="text-[#3D3D3D] font-[700] font-playfair leading-[1.1] md:text-[35px]"
    //         subHeading="lg:text-[20px] md:text-[15px] text-[#616161]"
    //         subtitle="From butterflies to blessings — upload your idea or choose
    //           elements you love, and we'll craft it into stunning laser-cut
    //           art."
    //         className="md:w-auto w-[283px] hero-title"
    //       >
    //         Design Your Own Metal Masterpiece
    //       </Title>

    //       {/* <div>
    //         <button className="bg-[#1F1A18] text-white md:px-[30px] md:py-[10px] md:rounded-[10px] rounded-[5px] p-[5px] lg:text-[22px] md:text-[15px] text-[10px]">
    //           Start customizing Now{" "}
    //         </button>
    //       </div> */}
    //     </div>
    //   </div>

    //   {/* Fade out then in  */}
    //   <div className="animate-[fadeIn_8s_ease-in-out_infinite] card-delay z-20 absolute  right-[5px] pl-[30px] pr-[75px] top-[5px] bottom-[5px] left-[5px] mr-[15px] hidden md:flex md:flex-row-reverse flex-row justify-evenly gap-8 items-center bg-[#F2EFEB]">
    //     <div>
    //       <img className="md:static absolute left-0 top-0 md:w-auto md:h-auto w-[200px] min-h-[158px]" src={design2} alt="" />
    //     </div>
    //     <div className="w-[598px] lg:h-[308px] md:h-[217px] flex flex-col justify-between">
    //       <Title
    //         heading="text-[#3D3D3D] font-[700] md:w-auto w-[283px] font-playfair leading-[1.1] md:text-[35px]"
    //         subHeading="lg:text-[20px] md:text-[15px] text-[#616161]"
    //         subtitle="Celebrate love, life, and the beauty of togetherness with
    //           handcrafted wall art that speaks your story."
    //           className="hero-title font-normal"
    //       >
    //         This Is Us — A Story Etched in Metal
    //       </Title>
    //       {/* <div>
    //         <button className="bg-[#1F1A18] text-white md:px-[30px] md:py-[10px] p-[5px] md:rounded-[10px] rounded-[5px] lg:text-[22px] md:text-[15px] text-[10px]">
    //           Start customizing Now{" "}
    //         </button>
    //       </div> */}
    //     </div>
    //   </div>
    //   <div className="absolute  right-[-10px] pl-[30px] pr-[75px] top-[5px] bottom-[5px] left-[5px] mr-[15px] flex flex-row-reverse justify-evenly gap-8 items-center bg-[#F2EFEB]">
    //     <div>
    //       <img className="opacity-0" src={design2} alt="" />
    //     </div>
    //     <div className="opacity-0 w-[598px] h-[308px] md:h-[217px] flex flex-col justify-between">
    //       <div>
    //         <h1 className="text-[#3D3D3D] text-[40px] font-[500] hero-title">
    //           This Is Us — A Story Etched in Metal
    //         </h1>
    //         <p className="text-[20px] text-[#616161]">
    //           Celebrate love, life, and the beauty of togetherness with
    //           handcrafted wall art that speaks your story.
    //         </p>
    //       </div>
    //       {/* <div>
    //         <button className="bg-[#1F1A18] text-white px-[30px] py-[10px] rounded-[10px]">
    //           Start customizing Now{" "}
    //         </button>
    //       </div> */}
    //     </div>
    //   </div>
    // </section>

    <section className="lg:px-20 md:px-16 px-4 py-10">
      {/* <div className="flex"> */}
      {/* <div className="w-2/3">
          <h1 className="text-[24px] sm:text-3xl md:text-[2.5rem] lg:text-[3rem] font-sans hero-title tracking-tight font-medium lg:w-[400px] !leading-[0.9]">
            Design Your Own Metal Masterpiece
          </h1>
          <p className="text-[14px] sm:text-[18px] text-gray-800 lg:w-[400px]">
            From butterflies to blessings — upload your idea or choose elements
            you love, and we'll craft it into stunning laser-cut art.
          </p>
        </div> */}

      <div className="flex flex-col lg:flex-row gap-2.5 lg:h-[600px]">
        {/* Left big image */}
        {/* <div className="relative overflow-hidden w-full lg:w-1/2">
          <img
            className="w-full h-[300px] lg:h-full object-cover rounded-md object-top"
            src="/name1.jpg"
            alt="Main"
          /> */}
        {/* <div className="absolute bottom-0 bg-white m-3 p-3 rounded-md shadow-md max-w-[90%]">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sans font-medium tracking-tight !leading-tight">
              Craft Metal Elegance
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-800">
              Choose elements you love, and we’ll craft them into timeless metal
              art.
            </p>
          </div> */}
        {/* </div> */}

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
          <div className="absolute lg:opacity-0 group-hover:opacity-100 bottom-0 bg-[#FFF4E6] m-3 p-3 rounded-md shadow-md transition-all ease-in">
            <h2 className="text-lg sm:text-xl md:text-2xl text-gray-800 md:line-clamp-none line-clamp-2 font-sans font-medium tracking-tight !leading-tight">
              {product3.title}
            </h2>
            <p className="text-sm hidden lg:block sm:text-base md:text-lg text-gray-800">
              {product3.description}
            </p>
          </div>
          <div
            className="bg-black md:w-14 md:h-14 w-10 h-10 absolute md:top-4 md:right-4 top-2 right-2  rounded-lg text-white flex items-center justify-center lg:opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 cursor-pointer"
            onClick={() => navigate(`/products/${product3.category}`)}
          >
            <ChevronRight
              className="group-hover:-rotate-45 transition-all delay-150 duration-300"
              size={34}
            />
          </div>
        </div>

        {/* Right column images */}
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
              <div className="absolute lg:opacity-0 group-hover:opacity-100 bottom-0 bg-[#E6F0F6] m-3 p-3 rounded-md shadow-md transition-all ease-in">
                <h3 className="text-xs md:line-clamp-none line-clamp-2 sm:text-lg md:text-xl lg:text-2xl font-medium tracking-tight !leading-tight">
                  {product1.title}
                </h3>
                <p className="text-xs hidden lg:block sm:text-sm md:text-base text-gray-800">
                  {product1.description}
                </p>
              </div>
              <div
                className="bg-black md:w-10 md:h-10 w-8 h-8 absolute md:top-4 md:right-4 top-2 right-2 rounded-lg text-white flex items-center justify-center lg:opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 cursor-pointer"
                onClick={() => navigate(`/products/${product1.category}`)}
              >
                <ChevronRight
                  className="group-hover:-rotate-45 transition-all delay-150 duration-300"
                  size={24}
                />
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
              <div className="absolute lg:opacity-0 group-hover:opacity-100 bottom-0 bg-[#F6E1E1] m-3 p-3 rounded-md shadow-md transition-all ease-in">
                <h3 className="text-xs md:line-clamp-none line-clamp-2 sm:text-lg md:text-xl lg:text-2xl  font-medium tracking-tight !leading-tight">
                  {product2.title}
                </h3>
                <p className="text-xs hidden lg:block sm:text-sm md:text-base text-gray-800">
                  {product2.description}
                </p>
              </div>
              <div
                className="bg-black md:w-10 md:h-10 w-8 h-8 absolute md:top-4 md:right-4 top-2 right-2 rounded-lg text-white flex items-center justify-center lg:opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 cursor-pointer"
                onClick={() => navigate(`/products/${product2.category}`)}
              >
                <ChevronRight
                  className="group-hover:-rotate-45 transition-all delay-150 duration-300"
                  size={24}
                />
              </div>
            </div>
          </div>
          {/* <div className="grid grid-cols-3 gap-2.5">
            <img
              className="w-full h-[120px] sm:h-[150px] object-cover rounded-md"
              src="/polygonAnimal4.jpg"
              alt="Middle"
            />
            <img
              className="w-full h-[120px] sm:h-[150px] object-cover rounded-md"
              src="/polygonAnimal2.jpg"
              alt="Middle"
            />
            <img
              className="w-full h-[120px] sm:h-[150px] object-cover rounded-md"
              src="/polygonAnimal3.jpg"
              alt="Middle"
            />
          </div> */}

          <div className="relative h-full bg-[#FFECD9]/50 border border-[#FFECD9] rounded-lg px-4 py-4 max-lg:py-10 flex flex-col gap-4 justify-center group max-sm:items-center max-sm:text-center">
            <h2 className="w-[90%] text-[24px] sm:text-3xl md:text-[2.5rem] lg:text-[3rem] font-sans hero-title tracking-tight font-medium md:leading-[0.9] leading-[1]">
              Design Your Own Metal Masterpiece
            </h2>
            <p className="text-[14px] sm:text-[18px] text-gray-800 w-[90%]">
              From butterflies to blessings — upload your idea or choose
              elements you love, and we'll craft it into stunning laser-cut art.
            </p>

            {/* <div className="bg-black w-16 h-16 absolute top-4 right-4 rounded-lg text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300">
              <ChevronRight
                className="group-hover:-rotate-45 transition-all delay-150 duration-300"
                size={34}
              />
            </div> */}
          </div>
        </div>
      </div>

      {/* </div> */}
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
