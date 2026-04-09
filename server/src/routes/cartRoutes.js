import express from 'express';
import { getCart, updateCart, clearCart } from '../controllers/cartController.js';
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/', isAuthenticated, getCart);
router.post('/', isAuthenticated, updateCart);
router.delete('/', isAuthenticated, clearCart);

export default router;
