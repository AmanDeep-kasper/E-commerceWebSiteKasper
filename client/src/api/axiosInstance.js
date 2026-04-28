// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL,
//   withCredentials: true,
// });

// // ================== REFRESH CONTROL ==================
// let isRefreshing = false;
// let failedQueue = [];

// // Process queued requests
// const processQueue = (error) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve();
//   });
//   failedQueue = [];
// };

// // ================== STORE (NO CIRCULAR DEP) ==================
// let storeRef = null;
// const getStore = async () => {
//   if (!storeRef) {
//     const { store } = await import("../redux/store.js");
//     storeRef = store;
//   }
//   return storeRef;
// };

// // ================== RESPONSE INTERCEPTOR ==================
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     const isAuthRoute =
//       originalRequest.url.includes("/auth/login") ||
//       originalRequest.url.includes("/auth/register") ||
//       originalRequest.url.includes("/auth/refresh-token") ||
//       originalRequest.url.includes("/auth/me"); // ✅ IMPORTANT

//     // ================== HANDLE 401 ==================
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !isAuthRoute
//     ) {
//       originalRequest._retry = true;

//       // ================== QUEUE ==================
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(() => axiosInstance(originalRequest));
//       }

//       isRefreshing = true;

//       try {
//         // 🔁 Refresh token
//         await axiosInstance.post("/auth/refresh-token");

//         // ✅ Process queued requests
//         processQueue(null);

//         // 🔁 Retry original request
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError);

//         // ================== FORCE LOGOUT ==================
//         try {
//           const store = await getStore();
//           const { forceLogout } = await import("../redux/cart/userSlice.js");
//           store.dispatch(forceLogout());
//         } catch (err) {
//           console.error("Logout error:", err);
//         }

//         // ================== SAFE REDIRECT ==================
//         if (
//           typeof window !== "undefined" &&
//           !window.location.pathname.includes("/login")
//         ) {
//           window.location.href = "/login";
//         }

//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// ================== REFRESH CONTROL ==================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

// ================== STORE (NO CIRCULAR DEP) ==================
let storeRef = null;
const getStore = async () => {
  if (!storeRef) {
    const { store } = await import("../redux/store.js");
    storeRef = store;
  }
  return storeRef;
};

// ================== FORCE LOGOUT HELPER ==================
const handleForceLogout = async () => {
  try {
    const store = await getStore();
    const { forceLogout } = await import("../redux/cart/userSlice.js");
    store.dispatch(forceLogout());
  } catch (err) {
    console.error("Logout dispatch error:", err);
  }

  if (
    typeof window !== "undefined" &&
    !window.location.pathname.includes("/login")
  ) {
    window.location.href = "/login";
  }
};

// ================== RESPONSE INTERCEPTOR ==================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar config hi nahi hai toh kuch nahi kar sakte
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // ✅ FIX 1: /auth/me hata diya — sirf login/register/refresh skip karo
    const isAuthRoute =
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/refresh-token") ||
      originalRequest.url.includes("/auth/me");

    // ================== HANDLE 401 ==================
    if (
      error.response?.status === 401 &&
      !originalRequest._retry && // ✅ FIX 2: infinite loop guard
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      // ================== QUEUE: agar refresh chal raha hai ==================
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest)) // ✅ FIX 3: resolve hone par retry
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh-token");

        // Refresh successful — queued requests ko retry karo
        processQueue(null);

        // Original request retry
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh bhi fail hua — sab ko reject karo aur logout
        processQueue(refreshError);
        await handleForceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 401 on refresh-token itself = logout
    if (
      error.response?.status === 401 &&
      originalRequest.url.includes("/auth/refresh-token")
    ) {
      await handleForceLogout();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
