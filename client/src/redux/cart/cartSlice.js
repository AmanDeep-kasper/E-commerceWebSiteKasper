import { createSlice } from "@reduxjs/toolkit";
import products from "../../data/products.json";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

// const [produtsbackend, setprodutsbackend] = useState([]);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const res = await axiosInstance.get("/products/all");
//       // console.log(res.data)
//       setprodutsbackend(res.data);
//     } catch (error) {
//       console.log("ERROR:", error);
//     }
//   };
//   fetchData();
// }, []);

/* ------------------------------
   Load Cart From LocalStorage
--------------------------------*/
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch {}
};

/* ------------------------------
   Initial State
--------------------------------*/
const savedItems = loadCartFromStorage();

const initialState = {
  cartItems: savedItems,
  totalItems: savedItems.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: savedItems.reduce((sum, i) => sum + i.basePrice * i.quantity, 0),
  totalDiscount: savedItems.reduce(
    (sum, i) =>
      sum + ((i.basePrice * (i.discountPercent || 0)) / 100) * i.quantity,
    0
  ),
  buyNowMode: false,
};

/* ------------------------------
   Slice
--------------------------------*/
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ------------------------------
       Sync & Save
    --------------------------------*/
    syncCart: (state) => {
      state.totalItems = state.cartItems.reduce(
        (sum, i) => sum + i.quantity,
        0
      );
      state.totalPrice = state.cartItems.reduce(
        (sum, i) => sum + i.basePrice * i.quantity,
        0
      );
      state.totalDiscount = state.cartItems.reduce(
        (sum, i) =>
          sum + ((i.basePrice * (i.discountPercent || 0)) / 100) * i.quantity,
        0
      );

      saveCartToStorage(state.cartItems);
    },

    /* ------------------------------
       Add Single Item
    --------------------------------*/
    addToCart: (state, { payload: item }) => {
      const ex = state.cartItems.find(
        (i) => i.uuid === item.uuid && i.variantId === item.variantId
      );

      if (ex) {
        if (ex.stockQuantity > ex.quantity) {
          ex.quantity++;
        }
      } else {
        state.cartItems.push({
          ...item,
          quantity: 1,
          stockQuantity: item.stockQuantity ?? 0,
        });
      }

      cartSlice.caseReducers.syncCart(state);
    },

    /* ------------------------------
       Add multiple items
    --------------------------------*/
    addMultipleItemToCart: (state, { payload }) => {
      const { product, quantity = 1 } = payload;

      const ex = state.cartItems.find(
        (i) => i.uuid === product.uuid && i.variantId === product.variantId
      );

      if (ex) {
        if (ex.stockQuantity >= ex.quantity + quantity) {
          ex.quantity += quantity;
        }
      } else {
        state.cartItems.push({
          ...product,
          quantity,
          stockQuantity: product.stockQuantity ?? 0,
        });
      }

      cartSlice.caseReducers.syncCart(state);
    },

    /* ------------------------------
       Remove item
    --------------------------------*/
    removeFromCart: (state, { payload: item }) => {
      state.cartItems = state.cartItems.filter(
        (i) => !(i.uuid === item.uuid && i.variantId === item.variantId)
      );
      cartSlice.caseReducers.syncCart(state);
    },

    /* ------------------------------
       Increase Qty
    --------------------------------*/
    increaseQty: (state, { payload }) => {
      const { uuid, variantId } = payload;

      const ex = state.cartItems.find(
        (i) => i.uuid === uuid && i.variantId === variantId
      );

      if (ex && ex.stockQuantity > ex.quantity) {
        ex.quantity++;
      }

      cartSlice.caseReducers.syncCart(state);
    },

    /* ------------------------------
       Decrease Qty
    --------------------------------*/
    decreaseQty: (state, { payload }) => {
      const { uuid, variantId } = payload;

      const ex = state.cartItems.find(
        (i) => i.uuid === uuid && i.variantId === variantId
      );

      if (!ex) return;

      if (ex.quantity > 1) {
        ex.quantity--;
      } else {
        state.cartItems = state.cartItems.filter(
          (i) => !(i.uuid === uuid && i.variantId === variantId)
        );
      }

      cartSlice.caseReducers.syncCart(state);
    },

    /* ------------------------------
       Clear Cart
    --------------------------------*/
    clearCart: (state) => {
      state.cartItems = [];
      state.buyNowMode = false;
      cartSlice.caseReducers.syncCart(state);
    },

    /* ------------------------------
       Buy Now
    --------------------------------*/
    buyNow: (state, { payload: item }) => {
      state.cartItems = [
        {
          ...item,
          quantity: 1,
          stockQuantity: item.stockQuantity ?? 0,
        },
      ];

      state.totalItems = 1;
      state.totalPrice = item.basePrice;
      state.totalDiscount =
        ((item.basePrice * (item.discountPercent || 0)) / 100) * 1;

      state.buyNowMode = true;

      saveCartToStorage(state.cartItems);
    },

    resetBuyNow: (state) => {
      state.buyNowMode = false;
    },
  },
});

/* ------------------------------
   Exports
--------------------------------*/
export const {
  syncCart,
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  addMultipleItemToCart,
  clearCart,
  buyNow,
  resetBuyNow,
} = cartSlice.actions;

export default cartSlice.reducer;

