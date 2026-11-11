import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const userAccessibility: any = createAsyncThunk(
  "userAccessibility",
  async (datas: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_USER_ACCESSIBILITY,
        datas
      );
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);
const userAccessibilitySlicee = createSlice({
  name: "userAccessibility",
  initialState: {
    res: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = "";
      state.res = [];
    },
  },
  extraReducers: {
    [userAccessibility.pending]: (state, action) => {
      state.loading = true;
    },
    [userAccessibility.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [userAccessibility.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.res = [];
    },
  },
});
export const companyDetails: any = createAsyncThunk(
  "companyDetails",
  async (datas: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_FETCH_COMPANY, datas);
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);
const companyDetailSlicee = createSlice({
  name: "companyDetails",
  initialState: {
    res: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = "";
      state.res = [];
    },
  },
  extraReducers: {
    [companyDetails.pending]: (state, action) => {
      state.loading = true;
    },
    [companyDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [companyDetails.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.res = [];
    },
  },
});

export const employersDetails: any = createAsyncThunk(
  "employersDetails",
  async (datas: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_FETCH_COMPANY_USER,
        datas
      );
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);
const employersDetailsSlicee = createSlice({
  name: "employersDetails",
  initialState: {
    res: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = "";
      state.res = [];
    },
  },
  extraReducers: {
    [employersDetails.pending]: (state, action) => {
      state.loading = true;
    },
    [employersDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [employersDetails.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.res = [];
    },
  },
});

export const resendMail: any = createAsyncThunk(
  "resendMail",
  async (id: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.AUTH_RESEND_VER_LINK, id);
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);
const resendMailSlicee = createSlice({
  name: "resendMail",
  initialState: {
    res: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = "";
      state.res = [];
    },
  },
  extraReducers: {
    [resendMail.pending]: (state, action) => {
      state.loading = true;
    },
    [resendMail.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [resendMail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.res = [];
    },
  },
});

export const userAccessibilitySlice = userAccessibilitySlicee.reducer,
  companyDetailSlice = companyDetailSlicee.reducer,
  employersDetailsSlice = employersDetailsSlicee.reducer,
  resendMailSlice = resendMailSlicee.reducer;
export const { reset: resetuserAccessibility } =
    userAccessibilitySlicee.actions,
  { reset: resetResendMail } = resendMailSlicee.actions,
  { reset: resetCompanyUserManage } = companyDetailSlicee.actions,
  { reset: resetEmployerUserProfileMange } = employersDetailsSlicee.actions;
