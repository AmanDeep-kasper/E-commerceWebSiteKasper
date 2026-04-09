import { useMemo, useState } from "react";
import product from "../assets/ProductDetails1.jpg";
import Ratings from "./Ratings";
import { ThumbsUp, ThumbsDown, Link } from "lucide-react";
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

function CustomerReview({ reviews = [], id, allReviews = false }) {
  const [moreReview, setMoreReview] = useState(2);
  const navigate = useNavigate();

  const productReview = useMemo(() => {
    if (!reviews) return [];
    return allReviews ? reviews : reviews.slice(0, moreReview);
  }, [reviews, allReviews, moreReview]);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-8 flex flex-col items-center justify-center text-center border rounded-lg bg-white">
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
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {productReview.map(
          ({ user, userImage, comment, rating, images, date }, index) => (
            <div
              key={index}
              className="border border-[#DADADA] rounded-lg bg-[#FCFCFC] p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex gap-3">
                  {userImage ? (
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={userImage}
                      alt={`${user}'s avatar`}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#D9A7A0] flex items-center justify-center text-white font-medium text-sm shrink-0">
                      {user?.charAt(0)?.toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-[15px] font-medium text-[#222]">
                        {user}
                      </h1>
                      <Ratings avgRating={Number(rating)} />
                      <span className="text-[#6C6B6B] text-[12px]">
                        (
                        {new Date(date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        )
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {images && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {(Array.isArray(images) ? images : [images]).map(
                    (img, idx) => (
                      <img
                        key={idx}
                        className="w-14 h-14 object-cover rounded border"
                        src={img}
                        alt="review"
                      />
                    ),
                  )}
                </div>
              )}

              <p className="text-sm text-[#3A3A3A] mt-3 leading-6">{comment}</p>
            </div>
          ),
        )}
      </div>

      {reviews.length > moreReview && !allReviews && (
        <Link to={"/rating"}>
        <button
          type="button"
          className="py-2 mt-3 font-medium text-[#1C3753]"
          onClick={() => navigate(`/all-reviews/${id}`)}
        >
          See more reviews &#8250;
        </button>
        </Link>
      )}
    </div>
  );
}

export default CustomerReview;
