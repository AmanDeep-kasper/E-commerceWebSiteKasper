// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // // Mock thunk to simulate placing an order
// // export const placeOrder = createAsyncThunk(
// //   "order/placeOrder",
// //   async (orderData, thunkAPI) => {
// //     await new Promise((res) => setTimeout(res, 500));
// //     return { ...orderData, status: "success" }; // Pass full order data
// //   }
// // );

// // const orderSlice = createSlice({
// //   name: "order",
// //   initialState: { loading: false, error: null, orders: [] },
// //   reducers: {
// //     resetOrder(state) {
// //       state.loading = false;
// //       state.error = null;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(placeOrder.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(placeOrder.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.orders.push(action.payload); // ✅ Save full order data
// //       })
// //       .addCase(placeOrder.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.error.message;
// //       });
// //   },
// // });

// // export const { resetOrder } = orderSlice.actions;
// // export default orderSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Load and save helpers for persistence
// const loadOrders = () => {
//   try {
//     const saved = localStorage.getItem("orders");
//     return saved ? JSON.parse(saved) : [];
//   } catch {
//     return [];
//   }
// };

// const saveOrders = (orders) => {
//   try {
//     localStorage.setItem("orders", JSON.stringify(orders));
//   } catch {}
// };

// // Mock async thunk (replace with API if needed)
// export const placeOrder = createAsyncThunk(
//   "orders/placeOrder",
//   async (orderData) => {
//     // simulate network delay
//     await new Promise((res) => setTimeout(res, 300));
//     return { ...orderData, status: "success" };
//   },
// );

// const orderSlice = createSlice({
//   name: "orders",
//   initialState: {
//     loading: false,
//     error: null,
//     list: loadOrders(), //  consistent key for order history
//   },
//   reducers: {
//     resetOrder(state) {
//       state.loading = false;
//       state.error = null;
//     },
//     clearOrders(state) {
//       state.list = [];
//       saveOrders([]);
//     },

//     //  ADD THIS (Place it here)
//     cancelOrder(state, action) {
//       const orderId = action.payload;

//       state.list = state.list.map((order) =>
//         order.orderId === orderId
//           ? { ...order, orderStatus: "Cancelled" }
//           : order,
//       );
//       saveOrders(state.list);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(placeOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(placeOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list.push(action.payload); // ✅ add new order
//         saveOrders(state.list); // persist to localStorage
//       })
//       .addCase(placeOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },

//   // add by aman
//   cancelOrderItems: (state, action) => {
//   const { orderId, itemsToCancel } = action.payload;

//   const order = state.list.find((o) => o.orderId === orderId);
//   if (!order) return;

//   order.items = order.items.map((item) => {
//     const key = item.itemId || item.variantId || item.uuid;

//     const match = itemsToCancel.find((x) => x.itemId === key);
//     if (!match) return item;

//     const oldQty = Number(item.quantity ?? item.Quantity ?? 1);
//     const cancelQty = Math.min(match.qty, oldQty);

//     const remainingQty = oldQty - cancelQty;

//     return {
//       ...item,
//       quantity: remainingQty,
//       Quantity: remainingQty,
//       cancelledQty: (item.cancelledQty || 0) + cancelQty,
//       itemStatus:
//         remainingQty === 0 ? "Cancelled" : "Partially Cancelled",
//     };
//   });

//   const anyRemaining = order.items.some(
//     (it) => Number(it.quantity ?? it.Quantity ?? 0) > 0
//   );

//   order.orderStatus = anyRemaining ? "Processing" : "Cancelled";
// },

//   // add by aman

//   updateOrderStatus(state, action) {
//     const { orderId, orderStatus } = action.payload;

//     state.list = state.list.map((o) =>
//       o.orderId === orderId ? { ...o, orderStatus } : o,
//     );

//     // if you are saving in localStorage
//     localStorage.setItem("orders", JSON.stringify(state.list));
//   },
// });

// export const { resetOrder, clearOrders, cancelOrder, updateOrderStatus } =
//   orderSlice.actions;
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
    await new Promise((res) => setTimeout(res, 300));
    return { ...orderData, status: "success" };
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    loading: false,
    error: null,
    list: loadOrders(),
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

    cancelOrder(state, action) {
      const orderId = action.payload;

      state.list = state.list.map((order) =>
        order.orderId === orderId
          ? { ...order, orderStatus: "Cancelled" }
          : order,
      );

      saveOrders(state.list);
    },

    requestReturnItems(state, action) {
      const { orderId, itemsToReturn } = action.payload;

      const order = state.list.find((o) => o.orderId === orderId);
      if (!order) return;

      order.items = (order.items || []).map((item, i) => {
        const req = itemsToReturn.find((x) => x.idx === i);
        if (!req) return item;

        return {
          ...item,
          returnRequestedQty: (item.returnRequestedQty || 0) + req.qty,
          returnStatus: "Requested",
          returnReason: req.reason,
          returnPhotos: req.photos, // base64 list (demo)
          returnComment: req.comment,
        };
      });

      // optional: order-level flag
      order.returnStatus = "Requested";

      saveOrders(state.list);
    },

    // ✅ FIXED: now inside reducers
    cancelOrderItems(state, action) {
      const { orderId, itemsToCancel } = action.payload;

      const order = state.list.find((o) => o.orderId === orderId);
      if (!order) return;

      order.items = (order.items || []).map((item, idx) => {
        const match = itemsToCancel.find((x) => x.idx === idx);
        if (!match) return item;

        const oldQty = Number(item.quantity ?? item.Quantity ?? 1);
        const cancelQty = Math.min(Number(match.qty || 0), oldQty);
        const remainingQty = oldQty - cancelQty;

        return {
          ...item,
          quantity: remainingQty,
          Quantity: remainingQty,
          cancelledQty: (item.cancelledQty || 0) + cancelQty,
          itemStatus: remainingQty === 0 ? "Cancelled" : "Partially Cancelled",
        };
      });

      const anyRemaining = order.items.some(
        (it) => Number(it.quantity ?? it.Quantity ?? 0) > 0,
      );

      order.orderStatus = anyRemaining ? "Processing" : "Cancelled";

      saveOrders(state.list);
    },

    // ✅ FIXED: now inside reducers
    updateOrderStatus(state, action) {
      const { orderId, orderStatus } = action.payload;

      state.list = state.list.map((o) =>
        o.orderId === orderId ? { ...o, orderStatus } : o,
      );

      saveOrders(state.list);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
        saveOrders(state.list);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  resetOrder,
  clearOrders,
  cancelOrder,
  cancelOrderItems,
  updateOrderStatus,
  requestReturnItems,
} = orderSlice.actions;

export default orderSlice.reducer;
