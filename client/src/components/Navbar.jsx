import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCart } from "../services/CartService";
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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "./UserProfile";
import { clearWishlist, setWishlistFromAPI } from "../redux/cart/wishlistSlice";
import Modal from "./Modal";
import { logoutUser } from "../redux/cart/userSlice";
import MainLog from "../assets/IconsUsed/HomeMainLogo.png";
import axiosInstance from "../api/axiosInstance";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useRef } from "react";
import { clearCart, setCartFromAPI } from "../redux/cart/cartSlice";

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [showChoice, setShowChoice] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [subDropdown, setSubDropdown] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const query = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (user?.user?.role === "admin") {
      setShowChoice(true);
    } else {
      setShowChoice(false);
    }
  }, [user]);

  const shopCategories = Array.isArray(categories)
    ? categories.filter((cat) => cat.isActive)
    : [];

  // category data for mobile dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get("/category/all-categories", {
          params: {
            page: 1,
            limit: 20,
          },
        });

        let fetchedCategories = [];

        if (response.data?.success && Array.isArray(response.data?.data)) {
          fetchedCategories = response.data.data;
        } else if (Array.isArray(response.data)) {
          fetchedCategories = response.data;
        }

        setCategories(fetchedCategories);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.response?.data?.message || "Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // console.log(categories)

  const searchRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);


  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    dispatch(clearWishlist());
    navigate("/login", { replace: true });
  };

  const totalItems = useSelector((state) => {
    if (state.user.isAuthenticated) {
      return state.cart.totalItems;
    } else {
      const guestCart = JSON.parse(localStorage.getItem("cart") || "[]");                               
      return guestCart.reduce((sum, i) => sum + (i.quantity || 0), 0);
    }
  });

  const totalWishlistItems = useSelector((state) => {
    if (state.user.isAuthenticated) {
      return state.wishlist.totalItems;
    } else {
      const guestWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]",
      );
      return guestWishlist.length;
    }
  });

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
      if (query?.trim()) {
        setDebouncedSearch(query);
        fetchSearchResults(query);
      } else {
        setDebouncedSearch("");
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const filteredResults = searchResults.slice(0, 5);

  // console.log(filteredResults);

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
      name: "Buy more, Save more- Unlock exclusive discounts",
    },
  ];

  // fetch products for search
  const fetchSearchResults = async (value) => {
    try {
      if (!value || !value.trim()) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      const res = await axiosInstance.get(`/product?search=${value}`);
      // console.log("API DATA:", res.data);
      setSearchResults(res.data.products || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="w-full">
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#F0EEFF] text-[#1C1C1C] text-center text-sm py-2">
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
      <div className="w-full h-16 bg-white shadow-sm border-b border-gray-200 sticky top-0 left-0">
        <div className="h-full flex justify-between items-center px-4 md:px-16 lg:px-20">
          {/* Left Section */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Mobile menu button */}
            <div
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#F0EEFF] transition-colors cursor-pointer"
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
            <Link to="/home" className="lg:flex items-center">
              <img className="h-auto w-auto" src={MainLog} alt="logo" />
            </Link>
            <Link to="/accounts/addresses">
              <button className="hidden lg:flex items-center gap-1">
                <MapPin size={16} />
                <span className="text-sm lg:text-xs md:text-sm text-[#4C5562]">
                  Add Delivery Location
                </span>
              </button>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
              {/* Desktop Search Input */}
              <div className="hidden lg:flex items-center bg-gray-50 overflow-hidden w-64 lg:w-80 xl:w-96 border-[1.5px] border-[#686868] rounded-md">
                <Search size={18} className="mx-2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={query}
                  onChange={(e) => {
                    setSearchParams({ q: e.target.value });
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  className="flex-1 py-2 px-2 outline-none text-sm bg-transparent placeholder:text-[#686868]"
                />
              </div>

              {/* Desktop Dropdown */}
              <div className="hidden lg:block">
                {isOpen && (
                  <div className="absolute top-full left-0 w-64 lg:w-80 xl:w-96 bg-white border border-gray-200 shadow-md mt-2.5 z-50">
                    {query.trim() === "" ? (
                      // 👉 EMPTY INPUT
                      <p className="p-3 text-sm text-gray-400 italic">
                        Type to search...
                      </p>
                    ) : loading ? (
                      // 👉 LOADING
                      <p className="p-3 text-sm text-gray-500">Loading...</p>
                    ) : filteredResults.length > 0 ? (
                      // 👉 RESULTS
                      <ul className="divide-y divide-gray-100">
                        {filteredResults.map((item, index) => (
                          <li
                            key={item._id || index}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(false);
                              setSearchParams({}, { replace: true });
                              navigate(`/product/${item._id}`);
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                              className="w-14 h-14 object-cover rounded border"
                            />
                            <div>
                              <p className="text-sm font-medium">
                                {item.productTittle}
                              </p>
                              <p className="text-xs text-[#1C3753]">
                                in {item.categoryName || "Uncategorized"}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      // 👉 NO RESULTS
                      <p className="p-3 text-sm text-gray-500">
                        No results found.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Search Icon */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-[#F0EEFF] transition-colors"
                onClick={() => setIsOpen(true)}
              >
                <Search size={20} className="text-gray-600" />
              </button>

              {/* Mobile full-screen modal */}
              {isOpen && (
                <div className="fixed inset-0 bg-white z-50 p-4 lg:hidden flex flex-col overflow-hidden">
                  {/* Header */}
                  <div
                    ref={searchRef}
                    className="flex items-center justify-between border-b pb-2 mb-4"
                  >
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
                    {query.trim() === "" ? (
                      // 👉 EMPTY INPUT
                      <p className="text-gray-400 text-sm italic">
                        Type to search...
                      </p>
                    ) : loading ? (
                      // 👉 LOADING STATE
                      <p className="text-gray-500 text-sm">Loading...</p>
                    ) : filteredResults.length > 0 ? (
                      // 👉 RESULTS FOUND
                      <ul className="divide-y divide-gray-100">
                        {filteredResults.map((item, index) => (
                          <li
                            key={item._id || index}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(false);
                              setSearchParams({}, { replace: true });

                              navigate(`/product/${item._id}`);
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.productTittle}
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded border"
                            />

                            <div>
                              <p className="text-sm font-medium">
                                {item.productTittle}
                              </p>

                              <p className="text-xs text-amber-600">
                                in {item.categoryName || "Uncategorized"}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      // 👉 NO RESULTS
                      <p className="text-gray-500 text-sm">No results found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* admin side  */}
            {showChoice && (
              <button
                onClick={() => navigate("/admin")}
                className="p-2 rounded-lg group hover:bg-[#F0EEFF] transition-colors"
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
                className="p-2 rounded-lg hover:bg-[#F0EEFF] transition-colors"
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

              <div className="absolute -right-[340%] hidden lg:group-hover:block max-lg:hidden top-8 z-50 border border-transparent">
                <div className="border border-gray-200 mt-4">
                  <UserProfile isAuthenticated={isAuthenticated} />

                  <div className="pt-2 border-t border-gray-200 bg-white">
                    {isAuthenticated ? (
                      <>
                        {/* Logout Button */}
                        <div
                          className="flex items-center gap-4 px-7 pb-5 rounded-lg cursor-pointer transition-colors duration-200 group"
                          onClick={() => setShowLogoutModal(true)}
                        >
                          <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#F0EEFF] transition-colors duration-200">
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
                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#F0EEFF] transition-colors duration-200">
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
              className="relative p-2 rounded-lg group hover:bg-[#F0EEFF] transition-colors"
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
              className="relative p-2 group rounded-lg hover:bg-[#F0EEFF] transition-colors"
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
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 left-0 bottom-0 bg-white shadow-lg z-50 flex flex-col overflow-y-auto
                   w-3/4 md:w-1/2 lg:hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    {user?.user?.profileImage?.url ? (
                      <img
                        src={user.user.profileImage.url}
                        alt="Profile"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <UserRound size={20} className="text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user?.user?.name || "please login"}
                      {/* {console.log(user)} */}
                    </p>

                    <p className="text-sm text-gray-500">Welcome back!</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="px-6 py-4 flex-1">
                <Link
                  to="/home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-gray-800 font-medium hover:text-[#1C3753] transition-colors"
                >
                  Home
                </Link>

                <div className="my-2 border-t border-gray-200"></div>
                <Link
                  to="/accounts/addresses"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-gray-800 font-medium hover:text-[#1C3753] transition-colors"
                >
                  <MapPin size={18} />
                  Add Delivery Location
                </Link>

                <div className="my-2 border-t border-gray-200"></div>

                {/* Categories */}
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                  Shop Categories
                </h3>

                {shopCategories.map((item, index) => (
                  <div key={item._id || item.name || index} className="py-2">
                    {console.log(item)}
                    <div
                      className="flex items-center justify-between py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-[#D5E5F5] hover:text-[#1C3753] cursor-pointer"
                      onClick={() => {
                        if (item.name?.length > 0) {
                          setSubDropdown(subDropdown === index ? null : index);
                        } else {
                          navigate(
                            `/products/${encodeURIComponent(item.name)}`,
                          );
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      <span>{item.name}</span>

                      {/* {item.name?.length > 0 && (
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-300 ${
                            subDropdown === index ? "rotate-180" : ""
                          }`}
                        />
                      )} */}
                    </div>

                    {item.subcategories?.length > 0 && (
                      <div
                        className={`pl-6 flex flex-col gap-1 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                          subDropdown === index ? "max-h-96" : "max-h-0"
                        }`}
                      >
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

                        {item.subcategories
                          .filter(
                            (s) => s?.name && s.name.toLowerCase() !== "all",
                          )
                          .map((sub, i) => (
                            <div
                              key={sub._id || sub.name || i}
                              className="py-2 px-3 text-sm text-gray-600 rounded-md hover:bg-[#D5E5F5] hover:text-[#1C3753] cursor-pointer"
                              onClick={() => {
                                navigate(
                                  `/products/${encodeURIComponent(item.name)}/${encodeURIComponent(sub.name)}`,
                                );
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              {sub.name}
                            </div>
                          ))}
                      </div>
                    )}
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
          fixed top-0 bottom-0 left-0 bg-white shadow-lg z-50 flex flex-col overflow-y-auto
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
