import React, { useEffect, useState } from "react";
import category1 from "../../assets/Category1.png";
import category3 from "../../assets/Category3.png";
import category2 from "../../assets/Category2.png";
import category5 from "../../assets/Category5.png";
import category4 from "../../assets/Category4.png";
import category6 from "../../assets/Category6.png";
import category7 from "../../assets/Category7.png";
import category8 from "../../assets/Category8.png";
import category9 from "../../assets/Category9.png";
import category10 from "../../assets/Category10.png";
import category11 from "../../assets/Category11.png";
import category12 from "../../assets/Category12.png";
import category13 from "../../assets/Category13.png";
import category14 from "../../assets/Category14.png";
import category15 from "../../assets/Category15.png";
import category16 from "../../assets/Category16.png";
import category17 from "../../assets/Category17.png";
import category18 from "../../assets/Category18.png";
import Tilt from "react-parallax-tilt";
import Button from "../Button";
import Title from "../Title";
import products from "../../data/products.json";
import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { getCardImage } from "../../utils/homePageUtils";

const categories = products.filter(
  (item, index, self) =>
    index === self.findIndex((obj) => obj.category === item.category)
);
// console.log(categories)

const cat = [...new Set(products.map((item) => item.category))];
// console.log(cat)

const subcategories = products
  .filter(
    (item, index, self) =>
      index === self.findIndex((obj) => obj.subcategory === item.subcategory)
  )
  .slice(0, 12);

// console.log(subcategories)

const categoryMap = new Map();

products.forEach((item) => {
  if (!categoryMap.has(item.category)) {
    categoryMap.set(item.category, []);
  }
  categoryMap.get(item.category).push(item);
});

const randomProducts = [];

categoryMap.forEach((items) => {
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * items.length);
    randomProducts.push(items[randomIndex]);
  }
});

// console.log(randomProducts);

const groupedProducts = products.reduce((acc, product) => {
  if (!acc[product.category]) {
    acc[product.category] = [];
  }
  acc[product.category].push(product);
  return acc;
}, {});

// console.log(randomProducts);

function CategoryProducts() {
  const navigate = useNavigate(null);
  const [visibleCount, setVisibleCount] = useState(4); // default = phone

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(8); // Desktop
      } else if (window.innerWidth >= 640) {
        setVisibleCount(9); // Tablet
      } else {
        setVisibleCount(9); // Phone
      }
    };

    updateCount(); // Run on mount
    window.addEventListener("resize", updateCount);

    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return (
    <div>
      {/* <Title className="md:items-start items-center">Art Across Styles</Title> */}
      {/* subcategories */}
      <div
        className="grid 
        xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 
        gap-2 md:gap-5 lg:gap-4 grid-flow-row
        place-items-center"
      >
        {Object.entries(groupedProducts).slice(0, visibleCount)
        .map(([category, items]) => (
          <Link
            key={category}
            to={`/products/${encodeURIComponent(category)}`}
            className="bg-gradient-to-b border border-gray-200  bg-white py-2 px-4"
          >
            <h2 className="md:text-2xl text-[20px] py-[10px] font-semibold">
              {category}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {items.slice(0, 4).map((p, index) => (
                <div
                  key={`${p.id || p.uuid || p.SKU || p.title}-${index}`}
                  className="cursor-pointer flex flex-col items-center transition-all duration-300 hover:shadow-sm"
                  onClick={() => navigate(getProductHref(p))}
                >
                  <div className="flex flex-col w-full h-full overflow-hidden">
                    {/* Product Image */}
                    <div className="relative w-full aspect-square rounded-md overflow-hidden">
                      <img
                        className="w-full h-full bg-white object-contain hover:scale-105 transition-transform duration-300"
                        src={getCardImage(p)}
                        alt={
                          p.title ||
                          p.slug ||
                          `${p.category} ${p.subcategory}` ||
                          "Product"
                        }
                        loading="lazy"
                      />

                      {/* Optional rating badge */}
                      {typeof p?.rating?.average === "number" && (
                        <span className="absolute top-1 right-1 bg-yellow-400 text-gray-800 text-[10px] px-2 py-0.5 rounded-full shadow">
                          {p.rating.average.toFixed(1)} ★
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs py-2 bg-transparent line-clamp-1 h-6">
                      {p.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="underline text-blue-800 hover:text-blue-950 py-2 text-sm"
              onClick={() => navigate(`/products/${encodeURIComponent(category)}`)}
            >
              view all
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryProducts;

// {subcategories.map((product, index) => (
//           // <div
//           //   key={category.title}
//           //   className="relative w-full h-[264px] rounded-lg  overflow-hidden"
//           //   // to={`/products/${encodeURIComponent(category.category)}/{${encodeURIComponent(category.subcategory)}}`}
//           // >
//           //   <img
//           //     className="absolute w-full h-full lg:hover:scale-105 object-cover transition duration-300"
//           //     src={category.image[0]}
//           //     alt={category.title}
//           //   />
//           //   <div className="z-50 w-full rounded-b-[10px] absolute bottom-0 h-[120px] bg-gradient-to-b from-[#FFFFFF00] via-[#000000CC]/60 to-[#000000]/80 flex flex-col items-center justify-center gap-2">
//           //     <p className="text-white text-sm md:text-lg font-medium text-center px-2 mb-2 line-clamp-1">
//           //       {category.title}
//           //     </p>
//           //     <Link
//           //       to={`/products/${encodeURIComponent(
//           //         category.category
//           //       )}/${encodeURIComponent(category.subcategory)}`}
//           //     >
//           //       <Button
//           //         className="text-xs md:text-sm py-1 px-3 md:py-2 md:px-4"
//           //       >
//           //         Shop Now
//           //       </Button>
//           //     </Link>
//           //   </div>
//           // </div>
//           <div
//             key={product.title + index}
//             className="cursor-pointer flex flex-col items-center transition-all duration-300 hover:shadow-sm p-2 bg-white"
//             onClick={() =>
//               navigate(
//                 `/products/${encodeURIComponent(
//                   product.category
//                 )}/${encodeURIComponent(product.subcategory)}`
//               )
//             }
//           >
//             <div className="flex flex-col items-center w-full h-full bg-white overflow-hidden">
//               {/* Product Image */}
//               <div className="relative w-full aspect-square overflow-hidden">
//                 <img
//                   className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
//                   src={product?.image[0]}
//                   alt={product.name}
//                 />
//               </div>

//               {/* Product Info */}
//               <div className="w-full p-3 flex flex-col items-center">
//                 <p className="max-w-40 text-sm md:text-base text-gray-700 w-full mb-3 text-ellipsis whitespace-nowrap overflow-clip">
//                   {product.title}
//                 </p>
//                 <p className="font-bold text-gray-900">Upto {product.discountPercent}% Off</p>
//                 {/* Action Button */}
//                 {/* <button
//                   className="flex items-center justify-center bg-gray-900 text-white text-xs md:text-sm py-2 px-4
//                         hover:bg-transparent hover:text-gray-900 border border-gray-900 transition-all duration-200 w-full"
//                   onClick={() =>
//                     navigate(
//                       `/products/${encodeURIComponent(product.category)}`
//                     )
//                   }
//                 >
//                   Shop Now
//                   <ArrowRight className="ml-1" size={16} />
//                 </button> */}
//               </div>
//             </div>
//           </div>
//         ))}
