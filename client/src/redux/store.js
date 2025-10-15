// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/cartSlice";
import wishlistReducer from "./cart/wishlistSlice";
import addressReducer from "./cart/addressSlice";
import paymentReducer from "./cart/paymentSlice";
import orderReducer from "./cart/orderSlice";
import userReducer from "./cart/userSlice";
import productReducer from "./cart/productSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
    payment: paymentReducer,
    order: orderReducer,
    user: userReducer,
    product: productReducer,
  },
});

export { store };
