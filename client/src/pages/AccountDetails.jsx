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
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserDetails } from "../redux/cart/userSlice";

function AccountDetails() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(null);

  useEffect(() => {
    if (user) {
      setTempData({
        name: user.name || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        alternateMobile: user.alternateMobile || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!tempData) return;
    dispatch(updateUserDetails(tempData)).then((res) => {
      if (!res.error) {
        setIsEditing(false);
      }
    });
  };

  const handleCancel = () => {
    // reset changes by re-syncing with Redux user
    setTempData({
      name: user?.name || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth || "",
      gender: user?.gender || "",
      alternateMobile: user?.alternateMobile || "",
      profileImage: user?.profileImage || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full font-inter">
      <div className="bg-white md:rounded-md shadow-sm md:border border-gray-200 overflow-hidden">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-3">
          {/* ===== Left: Form ===== */}
          <div className="lg:col-span-2 max-sm:pb-4">
            {/* Header */}
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
                        onClick={handleCancel}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-yellow-600 text-white rounded-lg shadow-sm hover:bg-yellow-700 transition flex items-center"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Email */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-500 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 text-gray-800 font-medium text-sm sm:text-base">
                      {user?.email || "Not provided"}
                      {user?.email && (
                        <BadgeCheck className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name */}
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
                  />
                ) : (
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-sm sm:text-base">
                      {user?.name || "Not provided"}
                    </p>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={tempData?.dateOfBirth || ""}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                  />
                ) : (
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-sm sm:text-base">
                      {user?.dateOfBirth || "Not provided"}
                    </p>
                  </div>
                )}
              </div>

              {/* Gender */}
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
                        className={`flex-1 py-2 sm:py-3 text-sm flex items-center justify-center gap-2 transition-colors ${
                          tempData?.gender === g
                            ? "bg-yellow-50 text-black font-medium"
                            : "hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        {tempData?.gender === g && (
                          <Check className="w-4 h-4 text-yellow-600" />
                        )}
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 capitalize text-sm sm:text-base">
                      {user?.gender || "Not provided"}
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempData?.alternateMobile || ""}
                    onChange={(e) =>
                      handleInputChange("alternateMobile", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                    placeholder="Enter 10-digit mobile number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                  />
                ) : (
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-sm sm:text-base">
                      {user?.alternateMobile || "Not provided"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== Right: Profile Summary ===== */}
          <div className="p-6 sm:p-8 flex flex-col items-center bg-gradient-to-b from-yellow-50 to-white space-y-5 sm:space-y-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-yellow-100 rounded-full shadow-inner">
              {user?.profileImage ? (
                <img
                  className="rounded-full object-cover w-full h-full"
                  src={`http://localhost:5000/uploads/${user.profileImage}`}
                  alt="Profile"
                />
              ) : (
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-600" />
              )}
            </div>
            <div className="text-center">
              <p className="text-gray-800 font-semibold text-base sm:text-lg">
                {user?.name || "Not provided"}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center justify-center">
                {user?.email || "Not provided"}
                {user?.email && (
                  <BadgeCheck className="w-4 h-4 text-green-600 ml-1" />
                )}
              </p>
            </div>

            <div className="w-full bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      DOB
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {user?.dateOfBirth || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Phone
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      +91 {user?.alternateMobile || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <User className="w-4 sm:w-5 h-4 sm:h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Gender
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {user?.gender || "Not provided"}
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
