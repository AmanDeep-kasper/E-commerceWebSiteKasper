// import React from "react";

// const InfoRow = ({ label, value }) => (
//   <div className="flex flex-col gap-0.5">
//     <span className="text-[13px] font-medium text-gray-700">{label}</span>
//     <span className="text-sm text-gray-900">{value}</span>
//   </div>
// );

// const Section = ({ title, children }) => (
//   <div className="py-4">
//     <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
//     <div className="grid grid-cols-2 gap-x-12 gap-y-4">{children}</div>
//   </div>
// );

// const Divider = () => <hr className="border-gray-200 my-4" />;

// function WishlistCartInfo({ customer }) {
//   const data = {
//     wishlistCount: "04",
//     wishlistCategories: ["Spiritual", "Abstract", "Clones"],
//     wishlistPreview: [
//       "Tree of Life",
//       "Adiyogi Shiva Wall Art",
//       "Clones",
//       "Floral Mandala",
//     ],
//     wishlistUpdate: "12 July 2025, 4:30 PM",
//     cartCount: "02",
//     cartValue: "₹4,800",
//     lastUpdate: "14 July 2025, 7:15 PM",
//     lastAdded: "Lotus Mandala (₹2,500)",
//     abandoned: true,
//     duration: "3 days",
//     emailSent: "15 July 2025, 9:00 AM",
//     cartExpiry: "20 July 2025",
//     coupon: "SUMMER25 (₹500 off)",
//   };

//   return (
//     <div className="col-span-6">
//         <div className="bg-white border rounded-xl shadow-sm p-5">
//           <h2 className="text-sm font-semibold text-gray-900 mb-4">
//             Wishlist & Cart Info
//           </h2>

//           {/* Wishlist Info */}
//           <div className="grid grid-cols-2 gap-x-12 gap-y-4">
//             <InfoRow label="Wishlist Items Count:" value={data.wishlistCount} />
//             <div>
//               <div className="text-[13px] font-medium text-gray-700 mb-1">
//                 Wishlist Preview:
//               </div>
//               <ul className="text-sm text-gray-900 list-disc list-inside space-y-0.5">
//                 {data.wishlistPreview.map((item, i) => (
//                   <li key={i}>{item}</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <div className="text-[13px] font-medium text-gray-700 mb-1">
//                 Wishlist Categories:
//               </div>
//               <ul className="text-sm text-gray-900 list-disc list-inside space-y-0.5">
//                 {data.wishlistCategories.map((c, i) => (
//                   <li key={i}>{c}</li>
//                 ))}
//               </ul>
//             </div>
//             <InfoRow
//               label="Last Wishlist Update:"
//               value={data.wishlistUpdate}
//             />
//           </div>

//           <Divider />

//           {/* Cart Info */}
//           <h3 className="text-sm font-semibold text-gray-900 mb-3">
//             Cart Info
//           </h3>
//           <div className="grid grid-cols-2 gap-x-12 gap-y-4">
//             <InfoRow label="Cart Items Count:" value={data.cartCount} />
//             <InfoRow label="Cart Value:" value={data.cartValue} />
//             <InfoRow label="Last Cart Update:" value={data.lastUpdate} />
//             <InfoRow label="Last Added to Cart:" value={data.lastAdded} />
//             <InfoRow
//               label="Cart Abandonment Status:"
//               value={data.abandoned ? "✔ Yes (Abandoned)" : "No"}
//             />
//             <InfoRow label="Abandonment Duration:" value={data.duration} />
//             <InfoRow
//               label="Last Abandonment Email Sent:"
//               value={data.emailSent}
//             />
//             <InfoRow label="Cart Expiration Date:" value={data.cartExpiry} />
//             <InfoRow label="Used Coupon:" value={data.coupon} />
//           </div>
//         </div>
//     </div>
//   );
// }

// export default WishlistCartInfo;

import React from "react";
import {
  Heart,
  ShoppingCart,
  Clock,
  Tag,
  Calendar,
  Mail,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Link, useOutletContext } from "react-router";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const InfoRow = ({ label, value, icon: Icon, status, className = "" }) => (
  <div className={`flex flex-col gap-1 p-3 bg-gray-50 rounded-lg ${className}`}>
    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </div>
    <div
      className={`text-sm font-medium ${
        status === "alert" ? "text-amber-700" : "text-gray-900"
      }`}
    >
      {value}
    </div>
  </div>
);

