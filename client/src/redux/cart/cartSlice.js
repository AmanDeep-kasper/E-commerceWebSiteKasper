// import { createSlice } from "@reduxjs/toolkit";

// // Helpers to load/save
// const loadCartFromStorage = () => {
//   try {
//     const saved = localStorage.getItem("cart");
//     return saved ? JSON.parse(saved) : [];
//   } catch {
//     return [];
//   }
// };

// const saveCartToStorage = (cartItems) => {
//   try {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   } catch {}
// };

// // Pull in existing items
// const savedItems = loadCartFromStorage();

// // Pre-compute totals
// const initialState = {
//   cartItems: savedItems,
//   totalItems: savedItems.reduce((sum, i) => sum + i.quantity, 0),
//   totalPrice: savedItems.reduce((sum, i) => sum + i.basePrice * i.quantity, 0),
//   totalDiscount: savedItems.reduce(
//     (sum, i) => sum + ((i.basePrice * i.discountPercent) / 100) * i.quantity,
//     0
//   ),
//   buyNowMode: false, // 👈 new flag
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     syncCart: (state) => {
//       state.totalItems = state.cartItems.reduce(
//         (sum, i) => sum + i.quantity,
//         0
//       );
//       state.totalPrice = state.cartItems.reduce(
//         (sum, i) => sum + i.basePrice * i.quantity,
//         0
//       );
//       state.totalDiscount = state.cartItems.reduce(
//         (sum, i) =>
//           sum + ((i.basePrice * i.discountPercent) / 100) * i.quantity,
//         0
//       );
//       saveCartToStorage(state.cartItems);
//     },
//     addToCart: (state, { payload: item }) => {
//       const ex = state.cartItems.find((i) => i.uuid === item.uuid);
//       if (ex) {
//         if (ex.stockQuantity > ex.quantity) {
//           ex.quantity++;
//         }
//       } else {
//         state.cartItems.push({
//           ...item,
//           quantity: 1,
//           stockQuantity: item.stockQuantity ?? 0, // 👈 ensure stock is saved
//         });
//       }
//       cartSlice.caseReducers.syncCart(state);
//     },
//     addMultipleItemToCart: (state, { payload }) => {
//       const { product, quantity = 1 } = payload;
//       const ex = state.cartItems.find((i) => i.title === product.title);

//       if (ex) {
//         ex.quantity += quantity;
//       } else {
//         state.cartItems.push({ ...product, quantity });
//       }

//       cartSlice.caseReducers.syncCart(state);
//     },
//     removeFromCart: (state, { payload: item }) => {
//       state.cartItems = state.cartItems.filter((i) => i.title !== item.title);
//       cartSlice.caseReducers.syncCart(state);
//     },
//     increaseQty: (state, { payload: item }) => {
//       const ex = state.cartItems.find((i) => i.uuid === item.uuid);
//       if (ex) {
//         if (ex.stockQuantity > ex.quantity) {
//           ex.quantity++;
//         } else {
//           // optional: set a flag ex.outOfStock = true
//         }
//       }
//       cartSlice.caseReducers.syncCart(state);
//     },
//     decreaseQty: (state, { payload: item }) => {
//       const ex = state.cartItems.find((i) => i.title === item.title);
//       if (ex?.quantity > 1) ex.quantity--;
//       else
//         state.cartItems = state.cartItems.filter((i) => i.title !== item.title);
//       cartSlice.caseReducers.syncCart(state);
//     },
//     clearCart: (state) => {
//       state.cartItems = [];
//       state.buyNowMode = false;
//       cartSlice.caseReducers.syncCart(state);
//     },

//     // 👉 New Buy Now Reducers
//     buyNow: (state, { payload: item }) => {
//       state.cartItems = [{ ...item, quantity: 1 }];
//       state.totalItems = 1;
//       state.totalPrice = item.basePrice;
//       state.totalDiscount =
//         ((item.basePrice * (item.discountPercent || 0)) / 100) * 1;
//       state.buyNowMode = true; // mark buy now flow
//       saveCartToStorage(state.cartItems);
//     },
//     resetBuyNow: (state) => {
//       state.buyNowMode = false;
//     },
//   },
// });

// export const {
//   syncCart,
//   addToCart,
//   removeFromCart,
//   increaseQty,
//   decreaseQty,
//   addMultipleItemToCart,
//   clearCart,
//   buyNow,
//   resetBuyNow,
// } = cartSlice.actions;
// export default cartSlice.reducer;

////////////////////////////////////////////////////////

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


/////////////////////////////////////////////////////////////////////
// import { createSlice } from "@reduxjs/toolkit";
// import products from "../../data/products.json";

// const loadCartFromStorage = () => {
//   try {
//     const saved = localStorage.getItem("cart");
//     let cart = saved ? JSON.parse(saved) : [];

//     // 🔄 Resync stock with latest product list
//     cart = cart.map((item) => {
//       const latest = products.find((p) => p.uuid === item.uuid);
//       return {
//         ...item,
//         stockQuantity: latest?.stockQuantity ?? 0,
//       };
//     });

//     return cart;
//   } catch {
//     return [];
//   }
// };

// const saveCartToStorage = (cartItems) => {
//   try {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   } catch {}
// };

// // Pull in existing items
// const savedItems = loadCartFromStorage();

// // Pre-compute totals (⚡ FIXED: using price)
// const initialState = {
//   cartItems: savedItems,
//   totalItems: savedItems.reduce((sum, i) => sum + i.quantity, 0),
//   totalPrice: savedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
//   totalDiscount: savedItems.reduce(
//     (sum, i) =>
//       sum + ((i.price * (i.discountPercent || 0)) / 100) * i.quantity,
//     0
//   ),
//   buyNowMode: false,
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     // 🔄 Sync totals and persist
//     syncCart: (state) => {
//       state.totalItems = state.cartItems.reduce(
//         (sum, i) => sum + i.quantity,
//         0
//       );

//       // ⚡ FIXED: use price not basePrice
//       state.totalPrice = state.cartItems.reduce(
//         (sum, i) => sum + i.price * i.quantity,
//         0
//       );

//       state.totalDiscount = state.cartItems.reduce(
//         (sum, i) =>
//           sum +
//           ((i.price * (i.discountPercent || 0)) / 100) * i.quantity,
//         0
//       );

//       saveCartToStorage(state.cartItems);
//     },

//     // 🛒 Add one item
//     addToCart: (state, { payload: item }) => {
//       const ex = state.cartItems.find(
//         (i) => i.uuid === item.uuid && i.variantId === item.variantId
//       );

//       if (ex) {
//         if (ex.stockQuantity > ex.quantity) {
//           ex.quantity++;
//         }
//       } else {
//         state.cartItems.push({
//           ...item,
//           quantity: 1,
//           stockQuantity: item.stockQuantity ?? 0,
//         });
//       }
//       cartSlice.caseReducers.syncCart(state);
//     },

//     // 🛒 Add multiple items at once
//     addMultipleItemToCart: (state, { payload }) => {
//       const { product, quantity = 1 } = payload;
//       const ex = state.cartItems.find((i) => i.uuid === product.uuid);

//       if (ex) {
//         if (ex.stockQuantity >= ex.quantity + quantity) {
//           ex.quantity += quantity;
//         }
//       } else {
//         state.cartItems.push({
//           ...product,
//           quantity,
//           stockQuantity: product.stockQuantity ?? 0,
//         });
//       }
//       cartSlice.caseReducers.syncCart(state);
//     },

//     // ❌ Remove from cart
//     removeFromCart: (state, { payload: item }) => {
//       state.cartItems = state.cartItems.filter(
//         (i) => !(i.uuid === item.uuid && i.variantId === item.variantId)
//       );
//       cartSlice.caseReducers.syncCart(state);
//     },

//     // Increase qty
//     increaseQty: (state, { payload: item }) => {
//       const ex = state.cartItems.find(
//         (i) => i.uuid === item.uuid && i.variantId === item.variantId
//       );
//       if (ex && ex.stockQuantity > ex.quantity) {
//         ex.quantity++;
//       }
//       cartSlice.caseReducers.syncCart(state);
//     },

//     // Decrease qty
//     decreaseQty: (state, { payload: item }) => {
//       const ex = state.cartItems.find(
//         (i) => i.uuid === item.uuid && i.variantId === item.variantId
//       );
//       if (ex?.quantity > 1) {
//         ex.quantity--;
//       } else {
//         state.cartItems = state.cartItems.filter(
//           (i) => !(i.uuid === item.uuid && i.variantId === item.variantId)
//         );
//       }
//       cartSlice.caseReducers.syncCart(state);
//     },

//     // 🧹 Clear cart
//     clearCart: (state) => {
//       state.cartItems = [];
//       state.buyNowMode = false;
//       cartSlice.caseReducers.syncCart(state);
//     },

//     // ⚡ Buy Now (single item)
//     buyNow: (state, { payload: item }) => {
//       state.cartItems = [
//         {
//           ...item,
//           quantity: 1,
//           stockQuantity: item.stockQuantity ?? 0,
//         },
//       ];

//       // ⚡ FIXED: use price
//       state.totalItems = 1;
//       state.totalPrice = item.price;
//       state.totalDiscount =
//         ((item.price * (item.discountPercent || 0)) / 100) * 1;

//       state.buyNowMode = true;
//       saveCartToStorage(state.cartItems);
//     },

//     // 🔄 Reset Buy Now flag
//     resetBuyNow: (state) => {
//       state.buyNowMode = false;
//     },
//   },
// });

// export const {
//   syncCart,
//   addToCart,
//   removeFromCart,
//   increaseQty,
//   decreaseQty,
//   addMultipleItemToCart,
//   clearCart,
//   buyNow,
//   resetBuyNow,
// } = cartSlice.actions;

// export default cartSlice.reducer;
