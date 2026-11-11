import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const sendOtp: any = createAsyncThunk(
  "SendOtp",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.AUTH_SEND_OTP, userInfo);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const sendOtpSlice = createSlice({
  name: "SendOtp",
  initialState: {
    otpRes: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.error = "";
      state.loading = false;
      state.otpRes = [];
    },
  },
  extraReducers: {
    [sendOtp.pending]: (state) => {
      state.loading = true;
    },
    [sendOtp.fulfilled]: (state, action) => {
      state.loading = false;
      state.otpRes = action.payload;
      state.error = "";
    },
    [sendOtp.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.otpRes = [];
    },
  },
});
export const { reset: resetsendotpAction } = sendOtpSlice.actions;
export default sendOtpSlice.reducer;
