import Cart from "../models/Cart.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(200).json({ user: req.user._id, items: [] });
  }

  res.status(200).json(cart);
});

export const updateCart = asyncHandler(async (req, res) => {
  const { items } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items });
  } else {
    cart.items = items;
  }

  await cart.save();
  res.status(200).json(cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.userId }, { items: [] });
  res.status(200).json({ message: "Cart cleared" });
});
