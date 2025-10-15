import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Shield, Clock, RotateCcw, CheckCircle, ArrowLeft } from "lucide-react";
import userService from "../../services/userService";
import { loginUser } from "../../redux/cart/userSlice";

function OtpVerifyForm({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const startResendCountdown = () => {
    setResendCountdown(30); // 30 seconds countdown
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit when last digit is entered
    if (value && index === 5) {
      const fullOtp = newOtp.join("");
      handleSubmit(null, fullOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData
        .split("")
        .concat(Array(6 - pasteData.length).fill(""));
      setOtp(newOtp.slice(0, 6));
      inputRefs.current[Math.min(pasteData.length, 5)].focus();
    }
  };

  const handleSubmit = async (e, prefilledOtp = null) => {
    if (e) e.preventDefault();

    const otpValue = prefilledOtp || otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await userService.verifyEmail({ email, otp: otpValue });

      // Show success animation before proceeding
      setVerificationSuccess(true);
      setTimeout(() => {
        // Auto-login after verification
        dispatch(loginUser({ email, password: res.passwordUsed }));
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      // Clear OTP on error for better UX
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError(null);

    try {
      await userService.resendOtp({ email });
      startResendCountdown();
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (verificationSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="animate-bounce mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verified! 🎉
          </h2>
          <p className="text-gray-600 mb-6">Email verified successfully</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              Redirecting you to your account...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to registration</span>
        </button>
      )}

      {/* OTP Verification Card */}
      <div className="bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Inputs */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700 block">
              Verification Code
            </label>
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center">
              Enter the 6-digit code from your email
            </p>
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
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </div>
            ) : (
              "Verify Email"
            )}
          </button>

          {/* Resend OTP Section */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-3">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading || resendCountdown > 0}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-medium transition-colors"
            >
              {resendLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : resendCountdown > 0 ? (
                <>
                  <Clock className="w-4 h-4" />
                  Resend in {resendCountdown}s
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Resend OTP
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            Check your spam folder if you don't see the email in your inbox.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OtpVerifyForm;
