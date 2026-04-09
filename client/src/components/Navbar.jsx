import products from "../data/products.json";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  UserRound,
  Heart,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Home,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  LogIn,
  MapPin,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "./UserProfile";
import users from "../data/user";
import Modal from "./Modal";
import { logout } from "../redux/cart/userSlice";
import MainLog from "../assets/IconsUsed/HomeMainLogo.png";
import axiosInstance from "../api/axiosInstance";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [showChoice, setShowChoice] = useState(
    user?.role === "admin" ? true : false,
  );
  // console.log(showChoice)
  // const [showChoice, setShowChoice] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [subDropdown, setSubDropdown] = useState(null);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const query = searchParams.get("q") || "";
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const totalItems = useSelector((state) => state.cart.totalItems);
  const totalWishlistItems = useSelector(
    (state) => state?.wishlist?.totalItems,
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [shopCategories, setShopCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/products/categories");
        setShopCategories(res.data.categories || []);
        // console.log("CATEGORIES:", res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    dispatch(logout()); // updates Redux + clears localStorage
    navigate("/"); // redirect to home
  };

  // Mock shop categories data
  // const shopCategories = Object.values(
  //   products.reduce((acc, { category, subcategory }) => {
  //     if (!acc[category]) {
  //       acc[category] = {
  //         name: category,
  //         path: `/products/${encodeURIComponent(category)}`, // matches your route
  //         sublist: [],
  //       };
  //     }

  //     if (!acc[category].sublist.some((sub) => sub.name === subcategory)) {
  //       acc[category].sublist.push({
  //         name: subcategory,
  //         category: subcategory,
  //         path: `/${encodeURIComponent(subcategory)}`,
  //       });
  //     }

  //     return acc;
  //   }, {}),
  // );

  // disable background scroll when mobile nav is open
  useEffect(() => {
    if (dropdown || isProfileOpen || (isOpen && window.innerWidth < 1024)) {
      // Only block scroll when dropdown (mobile nav) or isOpen AND in mobile mode
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [dropdown, isOpen, isProfileOpen]);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Filter results
  const filteredResults = products
    .filter((item) =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    )
    .slice(0, 5);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const Announcement = [
    {
      name: "Welcome to the beautiful world of Art Search",
    },
    {
      name: "Free Shipping on orders above ₹1,999",
    },
    {
      name: "COD Available",
    },
  ];

  return (
    // <div className="w-full">
    <div className="w-full top-0 left-0 z-50 relative">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#1800AC] text-white text-center text-sm py-2">
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
        >
          {Announcement.map((item, idx) => {
            return (
              <SwiperSlide>
                <p>{item.name}</p>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Fixed Navbar */}
      {/* <div className="fixed top-0 left-0 w-full h-16 bg-white shadow-sm z-50 border-b border-gray-200"> */}
      <div className="w-full h-16 bg-white shadow-sm border-b border-gray-200">
        <div className="h-full  flex justify-between items-center px-4 md:px-16 lg:px-20">
          {/* Left Section */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Mobile menu button */}
            <div
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
              onClick={() => {
                // setDropdown(!dropdown);
                setIsMobileMenuOpen((p) => !p);
                setIsProfileOpen(false);
              }}
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </div>

            {/* Logo */}
            <Link to="/home" className="flex items-center">
              {/* <h1 className="text-lg sm:text-xl font-semibold text-amber-600">
                Logo
              </h1> */}
              <img src={MainLog} alt="logo" />
            </Link>
            <Link to="/accounts/addresses">
              <button className="flex items-center gap-1">
                <MapPin size={16} />
                <span className="text-sm lg:text-xs md:text-sm text-[#4C5562]">
                  Add Delivery Location
                </span>
              </button>
            </Link>
          </div>

          {/* Add  */}

          {/* Desktop Navigation */}
          {/* <nav className="hidden lg:flex gap-8">
            <Link
              to="/home"
              className="relative group text-gray-700  hover:text-[#1C3753] transition-colors flex items-center gap-1 py-2"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1C3753] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <div className="relative">
              <button
                className="flex items-center gap-1 text-gray-700  hover:text-[#1C3753] transition-colors py-2 h-16"
                onMouseEnter={() => setDropdown(true)}
                onMouseLeave={() => setDropdown(false)}
              >
                Shop
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${
                    dropdown ? "rotate-180 text-[#1C3753]" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#1C3753] transition-all duration-300 ${
                    dropdown ? "w-full" : "w-0"
                  }`}
                ></span>
              </button>

              <div
                onMouseEnter={() => setDropdown(false)}
                className={`fixed top-16 left-0 right-0 bottom-0 bg-black/10 backdrop-blur-sm transition-all duration-300 z-40 ${
                  dropdown ? "visible opacity-100" : "invisible opacity-0"
                }`}
              ></div>

              <div
                onMouseEnter={() => setDropdown(true)}
                onMouseLeave={() => setDropdown(false)}
                className={`fixed top-16 left-0 w-full bg-white backdrop-blur-md shadow-xl border-t border-gray-200 transition-all duration-300 z-50 ${
                  dropdown ? "visible opacity-100" : "invisible opacity-0"
                }`}
              >
                <div className="max-w-7xl mx-auto px-10 py-10 grid xl:grid-cols-6 grid-cols-5 gap-8">
                  {shopCategories.map((cat) => (
                    <div key={cat.name}>
                      <h3
                        className="font-semibold"
                        onClick={() =>
                          navigate(`/products/${encodeURIComponent(cat.name)}`)
                        }
                      >
                        {cat.name}
                      </h3>

                      <ul>
                        {(cat.subcategories || [])
                          .filter((s) => s && s.toLowerCase() !== "all")
                          .map((sub) => (
                            <li key={sub}>
                              <button
                                className="text-[#686868] hover:underline"
                                onClick={() =>
                                  navigate(
                                    `/products/${encodeURIComponent(cat.name)}/${encodeURIComponent(sub)}`,
                                  )
                                }
                              >
                                {sub}
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/faqs"
              className="relative group text-gray-700  hover:text-[#1C3753] transition-colors flex items-center gap-1 py-2"
            >
              FAQs
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1C3753] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav> */}

          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
              {/* Desktop Search Input */}
              <div className="hidden lg:flex items-center bg-gray-50 overflow-hidden w-64 lg:w-80 xl:w-96 border-[1.5px] border-[#686868] rounded-md">
                <Search size={18} className="mx-2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={query} // ✅ from searchParams
                  onChange={(e) => {
                    setSearchParams({ q: e.target.value }); // ✅ always replace with new query
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  className="flex-1 py-2 px-2 outline-none text-sm bg-transparent placeholder:text-[#686868]"
                />
              </div>

              {/* Desktop Dropdown */}
              <div className="hidden lg:block border border-transparent">
                {isOpen && debouncedSearch && (
                  <div className="absolute top-full left-0 w-64 lg:w-80 xl:w-96 bg-white border border-gray-200 shadow-md mt-2.5 z-50">
                    {filteredResults.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {filteredResults.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setIsOpen(false);
                              setSearchParams({}, { replace: true });
                              setTimeout(() => {
                                navigate(
                                  `/products/${encodeURIComponent(
                                    item.category,
                                  )}`,
                                );
                              }, 0);
                            }}
                          >
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-14 h-14 object-cover rounded border"
                            />
                            <div>
                              <p className="text-sm font-medium">
                                {item.title}
                              </p>
                              <p className="text-xs text-[#1C3753]">
                                in {item.category || "Uncategorized"}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="p-3 text-sm text-gray-500">
                        No results found.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Search Icon */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors"
                onClick={() => setIsOpen(true)}
              >
                <Search size={20} className="text-gray-600" />
              </button>

              {/* Mobile full-screen modal */}
              {isOpen && (
                <div className="fixed inset-0 bg-white z-50 p-4 lg:hidden flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold">Search</h2>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setSearchParams({ q: "" });
                      }}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Input */}
                  <div className="flex items-center border rounded-md mb-4">
                    <Search size={18} className="mx-2 text-gray-500" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search for products..."
                      value={query}
                      onChange={(e) => setSearchParams({ q: e.target.value })}
                      className="flex-1 py-2 px-2 outline-none text-sm"
                    />
                  </div>

                  {/* Results */}
                  <div className="flex-1 overflow-y-auto">
                    {debouncedSearch ? (
                      filteredResults.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                          {filteredResults.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                setIsOpen(false);
                                setSearchParams({}, { replace: true });
                                setTimeout(() => {
                                  navigate(
                                    `/products/${encodeURIComponent(
                                      item.category,
                                    )}`,
                                  );
                                }, 0);
                              }}
                            >
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-10 h-10 object-cover rounded border"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {item.title}
                                </p>
                                <p className="text-xs text-amber-600">
                                  in {item.category || "Uncategorized"}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No results found.
                        </p>
                      )
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        Type to search...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {showChoice && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 rounded-lg group hover:bg-amber-50 transition-colors"
              >
                <LayoutDashboard
                  size={20}
                  className="text-gray-600 group-hover:text-[#1C3753]"
                />
              </button>
            )}

            {/* User dropdown */}
            <div className="relative group cursor-pointer">
              <button
                className="p-2 rounded-lg hover:bg-[#D5E5F5] transition-colors"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setDropdown(false);
                }}
                aria-expanded={isProfileOpen}
              >
                <UserRound
                  size={20}
                  className="text-gray-600 group-hover:text-[#1C3753]"
                />
              </button>

              <div className="absolute -right-[340%] hidden lg:group-hover:block max-lg:hidden top-9 z-50 border border-transparent">
                <div className="border border-gray-200 mt-4">
                  <UserProfile />
                  <div className="pt-4 border-t border-gray-200 bg-white">
                    {isAuthenticated ? (
                      <>
                        {/* Logout Button */}
                        <div
                          className="flex items-center gap-4 px-7 pb-6 rounded-lg cursor-pointer transition-colors duration-200 group"
                          onClick={() => setShowLogoutModal(true)}
                        >
                          <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#D5E5F5] transition-colors duration-200">
                            <LogOut className="w-5 h-5 text-gray-600 group-hover:text-[#1C3753]" />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-gray-800 font-medium text-[16px]">
                              Log Out
                            </h2>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Login Link
                      <Link
                        to="/login"
                        className="flex items-center gap-4 px-7 pb-6 rounded-lg cursor-pointer transition-colors duration-200 group"
                      >
                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#D5E5F5] transition-colors duration-200">
                          <LogIn className="w-5 h-5 text-gray-600 group-hover:text-[#1C3753]" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-gray-800 font-medium text-sm">
                            Log In
                          </h2>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute w-12 h-12 hidden lg:group-hover:block max-lg:hidden bg-gray-200 rotate-45 top-12 -left-1"></div>
              <div className="absolute w-12 h-12 hidden lg:group-hover:block max-lg:hidden bg-white z-50 rotate-45 top-12 -left-1.5 m-0.5"></div>
            </div>

            {/* Wishlist */}
            <Link
              to="/accounts/wishlist"
              className="relative p-2 rounded-lg group hover:bg-[#D5E5F5] transition-colors"
            >
              <Heart
                size={20}
                className="text-gray-600 group-hover:text-[#1C3753]"
              />
              {totalWishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1C3753] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/bag"
              className="relative p-2 group rounded-lg hover:bg-[#D5E5F5] transition-colors"
            >
              <ShoppingCart
                size={20}
                className="text-gray-600 group-hover:text-[#1C3753]"
              />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1C3753] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer so page content doesn't overlap navbar */}
      {/* <div className="h-16"></div> */}

      {/* Mobile Dropdown Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setDropdown(false)}
            />

            {/* Mobile menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-16 left-0 bottom-0 bg-white shadow-lg z-50 flex flex-col overflow-y-auto
                   w-3/4 md:w-1/2 lg:hidden"
            >
              {/* Header */}
              {/* <div className="p-5 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <UserRound size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {users?.[0]?.name || "Guest"}
                    </p>

                    <p className="text-sm text-gray-500">Welcome back!</p>
                  </div>
                </div>
              </div> */}

              {/* Links */}
              <div className="px-6 py-4 flex-1">
                <Link
                  to="/home"
                  onClick={() => setDropdown(false)}
                  className="flex items-center gap-3 py-3 text-gray-800 font-medium hover:text-[#1C3753] transition-colors"
                >
                  Home
                </Link>

                <div className="my-2 border-t border-gray-200"></div>

                {/* Categories */}
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                  Shop Categories
                </h3>

                {shopCategories.map((item, index) => (
                  <div key={item.name || index} className="py-2">
                    <div
                      className="flex items-center justify-between py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-[#D5E5F5] hover:text-[#1C3753] cursor-pointer"
                      onClick={() =>
                        setSubDropdown(subDropdown === index ? null : index)
                      }
                    >
                      <span>{item.name}</span>

                      {item.subcategories?.length > 0 && (
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-300 ${
                            subDropdown === index ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>

                    <div
                      className={`pl-6 flex flex-col gap-1 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                        subDropdown === index ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      {/* All */}
                      <div
                        className="py-2 px-3 text-sm rounded-md text-gray-600 hover:bg-[#D5E5F5] hover:text-[#1C3753] cursor-pointer"
                        onClick={() => {
                          navigate(
                            `/products/${encodeURIComponent(item.name)}`,
                          );
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        All
                      </div>

                      {/* Subcategories */}
                      {(item.subcategories || [])
                        .filter((s) => s && s.toLowerCase() !== "all")
                        .map((sub) => (
                          <div
                            key={sub}
                            className="py-2 px-3 text-sm text-gray-600 rounded-md hover:bg-[#D5E5F5] hover:text-[#1C3753] cursor-pointer"
                            onClick={() => {
                              navigate(
                                `/products/${encodeURIComponent(item.name)}/${encodeURIComponent(sub)}`,
                              );
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {sub}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}

                <div className="my-2 border-t border-gray-200"></div>

                <Link
                  to="/faqs"
                  onClick={() => setDropdown(false)}
                  className="flex items-center gap-3 py-3 text-gray-800 font-medium hover:text-[#1C3753] transition-colors"
                >
                  FAQs
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed lg:hidden inset-0 bg-black/50 z-40"
              onClick={() => setIsProfileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.35,
              }}
              className="
          fixed top-16 bottom-0 left-0 bg-white shadow-lg z-50 flex flex-col overflow-y-auto
          w-3/4 md:w-1/2 lg:w-1/4 lg:hidden
        "
              role="menu"
            >
              <UserProfile setIsProfileOpen={setIsProfileOpen} />
              <div className="pt-4 border-t border-gray-200 bg-white">
                {isAuthenticated ? (
                  <>
                    {/* Logout Button */}
                    <div
                      className="flex items-center gap-4 px-7 pb-6 rounded-lg cursor-pointer transition-colors duration-200 group"
                      onClick={() => setShowLogoutModal(true)}
                    >
                      <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors duration-200">
                        <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-gray-800 font-medium text-sm">
                          Log Out
                        </h2>
                      </div>
                    </div>
                  </>
                ) : (
                  // Login Link
                  <Link
                    to="/login"
                    className="flex items-center gap-4 px-7 pb-6 rounded-lg cursor-pointer transition-colors duration-200 group"
                  >
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-yellow-100 transition-colors duration-200">
                      <LogIn className="w-5 h-5 text-gray-600 group-hover:text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-yellow-600 font-medium text-sm">
                        Log In
                      </h2>
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          handleLogout();
          setShowLogoutModal(false);
        }}
        title="Log Out"
        description="Are you sure you want to log out?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
      ></Modal>
    </div>
  );
}

export default Navbar;
