import React from "react";
import { X } from "lucide-react"; //  use Lucide for a consistent icon style

const DisplayVariantImg = ({
  isModalOpen,
  selectedImages,
  currentImage,
  setCurrentImage,
  setIsModalOpen,
  variantIndex,
  onRemoveImage, // <-- new prop
}) => {
  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="relative  bg-black/30  rounded-xl p-6 w-[90%] max-w-[700px] shadow-2xl"
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

        {/* Thumbnails */}
        <div className="flex justify-center items-center gap-4 flex-wrap overflow-x-hidden overflow-y-auto  p-3">
          {selectedImages.map((img, i) => {
            const imgSrc =
              typeof img === "string"
                ? img
                : img.preview || URL.createObjectURL(img);

            return (
              <div key={i} className="relative">
                {/* Thumbnail */}
                <img
                  src={imgSrc}
                  onClick={() => setCurrentImage(imgSrc)}
                  alt={`Thumbnail ${i}`}
                  className={`w-[70px] h-[70px] object-cover rounded-md cursor-pointer border-2 transition-transform hover:scale-105 ${
                    currentImage === imgSrc
                      ? "border-[#DD851F]"
                      : "border-transparent"
                  }`}
                />

                {/* Small ✕ remove */}
                <button
                  type="button"
                    onClick={() => onRemoveImage(variantIndex, i)} //  calls parent fn
                  className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-amber-600 transition"
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
