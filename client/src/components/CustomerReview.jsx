import { useEffect, useMemo, useState } from "react";
import Ratings from "./Ratings";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import hardCompanylogo from "../assets/IconsUsed/fabicon.png";

function CustomerReview({ reviews = [], id, allReviews = false }) {
  const [moreReview] = useState(2);
  const [fetchedReviews, setFetchedReviews] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFetchedAll) {
      setFetchedReviews(reviews || []);
    }
  }, [reviews, hasFetchedAll]);

  const productReview = useMemo(() => {
    if (!fetchedReviews) return [];
    return allReviews || hasFetchedAll
      ? fetchedReviews
      : fetchedReviews.slice(0, moreReview);
  }, [fetchedReviews, allReviews, hasFetchedAll, moreReview]);

  const handleSeeMoreReviews = async () => {
    try {
      setLoadingMore(true);

      if (!hasFetchedAll) {
        const res = await axiosInstance.get(
          `/review/all-product-reviews/${id}`,
        );

        setFetchedReviews(res?.data?.data || []);
        setHasFetchedAll(true);
      } else {
        navigate(`/all-reviews/${id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  // console.log(fetchedReviews);

  if (!fetchedReviews || fetchedReviews.length === 0) {
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
          (
            {
              _id,
              reviewerName,
              reviewerImage,
              reviewText,
              rating,
              reviewImages,
              createdAt,
              replyText,
              replyDate,
            },
            index,
          ) => (
            <div
              key={_id || index}
              className="border border-[#DADADA] rounded-lg bg-[#FCFCFC] p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex gap-3">
                  {reviewerImage ? (
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={reviewerImage}
                      alt={`${reviewerName}'s avatar`}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#D9A7A0] flex items-center justify-center text-white font-medium text-sm shrink-0">
                      {reviewerName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-[15px] font-medium text-[#222]">
                        {reviewerName}
                      </h1>
                      <Ratings avgRating={Number(rating)} />
                      <span className="text-[#6C6B6B] text-[12px]">
                        (
                        {new Date(createdAt).toLocaleDateString("en-GB", {
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

              {reviewImages?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {reviewImages.map((img, idx) => (
                    <img
                      key={idx}
                      className="w-14 h-14 object-cover rounded border"
                      src={img?.url}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      alt="review"
                    />
                  ))}
                </div>
              )}

              <p className="text-sm text-[#3A3A3A] mt-3 leading-6">
                {reviewText}
              </p>
              {replyText ? (
                <div className="bg-[#F0EEFF] px-[10px] py-[12px] rounded-md">
                  <div className="flex items-center justify-start gap-2">
                    <img
                      className="w-[24px] h-[24px] rounded-full"
                      src={hardCompanylogo}
                      alt=""
                    />
                    <span className="text-[16px]">Happy Art Supplies</span>
                    <span className="text-[14px] text-[#686868]">
                      {replyText ? "Replied:" : ""}
                    </span>
                  </div>
                  <p className="mt-2">{reviewText}</p>
                </div>
              ) : (
                ""
              )}
            </div>
          ),
        )}
      </div>

      {!allReviews && fetchedReviews.length > moreReview && (
        <button
          type="button"
          className="py-2 mt-3 font-medium text-[#1800AC]"
          // onClick={() => navigate(`/all-reviews/${id}`)}
          onClick={handleSeeMoreReviews}
        >
          See more reviews ›
        </button>
      )}
    </div>
  );
}

export default CustomerReview;

//  {reviews.length > moreReview && !allReviews && (
//         <Link to={"/rating"}>
//           <button
//             type="button"
//             className="py-2 mt-3 font-medium text-[#1C3753]"
//             onClick={() => navigate(`/all-reviews/${id}`)}
//           >
//             See more reviews &#8250;
//           </button>
//         </Link>
//       )}
