import React from "react";

const reviews = [
  { star: 5, numOfReviews: 289 },
  { star: 4, numOfReviews: 200 },
  { star: 3, numOfReviews: 5 },
  { star: 2, numOfReviews: 2 },
  { star: 1, numOfReviews: 0 },
];

// function Reviews({ reviews, avgRating }) {
//   const filteredByFive = reviews.filter((r) => r.rating === 5);
//   const filteredByFour = reviews.filter((r) => r.rating === 4);
//   const filteredByThree = reviews.filter((r) => r.rating === 3);
//   const filteredByTwo = reviews.filter((r) => r.rating === 2);
//   const filteredByOne = reviews.filter((r) => r.rating === 1);

//   const maxValue = Number(reviews.length);
//   return (
//     <div className="flex justify-between items-center">
//       <div className="flex flex-col items-center w-full text-neutral-600">
//         <h1 className="text-4xl">
//           {avgRating} <span className="text-green-700">&#9733;</span>
//         </h1>
//         <p className="text-sm">{reviews.length} Verified Buyers</p>
//       </div>
//       <div className="flex flex-col mr-16">
//         <div className="flex items-center gap-2 w-[225px] whitespace-nowrap">
//           <span className="w-2 text-[14px]">5</span>{" "}
//           <span className="w-3 text-[#6C6B6B]">&#9733;</span>
//           <progress
//             className="progress-bar h-1 w-[135px] bg-[#D9D9D9]"
//             value={filteredByFive.length}
//             max={maxValue}
//           ></progress>{" "}
//           <span className="text-[14px]">{filteredByFive.length}</span>
//         </div>
//         <div className="flex items-center gap-2 w-[225px] whitespace-nowrap">
//           <span className="w-2 text-[14px]">4</span>{" "}
//           <span className="w-3 text-[#6C6B6B]">&#9733;</span>
//           <progress
//             className="progress-bar h-1 w-[135px] bg-[#D9D9D9]"
//             value={filteredByFour.length}
//             max={maxValue}
//           ></progress>{" "}
//           <span className="text-[14px]">{filteredByFour.length}</span>
//         </div>
//         <div className="flex items-center gap-2 w-[225px] whitespace-nowrap">
//           <span className="w-2 text-[14px]">3</span>{" "}
//           <span className="w-3 text-[#6C6B6B]">&#9733;</span>
//           <progress
//             className="progress-bar h-1 w-[135px] bg-[#D9D9D9]"
//             value={filteredByThree.length}
//             max={maxValue}
//           ></progress>{" "}
//           <span className="text-[14px]">{filteredByThree.length}</span>
//         </div>
//         <div className="flex items-center gap-2 w-[225px] whitespace-nowrap">
//           <span className="w-2 text-[14px]">2</span>{" "}
//           <span className="w-3 text-[#6C6B6B]">&#9733;</span>
//           <progress
//             className="progress-bar h-1 w-[135px] bg-[#D9D9D9]"
//             value={filteredByTwo.length}
//             max={maxValue}
//           ></progress>{" "}
//           <span className="text-[14px]">{filteredByTwo.length}</span>
//         </div>
//         <div className="flex items-center gap-2 w-[225px] whitespace-nowrap">
//           <span className="w-2 text-[14px]">1</span>{" "}
//           <span className="w-3 text-[#6C6B6B]">&#9733;</span>
//           <progress
//             className="progress-bar h-1 w-[135px] bg-[#D9D9D9]"
//             value={filteredByOne.length}
//             max={maxValue}
//           ></progress>{" "}
//           <span className="text-[14px]">{filteredByOne.length}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

function Reviews({ reviews = [], avgRating = 0 }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex justify-center items-center w-full text-neutral-600 py-6">
        {/* <p>No reviews yet</p> */}
      </div>
    );
  }
  

  // Count reviews by rating in one pass
  const ratingCounts = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {});

  const maxValue = reviews.length;

  return (
    <div className="flex justify-between gap-8 items-center w-full">
      {/* Average Rating */}
      <div className="flex flex-col items-center text-neutral-600 w-1/2">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800">
          {avgRating.toFixed(1)} <span className="text-green-700">&#9733;</span>
        </h2>
        <p className="text-sm">{maxValue} Verified Buyers</p>
      </div>

      {/* Rating Distribution */}
      <div className="flex flex-col mr-16 w-1/2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div
            key={rating}
            className="flex items-center gap-2 w-[225px] whitespace-nowrap"
          >
            <span className="w-2 text-[14px]">{rating}</span>
            <span className="w-3 text-[#6C6B6B]">&#9733;</span>
            <progress
              className="progress-bar h-1 w-[135px] bg-[#D9D9D9]"
              value={ratingCounts[rating] || 0}
              max={maxValue}
            ></progress>
            <span className="text-[14px]">{ratingCounts[rating] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
