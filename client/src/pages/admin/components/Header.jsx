import {
  BellIcon,
  Camera,
  MessageSquareIcon,
  MoonIcon,
  Search,
  SunIcon,
  ChevronDown,
  LogOut,
  Settings,
  User
} from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router";

const links = [
  { icon: MoonIcon, name: "Theme" },
  { icon: MessageSquareIcon, name: "Messages", badge: 3 },
  { icon: BellIcon, name: "Notifications", badge: 7 },
];

function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const inputRef = useRef(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can add logic to toggle dark mode class on document here
  };

  return (
    <div className="w-full flex justify-between items-center px-4 py-3 bg-white shadow-sm border-b border-gray-200">
      {/* Logo */}
      <Link to={`/`} className="text-xl font-bold">LOGO</Link>

      {/* Search Bar */}
      <div className="flex items-center flex-1 justify-end">
        <div className="flex-1 max-w-sm mx-4 hidden md:block">
          <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 bg-gray-50 hover:bg-white transition-colors duration-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for anything..."
              className="outline-none flex-1 text-sm text-gray-700 bg-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Icon Links */}
        <div className="flex items-center gap-2 mr-4">
          {links.map(({ icon: Icon, name, badge }, index) => (
            <div
              key={index}
              className="relative p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors duration-200 group"
              onClick={name === "Theme" ? toggleDarkMode : undefined}
            >
              {Icon && (
                <>
                  <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                  {/* {badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {badge}
                    </span>
                  )} */}
                </>
              )}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded mt-1 whitespace-nowrap">
                {name}
              </div>
            </div>
          ))}
        </div>

        {/* Profile Section */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="relative group w-9 h-9 rounded-full overflow-hidden">
              <img
                src={"/name1.jpg"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
              />
              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                <Camera className="text-white w-4 h-4" />
              </div>
              <input 
                type="file" 
                ref={inputRef}
                className="hidden" 
                accept="image/*" 
              />
            </div>
            <div className="hidden md:block text-black leading-4">
              <p className="text-sm font-medium">Rohit Sharma</p>
              <p className="text-xs text-gray-600 font-light">Admin</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium">Rohit Sharma</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
              
              <div className="py-1">
                <Link to={'/admin/profile-setting'} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150" onClick={() => isProfileOpen(false)}>
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link to={"/admin/settings/general"} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </div>
              
              <div className="py-1 border-t border-gray-200">
                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;