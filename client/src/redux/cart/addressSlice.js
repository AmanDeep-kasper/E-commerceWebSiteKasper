// import { createSlice } from "@reduxjs/toolkit";

// // Load from localStorage so addresses persist after refresh
// const loadFromStorage = () => {
//   try {
//     const saved = localStorage.getItem("addresses");
//     return saved ? JSON.parse(saved) : [];
//   } catch {
//     return [];
//   }
// };

// const loadSelectedAddress = () => {
//   try {
//     const saved = localStorage.getItem("selectedAddress");
//     return saved ? JSON.parse(saved) : null;
//   } catch {
//     return null;
//   }
// };

// const initialState = {
//   addresses: loadFromStorage(), // List of saved addresses
//   selectedAddress: loadSelectedAddress(), // Currently chosen address
// };

// const addressSlice = createSlice({
//   name: "address",
//   initialState,
//   reducers: {
//     addAddress: (state, { payload }) => {
//       // Ensure only one default address
//       if (payload.saveForFuture && state.addresses.length) {
//         state.addresses.forEach((addr) => (addr.saveForFuture = false));
//       }
//       state.addresses.push(payload);
//       localStorage.setItem("addresses", JSON.stringify(state.addresses));

//       if (payload.saveForFuture) {
//         state.selectedAddress = payload;
//         localStorage.setItem("selectedAddress", JSON.stringify(payload));
//       }
//     },

//     removeAddress: (state, { payload }) => {
//       state.addresses = state.addresses.filter((addr) => addr.id !== payload);

//       localStorage.setItem("addresses", JSON.stringify(state.addresses));

//       if (state.selectedAddress?.id === payload) {
//         const defaultAddr = state.addresses.find((addr) => addr.saveForFuture);
//         state.selectedAddress = defaultAddr || null;
//         localStorage.setItem(
//           "selectedAddress",
//           JSON.stringify(state.selectedAddress)
//         );
//       }
//     },

//     updateAddress: (state, { payload }) => {
//       const index = state.addresses.findIndex((addr) => addr.id === payload.id);
//       if (index !== -1) {
//         if (payload.saveForFuture) {
//           state.addresses.forEach((addr) => (addr.saveForFuture = false));
//         }
//         state.addresses[index] = payload;

//         localStorage.setItem("addresses", JSON.stringify(state.addresses));

//         if (state.selectedAddress?.id === payload.id || payload.saveForFuture) {
//           state.selectedAddress = payload;
//           localStorage.setItem("selectedAddress", JSON.stringify(payload));
//         }
//       }
//     },

//     selectAddress: (state, { payload }) => {
//       state.selectedAddress = payload;
//       localStorage.setItem("selectedAddress", JSON.stringify(payload));
//     },

//     clearSelectedAddress: (state) => {
//       state.selectedAddress = null;
//       localStorage.removeItem("selectedAddress");
//     },

//     // New reducer: explicitly set selectedAddress during checkout flow
//     setCheckoutAddress: (state, { payload }) => {
//       state.selectedAddress = payload;
//       localStorage.setItem("selectedAddress", JSON.stringify(payload));
//     },
//   },
// });

// export const {
//   addAddress,
//   removeAddress,
//   updateAddress,
//   selectAddress,
//   clearSelectedAddress,
//   setCheckoutAddress,
// } = addressSlice.actions;

// export default addressSlice.reducer;


// src/redux/addressSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import addressService from "../../services/addressService";

// Helpers
const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem("addresses");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const loadSelectedAddress = () => {
  try {
    const saved = localStorage.getItem("selectedAddress");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Initial state
const initialState = {
  addresses: loadFromStorage(),
  selectedAddress: loadSelectedAddress(),
  loading: false,
  error: null,
};

// 🔹 Thunks
export const fetchAddresses = createAsyncThunk(
  "address/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await addressService.getUserAddresses();
      localStorage.setItem("addresses", JSON.stringify(res));
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses"
      );
    }
  }
);

export const createAddress = createAsyncThunk(
  "address/create",
  async (data, thunkAPI) => {
    try {
      const res = await addressService.addAddress(data);
      // refresh full list after add
      const all = await addressService.getUserAddresses();
      localStorage.setItem("addresses", JSON.stringify(all));
      return all;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add address"
      );
    }
  }
);

export const editAddress = createAsyncThunk(
  "address/edit",
  async ({ id, data }, thunkAPI) => {
    try {
      await addressService.updateAddress(id, data);
      const all = await addressService.getUserAddresses();
      localStorage.setItem("addresses", JSON.stringify(all));
      return all;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update address"
      );
    }
  }
);

export const removeAddress = createAsyncThunk(
  "address/remove",
  async (id, thunkAPI) => {
    try {
      await addressService.deleteAddress(id);

      const all = await addressService.getUserAddresses();
      localStorage.setItem("addresses", JSON.stringify(all));
      return all;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

// 🔹 Slice
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    selectAddress: (state, { payload }) => {
      state.selectedAddress = payload;
      localStorage.setItem("selectedAddress", JSON.stringify(payload));
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
      localStorage.removeItem("selectedAddress");
    },
    setCheckoutAddress: (state, { payload }) => {
      state.selectedAddress = payload;
      localStorage.setItem("selectedAddress", JSON.stringify(payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // edit
      .addCase(editAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // remove
      .addCase(removeAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(removeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export actions & reducer
export const { selectAddress, clearSelectedAddress, setCheckoutAddress } =
  addressSlice.actions;
export default addressSlice.reducer;

