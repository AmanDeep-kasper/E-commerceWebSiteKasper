import { twMerge } from "tailwind-merge";
import Button from "./Button";
import Ratings from "./Ratings";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice";

function FilterCard({ cardData }) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(
    new Array(cardData.length).fill(false)
  );

  const handleAddToCart = (item, defaultVariant) => {
    // Mark this item as loading
    setLoadingIds((prev) => [...prev, item.uuid]);

    // Prepare variant payload
    const payload = {
      uuid: item.uuid,
      variantId: defaultVariant.variantId,
      title: item.title,
      basePrice: defaultVariant.price,
      discountPercent: item.discountPercent,
      stockQuantity: defaultVariant.stockQuantity,
      image: defaultVariant.images[0],
      deliverBy: item.deliverBy,
      selectedOptions: {
        color: defaultVariant.color,
        type: defaultVariant.type,
        dimension: defaultVariant.dimension,
      },
    };

    // Simulate API delay
    setTimeout(() => {
      dispatch(addToCart(payload)); // ✅ dispatch proper Redux action
      // Remove loading state
      setLoadingIds((prev) => prev.filter((id) => id !== item.uuid));
    }, 200);
  };

  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 grid-cols-2 flex-wrap gap-2 justify-start overflow-visible">
      {cardData ? (
        cardData.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col lg:justify-between lg:border border-[#F0F0F0] h-[333px] lg:rounded-[10px] overflow-hidden group lg:hover:drop-shadow-md aspect-4/3 object-top"
          >
            <img
              className=" lg:min-h-[202px] min-h-[160px] object-cover lg:rounded-t-[10px] lg:group-hover:scale-110 transition duration-300"
              src={item.image}
              alt={item.title}
            />
            <div className="p-2 flex flex-col md:gap-[1.5px] gap-[3px] lg:justify-between border border-gray-200 bg-white min-h-[178px] lg:group-hover:-translate-y-12 transition duration-300">
              <p className="text-[14px] w-full whitespace-nowrap overflow-clip text-ellipsis">
                {item.title}
              </p>
              <p className="text-[13px] w-full text-[#787878] lg:hidden">
                {item.decoreType}
              </p>
              <p className="md:text-[22px] whitespace-nowrap text-[13px] flex items-center gap-2">
                {item.price}{" "}
                <span className="md:text-[14px] text-[10px] text-[#787878] line-through">
                  {item.discount}
                </span>
                <span className="md:text-[14px] text-[10px] text-[#2E7D32]">
                  {item.discountPercent}
                </span>
              </p>
              <div className="lg:hidden flex gap-2 items-center">
                <Ratings />
                <p className="text-[10px] text-[#383838]">
                  {item.customerRated}
                </p>
              </div>
              <p className="text-[10px] lg:hidden ">{item.deliverBy}</p>

              <div
                className={twMerge(
                  "w-4 h-4 ring-2 lg:block hidden ring-[#BEBEBE] ring-offset-2 ml-1 rounded-full",
                  item.colorCode
                )}
              ></div>

              <div className="flex md:gap-2 justify-between">
                <button
                  className="py-2 w-full justify-center lg:text-[15px] md:text-[12px] text-[10px] text-center whitespace-nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item, defaultVariant);
                  }}
                >
                  Add to Cart
                </button>

                <button
                  className="flex-1 w-full rounded-[10px] md:flex hidden text-[14px] text-[#C19403] border border-[#C19403] px-2"
                  onClick={() => {
                    const updated = [...selected];
                    updated[index] = !updated[index];
                    setSelected(updated);
                  }}
                >
                  {selected[index] ? "Wishlisted" : "Wishlist"}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
          Not Available
        </h1>
      )}
    </div>
  );
}

export default FilterCard;
