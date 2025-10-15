import Title from "../Title";
import products from "../../data/products.json";
import { Link } from "react-router";
import {
  getProductUrl,
  getCardImage,
  getPrices,
  formatPrice,
} from "../../utils/homePageUtils";
import { useEffect, useState } from "react";
import { Anvil } from "lucide-react";

const DiwaliProducts = () => {
  const [visibleCount, setVisibleCount] = useState(4); // default = phone

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(5); // Desktop
      } else if (window.innerWidth >= 640) {
        setVisibleCount(6); // Tablet
      } else {
        setVisibleCount(4); // Phone
      }
    };

    updateCount(); // Run on mount
    window.addEventListener("resize", updateCount);

    return () => window.removeEventListener("resize", updateCount);
  }, []);

  // Sample product data
  const diwaliProducts = products.filter(
    (p) => p.category === "Festive Collection"
  );

  return (
    <div className=" bg-white py-10 px-4">
      {/*Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1 bg-[#eaa100]"></div>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-800 mb-3">
          Illuminate Your{" "}
          <span className="font-serif italic text-[#ebb100]">Diwali</span>
        </h1>
        <p className="text-gray-600 md:text-lg text-sm">
          Elegant golden accents for your festive celebrations
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 relative">
        {diwaliProducts?.slice(0, visibleCount).map((p) => {
          const key = p.id || p.uuid || p.SKU;
          const { base, effective, discountPercent, symbol } = getPrices(p);
          const ratingAvg = p?.rating?.average;

          return (
            <Link
              key={key}
              className="bg-white p-4 group block transition-shadow duration-300"
              to={getProductUrl(p)}
            >
              <div className="relative w-full overflow-hidden rounded-md group">
                <img
                  className="w-full aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
                  src={getCardImage(p)}
                  alt={p.title || p.slug || p.category}
                  loading="lazy"
                />

                {typeof ratingAvg === "number" && (
                  <div className="absolute top-2 right-2 bg-yellow-400 shadow-md text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                    <span>{Number(ratingAvg).toFixed(1)} ★</span>
                  </div>
                )}
                {/* <div className="group-hover:bg-amber-600 duration-300 text-black absolute top-0 h-full shadow-none group-hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)] text-4xl flex items-center justify-center md:font-bold font-medium py-0.5 px-8 w-full text-center transition-all ease-in-out">
                  <span className="translate-y-40 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in z-50">
                    {discountPercent}% Off
                  </span>
                </div>

                <div className="bg-transparent absolute bottom-[2px] right-[2px] h-full text-4xl flex items-center justify-center text-gray-100 md:font-bold font-medium py-0.5 px-8 w-full text-center transition-all ease-in-out shadow-[inset_0_-4px_10px_rgba(0,0,0,0.4)]">
                  <span className="translate-y-40 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in z-50">
                    {discountPercent}% Off
                  </span>
                </div> */}

                <div className="bg-[#eaa600] shadow-[0_4px_10px_rgba(0,0,0,0.4)] text-xs lg:text-sm text-gray-100 md:font-bold font-medium py-0.5 px-8 absolute top-4 -left-8 md:top-4 md:-left-8 -rotate-[44deg] w-max text-center transition-all ease-in-out">
                  {discountPercent}% Off
                </div>
              </div>

              <div className="mt-3">
                <h3 className="lg:text-xl md:text-base text-sm text-center font-serif text-gray-800 font-normal line-clamp-1 mb-2">
                  {p.title}
                </h3>

                {/* <div className="flex items-center flex-wrap gap-2">
                  <span className="text-gray-900 font-medium">
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
                </div> */}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DiwaliProducts;
