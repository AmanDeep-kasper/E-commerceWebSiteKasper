// import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";

// const loadWishlistFromStorage = () => {
//   try {
//     const saved = localStorage.getItem("wishlist");
//     return saved ? JSON.parse(saved) : [];
//   } catch {
//     return [];
//   }
// };

// const saveWishlistToStorage = (wishlistItems) => {
//   try {
//     localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
//   } catch {}
// };

// const savedItems = loadWishlistFromStorage();

// const initialState = {
//   wishlistItems: savedItems,
//   totalItems: savedItems.length,
// };

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState,
//   reducers: {
//     syncWishlist: (state) => {
//       state.totalItems = state.wishlistItems.length;
//       saveWishlistToStorage(state.wishlistItems);
//     },
//     addToWishlist: (state, { payload: item }) => {
//       const exists = state.wishlistItems.some((i) => i.uuid === item.uuid);
//       if (!exists) {
//         state.wishlistItems.push(item);
//         toast.success("Added to favourites");
//       }
//       wishlistSlice.caseReducers.syncWishlist(state);
//     },
//     removeFromWishlist: (state, { payload: item }) => {
//       state.wishlistItems = state.wishlistItems.filter(
//         (i) => i.uuid !== item.uuid
//       );
//       wishlistSlice.caseReducers.syncWishlist(state);
//     },
//     clearWishlist: (state) => {
//       state.wishlistItems = [];
//       wishlistSlice.caseReducers.syncWishlist(state);
//     },
//   },
// });

// export const {
//   syncWishlist,
//   addToWishlist,
//   removeFromWishlist,
//   clearWishlist,
// } = wishlistSlice.actions;

// export default wishlistSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import products from "../../data/products.json"; // 👈 import products to resync stock

// Load from localStorage + resync with latest stock
const loadWishlistFromStorage = () => {
  try {
    const saved = localStorage.getItem("wishlist");
    let wishlist = saved ? JSON.parse(saved) : [];

    // 🔄 Sync stock quantity with latest product data
    wishlist = wishlist.map((item) => {
      const latest = products.find((p) => p.uuid === item.uuid);
      return {
        ...item,
        stockQuantity: latest?.stockQuantity ?? 0,
      };
    });

    return wishlist;
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (wishlistItems) => {
  try {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  } catch {}
};

const savedItems = loadWishlistFromStorage();

const initialState = {
  wishlistItems: savedItems,
  totalItems: savedItems.length,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    syncWishlist: (state) => {
      state.totalItems = state.wishlistItems.length;
      saveWishlistToStorage(state.wishlistItems);
    },
    addToWishlist: (state, { payload: item }) => {
      const exists = state.wishlistItems.find(
        (i) => i.uuid === item.uuid && i.variantId === item.variantId
      );

      if (!exists) {
        state.wishlistItems.push({
          ...item,
          stockQuantity: item.stockQuantity ?? 0, // 👈 ensure stock is stored
        });
        // toast.success("Added to favourites");
      }
      wishlistSlice.caseReducers.syncWishlist(state);
    },
    removeFromWishlist: (state, { payload: item }) => {
      state.wishlistItems = state.wishlistItems.filter(
        (i) => !(i.uuid === item.uuid && i.variantId === item.variantId)
      );
      wishlistSlice.caseReducers.syncWishlist(state);
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      wishlistSlice.caseReducers.syncWishlist(state);
    },
  },
});

export const {
  syncWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
