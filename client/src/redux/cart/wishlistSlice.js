import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage
const loadWishlistFromStorage = () => {
  try {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
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

    setWishlistFromAPI: (state, { payload }) => {
      const wishlist = payload || {};

      state.wishlistItems = (wishlist.items || []).map((item) => ({
        _id: item._id,
        product: item.product,
        productId: item.product,
        uuid: item.product,
        variantId: item.variantId,
        title: item.productTitle,
        image: item.image?.url || "/placeholder.png",
        variantName: item.variantName,
        variantColor: item.variantColor,
        variantAttributes: item.variantAttributes || {},
        basePrice: Number(item.variantAttributes?.mrp || 0),
        discountPercent: Number(item.variantAttributes?.discount || 0),
        stockQuantity: Number(item.variantAvailableStock || 0),
      }));

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
          stockQuantity: item.stockQuantity ?? 0,
        });
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
  setWishlistFromAPI,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;