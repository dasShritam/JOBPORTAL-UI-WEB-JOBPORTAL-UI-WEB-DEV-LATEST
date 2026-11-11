import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";
import API from "../../../config/axios.config";

export const patchResetPassword: any = createAsyncThunk(
  "ResetPassword",
  async (resetPwdDetails: any) => {
    try {

      let body = new URLSearchParams()
      body.set('oldPassword', resetPwdDetails.oldPassword);
      body.set('newPassword', resetPwdDetails.newPassword);

      const { data } = await API.patch(API_ENDPOINTS.AUTH_RESET_PASSWORD, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const ResetPasswordSl = createSlice({
  name: "ResetPassword",
  initialState: {
    ResetPwd: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = "";
      state.ResetPwd = [];
    },
  },
  extraReducers: {
    [patchResetPassword.pending]: (state, action) => {
      state.loading = true;
    },
    [patchResetPassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.ResetPwd = action.payload;
      state.error = "";
    },
    [patchResetPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.ResetPwd = [];
    },
  },
});

export const forgetPwd: any = createAsyncThunk(
  "ForgetPassword",
  async (resetPwdDetails: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.AUTH_FORGET_PASSWORD, resetPwdDetails);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const forgetPwdSl = createSlice({
  name: "ForgetPassword",
  initialState: {
    forgetPass: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = "";
      state.forgetPass = [];
    },
  },
  extraReducers: {
    [forgetPwd.pending]: (state, action) => {
      state.loading = true;
    },
    [forgetPwd.fulfilled]: (state, action) => {
      state.loading = false;
      state.forgetPass = action.payload;
      state.error = "";
    },
    [forgetPwd.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.forgetPass = [];
    },
  },
});

export const { reset: forgetPwdActionCreator } = forgetPwdSl.actions;
export const { reset: resetPwdActionCreator } = ResetPasswordSl.actions;
export const resetPasswordSlice = ResetPasswordSl.reducer,
  forgetPwdSlice = forgetPwdSl.reducer;
