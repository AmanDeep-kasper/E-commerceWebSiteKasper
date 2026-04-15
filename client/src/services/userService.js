import axiosInstance from "../api/axiosInstance";

// Auth APIs
const register = async (formData) => {
  const res = await axiosInstance.post("/auth/register", formData);
  return res.data;
};

const verifyEmail = async (data) => {
  const res = await axiosInstance.post("/auth/verify", data);
  return res.data;
};

const login = async (credentials) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data;
};

const forgotPassword = async (email) => {
  const res = await axiosInstance.post("/auth/forgot-password", { email });
  return res.data;
};

const resetPassword = async ({
  token,
  email,
  newPassword,
  confirmPassword,
}) => {
  const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
    newPassword,
    confirmPassword,
    email,
    token,
  });

  return res.data;
};

// User axiosInstances
const getUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

const updateUser = async (data) => {
  const res = await axiosInstance.patch("/user/update-detail", data);
  return res.data;
};

const updateProfileImage = async (formData) => {
  const res = await axiosInstance.patch("/user/update-profile-image", formData);
  return res.data;
};

const updateEmail = async (data) => {
  const res = await axiosInstance.patch("/user/update-email", data);
  return res.data;
};

const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
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
