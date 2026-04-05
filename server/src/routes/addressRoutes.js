import express from "express";
import {
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, addAddress);
router.get("/", isAuthenticated, getUserAddresses);
router.put("/:id", isAuthenticated, updateAddress);
router.delete("/:id", isAuthenticated, deleteAddress);

export default router;
