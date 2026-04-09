import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Mail, Lock, Star, LogIn, ArrowRight } from "lucide-react";
import { getUserDetails, loginUser } from "../../redux/cart/userSlice";
import MainLog from "../../assets/IconsUsed/HomeMainLogo.png";
import MainVideo from "../../assets/FirstPageVideo/login.mp4";

function Login() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { authLoading, error, isAuthenticated } = useSelector(
    (state) => state.user,
  );
  const navigate = useNavigate();
  let res;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (authLoading) return;

    try {
      await dispatch(loginUser(formData)).unwrap();
      res = await dispatch(getUserDetails()); // 🔥 VERY IMPORTANT
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (res?.user?.role === "user") navigate("/home", { replace: true });
      else navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

              {/* <div className="space-y-6">
                        <div>
                          <h2 className="text-4xl font-medium mb-4">Welcome Back!</h2>
                          <p className="text-white text-lg">Ready to continue?</p>
                        </div>
        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <span>Designed for a seamless shopping experience</span>
                          </div>
        
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <span>Fast checkout. Smooth experience</span>
                          </div>
        
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <span>Everything you need, right here</span>
                          </div>
                        </div>
                      </div> */}

              {/* <div className="mt-8">
                        <p className="text-white text-sm">
                          *Precision cutting for perfect creations every time*
                        </p>
                      </div> */}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 p-8 md:p-12 md:flex justify-center items-center">
          <div className="lg:w-lvw max-w-md mx-auto ">
            {/* Mobile Header */}
            <div className="md:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-[#D5E5F5] p-2 rounded-full">
                  <Star
                    className="w-6 h-6 text-[#45709e]"
                    fill="currentColor"
                  />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">LaserCut</h1>
                {/* <img src={MainLog} alt="lazercut" /> */}
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
                    type="email"
                    name="identifier"
                    placeholder="your@email.com"
                    value={formData.identifier}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    required
                    disabled={authLoading}
                  />
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
