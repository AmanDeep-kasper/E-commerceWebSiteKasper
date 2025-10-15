import React from 'react'

function ProductQuickView({dimensions, weight, price}) {
  return (
    <div className="p-4 w-max shadow-md rounded-sm bg-white/80 backdrop-blur-xl" >
              <h3 className="text-[#AA2F1F] text-[14px] font-medium">
                <span>{price} </span>
                Amazon Price{" "}
              </h3>
              <p className="text-[14px] text-[#6C6B6B]">
                Product Dimensions -{" "}
                <span className="text-[#171515]">{dimensions}</span>
              </p>
              <p className="text-[14px] text-[#6C6B6B]">
                Item Weight - <span className="text-[#171515]">{weight} Grams</span>
              </p>
              <p className="text-[14px] text-[#6C6B6B]">
                Type - <span className="text-[#171515]">Unframed</span>
              </p>
            </div>
  )
}

export default ProductQuickView