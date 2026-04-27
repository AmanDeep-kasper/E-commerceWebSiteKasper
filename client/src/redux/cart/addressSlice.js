// src/redux/addressSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import addressService from "../../services/addressService";

// Initial state
const initialState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
};

// 🔹 Thunks
export const fetchAddresses = createAsyncThunk(
  "address/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await addressService.getUserAddresses();

      return res?.data?.addresses || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses",
      );
    }
  },
);

export const createAddress = createAsyncThunk(
  "address/create",
  async (data, thunkAPI) => {
    try {
      const res = await addressService.addAddress(data);
      const all = await addressService.getUserAddresses();
      return all.data?.data?.addresses || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add address",
      );
    }
  },
);

export const setDefaultAddress = createAsyncThunk(
  "address/set-default-address",
  async (id, thunkAPI) => {
    try {
      await addressService.setDefaultAddress(id);
      const all = await addressService.getUserAddresses();
      return all.data?.data?.addresses || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to set default address",
      );
    }
  },
);

export const editAddress = createAsyncThunk(
  "address/edit",
  async ({ id, data }, thunkAPI) => {
    try {
      await addressService.updateAddress(id, data);
      const all = await addressService.getUserAddresses();
      // localStorage.setItem("addresses", JSON.stringify(all));
      return all.data?.data?.addresses || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update address",
      );
    }
  },
);

export const removeAddress = createAsyncThunk(
  "address/remove",
  async (id, thunkAPI) => {
    try {
      await addressService.deleteAddress(id);

      const all = await addressService.getUserAddresses();
      // localStorage.setItem("addresses", JSON.stringify(all));
      return all.data?.data?.addresses || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete address",
      );
    }
  },
);

// 🔹 Slice
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    selectAddress: (state, { payload }) => {
      state.selectedAddress = payload;
      // localStorage.setItem("selectedAddress", JSON.stringify(payload));
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
      // localStorage.removeItem("selectedAddress");
    },
    setCheckoutAddress: (state, { payload }) => {
      state.selectedAddress = payload;
      // localStorage.setItem("selectedAddress", JSON.stringify(payload));
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
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      });
  },
});

// ✅ Export actions & reducer
export const { selectAddress, clearSelectedAddress, setCheckoutAddress } =
  addressSlice.actions;
export default addressSlice.reducer;
