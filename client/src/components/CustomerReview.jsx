import { useMemo, useState } from "react";
import product from "../assets/ProductDetails1.jpg";
import Ratings from "./Ratings";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useNavigate } from "react-router";

const customers = [
  {
    user: "Rohit Sharma",
    userImage: "https://randomuser.me/api/portraits/men/32.jpg",
    comment:
      "calms your mind whenever you look” and “excellent product… must‑have for home decor.”",
    rating: "5",
    likes: 42,
    dislike: 0,
    images: product,
    date: "2025-04-05",
  },
  {
    user: "Neha Sharma",
    userImage: "https://randomuser.me/api/portraits/women/32.jpg",
    comment:
      "calms your mind whenever you look” and “excellent product… must‑have for home decor.”",
    rating: "5",
    likes: 42,
    dislike: 0,
    images: product,
    date: "2025-04-05",
  },
];

function CustomerReview({ reviews = false, id, allReviews = false }) {
  const [moreReview, setMoreReview] = useState(2);
  const navigate = useNavigate(null);

  const productReview = useMemo(() => {
    if (!reviews) return [];
    return allReviews ? reviews : reviews.slice(0, moreReview);
  });
  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-1">
          No Reviews Yet
        </h3>
        <p className="text-gray-500 text-sm max-w-md">
          Be the first to share your thoughts about this product.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {productReview.map(
        (
          { user, userImage, comment, rating, likes, dislike, images, date },
          index
        ) => (
          <div
            key={index}
            className="py-6 flex gap-3 flex-col border border-t-[#C7C7C7] border-b-0 border-l-0 border-r-0"
          >
            <div className="flex justify-between">
              <div className="flex gap-4">
                {userImage ? (
                  <img
                    className="w-11 h-11 rounded-full"
                    src={userImage}
                    alt={`${user}'s avatar`}
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                    <h1 className="text-white">
                      {user?.charAt(0).toUpperCase()}
                    </h1>
                  </div>
                )}

                <div className="flex flex-col">
                  <h1 className="text-[14px]">{user}</h1>
                  <Ratings avgRating={Number(rating)} />
                </div>
              </div>
              <span className="text-[#6C6B6B] text-[12px]">
                {new Date(date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="text-[12px]">{comment}</p>
            {images && (
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <img
                    className="w-[78px] h-[97px]"
                    src={img}
                    alt="product"
                    key={index}
                  />
                ))}
              </div>
            )}
            <div className="flex gap-2 text-[#6C6B6B] text-[14px]">
              <span>
                <ThumbsUp />
              </span>
              <span>{likes} Helpful</span>
              <span className="ml-4">
                <ThumbsDown />
              </span>
              <span>{dislike}</span>
            </div>
          </div>
        )
      )}
      {reviews.length > moreReview && !allReviews && (
        <button
          className=" py-2 rounded-lg my-2 font-semibold"
          // onClick={() => moreReview < 4 ? setMoreReview(moreReview + 2) : navigate(`/all-reviews/${id}`)}
          onClick={() => navigate(`/all-reviews/${id}`)}
        >
          See more reviews &#8250;
        </button>
      )}
    </div>
  );
}

export default CustomerReview;
