import { ChevronRight, ListChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import StarRating from "./StarRating";
import { useLocation } from "react-router-dom";

const reviews = [
  { star: 5, numOfReviews: 289 },
  { star: 4, numOfReviews: 200 },
  { star: 3, numOfReviews: 5 },
  { star: 2, numOfReviews: 2 },
  { star: 1, numOfReviews: 0 },
];

function Reviews({ reviews = [], onAddReview }) {
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
        reviews.length
      : 0;

  const ratingCounts = reviews.reduce((acc, r) => {
    const rating = Math.round(r.rating);
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  const totalReviews = reviews.length;
  const location = useLocation();

  const isAllReviewsPage = location.pathname.includes("/all-reviews");

  if (!reviews || reviews.length === 0) {
    return (
      <div className="w-full">
        {/* <div className="flex flex-col items-start space-y-2">
          <div>
            <p className="text-lg font-medium">Review This Product</p>
            <span className="text-[#686868] text-xs">
              Share your thoughts with other customers
            </span>
          </div>

          <button
            type="button"
            onClick={onAddReview}
            className="py-2 px-6 border tetx-[#0C0057] border-[#0C0057] rounded-md hover:bg-[#1800AC] hover:text-white transition-all duration-200"
          >
            Write a product review
          </button>
        </div> */}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <div>
          <h4 className="text-[22px] font-medium text-[#1C1C1C]">
            Average Rating
          </h4>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[42px] leading-none font-semibold text-black">
              {avgRating.toFixed(1)}
            </span>
            <StarRating rating={avgRating} />
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Based on {totalReviews} reviews
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingCounts[rating] || 0;
            const percentage = totalReviews ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-2">
                <span className="w-4 text-sm text-[#1C1C1C]">{rating}</span>
                <span className="text-[#F8A14A] text-sm">★</span>

                <div className="flex-1 h-[5px] bg-[#D9D9D9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F8A14A] rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-6 text-right text-sm text-gray-500">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {!isAllReviewsPage && (
          <div className="flex flex-col items-start gap-2">
            <div>
              <p className="text-lg font-medium">Review This Product</p>
              <span className="text-[#686868] text-xs">
                Share your thoughts with other customers
              </span>
            </div>

            <button
              type="button"
              onClick={onAddReview}
              className="py-2 px-6 border border-[#1C3753] rounded-md hover:bg-[#1800AC] hover:text-white transition-all duration-200"
            >
              Write a product review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;
