
import axiosInstance from "../api/axiosInstance";

// Auth APIs
const register = async (formData) => {
  const res = await axiosInstance.post("/auth/register", formData);
  return res.data;
};

const verifyEmail = async (data) => {
  const res = await axiosInstance.post("/auth/verify-email", data);
  return res.data;
};

const login = async (credentials) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res.data;
};

const forgotPassword = async (email) => {
  const res = await axiosInstance.post("/auth/forgot-password", { email });
  return res.data;
};

const resetPassword = async ({ token, newPassword }) => {
  const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
    password: newPassword,
  });

  return res.data;
};

// User axiosInstances
const getUser = async () => {
  const res = await axiosInstance.get("/users/me");
  console.log(res.data);
  return res.data;
};

const updateUser = async (data) => {
  const res = await axiosInstance.put("/users/me", data);
  return res.data;
};

const updateProfileImage = async (formData) => {
  const res = await axiosInstance.patch("/users/me/profile-image", formData);
  return res.data;
};

const updateEmail = async (data) => {
  const res = await axiosInstance.patch("/users/me/update-email", data);
  return res.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getUser,
  updateUser,
  updateProfileImage,
  updateEmail,
  logout,
};
