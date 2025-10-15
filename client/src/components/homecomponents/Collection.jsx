import { useEffect, useRef, useState } from "react";
import collection1 from "../../assets/Collection1.png";
import collection2 from "../../assets/Collection2.png";
import collection3 from "../../assets/Collection3.png";
import collection4 from "../../assets/Collection4.png";
import collection5 from "../../assets/Collection5.png";
import collection6 from "../../assets/Collection6.jpg";
import collection7 from "../../assets/Collection7.png";
import collection8 from "../../assets/Collection8.png";
import collection9 from "../../assets/Collection9.jpg";
import { motion, useAnimation } from "framer-motion";
import icon from "../../assets/black-star-icon.svg";
import products from "../../data/products.json";
import newProducts from "../../data/newProducts.json";
import Tilt from "react-parallax-tilt";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Title from "../Title";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  getProductUrl,
  getCardImage,
  getPrices,
  formatPrice,
} from "../../utils/homePageUtils";

// const collections = [
//   {
//     name: "Adiyogi Shiv Ji Metal wall Art | Sculpture For Home | ...",
//     price: "₹5,999",
//     discount: "₹2,499",
//     discountPercent: "( 58% )",
//     img: collection1,
//   },
//   {
//     name: "Metal Yada Yada Hi Dharmasya Wall Hanging | Sanskrit written.....",
//     price: "₹3,259",
//     discount: "₹2,499",
//     discountPercent: "( 48% )",
//     img: collection2,
//   },
//   {
//     name: "Shree Ganesh Metal Wall Art | Premium Hindu Deity",
//     price: "₹5,999",
//     discount: "₹1,949",
//     discountPercent: "( 68% )",
//     img: collection3,
//   },
//   {
//     name: "Sparkenzy trees of Life Metal wall art Decore | Tree of Life...",
//     price: "₹5,952",
//     discount: "₹3,999",
//     discountPercent: "( 68% )",
//     img: collection4,
//   },
//   {
//     name: "Surah Al Ikhlas | Islamic Wall Decore Metal arts for...",
//     price: "₹5,999",
//     discount: "₹1,949",
//     discountPercent: "( 68% )",
//     img: collection5,
//   },
//   {
//     name: "Surah Al Ikhlas | Islamic Wall Decore Metal arts for...",
//     price: "₹5,999",
//     discount: "₹1,949",
//     discountPercent: "( 68% )",
//     img: collection6,
//   },
//   {
//     name: "Surah Al Ikhlas | Islamic Wall Decore Metal arts for...",
//     price: "₹5,999",
//     discount: "₹1,949",
//     discountPercent: "( 68% )",
//     img: collection7,
//   },
//   {
//     name: "Surah Al Ikhlas | Islamic Wall Decore Metal arts for...",
//     price: "₹5,999",
//     discount: "₹1,949",
//     discountPercent: "( 68% )",
//     img: collection8,
//   },
//   {
//     name: "Surah Al Ikhlas | Islamic Wall Decore Metal arts for...",
//     price: "₹5,999",
//     discount: "₹1,949",
//     discountPercent: "( 68% )",
//     img: collection9,
//   },
// ];

const collections = newProducts.filter(
  (item, index, self) =>
    index === self.findIndex((obj) => obj.category === item.category)
);

