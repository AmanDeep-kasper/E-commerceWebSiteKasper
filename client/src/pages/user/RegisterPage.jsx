// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import RegisterForm from "../../components/forms/RegisterForm";
import OtpVerifyForm from "../../components/forms/OtpVerifyForm";
import { Link } from "react-router";
import {
  CheckCircle,
  ArrowLeft,
  Star,
  Shield,
  Mail,
  LogIn,
} from "lucide-react";

function RegisterPage() {
  const [step, setStep] = useState("register");
  const [email, setEmail] = useState("");

  const handleBackToRegister = () => {
    setStep("register");
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full h-screen flex bg-white shadow-2xl overflow-y-auto">
        {/* Left Side - Welcome Section */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#0b0b0b] to-[#212121] p-8 text-white">
          <div className="flex flex-col justify-between h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white p-2 rounded-full">
                <Star className="w-6 h-6 text-amber-600" fill="currentColor" />
              </div>
              <h1 className="text-2xl font-bold">LaserCut</h1>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  Join Our Creative Community
                </h2>
                <p className="text-amber-100 text-lg">
                  Start your journey with precision cutting tools and exclusive
                  benefits
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-amber-100">
                    Exclusive member discounts
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-amber-100">
                    Priority customer support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-amber-100">
                    Early access to new products
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-amber-100">
                    Project management tools
                  </span>
                </div>
              </div>

              {/* Progress Steps - Sidebar Version */}
              <div className="bg-white bg-opacity-10 rounded-lg p-6 mt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        step === "register"
                          ? "bg-amber-400 border-amber-400 text-white"
                          : step === "otp" || step === "done"
                          ? "bg-green-400 border-green-400 text-white"
                          : "bg-white bg-opacity-20 border-white border-opacity-30 text-white"
                      }`}
                    >
                      {step === "register" ? (
                        "1"
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-medium">Create Account</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        step === "otp"
                          ? "bg-amber-400 border-amber-400 text-white"
                          : step === "done"
                          ? "bg-green-400 border-green-400 text-white"
                          : "bg-white bg-opacity-20 border-white border-opacity-30 text-white"
                      }`}
                    >
                      {step === "done" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "2"
                      )}
                    </div>
                    <span className="font-medium">Verify Email</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        step === "done"
                          ? "bg-green-400 border-green-400 text-white"
                          : "bg-white bg-opacity-20 border-white border-opacity-30 text-white"
                      }`}
                    >
                      {step === "done" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "3"
                      )}
                    </div>
                    <span className="font-medium">Complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-black bg-opacity-20 rounded-lg p-4 mt-8">
              <p className="text-amber-100 text-sm italic">
                "LaserCut transformed my creative projects with their precision
                tools and amazing community support!"
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
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
              <p className="text-gray-600">
                Join thousands of creative professionals
              </p>
            </div>

            {/* Progress Steps - Mobile */}
            <div className="md:hidden flex items-center justify-between mb-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 -z-10"></div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === "register"
                      ? "bg-[#DDAC0E] border-[#DDAC0E] text-white"
                      : step === "otp" || step === "done"
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {step === "register" ? (
                    "1"
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </div>
                <span className="text-xs mt-2 text-gray-600">Register</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === "otp"
                      ? "bg-[#DDAC0E] border-[#DDAC0E] text-white"
                      : step === "done"
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {step === "done" ? <CheckCircle className="w-4 h-4" /> : "2"}
                </div>
                <span className="text-xs mt-2 text-gray-600">Verify</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === "done"
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {step === "done" ? <CheckCircle className="w-4 h-4" /> : "3"}
                </div>
                <span className="text-xs mt-2 text-gray-600">Complete</span>
              </div>
            </div>

            {/* Header Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    First Time Here?
                  </h1>
                  <div className="bg-black text-white px-4 py-2 rounded-lg text-lg font-semibold inline-block">
                    Sign Up & Save Big!
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full">
                  <Star
                    className="w-8 h-8 text-amber-600"
                    fill="currentColor"
                  />
                </div>
              </div>
            </div>

            {/* Content Sections */}
            {step === "register" && (
              <div>
                <div className="text-center mb-6">
                  <div className="bg-blue-50 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create Account
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Sign up to get started with LaserCut
                  </p>
                </div>
                <RegisterForm
                  onOtpSent={(email) => {
                    setEmail(email);
                    setStep("otp");
                  }}
                />
              </div>
            )}

            {step === "otp" && (
              <div>
                <button
                  onClick={handleBackToRegister}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Back to registration
                  </span>
                </button>

                <div className="text-center mb-6">
                  <div className="bg-green-50 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Verify Your Email
                  </h2>
                  <p className="text-gray-600 mt-2">
                    We sent a verification code to
                  </p>
                  <p className="text-gray-900 font-semibold mt-1">{email}</p>
                </div>
                <OtpVerifyForm
                  email={email}
                  onSuccess={() => {
                    setStep("done");
                  }}
                  onBack={handleBackToRegister}
                />
              </div>
            )}

            {step === "done" && (
              <div className="text-center">
                <div className="bg-green-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Registration Successful! 🎉
                </h2>
                <p className="text-gray-600 mb-6">
                  Your email has been verified successfully
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 text-sm">
                    You can now login to your account and start using LaserCut's
                    premium features.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg transition-colors font-semibold mb-4"
                >
                  Go to Login
                </Link>

                <div className="text-sm text-gray-500">
                  Ready to start creating?{" "}
                  <span className="font-medium">
                    Login to access your dashboard!
                  </span>
                </div>
              </div>
            )}

            {/* <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-amber-600 hover:text-amber-700 font-semibold underline transition-colors"
                >
                  Log In
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
