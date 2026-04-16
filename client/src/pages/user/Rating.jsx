import React from "react";
import Navbar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import Footer from "../../../src/sections/Footer";

{
  /* <=================== icons ===================> */
}
import { IoIosArrowBack } from "react-icons/io";
import { IoStarOutline } from "react-icons/io5";

{
  /* <=================== icons ===================> */
}
// import art from "../../assets/art2.png"

const Rating = () => {
  return (
    <>
      <Navbar />
      <Breadcrumbs
        title={"Rating & Reviews"}
        titleClass="text-[#1C1C1C] text-[18px] font-normal px-4"
      />
      <div className="px-20 bg-gray-50 w-full h-full">
        <div className="flex items-center gap-4 py-5">
          <IoIosArrowBack size={24} />
          <span className="text-[#1800AC] text-[24px] font-marcellus">
            Rating & Reviews
          </span>
        </div>
        <div className="mt-5 bg-white px-6 py-4">
          <div className=" flex items-center justify-between mt-6">
            <div className="flex flex-col gap-1 border-r-[1px] border-[#E5E5E5] w-[40%]">
              <span className="text-[#1800AC] text-[16px] font-normal">
                Average Rating
              </span>
              <div className="flex items-center flex-row gap-1">
                <span className="text-[#1C1C1C] font-medium text-[32px]">
                  4
                </span>
                <span className="text-[#1C1C1C] font-medium text-[20px]">
                  /5
                </span>
                <div className="flex items-center flex-row gap-2">
                  <span className="text-[#F8A14A]">
                    <IoStarOutline size={24} />
                  </span>
                  <span className="text-[#F8A14A]">
                    <IoStarOutline size={24} />
                  </span>
                  <span className="text-[#F8A14A]">
                    <IoStarOutline size={24} />
                  </span>
                  <span className="text-[#F8A14A]">
                    <IoStarOutline size={24} />
                  </span>
                  <span className="text-[#F8A14A] ">
                    <IoStarOutline size={24} />
                  </span>
                </div>
              </div>
              <span className="text-[#686868] font-normal text-[12px]">
                Based on 40 reviews
              </span>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center justify-end">
                  <span className="text-[#1C1C1C] font-normal text-[14px]">
                    5
                  </span>
                  <span className="text-[#F8A14A]">
                    <IoStarOutline size={15} />
                  </span>
                  <span className="p-1 bg-[#DEDEDE] w-[50%] rounded-full"></span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center justify-end">
                  <span className="text-[#1C1C1C] font-normal text-[14px]">
                    4
                  </span>
                  <span className="text-[#F8A14A]">
                    <IoStarOutline size={15} />
                  </span>
                  <span className="p-1 bg-[#DEDEDE] w-[50%] rounded-full"></span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center justify-end">
                  <span className="text-[#1C1C1C] font-normal text-[14px]">
                    3
                  </span>
                  <span className="text-[#F8A14A]">
                    <IoStarOutline size={15} />
                  </span>
                  <span className="p-1 bg-[#DEDEDE] w-[50%] rounded-full"></span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center justify-end">
                  <span className="text-[#1C1C1C] font-normal text-[14px]">
                    2
                  </span>
                  <span className="text-[#F8A14A]">
                    <IoStarOutline size={15} />
                  </span>
                  <span className="p-1 bg-[#DEDEDE] w-[50%] rounded-full"></span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center justify-end">
                  <span className="text-[#1C1C1C] font-normal text-[14px]">
                    1
                  </span>
                  <span className="text-[#F8A14A]">
                    <IoStarOutline size={15} />
                  </span>
                  <span className="p-1 bg-[#DEDEDE] w-[50%] rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4">
          <img src={art} alt="" className="w-[180px] h-[180px] object-cover " />
        </div>

        <div className="py-4 border-t-[1px] border-[#E5E5E5]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <span className="p-4 w-[20px] h-[20px] flex items-center justify-center rounded-full bg-[#FFAEA3] text-[#861000] text-[14px] font-normal">
                M
              </span>
              <span className="text-[#1C1C1C] font-normal text-[16px]">
                M Roy
              </span>
              <div className="flex items-center flex-row gap-2">
                <span className="text-[#F8A14A]">
                  <IoStarOutline size={24} />
                </span>
                <span className="text-[#F8A14A]">
                  <IoStarOutline size={24} />
                </span>
                <span className="text-[#F8A14A]">
                  <IoStarOutline size={24} />
                </span>
                <span className="text-[#F8A14A]">
                  <IoStarOutline size={24} />
                </span>
                <span className="text-[#F8A14A] ">
                  <IoStarOutline size={24} />
                </span>
              </div>
              <span className="text-[#686868] text-[14px] font-normal">
                (1 Week ago)
              </span>
            </div>
            <div className="flex flex-row gap-4 items-center ">
              <img
                src={art}
                alt=""
                className="w-[60px] h-[60px] object-cover "
              />
              <img
                src={art}
                alt=""
                className="w-[60px] h-[60px] object-cover "
              />
            </div>
            <div>
              <span className="text-[#1C1C1C] text-[14px] font-normal">
                The detailing is very clean and the gold finish gives it a
                premium feel. It completely transformed my living room wall.
                Installation was simple and the size 40x25 is perfect above my
                sofa.
              </span>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Rating;
