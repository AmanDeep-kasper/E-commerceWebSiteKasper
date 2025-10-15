import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { twMerge } from "tailwind-merge";
import products from "../data/products.json";

function Categories({
  filters = false,
  setParam = () => {},
  val = "",
  colors = "",
  setColor = "",
}) {
  const [selected, setSelected] = useState("All");
  const [price, setPrice] = useState(60);
  const [filter, setFilter] = useState([]);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setPrice(newValue);
  };
  const { categoryName, subcategoryName } = useParams()

  // Extract subcategories for the given categoryName
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
            .filter(Boolean) // remove undefined/null
        ),
      ];

      setFilter(matchedSubcategories);
    }
  }, [categoryName]);

  // Sync selected filter from props
  useEffect(() => {
    setParam(val || "");
    setSelected(val || "All");
  }, [val, setParam]);

  useEffect(() => {
    if (subcategoryName) {
      setSelected(decodeURIComponent(subcategoryName));
    } else {
      setSelected("All"); // default when no subcategory
    }
    // console.log(subcategoryName)
  }, [subcategoryName]);


  return (
    <div className="min-w-[223px] bg-white lg:block hidden border border-gray-200 p-2 pb-6">
      {filter.length > 0 && (
        <div className="w-[195px] flex justify-between border-b border-black py-2">
          <h1 className="text-[15px] font-[500] px-2">Categories</h1>
          <ChevronRight />
        </div>
      )}

      {/* Subcategories list */}
      <div className="p-2">
        {filter.map((subcat, index) => (
          <div
            key={index}
            className="max-w-[200px] flex items-center gap-2 cursor-pointer mb-2"
            onClick={() => {
              setSelected(subcat)
              navigate(
                `/products/${encodeURIComponent(categoryName)}/${
                  subcat === "All" ? "" : encodeURIComponent(subcat)
                }`
              );
            }}
          >
            {selected === subcat ? (
              <div className="relative min-w-4 min-h-4">
                {/* Outer Gradient Ring */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, #CBA11A, #C8A112, #E2CF47, #EECD4E, #D6AD1D, #DFBA30)",
                  }}
                ></div>
                {/* Inner Circle */}
                <div className="top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-3 h-3 absolute border-2 border-white rounded-full"></div>
              </div>
            ) : (
              <div className="min-w-4 min-h-4 rounded-full border border-[#989898]"></div>
            )}
            <p className="text-sm text-[#6d6d6d]">{subcat}</p>
          </div>
        ))}
      </div>

      {/* Colors */}
      <div className="w-[195px] flex flex-col gap-6">
        <div className="flex justify-between border-b border-black py-2">
          <h1 className="text-[15px] font-[500] px-2">Colors</h1>
          <ChevronRight />
        </div>
        <div className="flex gap-4 px-3">
          {colors.map(({ colorName, colorCode }) => (
            <div
              key={colorName}
              className={twMerge(
                "w-4 h-4 rounded-full ring-2 ring-[#BEBEBE] ring-offset-2 cursor-pointer",
                colorCode
              )}
              onClick={() =>
                setColor((prev) => (prev === colorName ? "" : colorName))
              }
            ></div>
          ))}
        </div>
      </div>

      {/* Price filter */}
      {/* <div className="p-2 flex flex-col gap-2 w-[195px]">
        <p>Price</p>
        <Slider
          value={price}
          onChange={handleChange}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          sx={{
            color: "#434343",
            height: 4,
            "& .MuiSlider-thumb": {
              width: 12,
              height: 12,
              backgroundColor: "#fff",
              border: "3px solid currentColor",
              "&:hover": {
                boxShadow: "0 0 0 6px rgba(203, 161, 26, 0.16)",
              },
            },
            "& .MuiSlider-track": { height: 4, border: "none" },
            "& .MuiSlider-rail": {
              height: 4,
              opacity: 0.5,
              backgroundColor: "#E0E0E0",
            },
            "& .MuiSlider-valueLabel": {
              backgroundColor: "#434343",
              color: "#fff",
              fontSize: "10px",
              borderRadius: "4px",
              top: -6,
            },
          }}
        />
        <div className="flex justify-between w-[195px]">
          <button className="border w-[73px] h-[28px] text-start px-2 border-[#868686] rounded-[5px]">
            ₹
          </button>
          <button className="border w-[73px] h-[28px] text-start mr-[10px] px-2 border-[#868686] rounded-[5px]">
            ₹
          </button>
        </div>
      </div> */}
    </div>
  );
}

export default Categories;