function Collection() {
  const ref = useRef(null);
  const [leftArrow, setLeftArrow] = useState(false);
  const [rightArrow, setRightArrow] = useState(true);
  const [temp, setTemp] = useState(270);
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const slideToEnd = () => {
    if (ref.current) {
      const card = ref.current.querySelector("a"); // your Link is wrapping each card
      const cardWidth = card?.offsetWidth || 0;
      const gap = parseInt(getComputedStyle(ref.current).gap || "0", 10) || 0;

      const scrollStep = cardWidth + gap;

      const currentScroll = ref.current.scrollLeft;
      const nextScroll = currentScroll + scrollStep;

      ref.current.scrollTo({
        left: nextScroll,
        behavior: "smooth",
      });

      // Arrow visibility logic
      if (nextScroll > 0) setLeftArrow(true);
      if (nextScroll >= ref.current.scrollWidth - ref.current.clientWidth) {
        setRightArrow(false);
      } else {
        setRightArrow(true);
      }
    }
  };

  const slideToStart = () => {
    if (ref.current) {
      const card = ref.current.querySelector("a");
      const cardWidth = card?.offsetWidth || 0;
      const gap = parseInt(getComputedStyle(ref.current).gap || "0", 10) || 0;

      const scrollStep = cardWidth + gap;

      const currentScroll = ref.current.scrollLeft;
      const nextScroll = currentScroll - scrollStep;

      ref.current.scrollTo({
        left: nextScroll,
        behavior: "smooth",
      });

      // Arrow visibility logic
      if (nextScroll <= 0) {
        setLeftArrow(false);
      } else {
        setLeftArrow(true);
      }
      setRightArrow(true);
    }
  };

  function actualPrice(price, discountPercent) {
    return price - (price * discountPercent) / 100;
  }

  useEffect(() => {
    if (isHovered) return;
    let index = 0;
    const slideInterval = setInterval(() => {
      controls.start({
        x: `-${index * 100}%`,
        transition: { duration: 0.5, ease: "easeInOut" },
      });

      index = (index + 1) % 4; // cycle all product images
    }, 2000);

    return () => clearInterval(slideInterval);
  }, [controls, isHovered]);

  //   useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (ref.current) {
  //       const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;

  //       if (ref.current.scrollLeft >= maxScroll) {
  //         // reset to start when reached end
  //         ref.current.scrollTo({ left: 0, behavior: "smooth" });
  //       } else {
  //         // scroll forward
  //         ref.current.scrollBy({ left: 250, behavior: "smooth" });
  //       }
  //     }
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <section className="relative pt-[22px] pb-6 group bg-gray-50">
      <div className="mx-auto bg-white px-4 py-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-[#eaa100]"></div>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-800 mb-3">
            Explore Our{" "}
            <span className="font-serif italic text-[#ebb100]">
              Masterpieces
            </span>
          </h1>
          <p className="text-gray-600 md:text-lg text-sm">
            Customer Picks This Week
          </p>
        </div>

        {/* <div className="relative">
          <div
            className="flex gap-4 max-sm:gap-2 pb-6 overflow-x-auto scroll-smooth invisible-scrollbar"
            ref={ref}
          >
            {collections?.map((p) => {
              const key = p.id || p.uuid || p.SKU;
              const { base, effective, discountPercent, symbol } = getPrices(p);
              const ratingAvg = p?.rating?.average;

              return (
                <Link
                  key={key}
                  className="bg-white p-4 group/image"
                  to={getProductUrl(p)}
                >
                  <div className="w-[224px] max-sm:w-40 max-sm:h-40 relative overflow-hidden">
                    <img
                      className="w-56 h-56 group-hover/image:scale-110 max-sm:w-40 max-sm:h-40 object-contain rounded flex-shrink-0 transition-all ease-in-out duration-300"
                      src={getCardImage(p)}
                      alt={p.title || p.slug || p.category}
                      loading="lazy"
                    />

                    {typeof ratingAvg === "number" && (
                      <div className="absolute top-1 right-1 bg-yellow-400 shadow-lg text-gray-700 text-xs font-medium px-2 py-1 rounded-full flex gap-1 items-start">
                        <span>{Number(ratingAvg).toFixed(1)} ★</span>
                      </div>
                    )}
                  </div>

                  <div className="md:w-56 w-40 py-1">
                    <h3 className="text-sm font-serif font-normal text-gray-800 line-clamp-1 mb-2 tracking-wide">
                      {p.title}
                    </h3>

                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-gray-900 font-medium tracking-tight">
                        {formatPrice(effective)}
                      </span>

                      {discountPercent > 0 && (
                        <>
                          <span className="text-gray-400 text-xs line-through font-light">
                            {formatPrice(base)}
                          </span>
                          <span className="bg-green-700 text-white text-xs px-2 py-0.5 rounded">
                            {discountPercent}% Off
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {leftArrow && (
            <button
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-all duration-200 group-hover:opacity-100 opacity-0 border border-gray-200"
              onClick={slideToStart}
              aria-label="Previous items"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
          )}

          {rightArrow && (
            <button
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-all duration-200 group-hover:opacity-100 opacity-0 border border-gray-200"
              onClick={slideToEnd}
              aria-label="Next items"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          )}
        </div> */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={16} // same as your gap-4 (adjust responsive)
            slidesPerView={"auto"} // cards keep their own width
            navigation={{
              nextEl: ".collections-next",
              prevEl: ".collections-prev",
            }}
            // autoplay={{
            //   delay: 2000,
            //   disableOnInteraction: false,
            //   pauseOnMouseEnter: true,
            // }}
            loop={false} // set to true if you want infinite scrolling
            className="pb-6"
          >
            {collections?.map((p) => {
              return (
                <Swiper
                  modules={[Navigation]}
                  slidesPerView={"auto"}
                  spaceBetween={16} // this controls gap between cards
                  navigation={{
                    nextEl: ".collections-next",
                    prevEl: ".collections-prev",
                  }}
                  // autoplay={{
                  //   delay: 2000,
                  //   disableOnInteraction: false,
                  //   pauseOnMouseEnter: true,
                  // }}
                  className="pb-6"
                >
                  {collections.map((p, index) => (
                    <SwiperSlide
                      key={p.uuid + index}
                      className="!w-[224px] max-sm:!w-40 rounded-md overflow-hidden"
                    >
                      <Link
                        className="bg-white block group/image h-full rounded-md shadow-sm"
                        to={getProductUrl(p)}
                      >
                        <div className="relative w-full h-[224px] max-sm:h-40 overflow-hidden">
                          <img
                            className="w-full h-full object-contain group-hover/image:scale-110 transition-all duration-300"
                            src={getCardImage(p)}
                            alt={p.title}
                          />
                        </div>

                        <div className="w-full py-2 px-3">
                          {" "}
                          {/* only inner padding here */}
                          <h3 className="text-sm font-serif text-gray-800 line-clamp-1 mb-2">
                            {p.title}
                          </h3>
                          {/* price section... */}
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              );
            })}
          </Swiper>

          {/* Navigation Arrows */}
          <button className="collections-prev absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-all duration-200 z-10 border border-gray-200">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          <button className="collections-next absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-all duration-200 z-10 border border-gray-200">
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Collection;
