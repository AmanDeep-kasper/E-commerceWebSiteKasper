import React from "react";

const ReviewSkeleton = () => {
  return (
    <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 animate-pulse">
      <div className="flex gap-6">
        {/* Image */}
        <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>

          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSkeleton;
