import React from "react";
import { X } from "lucide-react";

const DisplayVariantImg = ({
  isModalOpen,
  selectedImages,
  currentImage,
  setCurrentImage,
  setIsModalOpen,
  variantIndex,
  onRemoveImage, // <-- new prop
    onAddMoreImages, // <-- new prop for adding more images
  isUploading = false, // <-- loading state
}) => {
  if (!isModalOpen) return null;
   const hasLessThan10Images = selectedImages.length < 10;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="relative  bg-black/10  rounded-xl p-6 w-[90%] max-w-[700px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✕ Main close */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-3 right-3 text-gray-800 hover:text-red-600 text-3xl font-bold transition-all"
        >
          ✕
        </button>

        {/* Large Preview */}
        <div className="flex justify-center mb-4">
          <img
            className="w-[400px] h-[400px] object-contain rounded-lg"
            src={currentImage}
            alt="Selected variant"
          />
        </div>
       {hasLessThan10Images && (
         <div className="flex items-center justify-center mb-4">
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 hover:bg-[#264464] text-gray px-4 py-2 rounded-lg transition-colors" style={{background:"white",}}>
{isUploading ? (
  <>
   <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Uploading...</span>
  </>
): (
  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <span>Upload Images</span>
                  </>
       )}
       </div>
       <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.webp,.svg"
                className="hidden"
                onChange={(e) => onAddMoreImages(e, variantIndex)}
                disabled={isUploading}
              />
            </label>
          </div>
        )}

  {/* Show message when max images reached */}
        {selectedImages.length >= 10 && (
          <div className="text-center mb-4 text-amber-600 text-sm">
            Maximum 10 images reached
          </div>
        )}

        {/* Thumbnails */}
        <div className="flex justify-center items-center gap-4 flex-wrap overflow-x-hidden overflow-y-auto  p-5">
          {selectedImages.map((img, i) => {
            const imgSrc =
              typeof img === "string"
                ? img
                : img.url
                  ? img.url
                  : img.preview
                    ? img.preview
                    : "";

            return (
              <div key={i} className="relative">
                {/* Thumbnail */}
                <img
                  src={imgSrc}
                  onClick={() => setCurrentImage(imgSrc)}
                  alt={`Thumbnail ${i}`}
                  className={`w-[40px] h-[40px] object-cover rounded-md cursor-pointer border-2 transition-transform hover:scale-105 ${
                    currentImage === imgSrc
                      ? "border-[#DD851F]"
                      : "border-transparent"
                  }`}
                />

                {/* Small ✕ remove */}
                <button
                  type="button"
                  onClick={() => onRemoveImage(variantIndex, i)} //  calls parent fn
                  className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-amber-600 transition"
                >
                  <X size={10} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DisplayVariantImg;
