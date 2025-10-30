import React from "react";

const DisplayVariantImg = ({
  isModalOpen,
  selectedImages,
  currentImage,
  setCurrentImage,
  setIsModalOpen,
}) => {
  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 w-[80%] max-w-[700px] relative">
            {/* Close Button */}
            <button
             onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-white hover:text-black text-[20px]"
            >
              ✕
            </button>

            {/* Large Main Image */}
            <div className="flex justify-center mb-4">
              <img
                className="w-[400px] h-[400px] object-contain rounded-lg"
                src={currentImage}
                alt="Selected variant"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex justify-center items-center gap-3 overflow-x-auto">
              {selectedImages.map((img, i) => {
                const imgSrc =
                  typeof img === "string"
                    ? img
                    : img.preview || URL.createObjectURL(img);
                return (
                  <img
                    key={i}
                    src={imgSrc}
                    onClick={() => setCurrentImage(imgSrc)}
                    alt={`Thumbnail ${i}`}
                    className={`w-[70px] h-[70px] object-cover rounded-md cursor-pointer border-2 ${
                      currentImage === imgSrc
                        ? "border-[#DD851F]"
                        : "border-transparent"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayVariantImg;
