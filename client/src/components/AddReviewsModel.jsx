import { Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";

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
    const MAX_SIZE_MB = 5;

    // filter only image
    const valid = files.filter((f) => f.type.startsWith("image/"));

    // size filter
    const sizeOk = valid.filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024);

    // create preview urls
    const newUrls = sizeOk.map((f) => URL.createObjectURL(f));

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
      if (!rating) {
        alert("Please select rating");
        return;
      }

      if (!product?._id) {
        alert("Product id missing");
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("reviewText", text);

      imageFiles.forEach((file) => {
        formData.append("reviewImages", file);
      });

      const res = await axiosInstance.post(
        `/review/add-review/${product._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const savedReview = res?.data?.data;
      onSave(savedReview);
    } catch (error) {
      console.error("Error adding review:", error);
      alert(error?.response?.data?.message || "Failed to add review");
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
          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="min-w-[140px] rounded-lg bg-[#1C3753] px-6 py-3 text-white text-sm font-medium hover:opacity-95"
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddReviewsModel;
