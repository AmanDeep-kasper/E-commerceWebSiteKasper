import React, { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

const sortOptions = [
  { label: "Price (Low to High)", value: "low" },
  { label: "Price (High to Low)", value: "high" },
  { label: "Latest", value: "latest" },
  // { label: "Customer Rating", value: "rating" },
  { label: "A to Z", value: "atoz" },
];

function Filter({
  setParam = () => {},
  val = "",
  colors = [],
  setColor = () => {},
  sort = () => {},
  selectedSubcategory = "All",
  setSelectedSubcategory = () => {},
}) {
  const [filterSubcategories, setFilterSubcategories] = useState([]);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [tempCategory, setTempCategory] = useState("All");
  const [tempColor, setTempColor] = useState("");

  const { categoryName } = useParams();

  // Fetch subcategories based on category
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axiosInstance.get("/product/all");
        
        let allProducts = [];
        if (res.data?.success && res.data?.data) {
          allProducts = res.data.data;
        } else if (Array.isArray(res.data)) {
          allProducts = res.data;
        } else if (res.data?.products) {
          allProducts = res.data.products;
        }

        const decodedCategory = decodeURIComponent(categoryName || "").trim().toLowerCase();
        
        // Filter products by categoryName (string) NOT category (object)
        const productsInCategory = allProducts.filter(
          (item) => (item.categoryName || "").trim().toLowerCase() === decodedCategory
        );
        
        // Extract subcategoryName from matching products
        const subcategoryNames = productsInCategory
          .map((item) => item.subcategoryName || "")
          .filter(Boolean);
        
        const uniqueSubcategories = [...new Set(subcategoryNames)];
        const matchedSubcategories = ["All", ...uniqueSubcategories];
        
        setFilterSubcategories(matchedSubcategories);
      } catch (error) {
        console.log("Subcategory fetch error:", error);
        setFilterSubcategories(["All"]);
      }
    };

    if (categoryName) {
      fetchSubcategories();
    }
  }, [categoryName]);

  // Set search param from val
  useEffect(() => {
    setParam(val || "");
  }, [val, setParam]);

  // Body scroll lock for modal
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const [filteropen, setFilterOpen] = useState(false);
  const [subopen, setSubOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const FiltersContent = ({ isMobile = false }) => (
    <>
      {/* Sort Filters */}
      <div className="mb-6 max-lg:hidden border-b pb-2">
        <button
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
          className="w-full text-lg sm:text-xl font-medium text-gray-800 flex justify-between items-center"
        >
          <span>Filters</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${
              filteropen ? "rotate-180" : ""
            }`}
          />
        </button>

        {filteropen && (
          <div className="flex flex-wrap gap-2 mt-3">
            {sortOptions.map(({ label, value }) => (
              <button
                key={value}
                className={`px-3 py-1.5 whitespace-nowrap rounded-full text-sm transition ${
                  selectedSort === label
                    ? "bg-[#D5E5F5] text-black cursor-default"
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
        )}
      </div>

      {/* Sub-Categories */}
      <div className="mb-6 border-b pb-2">
        <button
          type="button"
          onClick={() => setSubOpen((prev) => !prev)}
          className="w-full text-lg sm:text-xl font-medium text-gray-800 flex justify-between items-center"
        >
          <span>Sub-Categories</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${
              subopen ? "rotate-180" : ""
            }`}
          />
        </button>

        {subopen && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filterSubcategories.map((subcat, index) => (
              <button
                key={index}
                className={`px-3 py-1.5 whitespace-nowrap rounded-full text-sm transition ${
                  (isMobile ? tempCategory : selectedSubcategory) === subcat
                    ? "bg-[#D5E5F5] text-black cursor-default"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() =>
                  isMobile
                    ? setTempCategory(subcat)
                    : setSelectedSubcategory(subcat)
                }
              >
                {subcat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full text-lg sm:text-xl font-medium text-gray-800 flex justify-between items-center"
        >
          <span>Colors</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="flex flex-wrap gap-2 mt-3">
            {colors.map(({ colorName }) => {
              const isActive = isMobile 
                ? tempColor === colorName 
                : val === colorName;
              return (
                <button
                  key={colorName}
                  type="button"
                  className={twMerge(
                    "text-left px-2 py-1 border rounded-md transition text-xs",
                    isActive
                      ? "bg-[#D5E5F5] text-black font-medium"
                      : "border-gray-300 hover:bg-gray-100"
                  )}
                  onClick={() =>
                    isMobile
                      ? setTempColor((prev) =>
                          prev === colorName ? "" : colorName
                        )
                      : setColor((prev) => {
                          if (prev.includes(colorName)) {
                            return prev.filter((c) => c !== colorName);
                          }
                          return [...prev, colorName];
                        })
                  }
                >
                  {colorName}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <div className="hidden lg:block lg:sticky top-20 bg-white p-4 border border-gray-200 rounded-md h-max w-[260px]">
        <FiltersContent />
      </div>

      <div className="flex justify-between items-center lg:hidden mb-4">
        <button
          className="px-4 py-2 border border-gray-400 rounded-md text-sm"
          onClick={() => {
            setTempCategory(selectedSubcategory);
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
                  className="flex-1 py-2 bg-[#1C3753] text-white rounded-md"
                  onClick={() => {
                    setSelectedSubcategory(tempCategory);
                    setColor(tempColor ? [tempColor] : []);
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
// import React, { useEffect, useState } from "react";
// import { ChevronDown, X } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import { twMerge } from "tailwind-merge";
// import { motion, AnimatePresence } from "framer-motion";
// import axiosInstance from "../api/axiosInstance";

// const sortOptions = [
//   { label: "Price (Low to High)", value: "low" },
//   { label: "Price (High to Low)", value: "high" },
//   { label: "Latest", value: "latest" },
//   { label: "Customer Rating", value: "rating" },
//   { label: "A to Z", value: "atoz" },
// ];

// function Filter({
//   setParam = () => {},
//   val = "",
//   colors = [],
//   setColor = () => {},
//   sort = () => {},
//   selectedSubcategory = "All",
//   setSelectedSubcategory = () => {},
// }) {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [filterSubcategories, setFilterSubcategories] = useState([]);
//   const [selectedSort, setSelectedSort] = useState("Recommended");
//   const [sortOpen, setSortOpen] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const [tempCategory, setTempCategory] = useState("All");
//   const [tempColor, setTempColor] = useState("");

//   const navigate = useNavigate();
//   const { categoryName, subcategoryName } = useParams();
//   // console.log(colors)

//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       try {
//         const res = await axiosInstance.get("/product/all");
//         // console.log(res)
//         const allProducts = Array.isArray(res.data)
//           ? res.data
//           : Array.isArray(res.data?.products)
//           ? res.data.products
//           : [];

//         const matchedSubcategories = [
//           "All",
//           ...new Set(
//             allProducts
//               .filter(
//                 (item) =>
//                   item.category?.trim().toLowerCase() ===
//                   decodeURIComponent(categoryName || "").trim().toLowerCase()
//               )
//               .map((item) => item.subcategory?.trim())
//               .filter(Boolean)
//           ),
//         ];

//         setFilterSubcategories(matchedSubcategories);
//       } catch (error) {
//         console.log("Subcategory fetch error:", error);
//         setFilterSubcategories(["All"]);
//       }
//     };

//     if (categoryName) {
//       fetchSubcategories();
//     }
//   }, [categoryName]);

//   // console.log()

//   useEffect(() => {
//     setParam(val || "");
//     setSelectedCategory(val || "All");
//   }, [val, setParam]);

//   useEffect(() => {
//     if (subcategoryName) {
//       setSelectedCategory(decodeURIComponent(subcategoryName));
//     } else {
//       setSelectedCategory("All");
//     }
//   }, [subcategoryName]);

//   useEffect(() => {
//     document.body.style.overflow = showModal ? "hidden" : "auto";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [showModal]);

//   const [filteropen, setFilterOpen] = useState(false);
//   const [subopen, setSubOpen] = useState(false);
//   const [open, setOpen] = useState(false);

//   const FiltersContent = ({ isMobile = false }) => (
//     <>
//       <div className="mb-6 max-lg:hidden border-b pb-2">
//         <button
//           type="button"
//           onClick={() => setFilterOpen((prev) => !prev)}
//           className="w-full text-lg sm:text-xl font-medium text-gray-800 flex justify-between items-center"
//         >
//           <span>Filters</span>
//           <ChevronDown
//             className={`h-5 w-5 transition-transform duration-200 ${
//               filteropen ? "rotate-180" : ""
//             }`}
//           />
//         </button>

//         {filteropen && (
//           <div className="flex flex-wrap gap-2 mt-3">
//             {sortOptions.map(({ label, value }) => (
//               <button
//                 key={value}
//                 className={`px-3 py-1.5 whitespace-nowrap rounded-full text-sm transition ${
//                   selectedSort === label
//                     ? "bg-[#D5E5F5] text-black cursor-default"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//                 onClick={() => {
//                   setSelectedSort(label);
//                   sort(value);
//                   setSortOpen(false);
//                 }}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="mb-6 border-b pb-2">
//         <button
//           type="button"
//           onClick={() => setSubOpen((prev) => !prev)}
//           className="w-full text-lg sm:text-xl font-medium text-gray-800 flex justify-between items-center"
//         >
//           <span>Sub-Categories</span>
//           <ChevronDown
//             className={`h-5 w-5 transition-transform duration-200 ${
//               subopen ? "rotate-180" : ""
//             }`}
//           />
//         </button>

//         {subopen && (
//           <div className="flex flex-wrap gap-2 mt-3">
//             {filterSubcategories.map((subcat, index) => (
//               <button
//                 key={index}
//                 className={`px-3 py-1.5 whitespace-nowrap rounded-full text-sm transition ${
//                   (isMobile ? tempCategory : selectedSubcategory) === subcat
//                     ? "bg-[#D5E5F5] text-black cursor-default"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//                 onClick={() =>
//       isMobile
//         ? setTempCategory(subcat)
//         : setSelectedSubcategory(subcat)  // Just update state, no navigation
//     }
//               >
//                 {subcat}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="mb-6">
//         <button
//           type="button"
//           onClick={() => setOpen((prev) => !prev)}
//           className="w-full text-lg sm:text-xl font-medium text-gray-800 flex justify-between items-center"
//         >
//           <span>Colors</span>
//           <ChevronDown
//             className={`h-5 w-5 transition-transform duration-200 ${
//               open ? "rotate-180" : ""
//             }`}
//           />
//         </button>

//         {open && (
//           <div className="flex flex-wrap gap-2 mt-3">
//             {colors.map(({ colorName }) => {
//              const isActive = isMobile 
//   ? tempColor === colorName 
//   : colors.includes(colorName);
//               return (
//                 <button
//                   key={colorName}
//                   type="button"
//                   className={twMerge(
//                     "text-left px-2 py-1 border rounded-md transition text-xs",
//                     isActive
//                       ? "bg-[#D5E5F5] text-black font-medium"
//                       : "border-gray-300 hover:bg-gray-100"
//                   )}
//                   onClick={() =>
//                     isMobile
//                       ? setTempColor((prev) =>
//                           prev === colorName ? "" : colorName
//                         )
//                       : setColor((prev) => {
//                         //if color is already selected remove it
//                         if(prev.includes(colorName)){
//                           return prev.filter((c) => c !== colorName);
//                         }
//                           return [...prev, colorName];
//                   })
//                   }
//                 >
//                   {colorName}
//                 </button>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </>
//   );

//   return (
//     <>
//       <div className="hidden lg:block lg:sticky top-20 bg-white p-4 border border-gray-200 rounded-md h-max w-[260px]">
//         <FiltersContent />
//       </div>

//       <div className="flex justify-between items-center lg:hidden mb-4">
//         <button
//           className="px-4 py-2 border border-gray-400 rounded-md text-sm"
//           onClick={() => {
//             setTempCategory(selectedCategory);
//             setTempColor(val);
//             setShowModal(true);
//           }}
//         >
//           Filters
//         </button>

//         <div className="relative">
//           <button
//             className="px-4 py-2 border border-gray-400 rounded-md flex items-center gap-2 text-sm"
//             onClick={() => setSortOpen(!sortOpen)}
//           >
//             {selectedSort} <ChevronDown className="h-4 w-4" />
//           </button>

//           {sortOpen && (
//             <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md z-30 w-[200px]">
//               {sortOptions.map(({ label, value }) => (
//                 <p
//                   key={value}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                   onClick={() => {
//                     setSelectedSort(label);
//                     sort(value);
//                     setSortOpen(false);
//                   }}
//                 >
//                   {label}
//                 </p>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <AnimatePresence>
//         {showModal && (
//           <div className="fixed lg:hidden inset-0 bg-black/40 z-50 flex items-end">
//             <div
//               className="absolute inset-0"
//               onClick={() => setShowModal(false)}
//             />
//             <motion.div
//               initial={{ y: "100%" }}
//               animate={{ y: 0 }}
//               exit={{ y: "100%" }}
//               transition={{ duration: 0.35, ease: "easeOut" }}
//               className="relative bg-white w-full rounded-t-2xl p-5 shadow-lg z-50"
//             >
//               <button
//                 className="absolute top-3 right-3 text-gray-600"
//                 onClick={() => setShowModal(false)}
//               >
//                 <X className="h-6 w-6" />
//               </button>

//               <FiltersContent isMobile />

//               <div className="flex justify-between gap-3 border-t pt-4 mt-6">
//                 <button
//                   className="flex-1 py-2 border rounded-md text-gray-600"
//                   onClick={() => {
//                     setTempCategory("All");
//                     setTempColor("");
//                   }}
//                 >
//                   Clear
//                 </button>

//                 <button
//                   className="flex-1 py-2 bg-[#1C3753] text-white rounded-md"
//                   onClick={() => {
//       setSelectedSubcategory(tempCategory);  // Update parent state
//       setColor(tempColor ? [tempColor] : []);
//       setShowModal(false);
//     }}
//                 >
//                   Apply
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// export default Filter;
