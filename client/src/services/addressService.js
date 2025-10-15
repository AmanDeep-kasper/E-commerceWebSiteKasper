// src/services/addressService.js
import axiosInstance from "../api/axiosInstance";

// Create new address
const addAddress = async (data) => {
  const res = await axiosInstance.post("/addresses", data);
  return res.data;
};

// Get all user addresses
const getUserAddresses = async () => {
  const res = await axiosInstance.get("/addresses");
  return res.data;
};

// Update address
const updateAddress = async (id, data) => {
  const res = await axiosInstance.put(`/addresses/${id}`, data);
  return res.data;
};

// Delete address
const deleteAddress = async (id) => {
  const res = await axiosInstance.delete(`/addresses/${id}`);
  return res.data; // should return success or deleted id
};

export default {
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
};
