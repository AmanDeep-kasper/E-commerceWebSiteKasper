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
  Component,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";

// Account Menu Items
const accountDetails = [
  { listName: "Account Details", listIcon: List, path: "/details" },
  { listName: "Orders", listIcon: Package, path: "/order-history" },
  { listName: "Wishlist", listIcon: Heart, path: "/wishlist" },
  { listName: "Manage Addresses", listIcon: MapPinHouse, path: "/addresses" },
  { listName: "Support & Help", listIcon: Headset, path: "/support" },
  { listName: "Rating & Reviews", listIcon: Star, path: "/reviews" },
  { listName: "Reward Points" ,listIcon: Component , path: "/reward"}
];

function UserProfile({ setIsProfileOpen }) {
  //  Redux state
  const { user, isAuthenticated } = useSelector((state) => state.user);
  // console.log("user", user);

  // console.log(user);
  // console.log(isAuthenticated);

  return (
    <div className="h-max md:w-[413px] sm:w-[350px] w-[280px] overflow-hidden mx-auto bg-white z-50 ">
      {/* Top section: user icon and welcome message */}
      <div className="flex gap-4 items-center px-4 py-5 border-b border-gray-200 cursor-default">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D5E5F5] flex items-center justify-center">
            {user ? (
              <img
                src={user?.user?.profileImage?.url}
                alt="UserImage"
                className=" rounded-full"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserRound size={20} className="text-[#1C3753]" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {user?.user?.name || "Guest"}
            </p>
            <p className="text-sm text-gray-500">
              {isAuthenticated ? "Welcome back!" : "Please log in"}
            </p>
          </div>
        </div>
      </div>

      {/* List of Account Sections */}
      {isAuthenticated && (
        <div className="py-2 px-4">
          {accountDetails.map(({ listName, listIcon: Icon, path }) => (
            <NavLink
              key={listName}
              to={`/accounts${path}`}
              onClick={() => {
                setTimeout(() => {
                  // setIsProfileOpen(false);
                }, 0);
              }}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 my-1 rounded-lg duration-200 group ${
                  isActive ? "bg-[#F0EEFF]" : "hover:bg-[#F8FBFC]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? "bg-[#]" : "bg-[#F0EEFF]"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#1800AC]" />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-medium text-[16px] text-gray-800">
                      {listName}
                    </h2>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
