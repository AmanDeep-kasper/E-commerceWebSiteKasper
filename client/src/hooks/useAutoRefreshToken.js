// import { useEffect, useRef } from "react";
// import axiosInstance from "../api/axiosInstance";

// /**
//  * Custom hook to automatically refresh access token before it expires
//  * 
//  * Access Token Expiry: 15 minutes
//  * Refresh Time: 14 minutes (1 minute before expiry)
//  * Refresh Token Expiry: 7 days
//  * 
//  * Usage: useAutoRefreshToken() in your App.jsx
//  */
// export const useAutoRefreshToken = () => {
//   const refreshTimerRef = useRef(null);
//   const isRefreshingRef = useRef(false);

//   const scheduleTokenRefresh = () => {
//     // Clear any existing timer
//     if (refreshTimerRef.current) {
//       clearTimeout(refreshTimerRef.current);
//     }

//     // Refresh after 14 minutes (860 seconds)
//     // This way token is refreshed 1 minute before it expires
//     const REFRESH_INTERVAL = 14 * 60 * 1000;

//     refreshTimerRef.current = setTimeout(async () => {
//       if (isRefreshingRef.current) {
//         console.log("⏳ Token refresh already in progress...");
//         return;
//       }

//       isRefreshingRef.current = true;

//       try {
//         const response = await axiosInstance.post("/auth/refresh-token");

//         if (response?.status === 200) {
//           console.log("✅ Token refreshed successfully at", new Date().toLocaleTimeString());
          
//           // Schedule next refresh
//           scheduleTokenRefresh();
//         }
//       } catch (error) {
//         if (error?.response?.status === 401) {
//           console.error("❌ Refresh token expired. Redirecting to login...");
//           window.location.href = "/login";
//         } else {
//           console.error("⚠️ Token refresh error:", error?.message);
//           // Try again in 1 minute if error occurs
//           scheduleTokenRefresh();
//         }
//       } finally {
//         isRefreshingRef.current = false;
//       }
//     }, REFRESH_INTERVAL);

//     console.log(
//       `⏰ Token refresh scheduled for ${REFRESH_INTERVAL / 1000 / 60} minutes from now`
//     );
//   };

//   useEffect(() => {
//     // Start scheduling when component mounts
//     scheduleTokenRefresh();

//     // Cleanup on unmount
//     return () => {
//       if (refreshTimerRef.current) {
//         clearTimeout(refreshTimerRef.current);
//       }
//     };
//   }, []);
// };

// /**
//  * Advanced hook with manual refresh capability
//  */
// export const useTokenRefresh = () => {
//   const refreshTimerRef = useRef(null);
//   const isRefreshingRef = useRef(false);

//   const refreshTokenManually = async () => {
//     if (isRefreshingRef.current) {
//       console.log("⏳ Token refresh already in progress...");
//       return false;
//     }

//     isRefreshingRef.current = true;

//     try {
//       const response = await axiosInstance.post("/auth/refresh-token");
//       console.log("✅ Token refreshed manually");
//       return response?.status === 200;
//     } catch (error) {
//       console.error("❌ Manual token refresh failed:", error?.message);
//       if (error?.response?.status === 401) {
//         window.location.href = "/login";
//       }
//       return false;
//     } finally {
//       isRefreshingRef.current = false;
//     }
//   };

//   const scheduleTokenRefresh = () => {
//     if (refreshTimerRef.current) {
//       clearTimeout(refreshTimerRef.current);
//     }

//     const REFRESH_INTERVAL = 14 * 60 * 1000;

//     refreshTimerRef.current = setTimeout(() => {
//       refreshTokenManually();
//       scheduleTokenRefresh();
//     }, REFRESH_INTERVAL);

//     console.log(
//       `⏰ Auto token refresh scheduled for ${REFRESH_INTERVAL / 1000 / 60} minutes`
//     );
//   };

//   useEffect(() => {
//     // Get auth status from wherever you store it (Redux, Context, etc.)
//     // For now, just start if component mounts
//     scheduleTokenRefresh();

//     return () => {
//       if (refreshTimerRef.current) {
//         clearTimeout(refreshTimerRef.current);
//       }
//     };
//   }, []);

//   return { refreshTokenManually };
// };

// /**
//  * Simple interval-based refresh hook (less recommended)
//  */
// export const useSimpleTokenRefresh = () => {
//   useEffect(() => {
//     // Check every 5 minutes if token needs refresh
//     const interval = setInterval(async () => {
//       try {
//         await axiosInstance.post("/auth/refresh-token");
//         console.log("✅ Token refreshed via interval");
//       } catch (error) {
//         if (error?.response?.status === 401) {
//           window.location.href = "/login";
//         }
//       }
//     }, 5 * 60 * 1000); // 5 minutes

//     return () => clearInterval(interval);
//   }, []);
// };
