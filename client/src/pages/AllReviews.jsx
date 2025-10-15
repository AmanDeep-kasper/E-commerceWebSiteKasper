import React, { useState } from "react";
import products from "../data/products.json";
import Reviews from "../components/Reviews";
import CustomerReview from "../components/CustomerReview";
import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

function AllReviews() {
  const { uuid } = useParams();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const product = products.find((p) => p.uuid === uuid);

  const avgRating =
    product?.reviews?.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;
  return (
    <>
      <Navbar></Navbar>
      <section className="lg:px-20 md:px-[60px] px-4 py-6">
        <div className="flex max-lg:flex-col gap-8 items-start">
          <div className="lg:sticky top-20 flex gap-8 max-md:flex-col-reverse max-lg:w-full">
            {/* Thumbnails */}
            <div className="flex flex-col max-md:flex-row md:gap-4 max-md:justify-between rounded-lg">
              {product.image?.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative w-20 h-20 overflow-hidden rounded-md border-2 cursor-pointer transform transition duration-300 hover:scale-105 ${
                    mainImageIndex === idx
                      ? "border-[#D49A06] ring-2 ring-[#D49A06]/30 shadow-md"
                      : "border-transparent hover:border-gray-200"
                  }`}
                  onMouseEnter={() => setMainImageIndex(idx)}
                  onClick={() => setMainImageIndex(idx)}
                >
                  <img
                    src={
                      img.startsWith("/") ? img : `http://localhost:5000${img}`
                    }
                    alt={`${product.title} ${idx}`}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  {mainImageIndex === idx && (
                    <div className="absolute inset-0 bg-[#D49A06]/10 pointer-events-none transition-opacity duration-300" />
                  )}
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative">
              <img
                className="xl:min-w-[600px] xl:h-[600px] md:min-w-[460px] max-md:w-full h-[460px] object-contain"
                src={
                  (
                    product.image?.[mainImageIndex] || "/placeholder.png"
                  ).startsWith("/")
                    ? product.image?.[mainImageIndex] || "/placeholder.png"
                    : `http://localhost:5000${
                        product.image?.[mainImageIndex] || ""
                      }`
                }
                alt={product.title}
              />
            </div>
          </div>

          {/* Right Side (Reviews) */}
          <div className="w-full" id="reviews-section">
            <h3 className="text-xl font-semibold">
              {product.title} ({product.dimension})
            </h3>
            <div className="mt-2">
              <div className="mt-4">
                <Reviews reviews={product?.reviews} avgRating={avgRating} />
              </div>
              <CustomerReview reviews={product?.reviews} allReviews={true} />
            </div>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </>
  );
}

export default AllReviews;
