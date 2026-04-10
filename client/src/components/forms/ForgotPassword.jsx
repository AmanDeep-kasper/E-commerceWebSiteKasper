import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, ArrowLeft, Star, Shield, Send } from "lucide-react";
import userService from "../../services/userService";
import MainLog from "../../assets/IconsUsed/HomeMainLogo.png";
import SideImg from "../../assets/FirstPageVideo/RestImg.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // 🔥 ADD THIS

    setLoading(true);

    try {
      const res = await userService.forgotPassword(email);
      toast.success(res?.message || "Reset link sent to your email");
      setEmail("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1C3753] to-[#1C3753]">
      <div className="w-full h-screen flex bg-white">
        {/* Left Side - Welcome Section */}
        <div className="hidden md:flex flex-1 relative overflow-hidden text-white">
          {/* Background Image */}
          <img
            src={SideImg} // 🔁 change your image path
            alt="background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay (important for readability) */}
          {/* <div className="absolute inset-0 bg-[#1C3753]/70"></div> */}

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-8">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <img src={MainLog} alt="lazercut" />
            </div>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="flex-1 p-8 md:p-12 md:flex justify-center items-center">
          <div className="lg:w-lvw max-w-md mx-auto ">
            {/* Mobile Header */}
            <div className="md:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-[#D5E5F5]  p-2 rounded-full">
                  <Star
                    className="w-6 h-6 text-[#1C3753]"
                    fill="currentColor"
                  />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">LaserCut</h1>
              </div>
              <p className="text-gray-600">Reset your password securely</p>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="bg-blue-50 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Forgot Password?
              </h2>
              <p className="text-gray-600 mt-2">
                Enter your email to receive a reset link
              </p>
            </div>
            {/* Back to Login */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Login</span>
            </Link>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C3753] focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {errors.email && (
                    <p className="text-xs text-red-500 absolute right-50 top-full mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enter the email address associated with your account
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1800AC] text-[#FFFFFF] hover:bg-[#1C3753] hover:text-white disabled:bg-gray-400 py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reset Link
                  </>
                )}
              </button>

              {/* Support Info */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Need help?{" "}
                  <Link
                    to="/contact"
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Contact support
                  </Link>
                </p>
              </div>

              {/* Help Text */}
              <div className="">
                <p className="text-sm text-gray-600 text-center">
                  💡 Check your spam folder if you don't see the email within a
                  few minutes
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
