import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, CheckCircle, Star, ArrowLeft } from "lucide-react";
import userService from "../../services/userService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // ✅ call service layer
      const res = await userService.resetPassword({
        token,
        newPassword: formData.password,
      });

      toast.success(res?.message || "Password reset successfully");

      setFormData({ password: "", confirmPassword: "" });

      // redirect after short delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Token expired or invalid.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ password strength logic unchanged
  const passwordStrength = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full h-screen flex bg-white rounded-2xl">
        {/* Left Side - Welcome Section */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white">
          <div className="flex flex-col justify-between h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white p-2 rounded-full">
                <Star className="w-6 h-6 text-green-600" fill="currentColor" />
              </div>
              <h1 className="text-2xl font-bold">LaserCut</h1>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">Create New Password</h2>
                <p className="text-green-100 text-lg">
                  Choose a strong password to secure your account.
                </p>
              </div>

              {/* Password Tips */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-green-100">
                    Use at least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-green-100">
                    Mix letters, numbers & symbols
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-green-100">Avoid common passwords</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-green-100">
                    Don't reuse old passwords
                  </span>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-black bg-opacity-20 rounded-lg p-4 mt-8">
                <p className="text-green-100 text-sm">
                  🔒 Your new password will be securely encrypted and protected.
                </p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-black bg-opacity-20 rounded-lg p-4 mt-8">
              <p className="text-green-100 text-sm italic">
                "The password reset was seamless. Back to creating amazing
                projects!"
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="flex-1 p-8 md:p-12 md:flex justify-center items-center">
          <div className="lg:w-lvw max-w-md mx-auto ">
            {/* Mobile Header */}
            <div className="md:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-green-600 p-2 rounded-full">
                  <Star className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">LaserCut</h1>
              </div>
              <p className="text-gray-600">Create your new password</p>
            </div>

            {/* Back to Login */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Login</span>
            </Link>

            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="bg-green-50 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">New Password</h2>
              <p className="text-gray-600 mt-2">
                Create a strong, secure password
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1 h-1">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className={`flex-1 rounded-full transition-all ${
                            index < strengthScore
                              ? strengthColors[strengthScore - 1]
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  loading || formData.password !== formData.confirmPassword
                }
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Reset Password
                  </>
                )}
              </button>

              {/* Success Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm text-center">
                  ✅ You'll be redirected to login after successful password
                  reset
                </p>
              </div>
            </form>

            {/* Security Note */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                🔒 Your new password is securely encrypted and protected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
