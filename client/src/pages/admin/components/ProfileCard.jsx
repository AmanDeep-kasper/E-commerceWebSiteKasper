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


import { MoreVertical, Mail, ShoppingBag, Calendar, Star, Phone, MapPin } from "lucide-react";
import React, { useState } from "react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

function ProfileCard({ customer }) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Calculate customer status based on order count
  const getCustomerStatus = (orderCount) => {
    if (orderCount > 15) return { label: "VIP", color: "bg-purple-100 text-purple-800" };
    if (orderCount > 5) return { label: "Regular", color: "bg-blue-100 text-blue-800" };
    return { label: "New", color: "bg-gray-100 text-gray-800" };
  };
  
  const status = getCustomerStatus(customer.total_orders || 0);

  return (
    <div className="col-span-3">
      <Card className="p-6 relative">
        {/* Dropdown menu */}
        {showDropdown && (
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
        
        <div className="flex justify-between items-start mb-4">
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
        </div>

        <div className="flex flex-col items-center w-full gap-5">
          <div className="relative">
            <img
              src={customer?.profile_image || "/name1.jpg"}
              alt="avatar"
              className="w-32 h-32 ring-4 ring-gray-100 rounded-full object-cover shadow-md"
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border border-gray-200">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">4.8</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="font-semibold text-gray-900 text-xl">{customer.name}</div>
            <div className="text-sm text-gray-500 mt-1">
              Customer ID: {customer.id}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="text-sm font-medium text-gray-900 truncate">{customer.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="text-sm font-medium text-gray-900">{customer.phone || "Not provided"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-sm font-medium text-gray-900">{customer.total_orders || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Last Login</p>
              <p className="text-sm font-medium text-gray-900">{customer.last_order_date || "Recently"}</p>
            </div>
          </div>
        </div>

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
    </div>
  );
}

export default ProfileCard;