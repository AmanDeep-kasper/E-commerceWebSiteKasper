import React from "react";

function Offer({discount, id}) {
  return (
    <div className="relative">
      <div
        className="lg:h-14 lg:w-20 md:h-10 md:w-12 h-6 w-8 bg-[#C21B10] skew-x-[42deg]"></div>
      <div className="lg:h-14 lg:w-20 md:h-10 md:w-12 h-6 w-8 bg-[#C21B10] -skew-x-[42deg]"></div>
      <p className={`absolute lg:top-2 lg:left-4 md:top-2 md:left-1 top-1 left-1 lg:text-xl md:text-sm text-[8px] text-[#FFFFFF] font-medium ${(id === 4) && 'flip'}`}>FLAT</p>
      <p className={`absolute lg:top-10 lg:left-10 md:top-8 md:left-6 top-[18px] left-4 lg:text-xl md:text-sm text-[8px] text-[#FFFFFF] font-medium ${(id === 4) && 'flip'}`}>{discount}</p>
      <p className={`absolute lg:bottom-2 lg:left-4 md:bottom-2 md:left-1 bottom-1 left-1 lg:text-xl md:text-sm text-[8px] text-[#FFFFFF] font-medium ${(id === 4) && 'flip'}`}>OFF</p>
    </div>
  );
}

export default Offer;
