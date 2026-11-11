import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { stringify } from 'qs'
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";
import { InitializeSocket } from "../../../context/WebsocketContext";

export const jobSeekerRegister: any = createAsyncThunk(
  "JobSeekerRegister",
  async (userInfo: any) => {
    try {

      const { data } = await API.post(API_ENDPOINTS.AUTH_JS_REG, stringify(userInfo), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
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
  }
);

const jobSeekerRegsterSlice = createSlice({
  name: "JobSeekerRegister",
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
    [jobSeekerRegister.pending]: (state) => {
      state.loading = true;
    },
    [jobSeekerRegister.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [jobSeekerRegister.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.res = [];
    },
  },
});

export const jobSeekerSelfRegister: any = createAsyncThunk(
  "JobSeekerSelfRegister",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.AUTH_JS_SELF_REG,
        userInfo, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const jobSeekerSelfRegsterSlice = createSlice({
  name: "JobSeekerSelfRegister",
  initialState: {
    response: [],
    load: false,
    errors: "",
  },
  reducers: {
    reset: (state) => {
      state.load = false;
      state.response = [];
      state.errors = "";
    },
  },
  extraReducers: {
    [jobSeekerSelfRegister.pending]: (state) => {
      state.load = true;
    },
    [jobSeekerSelfRegister.fulfilled]: (state, action) => {
      state.load = false;
      state.response = action.payload;
      state.errors = "";
    },
    [jobSeekerSelfRegister.rejected]: (state, action) => {
      state.load = false;
      state.errors = action.payload;
      state.response = [];
    },
  },
});

// export default jobSeekerRegsterSlice.reducer;
export const { reset: resetRegActionCreator } = jobSeekerRegsterSlice.actions;
export const { reset: resetStateCreator } = jobSeekerSelfRegsterSlice.actions;
export const jobSeekerRegsterSsoSlice = jobSeekerRegsterSlice.reducer,
  jobseekerSelfRegistrationSlice = jobSeekerSelfRegsterSlice.reducer;
