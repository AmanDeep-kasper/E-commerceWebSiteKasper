import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  addProductToWishlist,
  clearWishlist,
  getWishlist,
  removeFromWishlist,
  removeProductFromWishlist,
} from "../controllers/wishlistController.js";

const router = Router();

// user routes
router.post("/add-to-wishlist", authenticate, addProductToWishlist);
router.get("/", authenticate, getWishlist);
router.delete("/remove-item", authenticate, removeProductFromWishlist);
router.delete("/clear-wishlist", authenticate, clearWishlist);
router.delete("/delete-item/:itemId", authenticate, removeFromWishlist);

export default router;
