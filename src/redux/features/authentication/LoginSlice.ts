import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { stringify } from "qs";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";
import { InitializeSocket } from "../../../context/WebsocketContext";

/*Admin Login*/
export const adminLogin: any = createAsyncThunk("AdminLogin", async (userInfo: any) => {
  try {
    let body = new URLSearchParams();
    body.set("authType", userInfo.authType);
    body.set("authKey", userInfo.authKey);
    body.set("pwd", userInfo.pwd);
    body.append("state[uniqueid]", userInfo.state.uniqueid);
    body.append("state[ondemandpage]", userInfo.state.ondemandpage);

    const { data } = await API.post(API_ENDPOINTS.AUTH_ADMIN_SIGN_IN, body.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return data;
  } catch (error: any) {
    return error;
  }
});

const adminLoginSl = createSlice({
  name: "AdminLogin",
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
    [adminLogin.pending]: (state) => {
      state.loading = true;
    },
    [adminLogin.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [adminLogin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.res = [];
    },
  },
});

/*----Admin Login----*/

/*Job Seeker Login*/
export const jobSeekerLogin: any = createAsyncThunk("JobSeekerLogin", async (userInfo: any) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.AUTH_JS_SIGN_IN, stringify(userInfo), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

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
});

const jobSeekerLoginSl = createSlice({
  name: "JobSeekerLogin",
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
    [jobSeekerLogin.pending]: (state) => {
      state.loading = true;
    },
    [jobSeekerLogin.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [jobSeekerLogin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.res = [];
    },
  },
});
/*----Job Seeker Login----*/

/*JS SOCAIL MEDIA SIGIN START*/
export const jsSocailMediaLogin: any = createAsyncThunk("JsSocMediaLogin", async (userInfo: any) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.AUTH_JS_SOCIAL_MEDIA_SIGN_IN, stringify(userInfo), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

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
});

const jsSocailMediaLoginSl = createSlice({
  name: "JsSocMediaLogin",
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
    [jsSocailMediaLogin.pending]: (state) => {
      state.loading = true;
    },
    [jsSocailMediaLogin.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [jsSocailMediaLogin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.res = [];
    },
  },
});
/*JS SOCIAL MEDIA SIGN IN END*/

/*Employer Login*/
export const employerLogin: any = createAsyncThunk("EmployerLogin", async (userInfo: any) => {
  try {
    let body = new URLSearchParams();
    body.set("authType", userInfo.authType);
    body.set("authKey", userInfo.authKey);
    body.set("pwd", userInfo.pwd);
    body.append("state[uniqueid]", userInfo.state.uniqueid);
    body.append("state[ondemandpage]", userInfo.state.ondemandpage);
    const { data } = await API.post(API_ENDPOINTS.AUTH_EMP_SIGN_IN, body.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

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
});

const employerLoginSl = createSlice({
  name: "EmployerLogin",
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
    [employerLogin.pending]: (state) => {
      state.loading = true;
    },
    [employerLogin.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [employerLogin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.res = [];
    },
  },
});
/*---Employer Login----*/

/*Otp Login*/
export const optLogin: any = createAsyncThunk("OtpLogin", async (userInfo: any) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.AUTH_OTP_SIGN_IN, userInfo);
    return data;
  } catch (error) {
    return error;
  }
});

const otpLoginSl = createSlice({
  name: "OtpLogin",
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
    },
  },
  extraReducers: {
    [optLogin.pending]: (state, action) => {
      state.loading = true;
    },
    [optLogin.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [optLogin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.res = [];
    },
  },
});
/*---Otp Login---*/
export const { reset: resetActionCreator } = jobSeekerLoginSl.actions;
export const { reset: resetSendOtp } = otpLoginSl.actions;
export const { reset: resetEmpLogActionCreator } = employerLoginSl.actions;
export const { reset: resetAdminLogActionCreator } = adminLoginSl.actions;
export const { reset: resetSocialMediaLogin } = jsSocailMediaLoginSl.actions;
export const jobSeekerLoginSlice = jobSeekerLoginSl.reducer,
  employerLoginSlice = employerLoginSl.reducer,
  adminLoginSlice = adminLoginSl.reducer,
  otpLoginSlice = otpLoginSl.reducer,
  jsSocMediaLoginslice = jsSocailMediaLoginSl.reducer;
