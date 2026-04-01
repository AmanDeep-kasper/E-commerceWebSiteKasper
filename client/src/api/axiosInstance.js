import axios from "axios";

// const baseURL = "https://e-commerbackend-5.onrender.com/api";
const baseURL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
