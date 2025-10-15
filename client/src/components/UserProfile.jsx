import {
  UserRound,
  List,
  Package,
  Heart,
  MapPinHouse,
  Headset,
  Star,
  LogOut,
  LogIn,
  ChevronRight,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { getUserDetails, logout } from "../redux/cart/userSlice"; // ✅ import logout from slice

// Account Menu Items
const accountDetails = [
  { listName: "Account Details", listIcon: List, path: "/details" },
  { listName: "Orders", listIcon: Package, path: "/order-history" },
  { listName: "Wishlist", listIcon: Heart, path: "/wishlist" },
  { listName: "Manage Addresses", listIcon: MapPinHouse, path: "/addresses" },
  { listName: "Support & Help", listIcon: Headset, path: "/support" },
  { listName: "Rating & Reviews", listIcon: Star, path: "/reviews" },
];

function UserProfile({ setIsProfileOpen }) {
  // ✅ Redux state
  const { user, isAuthenticated } = useSelector((state) => state.user);

  return (
    <div className="h-max md:w-[413px] sm:w-[350px] w-[280px] overflow-hidden mx-auto bg-white z-50">
      {/* Top section: user icon and welcome message */}
      <div className="flex gap-4 items-center px-4 py-5 border-b border-gray-200 cursor-default">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <UserRound size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name || "Guest"}</p>
            <p className="text-sm text-gray-500">
              {isAuthenticated ? "Welcome back!" : "Please log in"}
            </p>
          </div>
        </div>
      </div>

      {/* List of Account Sections */}
      <div className="py-2 px-4">
        {accountDetails.map(({ listName, listIcon: Icon, path }) => (
          <NavLink
            key={listName}
            to={`/accounts${path}`}
            onClick={() => setIsProfileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 my-1 rounded-lg transition-colors duration-200 group ${
                isActive ? "bg-yellow-50" : "hover:bg-gray-50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-yellow-100"
                      : "bg-gray-100 group-hover:bg-yellow-100"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-yellow-600"
                        : "text-gray-600 group-hover:text-yellow-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h2
                    className={`font-medium text-sm ${
                      isActive ? "text-yellow-700" : "text-gray-800"
                    }`}
                  >
                    {listName}
                  </h2>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default UserProfile;
