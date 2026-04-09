import axios from "axios";

// const baseURL = "https://e-commerbackend-5.onrender.com/api";
// moid api 
const baseURL = "http://localhost:5000/api/v1";
// aman 
// const baseURL = "http://localhost:5000/api/";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// ============================================
// Auto Token Refresh Logic
// ============================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(f => {
    if (error) {
      f.reject(error);
    } else {
      f.resolve();
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

// Response Interceptor with Auto-Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and request can be retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the access token
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (refreshResponse.status === 200) {
          console.log("✅ Token auto-refreshed successfully");
          processQueue();
          // Retry original request with new token
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError.message);
        processQueue(refreshError);
        
        // Redirect to login if refresh fails
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For 401 without retry (already retried or other 401 scenarios)
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
