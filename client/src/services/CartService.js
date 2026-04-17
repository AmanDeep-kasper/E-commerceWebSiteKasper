import axiosInstance from "../api/axiosInstance";

export const getCart = async () => {
  try {
    const res = await axiosInstance.get("/cart");
    console.log(res)
    return res.data.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};