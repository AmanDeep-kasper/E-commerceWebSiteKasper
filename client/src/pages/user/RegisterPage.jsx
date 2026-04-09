// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import RegisterForm from "../../components/forms/RegisterForm";
import OtpVerifyForm from "../../components/forms/OtpVerifyForm";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  ArrowLeft,
  Star,
  Shield,
  Mail,
  LogIn,
} from "lucide-react";
import MainLog from "../../assets/IconsUsed/HomeMainLogo.png";
import MainVideo from "../../assets/FirstPageVideo/Register.mp4";

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

        {/* Right Side - Registration Form */}
        <div className="flex-1 p-8 md:p-12 md:flex justify-center items-center">
          <div className="lg:w-lvw max-w-md mx-auto ">
            {/* Mobile Header */}
            <div className="md:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                 <img src={MainLog} alt="lazercut" />
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
                      ? "bg-[#D5E5F5] border-[#D5E5F5 ] text-[#1C3753]"
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

            {/* Content Sections */}
            {step === "register" && (
              <div>
                <div className="text-center mb-6">
                  <div className="bg-blue-50 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#1C3753]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create Account
                  </h2>
                  <p className="text-gray-600 mt-2">
                   Sign up to get started with Happy Art Supplies
                  </p>
                </div>
                <div className="flex items-center justify-between mt-8 px-4 mb-4">
                  {/* STEP 1 */}
                  <div className="flex items-center flex-1">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                          step === "register"
                            ? "bg-[#1C3753] border-[#1C3753] text-white"
                            : step === "otp" || step === "done"
                              ? "bg-green-400 border-green-400 text-white"
                              : "bg-[#DEDEDE] text-[#686868]"
                        }`}
                      >
                        {step === "register" ? (
                          "1"
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-xs mt-2">Create Account</span>
                    </div>

                    {/* Line */}
                    <div className="flex-1 h-[1px] bg-gray-300 mb-4"></div>
                  </div>

                  {/* STEP 2 */}
                  <div className="flex items-center flex-1">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                          step === "otp"
                            ? "bg-[#1C3753] border-[#1C3753] text-white"
                            : step === "done"
                              ? "bg-green-400 border-green-400 text-white"
                              : "bg-[#DEDEDE] text-[#686868]"
                        }`}
                      >
                        {step === "done" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          "2"
                        )}
                      </div>
                      <span className="text-xs mt-2 text-[#686868]">
                        Verify Email
                      </span>
                    </div>

                    {/* Line */}
                    <div className="flex-1 h-[1px] bg-gray-300 mb-4"></div>
                  </div>

                  {/* STEP 3 */}
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                        step === "done"
                          ? "bg-green-400 border-green-400 text-white"
                          : "bg-[#DEDEDE] text-[#686868]"
                      }`}
                    >
                      {step === "done" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "3"
                      )}
                    </div>
                    <span className="text-xs mt-2 text-[#686868]">
                      Complete
                    </span>
                  </div>
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
                {/* <button
                  onClick={handleBackToRegister}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Back to registration
                  </span>
                </button> */}

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
                  // email={email}
                  
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
                <h2 className="text-[28px] font-bold text-gray-900 mb-3">
                  Registration Successful
                </h2>
                <p className="text-gray-600 mb-6 text-[13px]">
                  Your email has been verified successfully
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 text-sm">
                    You can now login to your account and start using LAZERCUT.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full bg-[#1C3753] hover:bg-[#27405a] text-white py-3 px-4 rounded-lg transition-colors font-semibold mb-4"
                >
                  Go to Login
                </Link>

                {/* <div className="text-sm text-gray-500">
                  Ready to start creating?{" "}
                  <span className="font-medium">
                    Login to access your dashboard!
                  </span>
                </div> */}
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
