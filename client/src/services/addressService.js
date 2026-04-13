// src/services/addressService.js
import axiosInstance from "../api/axiosInstance";

// Create new address
const addAddress = async (data) => {
  const res = await axiosInstance.post("/address/add-address", data);
  return res.data;
};

// Get all user addresses
const getUserAddresses = async () => {
  const res = await axiosInstance.get("/address/all-addresses");
  return res.data;
};

// Update address
const updateAddress = async (id, data) => {
  const res = await axiosInstance.put(
    `/address/update-address/${id}`,
    data,
  );
  return res.data;
};

// Delete address
const deleteAddress = async (id) => {
  const res = await axiosInstance.delete(
    `/address/delete-address/${id}`,
  );
  return res.data; // should return success or deleted id
};

const setDefaultAddress = async (addressId) => {
  console.log(addressId)
  const res = await axiosInstance.patch(
    `/address/set-default-address/${addressId}`,
  );

  return res.data;
};

export default {
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
