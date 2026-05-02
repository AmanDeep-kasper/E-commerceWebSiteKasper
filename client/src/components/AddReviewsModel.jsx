import { Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

function AddReviewsModel({ open, review, onClose, onSave, product }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  // We'll store preview URLs here (strings)
  const [images, setImages] = useState([]);

  // Keep selected File objects if you later want to upload to backend
  const [imageFiles, setImageFiles] = useState([]);

  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Reset for Add mode, fill for Edit mode
  useEffect(() => {
    if (!open) return;

    if (review) {
      setRating(Number(review.rating) || 0);
      setText(review.review || "");

      // If edit mode: backend urls
      const existing = review.images || (review.image ? [review.image] : []);
      setImages(existing);
      setImageFiles([]); // you can keep empty for edit
    } else {
      setRating(0);
      setText("");
      setImages([]);
      setImageFiles([]);
    }
  }, [open, review]);

  // ✅ Cleanup object URLs on unmount/close
  useEffect(() => {
    return () => {
      // revoke only local object urls
      images.forEach((src) => {
        if (typeof src === "string" && src.startsWith("blob:")) {
          URL.revokeObjectURL(src);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!open) return null;

  const handlePickImages = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // ✅ optional constraints
    const MAX_FILES = 5;
    const MAX_SIZE_MB = 2; // Changed from 5 to 2 as per validation requirement

    // filter only image
    const valid = files.filter((f) => f.type.startsWith("image/"));

    // size filter
    const sizeOk = valid.filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024);

    // Show toast for files exceeding 2MB
    const exceededFiles = valid.filter(
      (f) => f.size > MAX_SIZE_MB * 1024 * 1024,
    );
    if (exceededFiles.length > 0) {
      toast.error(
        `Each image must be within 2MB. ${exceededFiles.length} file(s) exceeded limit.`,
      );
    }

    // create preview urls
    const newUrls = sizeOk.map((f) => URL.createObjectURL(f));

    // Check if adding these would exceed MAX_FILES
    if (images.length + newUrls.length > MAX_FILES) {
      toast.error(
        `Maximum ${MAX_FILES} images allowed. You can only add ${MAX_FILES - images.length} more.`,
      );
      return;
    }

    // append but limit
    setImages((prev) => {
      const merged = [...prev, ...newUrls];
      return merged.slice(0, MAX_FILES);
    });

    setImageFiles((prev) => {
      const merged = [...prev, ...sizeOk];
      return merged.slice(0, MAX_FILES);
    });

    // reset input so same file can be selected again
    e.target.value = "";
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => {
      const removed = prev[idx];
      // revoke only local blob url
      if (typeof removed === "string" && removed.startsWith("blob:")) {
        URL.revokeObjectURL(removed);
      }
      return prev.filter((_, i) => i !== idx);
    });

    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    try {
      // Validation: rating must be selected
      if (!rating || rating === 0) {
        toast.error("Please select a rating");
        return;
      }

      // Validation: review text minimum 10 chars, maximum 2000 chars
      const trimmedText = text.trim();
      if (!trimmedText || trimmedText.length < 10) {
        toast.error("Review text must be at least 10 characters");
        return;
      }
      if (trimmedText.length > 2000) {
        toast.error("Review text cannot exceed 2000 characters");
        return;
      }

      // Validation: images count (max 5)
      if (imageFiles.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }

      // Validation: each image size within 2MB (already validated on add, but double-check)
      const oversizedImages = imageFiles.filter(
        (file) => file.size > 2 * 1024 * 1024,
      );
      if (oversizedImages.length > 0) {
        toast.error("Each image must be within 2MB");
        return;
      }

      if (!product?._id) {
        toast.error("Product id missing");
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("reviewText", text);

      imageFiles.forEach((file) => {
        formData.append("reviewImages", file);
      });

      const promise = axiosInstance.post(
        `/review/add-review/${product._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.promise(promise, {
        pending: review ? "Updating review..." : "Adding review...",
        success: review
          ? "Review updated successfully"
          : "Review added successfully",
        error: "Something went wrong while saving review",
      });

      try {
        const res = await promise;
        const savedReview = res?.data?.data;
        onSave(savedReview);
      } catch (err) {
        console.error(err);
      }
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error(error?.response?.data?.message || "Failed to add review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg overflow-hidden">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Ratings & Reviews
          </h2>
          <button onClick={onClose} className="p-1">
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          {/* Product Row */}
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden border bg-gray-50 flex-shrink-0">
              <img
                src={review?.image || product?.image || "/placeholder.png"}
                alt={review?.name || product?.title || "Product"}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800 font-medium">
                How was the item?
              </p>
              <p className="text-sm text-gray-600">
                {review?.name || product?.title || "Write your review"}
              </p>
            </div>
          </div>

          {/* Stars */}
          <div className="mt-4 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="p-0.5"
                aria-label={`Rate ${s} star`}
              >
                <Star
                  className={`w-8 h-8 ${
                    s <= rating
                      ? "fill-[#F4A13D] text-[#F4A13D]"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Textarea */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900 mb-2">
              Write a review
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[120px] rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1C3753]/20"
              placeholder="Share your experience..."
            />
          </div>

          {/* Images */}
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
            <div className="flex items-start gap-4 flex-wrap">
              {images.map((src, idx) => (
                <div
                  key={src + idx}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border bg-white"
                >
                  <img
                    src={src}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    alt="review"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full bg-white border flex items-center justify-center shadow"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              ))}

              {/* Hidden input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilesChange}
              />

              {/* Add Button */}
              <button
                type="button"
                onClick={handlePickImages}
                className="w-20 h-20 rounded-lg border bg-white text-sm text-gray-500 hover:bg-gray-100"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Footer */}
          {/* <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="min-w-[140px] rounded-lg bg-[#1800AC] px-6 py-3 text-white text-sm font-medium hover:opacity-95"
            >
              {review ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-w-[140px] rounded-lg border border-[#1C3753] px-6 py-3 text-[#1C3753] text-sm font-medium hover:bg-[#1C3753]/5"
            >
              Cancel
            </button>
          </div> */}
          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="min-w-[140px] rounded-lg bg-[#1800AC] px-6 py-3 text-white text-sm font-medium hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {review ? "Updating..." : "Creating..."}
                </>
              ) : review ? (
                "Update"
              ) : (
                "Save"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-w-[140px] rounded-lg border border-[#1C3753] px-6 py-3 text-[#1C3753] text-sm font-medium hover:bg-[#1C3753]/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddReviewsModel;
