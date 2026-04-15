import React, { useState } from 'react'
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";

function Reward() {
    const [isShowPopup, setIsShowPopup] = useState(false);
    return (
        <div className="w-full bg-white rounded-lg shadow-sm md:border border-gray-200 mt-5">
            <div className="p-4 ">
                <div className="border-b border-gray-200 w-full border-b-2 p-4">
                    <span className="text-[#1C1C1C] text-[20px] md:text-[18px] text-[16px] font-medium">Reward Points</span>
                </div>
            </div>
            <div className='mt-3 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4'>
                <div className="rounded-lg bg-gradient-to-r from-[#FFFFFF]/80 to-[#B2FF00]/20 p-4">
                    <div className="flex flex-col">
                        <span className='text-[#1C1C1C] text-[20px] font-normal'>Earn Points on Every ₹500 Purchase</span>
                        <span className='text-[#686868] text-[14px] font-normal'>Get points for every ₹500+ purchase.</span>
                        <span className='text-[#686868] text-[14px] font-normal'>Redeem next time.</span>
                    </div>
                    <div className='flex flex-col mt-3 '>
                        <div><span className='text-[#686868] text-[14px] font-normal'>Total Points Available: </span><span className='text-[14px] font-medium text-[#1C1C1C]'>20</span></div>
                        <div><span className='text-[#686868] text-[14px] font-normal'>Expiry Date: <span className='text-[14px] font-medium text-[#1C1C1C]'>29/4/26</span></span></div>
                    </div>
                    <span className='text-[#159DFF] text-[14px] font-medium flex justify-end items-center cursor-pointer'
                        onClick={() => setIsShowPopup(true)}
                    >see Details <MdOutlineKeyboardArrowRight />
                    </span>
                </div>
            </div>

            {/* Reward Details Popup */}
            {isShowPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsShowPopup(false);
                        }
                    }} >
                    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className=''>
                            <div className='flex justify-between w-full items-center'>
                                <span className="text-[#1C1C1C] text-[20px] font-medium">Reward Details</span>
                                <span className="text-[#1C1C1C] text-[20px] font-medium cursor-pointer"
                                    onClick={() => setIsShowPopup(false)}>
                                    <IoMdCloseCircleOutline /></span>
                            </div>
                            <div className="rounded-lg bg-gradient-to-r from-[#FFFFFF]/80 to-[#B2FF00]/20 p-4 mt-3 w-full">
                                <div className="flex flex-col">
                                    <span className='text-[#1C1C1C] text-[20px] font-normal'>Earn Points on Every ₹500 Purchase</span>
                                    <span className='text-[#686868] text-[14px] font-normal'>Get points for every ₹500+ purchase.</span>
                                    <span className='text-[#686868] text-[14px] font-normal'>Redeem next time.</span>
                                </div>
                                <div className='flex flex-col mt-3 '>
                                    <div><span className='text-[#686868] text-[14px] font-normal'>Total Points Available: </span><span className='text-[14px] font-medium text-[#1C1C1C]'>20</span></div>
                                    <div><span className='text-[#686868] text-[14px] font-normal'>Expiry Date:<span className='text-[14px] font-medium text-[#1C1C1C]'>29/4/26</span></span></div>
                                </div>
                            </div>
                            <div className="rounded-lg bg-gradient-to-r from-[#FFFFFF]/80 to-[#B2FF00]/20 p-4 w-full">
                                <div className="flex flex-col">
                                    <span className='text-[#0E101A] text-[18px] font-normal'>• 1 point = ₹10 value during redemption</span>
                                    <span className='text-[#0E101A] text-[18px] font-normal'>• Customers can redeem up to 10% of the total invoice value</span>
                                    <span className='text-[#0E101A] text-[18px] font-normal'>• Minimum invoice value required for redemption: ₹ 500</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Reward