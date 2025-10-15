// /pages/VerifyEmail.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [otp, setOTP] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    toast.error("Email not found. Please register again.");
    navigate("/register");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/verify-email", { email, otp });
      toast.success("Email verified successfully!");
      // Save token if needed
      localStorage.setItem("token", res.data.token);
      navigate("/login"); // or dashboard
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] bg-white shadow-md rounded-lg p-6 flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-center">Verify Email</h2>
        <p className="text-sm text-center text-gray-600">
          Enter the OTP sent to <strong>{email}</strong>
        </p>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          required
          className="py-2 px-3 border rounded"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
