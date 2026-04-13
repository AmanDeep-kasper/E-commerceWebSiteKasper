// import img from "../assets/Art3.jpg";
import { Link } from "react-router-dom";
import {
  Star,
  Check,
  Edit,
  Trash2,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Ban,
} from "lucide-react";
import EmptyState from "./EmptyState";
import { useState } from "react";
import EditReviewModal from "./EditReviewsModel";
// import axiosInstance from "../api/axiosInstance";
import reviewService from "../services/reviewService";
import { useEffect } from "react";
import ReviewSkeleton from "./ReviewSkeleton ";

const initialReviews = [
  {
    name: "Adiyogi Shiva Metal Wall Art | Sculpture For Home Living Room ...",
    rating: 5,
    reviewTitle: "Awesome",
    review:
      "Absolutely beautiful! The detail in the metal is stunning and it looks elegant on our living room wall.",
    // image: img,
    like: 0,
    dislike: 0,
    userName: "Admin",
    date: "11 Jun 2025",
    id: 1,
  },
  {
    name: "Adiyogi Shiva Metal Wall Art | Sculpture For Home Living Room ...",
    rating: 5,
    reviewTitle: "Awesome",
    review:
      "Absolutely beautiful! The detail in the metal is stunning and it looks elegant on our living room wall.",
    // image: img,
    like: 0,
    dislike: 0,
    userName: "Admin",
    date: "11 Jun 2025",
    id: 2,
  },
  {
    name: "Adiyogi Shiva Metal Wall Art | Sculpture For Home Living Room ...",
    rating: 5,
    reviewTitle: "Awesome",
    review:
      "Absolutely beautiful! The detail in the metal is stunning and it looks elegant on our living room wall.",
    // image: img,
    like: 0,
    dislike: 0,
    userName: "Admin",
    date: "11 Jun 2025",
    id: 3,
  },
  {
    name: "Adiyogi Shiva Metal Wall Art | Sculpture For Home Living Room ...",
    rating: 5,
    reviewTitle: "Awesome",
    review:
      "Absolutely beautiful! The detail in the metal is stunning and it looks elegant on our living room wall.",
    // image: img,
    like: 0,
    dislike: 0,
    userName: "Admin",
    date: "11 Jun 2025",
    id: 4,
  },
];

function MyReviews({ totalItems = 0 }) {
  // delete model
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // edit model
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Add API call to fetch reviews on component mount (useEffect)
  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await reviewService.getUserReviews();
      console.log("API RESPONSE:", res.data);

      setReviews(res.data || res.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const handleConfirmDelete = async () => {
    if (!selectedReviewId) return;

    try {
      setDeleting(true);

      // deleteReviewLocal(selectedReviewId);
      await reviewService.deleteReview(selectedReviewId);
      setReviews((prev) => prev.filter((r) => r._id !== selectedReviewId));
      
      setOpenCancelModal(false);
      setSelectedReviewId(null);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleting(false);
    }
  };
  
  console.log("Deleting ID:", selectedReviewId);
  

  return (
    <div className="w-full font-inter rounded-md overflow-hidden">
      {openCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[30%] max-w-md rounded-xl bg-white p-5 shadow-lg">
            <div className="text-lg font-semibold flex items-center justify-center text-gray-900">
              <div className="bg-[#FFEAE9] p-2 rounded-full">
                <Ban className="text-[#D53B35]" />
              </div>
            </div>
            <p className="mt-2 text-xl text-center text-gray-600">
              Are you sure you want to delete this review?
            </p>

            <div className="mt-5 flex justify-center items-center gap-3">
              <button
                onClick={() => setOpenCancelModal(false)}
                className="px-4 py-2 rounded-lg border border-[#686868] text-sm hover:bg-gray-50"
              >
                No
              </button>

              <button
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-[#D53B35] text-white text-sm hover:bg-[#b92f2a]"
              >
                {deleting ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <EditReviewModal
        open={openEditModal}
        review={selectedReview}
        onClose={() => {
          setSelectedReview(null);
          setOpenEditModal(false);
        }}
        onSave={async (updated) => {
          try {
            const res = await reviewService.updateReview(
              selectedReview._id,
              updated,
            );
            console.log("Sending update:", updated);
            const updatedReview = res.data || res.review;

            setReviews((prev) =>
              prev.map((r) =>
                r._id === updatedReview._id ? updatedReview : r,
              ),
            );
            setOpenEditModal(false);
            setSelectedReview(null);
          } catch (error) {
            console.error("Update failed:", error);
          }
        }}
      />
      {/* Header */}
      <div className="flex flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white md:shadow-sm border-b border-gray-200">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Reviews & Ratings ({reviews.length})
          </h1>
        </div>
        {totalItems > 0 && (
          <button className="flex items-center gap-2 px-4 sm:px-5 py-2 text-[#1C3753] hover:text-[#1C3753] font-medium underline transition-colors duration-200 text-sm">
            View all
          </button>
        )}
      </div>

      {loading ? (
        <div className="md:mt-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          heading="No Reviews Yet"
          description="You haven’t reviewed any products yet. Share your thoughts to help
            others shop better."
          icon={Star}
          ctaLabel="Browse Products"
          ctaLink="/products"
        />
      ) : (
        /* Reviews List */
        <div className="md:mt-4 md:space-y-4 max-h-[520px] overflow-y-auto pr-2">
          {reviews.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="bg-white p-2 sm:p-3 md:rounded-md md:shadow-sm md:hover:shadow-md transition-shadow duration-200 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="w-full md:w-24 flex-shrink-0">
                  {/* <img
                    className="w-full h-full md:h-32 object-contain rounded-lg "
                    src={item.productImage || img}
                    alt={item.name}
                  /> */}
                </div>

                {/* Review Content */}
                <div className="flex-1 ">
                  {/* Product Name and Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 ">
                    <h2 className="text-base sm:text-lg font-medium text-gray-700">
                      {item.reviewText}
                    </h2>

                    {/* Reviewer Info */}
                    <div className="flex flex-wrap items-center gap-2 text-gray-500 text-xs sm:text-sm mb-4">
                      <span>
                        {new Date(item.updatedAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  {/* stars in user reviews */}
                  <div className="flex items-center gap-2 mb-2 py-1 rounded-full w-max">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.floor(item.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Images */}
                  <div className="mt-2">
                    {item.reviewImages && item.reviewImages.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {item.reviewImages.map((img, index) => (
                          <img
                            key={index}
                            src={img.url}
                            alt="review"
                            className="w-16 h-16 object-cover rounded-md border hover:scale-105 transition"
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    {item.reviewText ? item.reviewText : "No Reviews"}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4 text-xs sm:text-sm border-t border-gray-200 pt-4">
                    <button
                      onClick={() => {
                        setSelectedReview(item);
                        setOpenEditModal(true);
                      }}
                      className="flex items-center gap-1 text-[#686868] hover:text-[#686868] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReviewId(item._id);
                        setOpenCancelModal(true);
                      }}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReviews;
