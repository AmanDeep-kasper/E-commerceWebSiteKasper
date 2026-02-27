import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { Mail, ArrowLeft, Star, Shield, Send } from "lucide-react";
import userService from "../../services/userService";
import MainLog from "../../assets/IconsUsed/MainLogo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await userService.forgotPassword(email); // ✅ use service
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
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#1C3753] to-[#1C3753] p-8 text-white">
          <div className="flex flex-col justify-between h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              {/* <div className="bg-white p-2 rounded-full">
                <Star className="w-6 h-6 text-amber-600" fill="currentColor" />
              </div>
              <h1 className="text-2xl font-bold">LaserCut</h1> */}
              <img src={MainLog} alt="lazercut" />
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">Reset Your Password</h2>
                <p className="text-white text-lg">
                  No worries! We'll help you get back into your account.
                </p>
              </div>

              {/* Process Steps */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#DEDEDE] rounded-full flex items-center justify-center">
                    <span className="font-bold text-[#686868]">1</span>
                  </div>
                  <span className="text-white">
                    Enter your registered email
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#DEDEDE] rounded-full flex items-center justify-center">
                    <span className="font-bold text-[#686868]">2</span>
                  </div>
                  <span className="text-white">
                    Check your email for reset link
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#DEDEDE]  rounded-full flex items-center justify-center">
                    <span className="font-bold text-[#686868]">3</span>
                  </div>
                  <span className="text-white">Create a new password</span>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-black bg-opacity-20 rounded-lg p-4 mt-8">
                <p className="text-white text-sm">
                  🔒 Your security is our priority. Reset links expire after 1
                  hour for your protection.
                </p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-black bg-opacity-20 rounded-lg p-4 mt-8">
              <p className="text-white text-sm italic">
                "The password reset process was quick and secure. Back to
                creating in minutes!"
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
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
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C3753] focus:border-transparent transition-all"
                    required
                    disabled={loading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Enter the email address associated with your account
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#DEDEDE] text-[#686868] hover:bg-[#1C3753] hover:text-white disabled:bg-gray-400 py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
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
