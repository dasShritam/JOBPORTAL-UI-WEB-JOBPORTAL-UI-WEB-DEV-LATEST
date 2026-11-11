import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const verifyOtp: any = createAsyncThunk(
  "VerifyOtp",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.AUTH_VERIFY_OTP, userInfo);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const verifyJSOtpSl = createSlice({
  name: "VerifyOtp",
  initialState: {
    res: [],
    loadingState: false,
    otpError: "",
  },
  reducers: {
    reset: (state) => {
      state.res = [];
      state.loadingState = false;
      state.otpError = "";
    },
  },
  extraReducers: {
    [verifyOtp.pending]: (state) => {
      state.loadingState = true;
    },
    [verifyOtp.fulfilled]: (state, action) => {
      state.loadingState = false;
      state.res = action.payload;
      state.otpError = "";
    },
    [verifyOtp.rejected]: (state, action) => {
      state.loadingState = false;
      state.otpError = action.payload;
      state.res = [];
    },
  },
});

export const { reset: resetVerifyOtpSl } = verifyJSOtpSl.actions;
export const JobSeekerVerifyotpSlice = verifyJSOtpSl.reducer;
