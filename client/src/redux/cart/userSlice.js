import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

// Initial state with token persistence
const storedUser = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const initialState = {
  user: storedUser || null,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

// 🔹 Thunks
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await userService.login(credentials);

      // Fetch full user immediately after login
      const fullUser = await userService.getUser();
      localStorage.setItem("user", JSON.stringify(fullUser));

      return { user: fullUser, token: res.token };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "user/getDetails",
  async (_, thunkAPI) => {
    try {
      const user = await userService.getUser();
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "user/updateDetails",
  async (data, thunkAPI) => {
    try {
      await userService.updateUser(data);

      // Always fetch latest full user after update
      const refreshedUser = await userService.getUser();
      localStorage.setItem("user", JSON.stringify(refreshedUser));
      return refreshedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update failed"
      );
    }
  }
);

// 🔹 Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      userService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get user details
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update user
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // ✅ always full user
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export actions & reducer
export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
