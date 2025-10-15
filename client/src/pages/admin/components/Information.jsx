// const InfoRow = ({ label, value }) => (
//   <div className="flex flex-col gap-1 py-1">
//     <div className="text-[13px] font-medium text-gray-700">{label}</div>
//     <div className="text-sm text-gray-900">{value}</div>
//   </div>
// );

// const Card = ({ children, className = "" }) => (
//   <div className={`bg-white border rounded-xl shadow-sm ${className}`}>
//     {children}
//   </div>
// );

// function Information({customer}) {
//   return (
//     <div className="col-span-7">
//       <Card className="p-5">
//         <h2 className="text-sm font-semibold text-gray-900 mb-4">
//           Customer Information
//         </h2>
//         <div className="grid grid-cols-2 gap-x-10 gap-y-3">
//           <InfoRow label="Customer ID:" value={customer.id} />
//           <InfoRow label="Full Name:" value={customer.name} />
//           <InfoRow label="Phone Number:" value={customer.phone} />
//           <InfoRow label="Email Address:" value={customer.email} />
//           <InfoRow label="Gender:" value={customer?.gender || "male"} />
//           <InfoRow label="Date of Birth:" value={customer?.dob || "21st Aug"} />
//           <InfoRow
//             label="Account Type:"
//             value={customer?.accountType || "registered"}
//           />
//           <InfoRow label="Status:" value={customer.status} />
//           <InfoRow label="Phone Verified:" value={customer.phone_verified} />
//           <InfoRow label="Email Registered:" value={customer.email_verified} />
//           <InfoRow label="Registration Date:" value={customer.joined_date} />
//           <InfoRow label="Last Login:" value={customer.last_order_date} />
//         </div>
//       </Card>
//     </div>
//   );
// }

// export default Information;



import React from "react";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle, 
  Clock,
  CreditCard,
  Activity,
  VenusAndMars
} from "lucide-react";
import { Link, useOutletContext } from "react-router";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const InfoRow = ({ label, value, icon: Icon, verified }) => (
  <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-900">{value}</span>
      {verified && (
        <CheckCircle className="w-4 h-4 text-green-500" />
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.inactive}`}>
      {status}
    </span>
  );
};

function Information() {
  // Format dates for better display
  const { customer } = useOutletContext();
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="col-span-7">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Information
          </h2>
          <StatusBadge status={customer.status} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Information Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2">
              Personal Details
            </h3>
            <InfoRow 
              label="Customer ID" 
              value={customer.id} 
              icon={User}
            />
            <InfoRow 
              label="Full Name" 
              value={customer.name} 
              icon={User}
            />
            <InfoRow 
              label="Phone Number" 
              value={customer.phone} 
              icon={Phone}
              verified={customer.phone_verified}
            />
            <InfoRow 
              label="Email Address" 
              value={customer.email} 
              icon={Mail}
              verified={customer.email_verified}
            />
            <InfoRow 
              label="Gender" 
              value={customer?.gender || "Male"} 
              icon={VenusAndMars}
            />
            <InfoRow 
              label="Date of Birth" 
              value={customer?.dob ? formatDate(customer.dob) : "21st Aug"} 
              icon={Calendar}
            />
          </div>
          
          {/* Account Information Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2">
              Account Details
            </h3>
            <InfoRow 
              label="Account Type" 
              value={customer?.accountType || "Registered"} 
              icon={CreditCard}
            />
            <InfoRow 
              label="Status" 
              value={<StatusBadge status={customer.status} />} 
              icon={Activity}
            />
            <InfoRow 
              label="Phone Verified" 
              value={customer.phone_verified ? "Verified" : "Not Verified"} 
              icon={Phone}
              verified={customer.phone_verified}
            />
            <InfoRow 
              label="Email Verified" 
              value={customer.email_verified ? "Verified" : "Not Verified"} 
              icon={Mail}
              verified={customer.email_verified}
            />
            <InfoRow 
              label="Registration Date" 
              value={formatDate(customer.joined_date)} 
              icon={Clock}
            />
            <InfoRow 
              label="Last Login" 
              value={formatDate(customer.last_order_date)} 
              icon={Clock}
            />
          </div>
        </div>
        
        {/* Additional Stats Section */}
        {/* <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Activity Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">12</div>
              <div className="text-xs text-gray-600">Total Orders</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">$1,240</div>
              <div className="text-xs text-gray-600">Total Spent</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">3</div>
              <div className="text-xs text-gray-600">Wishlist Items</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-700">98%</div>
              <div className="text-xs text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div> */}
      </Card>
      <div className="flex items-center gap-2 justify-end mt-6">
              <Link to={'/admin/customer-form'} className="inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
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

export default Information;