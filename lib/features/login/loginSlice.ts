import { CONST } from "@/lib/const";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
interface AuthState {
  user: any | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

// Thunk to handle user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    loginData: { email: string; password: string; mobileDeviceToken: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(CONST.loginURL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to login: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();
      return { token: data.token, user: data.user };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: any }>) => {
          state.status = "succeeded";
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export const selectAuthToken = (state: any) => state.auth.token;
export const selectAuthStatus = (state: any) => state.auth.status;
export const selectAuthError = (state: any) => state.auth.error;
export const selectAuthUser = (state: any) => state.auth.user;

export default authSlice.reducer;
