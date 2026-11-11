import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const findJob: any = createAsyncThunk("SearchJob", async (datas: any) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.MAC_JOB_SEARCH_JOB, datas);
    return data;
  } catch (error: any) {
    return error;
  }
});

export const authfindJob: any = createAsyncThunk(
  "FindJob",
  async (datas: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_JOB_FETCH_JOB, datas);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const JobSearchSliceSl = createSlice({
  name: "SearchJob",
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
    [findJob.pending]: (state, action) => {
      state.loading = true;
    },
    [findJob.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [findJob.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.res = [];
    },
  },
});

const AuthJobSearchSliceSl = createSlice({
  name: "FindJob",
  initialState: {
    response: [],
    load: false,
    err: "",
  },
  reducers: {
    reset: (state) => {
      state.load = false;
      state.response = [];
      state.err = "";
    },
  },
  extraReducers: {
    [authfindJob.pending]: (state, action) => {
      state.load = true;
    },
    [authfindJob.fulfilled]: (state, action) => {
      state.load = false;
      state.response = action.payload;
      state.err = "";
    },
    [authfindJob.rejected]: (state, action) => {
      state.load = false;
      state.err = action.payload.response.data.message;
      state.response = [];
    },
  },
});

export const JobSearchSlice = JobSearchSliceSl.reducer;
export const { reset: resetJobSearchCreator } = JobSearchSliceSl.actions;

export const AuthJobSearchSlice = AuthJobSearchSliceSl.reducer;
export const { reset: resetAuthJobSearchCreator } =
  AuthJobSearchSliceSl.actions;
