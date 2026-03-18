import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No access token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expired. Please refresh token or log in again.",
      });
    }

    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  const role = req.user?.role?.trim().toLowerCase();

  if (role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Forbidden: Admins only" });
};
