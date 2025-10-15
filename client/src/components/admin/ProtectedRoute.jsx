// import React from "react";
// import { Navigate, Outlet } from "react-router";

// const ProtectedRoute = ({ allowedRoles }) => {
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("loggedInUser"));

//   const isAuthorized = token && allowedRoles.includes(user?.user?.role?.toLowerCase());

//   return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;
// components/ProtectedRoute.js
// components/admin/ProtectedRoute.js
// src/components/admin/ProtectedRoute.js
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation(); // ⬅️ triggers re-render on URL change
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!userData || !userData.token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(userData.user.role.toLowerCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
