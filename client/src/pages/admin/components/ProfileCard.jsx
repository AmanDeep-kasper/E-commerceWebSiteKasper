// import { MoreHorizontal, MoreVertical } from "lucide-react";
// import React from "react";

// const Card = ({ children, className = "" }) => (
//   <div className={`bg-white border rounded-xl shadow-sm ${className}`}>
//     {children}
//   </div>
// );

// function ProfileCard({ customer }) {
//   return (
//     <div className="col-span-3">
//       <Card className="p-4 relative">
//         <div className="flex items-center justify-between">
//           <div className=" flex flex-col items-center w-full gap-4">

//             <img
//               src={customer?.profile_image || "/name1.jpg"}
//               alt="avatar"
//               className="w-32 h-32 ring-8 ring-gray-200 rounded-full object-cover"
//             />
//             <div>
//               <div className="font-medium text-gray-900 text-lg">{customer.name}</div>
//               <div className="text-sm text-gray-500">
//                 Customer ID: {customer.id}
//               </div>
//             </div>
//           </div>
//           <button className="absolute right-2 top-4 p-1 rounded hover:bg-gray-100" aria-label="More">
//             <MoreVertical className="w-4 h-4 text-gray-600" />
//           </button>
//         </div>

//         <div className="mt-4 space-y-2 text-base">
//           <div className="text-gray-700 ">
//             <p className="text-gray-500">E-mail Address:</p>{" "}
//             {customer.email}
//           </div>
//           <div className="text-gray-700">
//             <p className="text-gray-500">Total Orders:</p>{" "}
//             {customer.total_orders}
//           </div>
//           <div className="text-[11px] text-gray-500">
//             Last Login: {customer.last_order_date}
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }

// export default ProfileCard;

import {
  BanknoteX,
  BadgeCheck,
  UserLock,
  Banknote,
  Shield,
} from "lucide-react";
import React, { useState } from "react";
import AccountActivityRow from "./AccountActivityRow";
import AccountActivityVerfiy from "./AccountActivityVerfiy";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

