import { useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { NavLink, useNavigate } from "react-router-dom";
import users from "../data/user";
import {
  User,
  Package,
  Heart,
  MapPin,
  HelpCircle,
  Star,
  Camera,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser, updateProfileImage } from "../redux/cart/userSlice";

const accountMenu = [
  { label: "Account Details", path: "/details", icon: User },
  { label: "Orders", path: "/order-history", icon: Package },
  { label: "Wishlist", path: "/wishlist", icon: Heart },
  { label: "Manage Addresses", path: "/addresses", icon: MapPin },
  { label: "Support & Help", path: "/support", icon: HelpCircle },
  { label: "Reviews & Ratings", path: "/reviews", icon: Star },
  { label: "Reward Points", path: "/reward", icon: Star },
];

function AccountSidebar() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const token = localStorage.getItem("token");
  const { user, isAuthenticated } = useSelector((s) => s.user);
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    const res = await dispatch(updateProfileImage(formData));

    if (!res.error) {
      toast.success("Profile image updated");
    } else {
      toast.error(res.payload);
    }
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());

    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="sticky top-28 h-max min-w-[310px] !w-[310px] bg-white rounded-lg shadow-sm overflow-hidden mt-5">
      {/* Account holder */}
      <div className="px-6 py-4 flex gap-4 items-center text-white bg-gradient-to-r from-[#CFC7FF]/50 to-[#FFC9EA]/20 rounded-b-3xl rounded-t-lg m-1">
        <div className="relative group w-14 h-14 rounded-full overflow-hidden border-2 border-white/90 hover:border-white/50 transition-all duration-300">
          <img
            src={user?.user?.profileImage?.url || "/name1.jpg"}
            alt="Profile"
            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
          />

          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => inputRef.current.click()}
          >
            <Camera className="text-white w-5 h-5" />
          </div>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="text-black">
          <p className="text-sm font-light">Welcome back</p>
          <p className="font-medium">{user?.user?.name}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 py-2">
        {/* Account Details */}
        <div className="mb-6">
          <h3 className="px-2 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </h3>
          <ul className="space-y-1">
            {accountMenu.map(({ label, path, icon: Icon }) => (
              <li key={label}>
                <NavLink
                  to={`/accounts${path}`}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-[#F0EEFF] text-[#1C3753] border-l-4 border-[#1C3753] "
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  {Icon && <Icon className="w-5 h-5 mr-3 " />}
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <hr />
        <button
          onClick={handleLogout}
          className="w-full flex items-center bg-[#F0EEFF] px-3 py-3 mt-1 text-lg font-normal text-[#1C1C1C] hover:bg-[#D5E5F5] rounded-lg transition-all duration-200 group"
        >
          <div className="p-1.5 mr-3 bg-[#F0EEFF] text-[#1C3753] rounded-lg group-hover:bg-[#D5E5F5] transition-all duration-200">
            <LogOut className="text-[#1800AC]"/>
          </div>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default AccountSidebar;
