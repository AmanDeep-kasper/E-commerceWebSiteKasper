import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TopbannerVideo from "../assets/TopBannerImg/TopBannerVideo.mp4";
import { motion, useAnimation } from "framer-motion";
import products from "../data/products.json";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import img1 from "../assets/img/img1.png";
import img2 from "../assets/img/img2.png";
import img3 from "../assets/img/img3.png";
import img4 from "../assets/img/img4.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import axiosInstance from "../api/axiosInstance";
import { img } from "framer-motion/m";

function Hero() {
  // const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const [imageIndex, setImageIndex] = useState(0);
  const defaultImages = [img1, img2, img3, img4];
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axiosInstance.get(
          "/dashboard/banner/get-active-banners?sectionType=hero",
        );

        console.log(res);

        const banners = res.data?.data || [];

        const heroImages = banners.flatMap((banner) =>
          (banner.items || [])
            .filter((item) => item.isActive !== false)
            .map((item) => item.image)
            .filter(Boolean),
        );

        // ✅ If backend has images → use them
        if (heroImages.length > 0) {
          setImages(heroImages);
        } else {
          setImages(defaultImages);
        }
      } catch (err) {
        console.log("Banner fetch error:", err);
        setImages(defaultImages);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await axiosInstance.get("/products/all");
  //       // console.log("PRODUCTS:", res.data);
  //       setselectedProducts(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  // const selectedProducts = sideslider.filter(
  //   (item, index, self) =>
  //     index === self.findIndex((obj) => obj.category === item.category),
  // );

  // Animate on imageIndex change
  useEffect(() => {
    controls.start({
      x: `-${imageIndex * 100}%`,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  }, [imageIndex, controls]);

  // Auto-slide
  // useEffect(() => {
  //   if (isHovered || selectedProducts.length === 0) return;

  //   const interval = setInterval(() => {
  //     setImageIndex((prevIndex) => (prevIndex + 1) % selectedProducts.length);
  //   }, 2500);

  //   return () => clearInterval(interval);
  // }, [isHovered, selectedProducts.length, imageIndex]);

  // Manual navigation
  const handlePrev = () => {
    setImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedProducts.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % selectedProducts.length);
  };

  return (
    //   <section className="w-full mx-auto sm:py-0 bg-gray-50 mt-24">
    //     <div className="mx-auto w-full px-0 sm:px-0 md:px-0 lg:px-0">
    //       <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[800px] overflow-hidden">
    //         {/* Video */}
    //         <video
    //           className="w-full h-full absolute inset-0 object-cover"
    //           src={TopbannerVideo}
    //           autoPlay
    //           loop
    //           muted
    //           playsInline
    //         />

    //         {/* Optional dark overlay */}
    //         <div className="absolute inset-0 bg-black/35" />

    //         {/* Text block */}
    //         <div className="absolute inset-0 z-10 flex items-center">
    //           <div className="px-4 sm:px-6 md:px-10 lg:px-12 w-full max-w-[100%]">
    //             {/* Gradient Handwritten Heading */}
    //             <h1
    //               className="font-montez w-full
    // text-[28px] sm:text-[40px] md:text-[64px] lg:text-[96px]
    // leading-[1.1] tracking-wide
    // bg-gradient-to-r from-[#FF5667] via-[#E8E8E8] to-[#8494FB]
    // bg-clip-text text-transparent"
    //             >
    //               Craft Your Own Masterpieces <br />
    //               with Premium Resin
    //             </h1>

    //             {/* Description */}
    //             <p className="mt-4 text-[14px] sm:text-[20px] text-white/90 max-w-[800px]  leading-6 font-light">
    //               Welcome to Happy Art Supplies, your trusted destination for
    //               premium resin art materials in Bangalore and across India. We
    //               are passionate about empowering artists, hobbyists, and small
    //               business owners with high-quality resin supplies that inspire
    //               creativity and bring artistic visions to life.
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>
    <section className="w-full mx-auto sm:py-0 bg-gray-50 mt-24">
      <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[800px] overflow-hidden">
        {/* 🔥 Continuous Swiper Background */}
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false, // optional (keeps running)
          }}
          speed={1100} // smoother fade
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="w-full h-[300px] sm:h-[400px] md:h-[600px] lg:h-[820px]">
                <img
                  src={img}
                  className="w-full h-full object-cover"
                  alt="banner"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black/35 z-10" /> */}

        {/* Content */}
        {/* <div className="absolute inset-0 z-20 flex items-center">
          <div className="px-4 sm:px-6 md:px-10 lg:px-12 w-full">
            <h1
              className="font-montez
          text-[28px] sm:text-[40px] md:text-[64px] lg:text-[96px]
          leading-[1.1] tracking-wide
          bg-gradient-to-r from-[#FF5667] via-[#E8E8E8] to-[#8494FB]
          bg-clip-text text-transparent"
            >
              Craft Your Own Masterpieces <br />
              with Premium Resin
            </h1>

            <p className="mt-4 text-[14px] sm:text-[20px] text-white/90 max-w-[800px] leading-6 font-light">
              Welcome to Happy Art Supplies, your trusted destination for
              premium resin art materials in Bangalore and across India...
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
}

export default Hero;
