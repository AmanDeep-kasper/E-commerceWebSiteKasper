import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Mail, Lock, Star, LogIn, ArrowRight } from "lucide-react";
import { getUserDetails, loginUser, clearError } from "../../redux/cart/userSlice";
import MainLog from "../../assets/IconsUsed/HomeMainLogo.png";
import MainVideo from "../../assets/FirstPageVideo/login.mp4";

function Login() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { authLoading, error, isAuthenticated, user } = useSelector(
    (state) => state.user,
  );
  const navigate = useNavigate();

  // Clear stale errors when Login mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (authLoading) return;

    if (!validate()) return;

    try {
      console.log("form", formData);
      await dispatch(loginUser(formData)).unwrap();

      await dispatch(getUserDetails());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user?.user?.role === "user") {
        navigate("/home", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "identifier") {
      // If starts with number → treat as phone
      if (/^\d/.test(value)) {
        newValue = value.replace(/\D/g, "");

        if (newValue.length > 10) return; // 🚫
      }
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const validate = () => {
    let newErrors = {};

    const { identifier, password } = formData;

    const cleanPhone = identifier.replace(/\D/g, "");

    const isEmail = emailRegex.test(identifier);
    const isPhone = /^[6-9]\d{9}$/.test(cleanPhone);

    // 🔴 Identifier validation
    if (!identifier) {
      newErrors.identifier = "Identifier is required";
    } else if (!isEmail && !isPhone) {
      newErrors.identifier = "Enter a valid email or phone number";
    }

    // 🔴 Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full h-screen flex bg-white shadow-2xl overflow-y-auto ">
        {/* Left Side - Welcome Section */}
        <div className="hidden md:flex flex-1 text-white">
          <div className="hidden md:flex flex-1 relative overflow-hidden text-white">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={MainVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* <div className="absolute inset-0 bg-black/50 z-0"></div> */}

            <div className="relative z-10 flex flex-col justify-between h-full p-8">
              <div className="flex items-center gap-3 mb-8">
                <img src={MainLog} alt="lazercut" />
              </div>

              {/*  */}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 p-8 md:p-12 md:flex justify-center items-center">
          <div className="lg:w-lvw max-w-md mx-auto ">
            {/* Mobile Header */}
            <div className="md:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                {/* <div className="bg-[#D5E5F5] p-2 rounded-full">
                  <Star
                    className="w-6 h-6 text-[#45709e]"
                    fill="currentColor"
                  />
                </div> */}
                {/* <h1 className="text-2xl font-bold text-gray-900">LaserCut</h1> */}
               <img src={MainLog} alt="lazercut" />
              </div>
              <p className="text-gray-600">Enter the World of Precision Art</p>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="bg-[#D5E5F5] p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <LogIn className="w-6 h-6 text-[#1C3753]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Log In & Save Big!</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email/Phone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="identifier"
                    placeholder="Enter Phone Number or Email"
                    value={formData.identifier}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    disabled={authLoading}
                  />
                  {errors.identifier && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.identifier}
                    </p>
                  )}
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#F8A14A] hover:text-amber-700 font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    required
                    disabled={authLoading}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {isAuthenticated && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-600 text-sm font-medium">
                    Logged In Successfully!
                  </p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#1800AC]  hover:bg-[#FFFFF] hover:text-white disabled:bg-gray-400 text-[#FFFFFF] py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    {/* <LogIn className="w-4 h-4" /> */}
                    Sign In to Your Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                New to Happy Art Supplies?{" "}
                <Link
                  to="/register"
                  className="text-[#F8A14A] hover:text-amber-700 font-semibold underline transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Security Note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                🔒 Your data is securely encrypted and protected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