function ProfileCard({ customer }) {
  console.log(customer);

  const [openStatus, setOpenStatus] = useState(false);
  const [status, setStatus] = useState(customer.status);
  const [showPopup, setShowPopup] = useState(false);
  const [reVerfiy, setReVerfiy] = useState(false);
  const [cashDelivery, setCashDelivery] = useState("Disable Cash on Delivery");

  return (
    <div className="col-span-3 relative">
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 w-[467px]">
            <h3 className="text-lg font-medium mb-2">
              {cashDelivery === "Enable Cash on Delivery"
                ? "Disable"
                : "Enable"}{" "}
              cash on delivery for this customer?
            </h3>

            <p className="text-sm text-[#1C1C1C] mb-4">
              This will
              <span>
                {cashDelivery === "Enable Cash on Delivery"
                  ? " prevent the"
                  : " give access to "}
              </span>{" "}
              the customer from paying on delivery. They
              <span>
                {cashDelivery === "Enable Cash on Delivery"
                  ? " will have to prepaid"
                  : " can pay on delivery on "}
              </span>{" "}
              their new orders.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-7 py-1.5 border rounded-md text-sm">
                Cancel
              </button>

              <button
                onClick={() => {
                  setCashDelivery(
                    cashDelivery === "Enable Cash on Delivery"
                      ? "Disable Cash on Delivery"
                      : "Enable Cash on Delivery",
                  );
                  setShowPopup(false);
                }}
                className="px-7 py-1.5 bg-[#1C3753] text-white rounded-md text-sm">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {reVerfiy && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 w-[467px]">
            <h3 className="text-lg font-medium mb-2">
              Re-verification of customer credentials?
            </h3>

            <p className="text-sm text-[#1C1C1C] mb-4">
              Customer have to re-verify their credentials via email or OTP.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReVerfiy(false)}
                className="px-7 py-1.5 border rounded-md text-sm">
                Cancel
              </button>

              <button
                // onClick={() => {
                //   setCashDelivery(
                //     cashDelivery === "Enable Cash on Delivery"
                //       ? "Disable Cash on Delivery"
                //       : "Enable Cash on Delivery",
                //   );
                //   setShowPopup(false);
                // }}
                className="px-7 py-1.5 bg-[#1C3753] text-white rounded-md text-sm">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {openStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 w-[400px]">
            <h3 className="text-lg font-medium mb-2">
              {status === "Unblock" ? "Block" : "Unblock"} this customer?
            </h3>

            <p className="text-sm text-[#1C1C1C] mb-4">
              This will
              <span>
                {status === "Unblock" ? " prevent the" : " restore "}
              </span>{" "}
              access to their account and
              <span>
                {status === "Unblock"
                  ? " will have to prepaid"
                  : " allow them to place orders"}
              </span>{" "}
              {/* their new orders. */}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenStatus(false)}
                className="px-7 py-1.5 border rounded-md text-sm">
                Cancel
              </button>

              <button
                onClick={() => {
                  setStatus(status === "Unblock" ? "Block" : "Unblock");
                  setOpenStatus(false);

                  if (status === "Block") {
                    toast.success("Customer unblocked successfully", {
                      className:
                        "bg-[#E0F4DE] text-[#00A63E] border-l-4 border-[#00A63E] rounded-xl text-sm",
                      // icon: true,
                      hideProgressBar: true,
                    });
                  } else {
                    toast.success("Customer blocked successfully", {
                      className:
                        "bg-[#E0F4DE] text-[#00A63E] border-l-4 border-[#00A63E] rounded-xl text-sm",
                      // icon: false,
                      hideProgressBar: true,
                    });
                  }
                }}
                className="px-7 py-1.5 bg-[#1C3753] text-white rounded-md text-sm">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Card className="p-6 ">
        {/* Dropdown menu */}
        {/* {showDropdown && (
          <div className="absolute right-4 top-12 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Edit Profile
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Send Message
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              View Activity
            </button>
            <hr className="my-1" />
            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
              Deactivate Account
            </button>
          </div>
        )}
         */}
        {/* <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color[0]}`}>
            {status.label} Customer
          </span>
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div> */}

        <div className="flex flex-col items-center w-full gap-5">
          <div className="">
            <img
              src={customer?.profile_image || "/name1.jpg"}
              alt="avatar"
              className="w-32 h-32  rounded-full object-cover shadow-md"
            />
            <div
              className={`absolute top-3 right-3 ${
                status === "Unblock"
                  ? `bg-[#E0F4DE] text-[#00A63E] px-2 font-medium py-0.5 text-sm rounded-md`
                  : `bg-[#FFEAE9] text-[#D53B35] px-2 font-medium py-0.5 text-sm rounded-md`
              }`}>
              {status}
            </div>
          </div>

          <div className="text-center">
            <div className="font-semibold text-gray-900 text-xl">
              {customer.name}
            </div>
            {/* <div className="text-sm text-gray-500 mt-1">ID: {customer.id}</div> */}
            <div className="text-sm text-gray-500 mt-1"> {customer.id}</div>
            <div className="text-sm text-gray-500 mt-1">{customer.phone}</div>
            <div className="text-sm text-gray-500 mt-1">{customer.email}</div>
          </div>
        </div>

        {/* <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {customer.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="text-sm font-medium text-gray-900">
                {customer.phone || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-sm font-medium text-gray-900">
                {customer.total_orders || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Last Login</p>
              <p className="text-sm font-medium text-gray-900">
                {customer.last_order_date || "Recently"}
              </p>
            </div>
          </div>
        </div> */}

        {/* Quick Stats */}
        {/* <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Customer Activity</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-blue-50 rounded-md">
              <div className="text-sm font-bold text-blue-700">{customer.total_orders || 0}</div>
              <div className="text-xs text-gray-600">Orders</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-md">
              <div className="text-sm font-bold text-green-700">$1,240</div>
              <div className="text-xs text-gray-600">Spent</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-md">
              <div className="text-sm font-bold text-purple-700">3</div>
              <div className="text-xs text-gray-600">Returns</div>
            </div>
          </div>
        </div> */}
      </Card>
      <Card className="mt-6">
        <div className="p-6">
          <h1 className="font-medium ">Account Activity</h1>
          <AccountActivityRow
            lable={"Total Orders"}
            value={customer.total_orders ?? "-"}
          />
          <AccountActivityRow
            lable={"Total Spend"}
            value={customer.total_spent ?? "₹0"}
          />
          <AccountActivityRow
            lable={"Last Order"}
            value={customer.last_order_date ?? "-"}
          />
          <AccountActivityRow
            lable={"Last Login"}
            // value={customer.total_orders ?? "-"}
            value={"Today"}
          />
          <AccountActivityRow
            lable={"Signup Date"}
            value={customer.joined_date ?? "-"}
          />

          <AccountActivityRow
            lable={"Login Method"}
            value={"Phone Number"}
            isBadge
          />

          <AccountActivityVerfiy
            label={"Email Verified"}
            verified={customer.email_verified}
          />
          <div className="border-t">
            <AccountActivityVerfiy
              label={"Phone Verified"}
              verified={customer.phone_verified}
            />
          </div>
        </div>
      </Card>
      <Card className="mt-6">
        <div className="p-[16px]">
          <h1 className="font-medium">Admin Actions</h1>
          <div className="flex flex-col space-y-4 mt-2">
            {/* <button
              // onClick={() => {
              //   setCashDelivery(
              //     cashDelivery === "Enable Cash on Delivery"
              //       ? "Disable Cash on Delivery"
              //       : "Enable Cash on Delivery",
              //   );
              // }}
              onClick={() => setShowPopup(true)}
              className="flex items-center justify-start gap-2 bg-[#F8FBFC] border px-2 py-2 rounded-lg">
              {cashDelivery === "Disable Cash on Delivery" ? (
                <>
                  <BanknoteX width={16.5} height={16.5} />
                  <span className="text-sm font-medium">{cashDelivery}</span>
                </>
              ) : (
                <>
                  <Banknote width={16.5} height={16.5} />
                  <span className="text-sm font-medium">{cashDelivery}</span>
                </>
              )}
            </button> */}
            <button
              onClick={() => setReVerfiy(true)}
              className="flex items-center justify-start gap-2 bg-[#F8FBFC] border px-2 py-2 rounded-lg">
              <BadgeCheck width={16.5} height={16.5} />
              <span className="text-sm font-medium">
                Re-Verification of User
              </span>
            </button>
            <button
              // onClick={() => {
              //   setStatus(status === "Unblock" ? "Block" : "Unblock");
              // }}
              onClick={() => setOpenStatus(true)}
              className={`flex items-center justify-start gap-2 border px-2 py-2 rounded-lg
    ${
      status === "Unblock"
        ? "bg-[#E0F4DE] text-[#00A63E]"
        : "bg-[#FFEAE9] text-[#D53B35]"
    }`}>
              {status === "Unblock" ? (
                <>
                  <Shield
                    width={16.5}
                    height={16.5}
                    className={
                      status === "Unblock" ? "text-[#00A63E]" : "text-[#D53B35]"
                    }
                  />
                  <span className="text-sm font-medium">{status} User</span>
                </>
              ) : (
                <>
                  <UserLock
                    width={16.5}
                    height={16.5}
                    className={
                      status === "Unblock" ? "text-[#00A63E]" : "text-[#D53B35]"
                    }
                  />
                  <span className="text-sm font-medium">{status} User</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Card>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeButton={false}
        pauseOnHover
      />
    </div>
  );
}

export default ProfileCard;
