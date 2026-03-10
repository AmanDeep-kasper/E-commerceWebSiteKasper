import {
  BellIcon,
  Camera,
  MessageSquareIcon,
  MoonIcon,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import axiosInstance from "../../../api/axiosInstance";
import mainLogo from "../../../assets/IconsUsed/HomeMainLogo.png";

// const links = [
//   { icon: MoonIcon, name: "Theme" },
//   { icon: MessageSquareIcon, name: "Messages", badge: 3 },
//   { icon: BellIcon, name: "Notifications", badge: "" },
// ];

function Header({ isCollapsed }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [adminDetails, setAdminDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        setAdminDetails(res.data);
      } catch (error) {
        console.error("Failed to fetch admin details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  // console.log(adminDetails);
  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 z-50`}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xl font-bold text-gray-800">
          {mainLogo && <img src={mainLogo} alt={mainLogo} />}
        </Link>
      </div>

      {/* Right: Icons + Profile + Search */}
      <div className="flex items-center gap-2">
        {/* Center: Search */}
        <div className="hidden md:block flex-1 max-w-full mx-4">
          <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 hover:bg-white transition-colors duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for anything..."
              className="outline-none flex-1 text-sm text-gray-700 bg-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Icons */}
        {/* {links.map(({ icon: Icon, name, badge }, i) => (
          <div
            key={i}
            className="relative p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition"
            onClick={name === "Theme" ? toggleDarkMode : undefined}
          >
            <Icon className="w-6 h-6 text-gray-600" />
            {badge && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {badge}
              </span>
            )}
          </div>
        ))} */}

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsProfileOpen((prev) => !prev)}
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden group">
              <img
                src={adminDetails?.profileImage || "profileimg"}
                alt="img"
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
              />
              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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

            <div className="hidden md:block">
              <p className="text-sm font-medium">
                {adminDetails?.name || "Admin"}{" "}
              </p>
              <p className="text-xs text-gray-500">
                {adminDetails?.role || "role"}
              </p>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium">{adminDetails?.name|| "Admin name"}</p>
                <p className="text-xs text-gray-500">{adminDetails?.email||"admin@example.com"}</p>
              </div>

              <Link
                to="/admin/profile-setting"
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileOpen(false)}
              >
                <User
                  alternateMobile={adminDetails?.alternateMobile}
                  dateOfjoin={adminDetails?.dateOfBirth}
                  email={adminDetails?.email}
                  gender={adminDetails?.gender}
                  name={adminDetails?.name}
                  profileImage={adminDetails?.profileImage}
                  role={adminDetails?.role}
                  className="w-4 h-4"
                />
                Profile
              </Link>
              <Link
                to="/admin/settings/general"
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>

              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-200 mt-1">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