const ListPreview = ({ title, items, icon: Icon }) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{title}</span>
    </div>
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-center text-sm text-gray-900">
          <ChevronRight className="w-3 h-3 text-gray-400 mr-1.5 flex-shrink-0" />
          <span className="truncate">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="mb-6 last:mb-0">
    <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2 mb-4">
      {Icon && <Icon className="w-4 h-4" />}
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

function WishlistCartInfo() {
  const { customer } = useOutletContext();
  const data = {
    wishlistCount: "04",
    wishlistCategories: ["Spiritual", "Abstract", "Clones"],
    wishlistPreview: [
      "Tree of Life",
      "Adiyogi Shiva Wall Art",
      "Clones",
      "Floral Mandala",
    ],
    wishlistUpdate: "12 July 2025, 4:30 PM",
    cartCount: "02",
    cartValue: "₹4,800",
    lastUpdate: "14 July 2025, 7:15 PM",
    lastAdded: "Lotus Mandala (₹2,500)",
    abandoned: true,
    duration: "3 days",
    emailSent: "15 July 2025, 9:00 AM",
    cartExpiry: "20 July 2025",
    coupon: "SUMMER25 (₹500 off)",
  };

  return (
    <div className="col-span-7">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Wishlist & Cart Info
          </h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {data.wishlistCount} Wishlist Items
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {data.cartCount} Cart Items
            </span>
          </div>
        </div>

        {/* Wishlist Section */}
        <Section title="Wishlist Details" icon={Heart}>
          <InfoRow
            label="Items Count"
            value={data.wishlistCount}
            icon={Heart}
          />
          <InfoRow
            label="Last Updated"
            value={data.wishlistUpdate}
            icon={Clock}
          />
          <ListPreview
            title="Wishlist Preview"
            items={data.wishlistPreview}
            icon={Heart}
          />
          <ListPreview
            title="Categories"
            items={data.wishlistCategories}
            icon={Tag}
          />
        </Section>

        {/* Cart Section */}
        <Section title="Cart Details" icon={ShoppingCart}>
          <InfoRow
            label="Items Count"
            value={data.cartCount}
            icon={ShoppingCart}
          />
          <InfoRow label="Cart Value" value={data.cartValue} icon={Tag} />
          <InfoRow label="Last Updated" value={data.lastUpdate} icon={Clock} />
          <InfoRow
            label="Last Added Item"
            value={data.lastAdded}
            icon={ShoppingCart}
          />
        </Section>

        {/* Abandoned Cart Section */}
        <Section title="Abandoned Cart" icon={AlertCircle}>
          <InfoRow
            label="Status"
            value={data.abandoned ? "Abandoned ⚠️" : "Active"}
            icon={AlertCircle}
            status={data.abandoned ? "alert" : "normal"}
            className={data.abandoned ? "bg-amber-50" : ""}
          />
          <InfoRow
            label="Duration"
            value={data.duration}
            icon={Clock}
            className={data.abandoned ? "bg-amber-50" : ""}
          />
          <InfoRow
            label="Recovery Email Sent"
            value={data.emailSent}
            icon={Mail}
          />
          <InfoRow
            label="Cart Expiration"
            value={data.cartExpiry}
            icon={Calendar}
          />
        </Section>

        {/* Discount Section */}
        <Section title="Discount & Coupon" icon={Tag}>
          <InfoRow
            label="Applied Coupon"
            value={data.coupon}
            icon={Tag}
            className="bg-green-50"
          />
        </Section>

        {/* Quick Actions */}
        {/* <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
              <Mail className="w-4 h-4" />
              Send Reminder
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">
              <Tag className="w-4 h-4" />
              Apply Discount
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              <ShoppingCart className="w-4 h-4" />
              View Cart Details
            </button>
          </div>
        </div> */}
      </Card>
      <div className="flex items-center gap-2 justify-end mt-6">
        <Link to={"/admin/wishlist-form"} className="inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
          Edit
        </Link>
        <button className="inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
          Cancel
        </button>
        <button className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
          Delete
        </button>
      </div>
    </div>
  );
}

export default WishlistCartInfo;
