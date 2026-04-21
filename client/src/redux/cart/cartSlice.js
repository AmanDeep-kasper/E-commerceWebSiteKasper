import { createSlice } from "@reduxjs/toolkit";

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
  totalItems: savedItems.reduce((sum, i) => sum + (i.quantity || 0), 0),
  totalPrice: savedItems.reduce(
    (sum, i) => sum + (i.basePrice || i.sellingPrice || 0) * (i.quantity || 0),
    0,
  ),
  totalDiscount: savedItems.reduce(
    (sum, i) =>
      sum +
      (((i.basePrice || i.sellingPrice || 0) * (i.discountPercent || 0)) /
        100) *
        (i.quantity || 0),
    0,
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
       Set Cart From Backend API
    --------------------------------*/
    setCartFromAPI: (state, { payload }) => {
      const cart = payload || {};

      state.cartItems = (cart.items || []).map((item) => ({
        _id: item._id,
        uuid: item.product || item.productId || item._id,
        productId: item.product,
        variantId: item.variantId,
        title: item.productTitle,
        image: item.image?.url || "/placeholder.png",
        quantity: item.quantity || 1,
        basePrice: item.sellingPrice || item.mrp || 0,
        sellingPrice: item.sellingPrice || 0,
        mrp: item.mrp || 0,
        discountPercent: item.discount || 0,
        stockQuantity: item.stockQuantity ?? 9999,
        category: item.category,
        gst: item.gst,
        variantName: item.variantName,
        variantSkuId: item.variantSkuId,
        variantColor: item.variantColor,
        variantAttributes: item.variantAttributes,
      }));

      // state.totalItems = Number(cart.totalQuantity) || 0;
      state.totalItems = (cart.items || []).length;
      state.totalPrice = Number(cart.subtotal) || 0;
      state.totalDiscount = 0;

      saveCartToStorage(state.cartItems);
    },

    /* ------------------------------
       Sync & Save
    --------------------------------*/
    syncCart: (state) => {
      state.totalItems = state.cartItems.reduce(
        (sum, i) => sum + (i.quantity || 0),
        0,
      );

      state.totalPrice = state.cartItems.reduce(
        (sum, i) =>
          sum + (i.basePrice || i.sellingPrice || 0) * (i.quantity || 0),
        0,
      );

      state.totalDiscount = state.cartItems.reduce(
        (sum, i) =>
          sum +
          (((i.basePrice || i.sellingPrice || 0) * (i.discountPercent || 0)) /
            100) *
            (i.quantity || 0),
        0,
      );

      saveCartToStorage(state.cartItems);
    },

    /* ------------------------------
       Add Single Item
    --------------------------------*/
    addToCart: (state, { payload: item }) => {
      const ex = state.cartItems.find(
        (i) => i.uuid === item.uuid && i.variantId === item.variantId,
      );

      if (ex) {
        if ((ex.stockQuantity ?? 9999) > ex.quantity) {
          ex.quantity += 1;
        }
      } else {
        state.cartItems.push({
          ...item,
          quantity: item.quantity || 1,
          stockQuantity: item.stockQuantity ?? 9999,
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
        (i) => i.uuid === product.uuid && i.variantId === product.variantId,
      );

      if (ex) {
        if ((ex.stockQuantity ?? 9999) >= ex.quantity + quantity) {
          ex.quantity += quantity;
        }
      } else {
        state.cartItems.push({
          ...product,
          quantity,
          stockQuantity: product.stockQuantity ?? 9999,
        });
      }

      cartSlice.caseReducers.syncCart(state);
    },

    /* ------------------------------
       Remove item
    --------------------------------*/
    removeFromCart: (state, { payload: item }) => {
      state.cartItems = state.cartItems.filter(
        (i) => !(i.uuid === item.uuid && i.variantId === item.variantId),
      );
      cartSlice.caseReducers.syncCart(state);
    },

    /* ------------------------------
       Increase Qty
    --------------------------------*/
    increaseQty: (state, { payload }) => {
      const { uuid, variantId } = payload;

      const ex = state.cartItems.find(
        (i) => i.uuid === uuid && i.variantId === variantId,
      );

      if (ex && (ex.stockQuantity ?? 9999) > ex.quantity) {
        ex.quantity += 1;
      }

      cartSlice.caseReducers.syncCart(state);
    },

    /* ------------------------------
       Decrease Qty
    --------------------------------*/
    decreaseQty: (state, { payload }) => {
      const { uuid, variantId } = payload;

      const ex = state.cartItems.find(
        (i) => i.uuid === uuid && i.variantId === variantId,
      );

      if (!ex) return;

      if (ex.quantity > 1) {
        ex.quantity -= 1;
      } else {
        state.cartItems = state.cartItems.filter(
          (i) => !(i.uuid === uuid && i.variantId === variantId),
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
          stockQuantity: item.stockQuantity ?? 9999,
        },
      ];

      state.totalItems = 1;
      state.totalPrice = item.basePrice || item.sellingPrice || 0;
      state.totalDiscount =
        (((item.basePrice || item.sellingPrice || 0) *
          (item.discountPercent || 0)) /
          100) *
        1;

      state.buyNowMode = true;

      saveCartToStorage(state.cartItems);
    },

    resetBuyNow: (state) => {
      state.buyNowMode = false;
    },
  },
});

export const {
  setCartFromAPI,
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
