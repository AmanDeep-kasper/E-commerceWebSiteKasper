import { div } from "framer-motion/m";
import { CheckCircle, Clock, X } from "lucide-react";
import React from "react";

const ReturnTimeline = ({ setSelectedOrderId }) => {
  const data = [
    {
      status: "Pickup Scheduled",
      description: "Pickup has been scheduled. ",
      date: "Wed, 31 Dec, 25 - 3:06 pm",
      completed: true,
    },
    {
      status: "Picked Up",
      description: "Order has been picked up from customer.",
      date: "Wed, 31 Dec, 25 - 3:08 pm",
      completed: true,
    },
    {
      status: "In Transit",
      description: "Package is on the way to destination.",
      date: "Thu, 01 Jan, 26 - 11:06 am",
      completed: true,
    },
    {
      status: "Out for Delivery",
      description: "Courier is on the way, expected to reach today.",
      date: "Sat, 03 Jan, 26 - 02:24 pm",
      completed: true,
    },
    {
      status: "Delivered",
      description: "Order successfully delivered to the customer.",
      date: "-",
      completed: false,
    },
  ];
  return (
    <div>
      <div className="bg-[#FFFFFF] w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 w-full flex-nowrap border-b-2 pb-4">
          <span className="text-[18px]">Order Timeline</span>
          <button
            className="border-[1px] border-black rounded-full shrink-0"
            onClick={setSelectedOrderId}>
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-6 relative ">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 w-full relative ">
              <div className="flex flex-col items-center">
                {item.completed ? (
                  <CheckCircle className="text-[#00A63E] w-[20px] h-[20px]" />
                ) : (
                  <Clock className="text-[#686868] w-[20px] h-[20px]" />
                )}
                {/* Vertical line */}
                {index !== item.length - 1 && (
                  <div className="w-[1.5px] bg-gray-300 h-7 mt-1 "></div>
                )}
              </div>

              <div className="w-full">
                {/* Status Section */}
                {item.status && (
                  <div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium text-[#1C1C1C]">
                        {item.status}
                      </span>
                      {item.date && (
                        <div className="text-sm text-[#1C1C1C]">
                          {item.date}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Description Section */}
                {item.description && (
                  <div className="mt-1">
                    <div className="text-xs text-[#686868]">
                      {item.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReturnTimeline;
