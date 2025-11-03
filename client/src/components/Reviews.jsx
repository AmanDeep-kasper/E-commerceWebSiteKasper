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

function Reviews({ reviews = [] }) {

  const avgRating =
  reviews.length > 0
    ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
      reviews.length
    : 0;


      // console.log(avgRating)

  //  If no reviews, show message
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex justify-center items-center w-full text-neutral-600 py-6">
        <p className="text-gray-500 text-sm italic">No reviews yet</p>
      </div>
    );
  }

  //  Count reviews by rating (1–5)
  const ratingCounts = reviews.reduce((acc, r) => {
    const rating = Math.round(r.rating); // ensure it's 1–5
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  const totalReviews = reviews.length;

  return (
    <div className="flex flex-wrap md:flex-nowrap justify-start items-center gap-8 mt-3">

      {/* ⭐ Average Rating Section */}
      <div className="flex flex-col items-start text-neutral-700 ">
        <h2 className="text-4xl font-semibold text-gray-800">
          {avgRating.toFixed(1)}
          <span className="text-yellow-400 ml-1">&#9733;</span>
        </h2>
        <p className="text-sm text-gray-500">{avgRating.toFixed(1)} Rating </p>
        <p className="text-sm text-gray-500">{totalReviews} Reviews</p>
      </div>

      {/* 📊 Rating Distribution */}
      <div className="flex flex-col gap-1 w-1/2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingCounts[rating] || 0;
          const percentage = (count / totalReviews) * 100;
          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="w-4 text-sm">{rating}</span>
              <span className="text-yellow-400">&#9733;</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-700 w-6 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Reviews;
