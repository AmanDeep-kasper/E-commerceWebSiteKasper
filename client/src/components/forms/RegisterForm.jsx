// src/components/forms/RegisterForm.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import userService from "../../services/userService";

function RegisterForm({ onOtpSent }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!termsAccepted) {
      setError("Please accept the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("phoneNumber", formData.phoneNumber);

      const res = await userService.register(payload);
      // console.log("regsiter",res.tempUserId);
      localStorage.setItem("tempUserId", res.tempUserId);
      
      onOtpSent(formData.email);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }

    if (formData.phoneNumber.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      setLoading(false);
      return;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    // Remove all non-numeric characters
    value = value.replace(/\D/g, "");

    // Limit to 10 digits
    if (value.length <= 10) {
      setFormData({
        ...formData,
        phoneNumber: value,
      });
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Form Card */}
      <div className="bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              {/* <User className="w-4 h-4" /> */}
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
              {/* <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              {/* <Mail className="w-4 h-4" /> */}
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
              {/* <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
            </div>
          </div>
          {/* phoen Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              {/* <Mail className="w-4 h-4" /> */}
              Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter 10 digit number"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              {/* <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              {/* <Lock className="w-4 h-4" /> */}
              Password
            </label>
            <div className="relative ">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
              {/* <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
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

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3  rounded-lg">
            <div className="flex items-start gap-2 mt-0.5">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                required
              />
            </div>
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 leading-relaxed"
            >
              By continuing, I agree to the website's{" "}
              <Link
                to="/termsconditions"
                className="text-[#F8A14A] hover:text-amber-700 underline font-medium"
              >
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link
                to="/policy"
                className="text-[#F8A14A] hover:text-amber-700 underline font-medium"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full bg-[#1C3753] text-white hover:bg-[#1C3753] hover:text-white disabled:bg-[#DEDEDE] disabled:text-[#686868] py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 pt-3 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#F8A14A] hover:text-amber-700 font-semibold underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
