import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add-to-cart", authenticate, addToCart);
router.get("/", authenticate, getCart);
router.patch("/update-item", authenticate, updateCart);
router.delete("/remove-item/:itemId", authenticate, removeFromCart);
router.delete("/clear-cart", authenticate, clearCart)

export default router;
