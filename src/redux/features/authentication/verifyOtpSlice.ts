import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";
import API from "../../../config/axios.config";
import { InitializeSocket } from "../../../context/WebsocketContext";

export const verifyOtpAndCrtToken: any = createAsyncThunk(
  "VerifyOtpAndCreateToken",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.AUTH_VERIFY_AND_CREATE_TOKEN, userInfo);
      if (data.code === 200) {
        /*Init webscoket after login only*/
        InitializeSocket(data.data.access_token);
        sessionStorage.setItem("access_token", data.data.access_token);
        sessionStorage.setItem("refresh_token", data.data.refresh_token);
        sessionStorage.setItem("state", JSON.stringify(data.data.state));
      }
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const verifyOtpCrtTokenSl = createSlice({
  name: "VerifyOtpAndCreateToken",
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
    [verifyOtpAndCrtToken.pending]: (state) => {
      state.loading = true;
    },
    [verifyOtpAndCrtToken.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [verifyOtpAndCrtToken.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.res = [];
    },
  },
});

export const verifyForgetPwdOtp: any = createAsyncThunk(
  "verifyForgetPwdOtp",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.AUTH_VERIFY_FORGET_PWD, userInfo);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const verifyForgetPwdOtpSl = createSlice({
  name: "verifyForgetPwdOtp",
  initialState: {
    res: [],
    loading: false,
    error: "",
  },
  reducers: {
    resetPwd: (state) => {
      state.loading = false;
      state.res = [];
      state.error = "";
    },
  },
  extraReducers: {
    [verifyForgetPwdOtp.pending]: (state) => {
      state.loading = true;
    },
    [verifyForgetPwdOtp.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [verifyForgetPwdOtp.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.res = [];
    },
  },
});

export const verifyOtp: any = createAsyncThunk(
  "verifyOtp",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.AUTH_VERIFY_OTP, userInfo);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const verifyOtpSl = createSlice({
  name: "verifyOtp",
  initialState: {
    res: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.res = [];
      state.error = "";
    },
  },
  extraReducers: {
    [verifyOtp.pending]: (state) => {
      state.loading = true;
    },
    [verifyOtp.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [verifyOtp.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.res = [];
    },
  },
});

export const { reset: resetForgetPwdState } = verifyOtpSl.actions;
export const { resetPwd: resetVerifyPwdState } = verifyForgetPwdOtpSl.actions;
export const { reset: resetVerifyOtp } = verifyOtpCrtTokenSl.actions
export const verifyOtpCrtTokenSlice = verifyOtpCrtTokenSl.reducer,
  verifyForgetPwdOtpSlice = verifyForgetPwdOtpSl.reducer,
  verifyOtpSlice = verifyOtpSl.reducer;
