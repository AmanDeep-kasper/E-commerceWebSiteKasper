import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const options = [
  { label: "Recommended", value: "recommended" },
  { label: "Price (Low to High)", value: "price_low" },
  { label: "Price (High to Low)", value: "price_high" },
  { label: "Latest", value: "latest" },
  { label: "Ratings (High to Low)", value: "rating_high" },
  { label: "Ratings (Low to High)", value: "rating_low" },
  { label: "Alphabetical (A to Z)", value: "atoz" },
  { label: "Alphabetical (Z to A)", value: "ztoa" },
];

function FilterProducts({ text = "Latest Products", sort }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]); // object
  const dropdownRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex justify-between items-center w-full mb-5 p-2">
      <div className="flex md:gap-[160px] max-md:hidden">
        <p className="text-xl font-medium">{text}</p>
      </div>

      {/* Make this relative so absolute dropdown positions correctly */}
      <div
        ref={dropdownRef}
        className="relative flex max-md:justify-between gap-2 drop-shadow-md items-center z-30 max-sm:text-xs max-md:w-full"
      >
        <span>Sort by:</span>

        <button
          type="button"
          className="md:w-[200px] max-sm:text-xs h-10 border border-[#7C7C7C] rounded-[5px] flex justify-between items-center px-2 bg-white"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="text-[#3A3A3A]">{selected.label}</span>
          <ChevronDown
            className={`max-sm:h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-12 right-0 bg-white w-[200px] border border-[#7C7C7C] rounded-[5px] overflow-hidden">
            {options.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className="w-full text-left hover:bg-[#fff2cc] border-b border-[#7C7C7C] last:border-b-0 px-[15px] py-2"
                onClick={() => {
                  setSelected(opt);
                  sort?.(opt.value); // safe call
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterProducts;