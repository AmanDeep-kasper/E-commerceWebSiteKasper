import { Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function EditReviewModal({ open, review, onClose, onSave }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImagesPreview, setNewImagesPreview] = useState([]);
  const [files, setFiles] = useState([]);
  const [removedPublicIds, setRemovedPublicIds] = useState([]);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));

    setNewImagesPreview((prev) => [...prev, ...previewUrls]);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  useEffect(() => {
    if (!open || !review) return;

    setRating(review.rating || 0);
    setText(review.reviewText || "");

    const existing = review.reviewImages?.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    })) || [];

    setExistingImages(existing);
    setNewImagesPreview([]);
    setFiles([]);
    setRemovedPublicIds([]);
  }, [open, review]);

  if (!open || !review) return null;

  const handleRemoveExistingImage = (idx, publicId) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
    setRemovedPublicIds((prev) => [...prev, publicId]);
  };

  const handleRemoveNewImage = (idx) => {
    setNewImagesPreview((prev) => prev.filter((_, i) => i !== idx));
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const formData = new FormData();

    formData.append("rating", rating);
    formData.append("reviewText", text);
    formData.append("reviewId", review._id);

    // Send publicIds of images to delete
    if (removedPublicIds.length > 0) {
      removedPublicIds.forEach((publicId) => {
        formData.append("removeImages[]", publicId);
      });
    }

    // Send new files
    files.forEach((file) => {
      formData.append("reviewImages", file);
    });

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg overflow-hidden">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Ratings & Reviews
          </h2>
        </div>

        <div className="p-6">
          {/* Product Row */}
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden border bg-gray-50 flex-shrink-0">
              <img
                src={review.productId?.image}
                alt={review.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-800 font-medium">
                How was the item?
              </p>
              <p className="text-sm text-gray-600">
                {review.productId?.productTittle}
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

          {/* Image upload area */}
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
            <div className="flex items-start gap-4 flex-wrap">
              {/* Existing Images */}
              {existingImages.map((img, idx) => (
                <div
                  key={img.publicId + idx}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border bg-white"
                >
                  <img
                    src={img.url}
                    alt="review"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx, img.publicId)}
                    className="absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full bg-white border flex items-center justify-center shadow"
                    aria-label="Remove image"
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              ))}

              {/* New Images Preview */}
              {newImagesPreview.map((src, idx) => (
                <div
                  key={src + idx}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border bg-white"
                >
                  <img
                    src={src}
                    alt="new review"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full bg-white border flex items-center justify-center shadow"
                    aria-label="Remove image"
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              ))}

              {/* Hidden file input */}
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Add button */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="w-20 h-20 rounded-lg border bg-white text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="min-w-[140px] rounded-lg bg-[#1C3753] px-6 py-3 text-white text-sm font-medium hover:opacity-95"
            >
              Save
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

export default EditReviewModal;