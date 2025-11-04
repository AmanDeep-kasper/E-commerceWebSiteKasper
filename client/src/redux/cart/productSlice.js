import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await productService.getAllProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Add product
export const addProduct = createAsyncThunk(
  "products/add",
  async (formData, thunkAPI) => {
    try {
      return await productService.addProduct(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add product"
      );
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Fetch product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, thunkAPI) => {
    try {
      return await productService.getProductById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

// Fetch product by slug
export const fetchProductBySlug = createAsyncThunk(
  "products/fetchBySlug",
  async (route, thunkAPI) => {
    try {
      return await productService.getProductBySlug(route);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 fetchAllProducts
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 addProduct
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        // push the new product into list
        if (action.payload?.product) {
          state.products.push(action.payload.product);
        } else {
          state.products.push(action.payload);
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.product || action.payload;

        // Find the product by ID or UUID and replace it
        const index = state.products.findIndex(
          (p) => p._id === updated._id || p.uuid === updated.uuid
        );

        if (index !== -1) {
          state.products[index] = updated;
        } else {
          state.products.push(updated);
        }

        state.selectedProduct = updated;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 fetchProductBySlug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
