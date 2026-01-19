// 2026 hide this code

import React, { useState } from "react";
import {
  BarChart2,
  ChevronRight,
  Heart,
  MapPin,
  MessageSquare,
  User,
} from "lucide-react";
import { use } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

const profileMenu = [
  { label: "Personal Information", path: "/customer-info", icon: User },
  { label: "Orders Information", path: "/order-insight", icon: BarChart2 },
  // { label: "Wishlist & Cart Info", path: "/wishlist-cart", icon: Heart },
  // { label: "Address Book", path: "/address-book", icon: MapPin },
  { label: "Support & Ticket", path: "/support-feedback", icon: MessageSquare },
];

function ProfileSidebar({ customer, isEditPage }) {
  const location = useLocation(null);
  const { id } = useParams();

  return (
    <>
      {/* <Card className="p-4"> */}
      {!isEditPage ? (
        <div className="flex gap-8 px-2">
          {profileMenu.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname.includes(path);

            return (
              <Link
                key={label}
                to={`/admin/customers/${customer.id}${path}`}
                className={`relative py-2 text-md font-medium transition-colors flex items-center gap-2 ${
                  isActive ? " text-[#1C3753] font-medium" : "text-gray-600"
                } `}>
                {/* <Icon
                className={`w-5 h-5 flex-shrink-0 ${
                  isActive
                    ? "text-[#1C3753]"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              /> */}
                {label}
                {/* underline  */}
                {isActive && (
                  <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        ""
      )}
      {/* </Card> */}
    </>
  );
}

export default ProfileSidebar;

//  Add his code (AD)

// import React from "react";
// import { Link, useLocation, useParams } from "react-router";

// const tabs = [
//   { label: "Personal Information", path: "/customer-info" },
//   { label: "Orders Information", path: "/order-insight" },
//   { label: "Support & Ticket", path: "/support-feedback" },
// ];

// function ProfileTopTabs() {
//   const location = useLocation();
//   const { id } = useParams();

//   return (
//     <div className="border-b bg-white">
//       <div className="flex gap-8 px-6">
//         {tabs.map((tab) => {
//           const isActive = location.pathname.includes(tab.path);

//           return (
//             <Link
//               key={tab.label}
//               to={`/admin/customers/${id}${tab.path}`}
//               className={`relative py-4 text-sm font-medium transition-colors ${
//                 isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
//               }`}>
//               {tab.label}

//               {/* underline */}
//               {isActive && (
//                 <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 rounded-full" />
//               )}
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default ProfileTopTabs;

// import React, { useState } from "react";
// import {
//   BarChart2,
//   Heart,
//   MapPin,
//   MessageSquare,
//   User,
//   ChevronRight,
//   ChevronDown,
// } from "lucide-react";
// import { useLocation } from "react-router";
// import { Link } from "react-router";

// const Card = ({ children, className = "" }) => (
//   <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}>
//     {children}
//   </div>
// );

// const profileMenu = [
//   { label: "Customer Info", path: "/customer-info", icon: User },
//   { label: "Order Insights", path: "/order-insight", icon: BarChart2 },
//   { label: "Wishlist & Cart Info", path: "/wishlist-cart", icon: Heart },
//   { label: "Address Book", path: "/address-book", icon: MapPin },
//   {
//     label: "Support / Feedback",
//     path: "/support-feedback",
//     icon: MessageSquare,
//   },
// ];

// function ProfileSidebar({ customer }) {
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   // For mobile responsiveness - collapse by default on small screens
//   React.useEffect(() => {
//     const checkScreenSize = () => {
//       setIsCollapsed(window.innerWidth < 768);
//     };

//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);

//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   return (
//     <div className={`md:col-span-3 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-full'}`}>
//       <Card className="p-0 overflow-hidden">
//         {/* Header with toggle button */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200 flex justify-between items-center">
//           {!isCollapsed && (
//             <div>
//               <h3 className="font-semibold text-gray-800">Customer Profile</h3>
//               <p className="text-sm text-gray-600 mt-1 truncate">{customer?.name || 'Customer Details'}</p>
//             </div>
//           )}
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="p-1.5 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
//             aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//           >
//             {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
//           </button>
//         </div>

//         {/* Navigation items */}
//         <div className="p-2">
//           {profileMenu.map(({ label, path, icon: Icon }) => {
//             const isActive = location.pathname.includes(path);

//             return (
//               <Link
//                 key={label}
//                 to={`/admin/customers/${customer.id}${path}`}
//                 className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg mb-1 transition-all duration-200 group ${
//                   isActive
//                     ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500"
//                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//                 } ${isCollapsed ? 'justify-center' : ''}`}
//                 title={isCollapsed ? label : ''}
//               >
//                 <Icon
//                   className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
//                 />
//                 {!isCollapsed && (
//                   <span className="flex-1 truncate">{label}</span>
//                 )}
//                 {!isCollapsed && isActive && (
//                   <ChevronRight className="w-4 h-4 text-blue-500" />
//                 )}
//               </Link>
//             );
//           })}
//         </div>

//         {/* Customer summary (only visible when expanded) */}
//         {!isCollapsed && customer && (
//           <div className="border-t border-gray-200 p-4 bg-gray-50">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-xs text-gray-500">Customer Since</span>
//               <span className="text-xs font-medium text-gray-700">
//                 {new Date(customer.joinDate || Date.now()).toLocaleDateString()}
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-xs text-gray-500">Status</span>
//               <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
//                 {customer.status || 'Active'}
//               </span>
//             </div>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }

// export default ProfileSidebar;
