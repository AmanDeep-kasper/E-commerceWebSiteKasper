import { Clock, Globe, Key, Mail, Phone, User } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const InfoRow = ({ label, value, icon: Icon, verified }) => (
  <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-900">{value}</span>
      {verified && <CheckCircle className="w-4 h-4 text-green-500" />}
    </div>
  </div>
);

function AdminProfileSetting() {
  const admin = {
    name: "Rohit Sharma",
    email: "rohitsharma@gmail.com",
    phone: "8448******",
    joined: "12 Jan 2024",
    language: "English",
    password: "********",
  };

  return (
    <div className=" bg-gray-50 text-gray-900 ">
      <div className="grid grid-cols-8 gap-4">
        {/* Left Profile Card */}
        <div className="bg-white col-span-2 border rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
          <img
            src="/name1.jpg"
            alt="Rohit Sharma"
            className="w-16 h-16 rounded-full object-cover mb-3"
          />
          <h3 className="text-sm font-medium">Rohit Sharma</h3>
          <p className="text-xs text-gray-500">rohitsharma@gmail.com</p>
          <p className="text-xs text-gray-400 mt-1">Joined Date: 12 Jan 2024</p>
        </div>

        {/* Center Admin Settings */}
        <div className="bg-white border rounded-xl shadow-sm p-6 col-span-4">
          <h2 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Admin Profile Setting
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <InfoRow label="Full Name" value={admin.name} icon={User} />
            <InfoRow label="Email Address" value={admin.email} icon={Mail} />
            <InfoRow label="Phone Number" value={admin.phone} icon={Phone} />
            <InfoRow label="Joined Date" value={admin.joined} icon={Clock} />
            <InfoRow label="Language" value={admin.language} icon={Globe} />
            <InfoRow label="Change Password" value={admin.name} icon={Key} />
          </div>
        </div>

        {/* Right Profile Card */}
        <div className="bg-white col-span-2 border rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
          <img
            src="/name1.jpg"
            alt="Rohit Sharma"
            className="w-16 h-16 rounded-full object-cover mb-3"
          />
          <h3 className="text-sm font-medium">Rohit Sharma</h3>
          <p className="text-xs text-gray-500">rohitsharma@gmail.com</p>
          <p className="text-xs text-gray-400 mt-1">Joined Date: 12 Jan 2024</p>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end mt-6">
        <Link
          to={"/admin/profile-form"}
          className="inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50"
        >
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

export default AdminProfileSetting;

// import React, { useState } from "react";
// import {
//   User,
//   Settings,
//   Bell,
//   Shield,
//   CreditCard,
//   BarChart3,
//   Download,
//   Edit3,
//   LogOut,
//   Mail,
//   Phone,
//   Calendar,
//   Globe,
//   Key,
//   Eye,
//   EyeOff,
//   ChevronDown,
//   CheckCircle,
//   XCircle,
//   Server,
//   Database,
//   Cpu,
//   HardDrive
// } from "lucide-react";

// const StatCard = ({ title, value, icon: Icon, trend, className = "" }) => (
//   <div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-200 ${className}`}>
//     <div className="flex justify-between items-start mb-3">
//       <div>
//         <p className="text-sm text-gray-500 mb-1">{title}</p>
//         <p className="text-2xl font-bold text-gray-800">{value}</p>
//       </div>
//       <div className="p-2 bg-blue-50 rounded-lg">
//         <Icon className="w-5 h-5 text-blue-600" />
//       </div>
//     </div>
//     {trend && (
//       <div className={`inline-flex items-center text-xs ${trend.value > 0 ? "text-green-600" : "text-red-600"}`}>
//         {trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
//       </div>
//     )}
//   </div>
// );

// const ActionButton = ({ icon: Icon, label, onClick, variant = "default" }) => {
//   const variants = {
//     default: "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
//     primary: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
//     danger: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
//   };

//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm font-medium transition-colors ${variants[variant]}`}
//     >
//       {Icon && <Icon className="w-4 h-4" />}
//       <span>{label}</span>
//     </button>
//   );
// };

// const ToggleSwitch = ({ enabled, setEnabled }) => (
//   <button
//     onClick={() => setEnabled(!enabled)}
//     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
//   >
//     <span
//       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
//     />
//   </button>
// );

// function AdminProfileDashboard() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   const admin = {
//     name: "Rohit Sharma",
//     email: "rohitsharma@example.com",
//     phone: "+91 8448XXXXXX",
//     joined: "12 Jan 2024",
//     lastLogin: "15 Jun 2024, 14:30",
//     role: "Super Administrator",
//     status: "active"
//   };

//   const stats = [
//     { title: "Total Logins", value: "1,248", icon: User, trend: { value: 12, label: "this month" } },
//     { title: "Tasks Completed", value: "89%", icon: BarChart3, trend: { value: 5, label: "this week" } },
//     { title: "Storage Used", value: "2.4/5GB", icon: Database, trend: { value: -2, label: "this month" } },
//     { title: "System Health", value: "98%", icon: Server, trend: { value: 1, label: "stable" } }
//   ];

//   const quickActions = [
//     { icon: Edit3, label: "Edit Profile", variant: "default" },
//     { icon: Download, label: "Export Data", variant: "default" },
//     { icon: Shield, label: "Privacy Settings", variant: "default" },
//     { icon: CreditCard, label: "Billing", variant: "default" }
//   ];

//   const securityEvents = [
//     { id: 1, action: "Password changed", date: "10 Jun 2024, 09:23", device: "iPhone 13 Pro", status: "success" },
//     { id: 2, action: "Login from new device", date: "5 Jun 2024, 14:45", device: "MacBook Pro", status: "success" },
//     { id: 3, action: "Failed login attempt", date: "2 Jun 2024, 03:12", device: "Unknown", status: "failed" },
//     { id: 4, action: "Two-factor enabled", date: "1 Jun 2024, 11:30", device: "Web", status: "success" }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//             <p className="text-gray-500">Manage your account settings and preferences</p>
//           </div>
//           <div className="flex items-center gap-3">
//             <ActionButton icon={LogOut} label="Logout" variant="danger" />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Profile Card */}
//           <div className="lg:col-span-1 space-y-6">
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex flex-col items-center text-center">
//                 <div className="relative mb-4">
//                   <img
//                     src="/name1.jpg"
//                     alt={admin.name}
//                     className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-sm"
//                   />
//                   <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 shadow-md">
//                     <User className="w-4 h-4 text-white" />
//                   </div>
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900">{admin.name}</h2>
//                 <p className="text-gray-500">{admin.email}</p>

//                 <div className="mt-3 px-4 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
//                   {admin.status}
//                 </div>

//                 <div className="w-full mt-6 space-y-3">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-500">Role:</span>
//                     <span className="font-medium text-gray-800">{admin.role}</span>
//                   </div>
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-500">Joined:</span>
//                     <span className="font-medium text-gray-800">{admin.joined}</span>
//                   </div>
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-500">Last Login:</span>
//                     <span className="font-medium text-gray-800">{admin.lastLogin}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//               <div className="grid grid-cols-2 gap-3">
//                 {quickActions.map((action, index) => (
//                   <ActionButton
//                     key={index}
//                     icon={action.icon}
//                     label={action.label}
//                     variant={action.variant}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Middle Column - Stats and Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {stats.map((stat, index) => (
//                 <StatCard
//                   key={index}
//                   title={stat.title}
//                   value={stat.value}
//                   icon={stat.icon}
//                   trend={stat.trend}
//                 />
//               ))}
//             </div>

//             {/* Tabs */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="border-b border-gray-200">
//                 <nav className="flex -mb-px">
//                   {["overview", "security", "preferences", "billing"].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
//                         activeTab === tab
//                           ? "border-blue-500 text-blue-600"
//                           : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                       }`}
//                     >
//                       {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                     </button>
//                   ))}
//                 </nav>
//               </div>

//               <div className="p-6">
//                 {activeTab === "overview" && (
//                   <div className="space-y-6">
//                     <h3 className="text-lg font-semibold text-gray-900">Account Overview</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="p-4 bg-gray-50 rounded-lg">
//                         <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2 text-sm">
//                             <Mail className="w-4 h-4 text-gray-400" />
//                             <span>{admin.email}</span>
//                           </div>
//                           <div className="flex items-center gap-2 text-sm">
//                             <Phone className="w-4 h-4 text-gray-400" />
//                             <span>{admin.phone}</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="p-4 bg-gray-50 rounded-lg">
//                         <h4 className="text-sm font-medium text-gray-700 mb-2">Security</h4>
//                         <div className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm">Two-factor authentication</span>
//                             <ToggleSwitch enabled={twoFactorEnabled} setEnabled={setTwoFactorEnabled} />
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm">Email notifications</span>
//                             <ToggleSwitch enabled={notificationsEnabled} setEnabled={setNotificationsEnabled} />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Security Activity</h4>
//                       <div className="space-y-3">
//                         {securityEvents.map((event) => (
//                           <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                             <div>
//                               <p className="text-sm font-medium">{event.action}</p>
//                               <p className="text-xs text-gray-500">{event.date} • {event.device}</p>
//                             </div>
//                             {event.status === "success" ? (
//                               <CheckCircle className="w-5 h-5 text-green-500" />
//                             ) : (
//                               <XCircle className="w-5 h-5 text-red-500" />
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {activeTab === "security" && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
//                     <p className="text-gray-600">Security content goes here...</p>
//                   </div>
//                 )}

//                 {activeTab === "preferences" && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
//                     <p className="text-gray-600">Preferences content goes here...</p>
//                   </div>
//                 )}

//                 {activeTab === "billing" && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
//                     <p className="text-gray-600">Billing content goes here...</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminProfileSetting