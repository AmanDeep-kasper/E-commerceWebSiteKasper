import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import Reviews from "../components/Reviews";
import CustomerReview from "../components/CustomerReview";
import axiosInstance from "../api/axiosInstance";
import EmptyState from "../components/EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";

function AllReviews() {
  const { slugOrId } = useParams();
  const [allReviews, setAllReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);

        const res = await axiosInstance.get(
          `/review/all-product-reviews/${slugOrId}`,
        );

        setAllReviews(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setAllReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (slugOrId) {
      fetchReviews();
    }
  }, [slugOrId]);

  const allReviewImages = useMemo(() => {
    return allReviews.flatMap((review) =>
      (review?.reviewImages || []).map((img) => ({
        ...img,
        reviewerName: review?.reviewerName,
        rating: review?.rating,
        reviewText: review?.reviewText,
        createdAt: review?.createdAt,
      })),
    );
  }, [allReviews]);

  const scrollGallery = (direction) => {
    const container = document.getElementById("review-image-gallery");
    if (!container) return;

    const scrollAmount = 320;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <section className="lg:px-20 md:px-[60px] px-4 py-6">
          <EmptyState heading="Loading..." description="Fetching reviews..." />
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="lg:px-20 md:px-[60px] px-4 py-32">
        <div className="w-full" id="reviews-section">
          <div className="flex items-center gap-2">
            <ChevronLeft
              size={25}
              className="cursor-pointer text-[#1800AC]"
              onClick={() => navigate(`/product/${slugOrId}`)}
            />
            <h3 className="text-xl font-semibold font-marcellus text-[#1800AC]">
              Rating & Reviews
            </h3>
          </div>

          <div className="mt-6">
            <Reviews reviews={allReviews} hideReviewButton />
          </div>

          {/* Review Image Gallery Strip */}
          {allReviewImages.length > 0 && (
            <div className="mt-6 rounded-xl bg-[#ffff] border border-[#E5E5E5] p-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-[18px] font-semibold text-[#1800AC]">
                    Review With images
                  </h4>
                  <p className="text-sm text-[#686868]">
                    {allReviewImages.length} photo
                    {allReviewImages.length === 1 ? "" : "s"} from reviews
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollGallery("left")}
                    className="w-9 h-9 rounded-full bg-white border border-[#D7D7D7] flex items-center justify-center hover:bg-[#F8F8F8]"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollGallery("right")}
                    className="w-9 h-9 rounded-full bg-white border border-[#D7D7D7] flex items-center justify-center hover:bg-[#F8F8F8]"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div
                id="review-image-gallery"
                className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
              >
                {allReviewImages.map((img, idx) => (
                  <button
                    key={img?._id || idx}
                    type="button"
                    onClick={() => setPreviewImage(img)}
                    className="shrink-0 w-[140px] h-[120px] bg-white rounded-lg overflow-hidden border border-[#E1E1E1] hover:shadow-md transition"
                  >
                    <img
                      src={img?.url}
                      alt={`review-${idx}`}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <CustomerReview reviews={allReviews} allReviews={true} />
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-5xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-[1fr_320px]">
              <div className="bg-black flex items-center justify-center min-h-[320px]">
                <img
                  src={previewImage?.url}
                  alt="preview"
                  className="max-h-[80vh] max-w-full object-contain"
                />
              </div>

              <div className="p-5">
                <h4 className="text-lg font-semibold text-[#1C1C1C]">
                  {previewImage?.reviewerName || "Customer Review"}
                </h4>

                <p className="text-sm text-[#6C6B6B] mt-1">
                  Rating: {previewImage?.rating || "-"} / 5
                </p>

                <p className="text-sm text-[#6C6B6B] mt-1">
                  {previewImage?.createdAt
                    ? new Date(previewImage.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : ""}
                </p>

                <p className="text-sm text-[#2F2F2F] mt-4 leading-6">
                  {previewImage?.reviewText || "No review text available."}
                </p>

                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="mt-6 px-4 py-2 rounded-md border border-[#1C3753] text-[#1C3753] hover:bg-[#1C3753] hover:text-white transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default AllReviews;
