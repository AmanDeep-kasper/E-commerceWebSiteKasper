import React, { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { twMerge } from "tailwind-merge";
import products from "../data/products.json";
import { motion, AnimatePresence } from "framer-motion";

const sortOptions = [
  { label: "Price (Low to High)", value: "low" },
  { label: "Price (High to Low)", value: "high" },
  { label: "Latest", value: "latest" },
  { label: "Customer Rating", value: "rating" },
  { label: "A to Z", value: "atoz" },
];

function Filter({
  setParam = () => {},
  val = "",
  colors = [],
  setColor = () => {},
  sort = () => {},
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterSubcategories, setFilterSubcategories] = useState([]);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // mobile modal

  // temp states for mobile filters
  const [tempCategory, setTempCategory] = useState("All");
  const [tempColor, setTempColor] = useState("");

  const navigate = useNavigate();
  const { categoryName, subcategoryName } = useParams();

  // extract subcategories
  useEffect(() => {
    if (Array.isArray(products)) {
      const matchedSubcategories = [
        "All",
        ...new Set(
          products
            .filter(
              (item) =>
                item.category.trim().toLowerCase() ===
                categoryName.trim().toLowerCase()
            )
            .map((item) => item.subcategory?.trim())
            .filter(Boolean)
        ),
      ];
      setFilterSubcategories(matchedSubcategories);
    }
  }, [categoryName]);

  // sync params for desktop
  useEffect(() => {
    setParam(val || "");
    setSelectedCategory(val || "All");
  }, [val, setParam]);

  useEffect(() => {
    if (subcategoryName) {
      setSelectedCategory(decodeURIComponent(subcategoryName));
    } else {
      setSelectedCategory("All");
    }
  }, [subcategoryName]);

  // disable background scroll when mobile nav is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden"; // lock scroll
    } else {
      document.body.style.overflow = "auto"; // restore scroll
    }

    // cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // 🟡 Shared content (used in both desktop + mobile)
  const FiltersContent = ({ isMobile = false }) => (
    <>
      {/* Filters */}
      <div className="mb-6 max-lg:hidden">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 flex justify-between items-center border-b border-gray-300 pb-2">
          Filters
        </h1>
        <div className="flex flex-wrap gap-2 mt-3">
          {sortOptions.map(({ label, value }) => (
            <button
              key={value}
              className={`px-3 py-1.5 whitespace-nowrap rounded-full text-sm transition ${
                selectedSort === label
                  ? "bg-yellow-500 text-white cursor-default"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                setSelectedSort(label);
                sort(value);
                setSortOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* Categories */}
      <div className="mb-6">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 flex justify-between items-center border-b border-gray-300 pb-2">
          Categories
        </h1>
        <div className="flex flex-wrap gap-2 mt-3">
          {filterSubcategories.map((subcat, index) => (
            <button
              key={index}
              className={`px-3 py-1.5 whitespace-nowrap rounded-full text-sm transition ${
                (isMobile ? tempCategory : selectedCategory) === subcat
                  ? "bg-yellow-500 text-white cursor-default"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() =>
                isMobile
                  ? setTempCategory(subcat)
                  : (() => {
                      setSelectedCategory(subcat);
                      navigate(
                        `/products/${encodeURIComponent(categoryName)}/${
                          subcat === "All" ? "" : encodeURIComponent(subcat)
                        }`
                      );
                    })()
              }
            >
              {subcat}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-6">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 flex justify-between items-center border-b border-gray-300 pb-2">
          Colors
        </h1>
        <div className="flex gap-3 mt-3 flex-wrap">
          {colors.map(({ colorName, colorCode }) => (
            <div
              key={colorName}
              className={twMerge(
                "w-7 h-7 rounded-full ring-2 cursor-pointer transition",
                colorCode,
                (isMobile ? tempColor : val) === colorName
                  ? "ring-yellow-500 scale-110"
                  : "ring-gray-300"
              )}
              onClick={() =>
                isMobile
                  ? setTempColor((prev) =>
                      prev === colorName ? "" : colorName
                    )
                  : setColor((prev) => (prev === colorName ? "" : colorName))
              }
              title={colorName}
            ></div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 🖥️ Desktop sidebar (applies instantly) */}
      <div className="hidden lg:block lg:sticky top-20 bg-white p-4 border border-gray-200 rounded-md h-max w-[260px]">
        <FiltersContent />
      </div>

      {/* 📱 Mobile: Filters button + Sort dropdown */}
      <div className="flex justify-between items-center lg:hidden mb-4">
        <button
          className="px-4 py-2 border border-gray-400 rounded-md text-sm"
          onClick={() => {
            // reset temp state when opening
            setTempCategory(selectedCategory);
            setTempColor(val);
            setShowModal(true);
          }}
        >
          Filters
        </button>

        <div className="relative">
          <button
            className="px-4 py-2 border border-gray-400 rounded-md flex items-center gap-2 text-sm"
            onClick={() => setSortOpen(!sortOpen)}
          >
            {selectedSort} <ChevronDown className="h-4 w-4" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md z-30 w-[200px]">
              {sortOptions.map(({ label, value }) => (
                <p
                  key={value}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setSelectedSort(label);
                    sort(value);
                    setSortOpen(false);
                  }}
                >
                  {label}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 📱 Mobile Filters Bottom Sheet */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed lg:hidden inset-0 bg-black/40 z-50 flex items-end">
            <div
              className="absolute inset-0"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative bg-white w-full rounded-t-2xl p-5 shadow-lg z-50"
            >
              <button
                className="absolute top-3 right-3 text-gray-600"
                onClick={() => setShowModal(false)}
              >
                <X className="h-6 w-6" />
              </button>

              <FiltersContent isMobile />

              {/* Apply + Clear actions */}
              <div className="flex justify-between gap-3 border-t pt-4 mt-6">
                <button
                  className="flex-1 py-2 border rounded-md text-gray-600"
                  onClick={() => {
                    setTempCategory("All");
                    setTempColor("");
                  }}
                >
                  Clear
                </button>
                <button
                  className="flex-1 py-2 bg-yellow-500 text-white rounded-md"
                  onClick={() => {
                    // apply changes
                    setSelectedCategory(tempCategory);
                    setColor(tempColor);
                    navigate(
                      `/products/${encodeURIComponent(categoryName)}/${
                        tempCategory === "All"
                          ? ""
                          : encodeURIComponent(tempCategory)
                      }`
                    );
                    setShowModal(false);
                  }}
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Filter;
