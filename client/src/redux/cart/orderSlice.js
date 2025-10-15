// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Mock thunk to simulate placing an order
// export const placeOrder = createAsyncThunk(
//   "order/placeOrder",
//   async (orderData, thunkAPI) => {
//     await new Promise((res) => setTimeout(res, 500));
//     return { ...orderData, status: "success" }; // Pass full order data
//   }
// );

// const orderSlice = createSlice({
//   name: "order",
//   initialState: { loading: false, error: null, orders: [] },
//   reducers: {
//     resetOrder(state) {
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(placeOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(placeOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders.push(action.payload); // ✅ Save full order data
//       })
//       .addCase(placeOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export const { resetOrder } = orderSlice.actions;
// export default orderSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Load and save helpers for persistence
const loadOrders = () => {
  try {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveOrders = (orders) => {
  try {
    localStorage.setItem("orders", JSON.stringify(orders));
  } catch {}
};

// Mock async thunk (replace with API if needed)
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData) => {
    // simulate network delay
    await new Promise((res) => setTimeout(res, 300));
    return { ...orderData, status: "success" };
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    loading: false,
    error: null,
    list: loadOrders(), // 👈 consistent key for order history
  },
  reducers: {
    resetOrder(state) {
      state.loading = false;
      state.error = null;
    },
    clearOrders(state) {
      state.list = [];
      saveOrders([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload); // ✅ add new order
        saveOrders(state.list); // persist to localStorage
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
