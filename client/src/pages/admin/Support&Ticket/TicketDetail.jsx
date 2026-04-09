import { BookmarkX, ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const TicketDetail = () => {
  const [closeTicket, setCloseTicket] = useState(false);
  const navigate = useNavigate()

  return (
    <>
      <div className="p-[24px] bg-[#F6F8F9] rounded-md min-h-screen">
        {closeTicket && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-5 w-[467px]">
              <h3 className="text-lg font-medium mb-2">Close this ticket?</h3>

              <p className="text-sm text-[#1C1C1C] mb-4">
                This means the ticket is closed and can’t be opened again.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setCloseTicket(false)}
                  className="px-7 py-1.5 border rounded-md text-sm"
                >
                  Cancel
                </button>

                <button className="px-7 py-1.5 bg-[#1C3753] text-white rounded-md text-sm">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/support&ticket")}
                className="text-[#1C3753] hover:bg-gray-300 rounded-full transform ease-in-out text-sm"
              >
                <ChevronLeft />
              </button>
              <h2 className="text-[20px] font-semibold text-gray-800">
                Ticket Details
              </h2>
              <div className="">
                {/* <p className="text-[#686868] text-[14px]">Status</p> */}
                <span
                //   className={`font-medium  ${
                //     ticket.status === "Active"
                //       ? "text-[#00A63E] bg-[#E0F4DE] py-1 px-4 rounded-lg"
                //       : ticket.status === "Inactive"
                //         ? "text-[#D53B35] py-1 px-4 rounded-lg"
                //         : "text-[#686868] py-1 px-4 rounded-lg"
                //   }`}
                >
                  Open
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          {/* Left */}
          <div className="flex flex-col w-[60%] space-y-4">
            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">Ticket Summary</h1>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#686868] text-[14px]">Ticket ID</p>
                  <span>TK-0001</span>
                </div>

                <div>
                  <p className="text-[#686868] text-[14px]">Issue Type</p>
                  <span>Order</span>
                </div>
              </div>

              <div>
                <p className="text-[#686868] text-[14px]">Created Date</p>
                <span>20/08/2024</span>
              </div>
            </div>

            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">Customer’s Issue</h1>

              <div className="border flex items-center py-[9px] px-[12px] gap-2 rounded-lg bg-[#F8FBFC]">
                <div className="font-semibold">|</div>
                <span className="text-[#1C3753]">Order is delayed</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col w-[40%] space-y-4">
            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <div className="flex items-center justify-between gap-4">
                {" "}
                <h1 className="font-medium">Contact Details</h1>
                <span className="py-1 px-3 rounded-lg text-[#00A63E] bg-[#E0F4DE]">
                  Active
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Name</p>
                  <span>Amit Iyer</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Phone Number</p>
                  <span>+91 9876543210</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Email Address</p>
                  <span>amit.iyer@example.com</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Customer ID</p>
                  <span>CX-AI-3942</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">Admin Actions</h1>
              <button
                onClick={() => setCloseTicket(true)}
                className="border flex items-center py-[8px] px-[12px] gap-4 rounded-lg bg-[#F8FBFC]"
              >
                <BookmarkX className="text-[#D53B35]" />
                <span className="text-[#D53B35] font-medium">Close Ticket</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketDetail;
