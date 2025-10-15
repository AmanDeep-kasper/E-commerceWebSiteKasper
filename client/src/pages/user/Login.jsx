import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Mail, Lock, Star, LogIn, ArrowRight } from "lucide-react";
import { loginUser } from "../../redux/cart/userSlice";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); 
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full h-screen flex bg-white shadow-2xl overflow-y-auto ">
        {/* Left Side - Welcome Section */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#0b0b0b] to-[#212121] p-8 text-white">
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white p-2 rounded-full">
                <Star className="w-6 h-6 text-amber-600" fill="currentColor" />
              </div>
              <h1 className="text-2xl font-bold">LaserCut</h1>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-amber-100 text-lg">
                  Ready to continue your creative journey?
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-amber-100">
                    Access your personalized dashboard
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-amber-100">
                    Manage your projects and orders
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-amber-100">
                    Get exclusive member discounts
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-20 rounded-lg p-4 mt-8">
              <p className="text-amber-100 text-sm">
                "Precision cutting for perfect creations every time"
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 p-8 md:p-12 md:flex justify-center items-center">
          <div className="lg:w-lvw max-w-md mx-auto ">
            {/* Mobile Header */}
            <div className="md:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-amber-600 p-2 rounded-full">
                  <Star className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">LaserCut</h1>
              </div>
              <p className="text-gray-600">Enter the World of Precision Art</p>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="bg-amber-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <LogIn className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Log In & Save Big!</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
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
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
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
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
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
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
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
                New to LaserCut?{" "}
                <Link
                  to="/register"
                  className="text-amber-600 hover:text-amber-700 font-semibold underline transition-colors"
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
