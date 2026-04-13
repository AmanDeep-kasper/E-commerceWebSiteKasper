import { useState, useEffect } from "react";
import {
  BadgeCheck,
  Check,
  Phone,
  Calendar,
  User,
  Mail,
  Edit2,
  Save,
  Loader2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserDetails } from "../redux/cart/userSlice";
import ChangePassword from "./ChangePassword";

// Skeleton Loader for Account Details
const AccountDetailsSkeleton = () => (
  <div className="w-full font-inter mt-20">
    <div className="bg-white md:rounded-md shadow-sm overflow-hidden">
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-3">
        <div className="lg:col-span-2 max-sm:pb-4">
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="h-7 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-56 bg-gray-200 rounded animate-pulse mt-2"></div>
              </div>
              <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            {/* Email Section Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#FFFFFF] rounded-full">
                  <Mail className="w-5 h-5 text-gray-300" />
                </div>
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mt-1"></div>
                </div>
              </div>
            </div>

            {/* Form Fields Skeleton */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel Skeleton */}
        <div className="p-6 sm:p-8 flex flex-col items-center rounded-md bg-gradient-to-b from-[#D5E5F5] to-[#FFFFFF] space-y-5 sm:space-y-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="text-center w-full">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto mt-2"></div>
          </div>
          <div className="w-full space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 sm:gap-4 p-3 bg-[#FFFFFF] rounded-lg"
              >
                <div className="p-2 bg-[#F5F8FA] rounded-lg">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

function AccountDetails() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setTempData({
        name: user?.user.name || "",
        email: user?.user.email || "",
        dateOfBirth: user?.user.dateOfBirth || "",
        gender: user?.user.gender || "",
        phoneNumber: user?.user.phoneNumber || "",
        profileImage: user?.user.profileImage || "",
        password: "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!tempData) return;
    setIsSaving(true);
    try {
      const res = await dispatch(updateUserDetails(tempData));
      if (!res.error) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({
      name: user?.user.name || "",
      email: user?.user.email || "",
      dateOfBirth: user?.user.dateOfBirth || "",
      gender: user?.user.gender || "",
      phoneNumber: user?.user.phoneNumber || "",
      profileImage: user?.user.profileImage || "",
      password: user?.user.password || "",
    });
    setIsEditing(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.q.value;
    console.log("Search:", query);
  };

  // Show full page loader while initial auth check or loading user data
  if (isAuthenticated === null || loading) {
    return (
      <>
        <AccountDetailsSkeleton />
      </>
    );
  }

  // Show skeleton if user data is not available
  if (!user) {
    return <AccountDetailsSkeleton />;
  }

  return (
    <div className="w-full font-inter">
      {/* Saving Overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 shadow-xl">
            <Loader2 className="w-12 h-12 text-[#1C3753] animate-spin" />
            <p className="text-gray-700 font-medium">Saving changes...</p>
          </div>
        </div>
      )}

      <ChangePassword
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
      />

      <div className="bg-white md:rounded-md shadow-sm overflow-hidden">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-3">
          <div className="lg:col-span-2 max-sm:pb-4">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Account Details
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Manage your personal information
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-[#1C3753] text-[#1C3753] border rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-[#1C3753] text-white rounded-lg shadow-sm hover:bg-[#1C3753]/90 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#1C3753] border border-[#1C3753] rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#F0EEFF] rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#FFFFFF] rounded-full">
                    <Mail className="w-5 h-5 text-[#1C3753]" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-500 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 text-gray-800 font-medium text-sm sm:text-base">
                      {user?.user?.email || "Not provided"}
                      {user?.user?.email && (
                        <BadgeCheck className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                    placeholder="Enter your full name"
                    disabled={isSaving}
                  />
                ) : (
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-sm sm:text-base">
                      {user?.user?.name || "Not provided"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={tempData?.dateOfBirth ? new Date(tempData.dateOfBirth).toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                    disabled={isSaving}
                  />
                ) : (
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-sm sm:text-base">
                      {user?.user?.dateOfBirth
                        ? new Date(user.user.dateOfBirth).toLocaleDateString(
                            "en-GB",
                          )
                        : "Not provided"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                {isEditing ? (
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    {["male", "female"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleInputChange("gender", g)}
                        disabled={isSaving}
                        className={`flex-1 py-2 sm:py-3 text-sm flex items-center justify-center gap-2 transition-colors ${
                          tempData?.gender === g
                            ? "bg-[#CFC7FF] text-black font-medium"
                            : "hover:bg-gray-50 text-gray-600"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {tempData?.gender === g && (
                          <Check className="w-4 h-4 text-[#1C3753]" />
                        )}
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-[#DEDEDE] rounded-lg border border-gray-200">
                    <p className="text-gray-800 capitalize text-sm sm:text-base">
                      {user?.user?.gender || "Not provided"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempData?.phoneNumber || ""}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      if (onlyNums.length <= 10) {
                        handleInputChange("phoneNumber", onlyNums);
                      }
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1C3753] focus:border-[#1C3753] outline-none transition"
                    placeholder="Enter 10-digit mobile number"
                    disabled={isSaving}
                  />
                ) : (
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-sm sm:text-base">
                      {user?.user?.phoneNumber || "Not provided"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-[#006EE1] text-sm mb-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPasswordModal(true);
                    }}
                    disabled={isSaving}
                  >
                    Change Password
                  </button>
                </div>

                {isEditing ? (
                  <input
                    type="password"
                    value={tempData?.password || ""}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1C3753] focus:border-[#1C3753] outline-none transition"
                    placeholder="Enter your password"
                    disabled={isSaving}
                  />
                ) : (
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-sm sm:text-base">
                      ***********
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8  flex flex-col items-center rounded-md bg-gradient-to-b from-[#CFC7FF]/20 to-[#FFC9EA]/80 space-y-5 sm:space-y-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-[#F6F8F9] rounded-full shadow-inner overflow-hidden">
              {user?.user?.profileImage?.url ? (
                <img
                  className="rounded-full object-cover w-full h-full"
                  src={user.user.profileImage.url}
                  alt="Profile"
                />
              ) : (
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-600" />
              )}
            </div>

            <div className="text-center">
              <p className="text-gray-800 font-semibold text-base sm:text-lg">
                {user?.user?.name || "Not provided"}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                {user?.user?.email || "Not provided"}
                {user?.user?.email && (
                  <BadgeCheck className="w-4 h-4 text-green-600" />
                )}
              </p>
            </div>

            <div className="w-full bg-[#F6F8F9] rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3 sm:gap-4 p-3 bg-[#FFFFFF] rounded-lg">
                  <div className="p-2 bg-[#F5F8FA] rounded-lg">
                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-[#1C3753]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      DOB
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {user?.user?.dateOfBirth
                        ? new Date(user.user.dateOfBirth).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 bg-[#FFFFFF] rounded-lg">
                  <div className="p-2 bg-[#F5F8FA] rounded-lg">
                    <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-[#1C3753]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Phone
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {user?.user?.phoneNumber
                        ? `+91 ${user.user.phoneNumber}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 bg-[#FFFFFF] rounded-lg">
                  <div className="p-2 bg-[#F5F8FA] rounded-lg">
                    <User className="w-4 sm:w-5 h-4 sm:h-5 text-[#1C3753]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Gender
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 capitalize">
                      {user?.user?.gender
                        ? user.user.gender.charAt(0).toUpperCase() +
                          user.user.gender.slice(1)
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 mt-2 sm:mt-4 text-center">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;
