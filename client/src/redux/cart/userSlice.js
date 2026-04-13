import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false, // general loading
  authLoading: false, // 🔥 for login only
  error: null,
  authChecked: false,
};

// 🔹 Thunks
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await userService.login(credentials);
      return res.data; // only login response
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      const res = await userService.logout();
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout failed",
      );
    }
  },
);

export const getUserDetails = createAsyncThunk(
  "user/getDetails",
  async (_, thunkAPI) => {
    try {
      const user = await userService.getUser();
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

export const updateUserDetails = createAsyncThunk(
  "user/updateDetails",
  async (data, thunkAPI) => {
    try {
      await userService.updateUser(data);
      const refreshedUser = await userService.getUser();
      return refreshedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update failed",
      );
    }
  },
);

export const updateProfileImage = createAsyncThunk(
  "user/updateProfileImage",
  async (formData, thunkAPI) => {
    try {
      await userService.updateProfileImage(formData);
      return await userService.getUser(); // 🔥 return fresh user
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile image update failed",
      );
    }
  },
);

// 🔹 Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    forceLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
      state.loading = false;
      state.authLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.authLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET USER
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(getUserDetails.rejected, (state) => {
        state.loading = false;
        state.authChecked = true;
      })

      // UPDATE USER
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE PROFILE IMAGE
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      });
  },
});

export const { forceLogout, clearError } = userSlice.actions;
export default userSlice.reducer;
