import { useState } from "react";
import img from "../assets/Art3.jpg";
import Footer from "../sections/Footer";
import Navbar from "../components/Navbar";
import Ratings from "../components/Ratings";
import Button from "../components/Button";

const RecentlyViewedProduct = [
  {
    title: "Lord Shiva Hindu Deity Metal Wall Art",
    rating: 3.7,
    price: "5,999",
    discount: "1,999",
    discountPercent: "58% off",
    image: img,
    decoreType: "Home Decore",
    discount: "₹5,999",
    discountPercent: "68% off",
    customerRated: "(181)",
    deliverBy: "Delivery by Tomorrow",
  },
  {
    title: "Lord Shiva Hindu Deity Metal Wall Art",
    rating: 3.7,
    price: "5,999",
    discount: "1,999",
    discountPercent: "58% off",
    image: img,
    decoreType: "Home Decore",
    discount: "₹5,999",
    discountPercent: "68% off",
    customerRated: "(181)",
    deliverBy: "Delivery by Tomorrow",
  },
  {
    title: "Lord Shiva Hindu Deity Metal Wall Art",
    rating: 3.7,
    price: "5,999",
    discount: "1,999",
    discountPercent: "58% off",
    image: img,
    decoreType: "Home Decore",
    discount: "₹5,999",
    discountPercent: "68% off",
    customerRated: "(181)",
    deliverBy: "Delivery by Tomorrow",
  },
  {
    title: "Lord Shiva Hindu Deity Metal Wall Art",
    rating: 3.7,
    price: "5,999",
    discount: "1,999",
    discountPercent: "58% off",
    image: img,
    decoreType: "Home Decore",
    discount: "₹5,999",
    discountPercent: "68% off",
    customerRated: "(181)",
    deliverBy: "Delivery by Tomorrow",
  },
];

function RecentlyViewed() {
  const [totalItems, setTotalItems] = useState(RecentlyViewedProduct.length);
  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] px-4 py-6">
        <div className="text-center">
          <h1 className="text-lg sm:text-xl text-gray-800 font-medium">
            Recently Viewed
          </h1>
          <p className="text-[#8F8F8F] my-2">{totalItems} items</p>
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-x-2 gap-y-4">
          {RecentlyViewedProduct.map(
            (
              {
                title,
                rating,
                customerRated,
                price,
                discount,
                discountPercent,
                image,
                decoreType,
                deliverBy,
              },
              index
            ) => (
              <div
                key={title + index}
                className="border overflow-hidden flex flex-col bg-white"
              >
                {/* Image with fixed ratio */}
                <div className="relative flex flex-col lg:justify-between lg:border border-[#F0F0F0] overflow-hidden group lg:hover:drop-shadow-md object-top">
                  <img
                    className="lg:min-h-[228px] min-h-[160px] object-cover "
                    src={image}
                    alt={title}
                  />
                  <span className="absolute top-2 right-2 bg-white p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-heart"
                      viewBox="0 0 16 16"
                    >
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                    </svg>
                  </span>
                </div>

                {/* Text content */}
                <div className="p-2 flex flex-col justify-between gap-1">
                  <div className="flex flex-col lg:gap-2 ">
                    <h1 className="text-lg sm:text-xl text-gray-800 font-medium overflow-clip text-ellipsis max-lg:whitespace-nowrap">
                      {title}
                    </h1>
                    <p className="text-[13px] w-full text-[#787878] lg:hidden">
                      {decoreType}
                    </p>
                    <p className="mt-1 text-sm lg:block hidden">
                      <span className="bg-[#2E7D32] text-white px-2 py-0.5 rounded-sm">
                        {rating} &#9733;
                      </span>{" "}
                      ({customerRated})
                    </p>

                    <p className="text-[#212121] mt-1 lg:text-[20px] text-[14px]">
                      ₹{price}{" "}
                      <span className="text-[#B0B0B0] line-through lg:text-[18px] text-[12px]">
                        ₹{discount}
                      </span>{" "}
                      <span className="text-[#2E7D32] lg:text-[18px] text-[13px]">
                        {discountPercent}
                      </span>
                    </p>
                    <div className="lg:hidden flex gap-2 items-center">
                      <span>
                        <Ratings></Ratings>
                      </span>{" "}
                      <p className="text-[10px] text-[#383838]">
                        {customerRated}
                      </p>
                    </div>
                    <p className="text-[10px] md:text-[12px] lg:hidden">
                      {deliverBy}
                    </p>
                  </div>
                  <div className="lg:hidden flex">
                    <Button
                      className="py-2 w-full justify-center lg:text-[15px] md:text-[12px] text-[10px] text-center whitespace-nowrap"
                      icon={false}
                      btnClass="flex-1 text-[14px]"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default RecentlyViewed;
