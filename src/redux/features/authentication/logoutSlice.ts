import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const logout: any = createAsyncThunk(
  "logout",
  async (resetPwdDetails: any) => {
    try {
      const { data } = await API.patch(API_ENDPOINTS.AUTH_LOGOUT, resetPwdDetails);
      if (data.code === 200) {
        sessionStorage.clear();
      }
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const logoutSlice = createSlice({
  name: "logout",
  initialState: {
    res: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.res = [];
      state.loading = false;
      state.error = "";
    }
  },
  extraReducers: {
    [logout.pending]: (state, action) => {
      state.loading = true;
    },
    [logout.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [logout.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.res = [];
    },
  },
});
export const { reset: resetLogout } = logoutSlice.actions
export default logoutSlice.reducer;
