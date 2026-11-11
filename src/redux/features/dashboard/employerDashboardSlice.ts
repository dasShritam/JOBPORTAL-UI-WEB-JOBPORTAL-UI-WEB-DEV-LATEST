import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const getJobPostStatics: any = createAsyncThunk(
  "JobPostStatics",
  async (JobPostcount: any) => {
    try {
      const { data } = await API.get(
        API_ENDPOINTS.JOB_POST_STATICS,
        JobPostcount
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const JobPostStaticsSL = createSlice({
  name: "JobPostStatics",
  initialState: {
    JobPostStatics: [],
    JPloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.JobPostStatics = [];
      state.JPloading = true;
      state.error = "";
    },
  },

  extraReducers: {
    [getJobPostStatics.pending]: (state) => {
      state.JPloading = true;
    },
    [getJobPostStatics.fulfilled]: (state, action) => {
      state.JPloading = false;
      state.JobPostStatics = action.payload;
      state.error = "";
    },
    [getJobPostStatics.rejected]: (state, action) => {
      state.JPloading = false;
      state.error = action.payload;
      state.JobPostStatics = [];
    },
  },
});

export const getJobPostResponse: any = createAsyncThunk(
  "JobPostResponse",
  async (JobPostResCount: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.JOB_POST_RESPONSE,
        JobPostResCount
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const JobPostResponseSL = createSlice({
  name: "JobPostResponse",
  initialState: {
    JobPostResponse: [],
    JRloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.JobPostResponse = [];
      state.JRloading = true;
      state.error = "";
    },
  },

  extraReducers: {
    [getJobPostResponse.pending]: (state) => {
      state.JRloading = true;
    },
    [getJobPostResponse.fulfilled]: (state, action) => {
      state.JRloading = false;
      state.JobPostResponse = action.payload;
      state.error = "";
    },
    [getJobPostResponse.rejected]: (state, action) => {
      state.JRloading = false;
      state.error = action.payload;
      state.JobPostResponse = [];
    },
  },
});

export const getJobResponsePost: any = createAsyncThunk(
  "getJobResponsePost",
  async (JobPostResCount: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.JOB_POST_RESPONSE,
        JobPostResCount
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const getJobResponsePostSL = createSlice({
  name: "getJobResponsePost",
  initialState: {
    JobResPost: [],
    jobloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.JobResPost = [];
      state.jobloading = true;
      state.error = "";
    },
  },

  extraReducers: {
    [getJobResponsePost.pending]: (state) => {
      state.jobloading = true;
    },
    [getJobResponsePost.fulfilled]: (state, action) => {
      state.jobloading = false;
      state.JobResPost = action.payload;
      state.error = "";
    },
    [getJobResponsePost.rejected]: (state, action) => {
      state.jobloading = false;
      state.error = action.payload;
      state.JobResPost = [];
    },
  },
});

export const { reset: JobPostStatics } = JobPostStaticsSL.actions,
  { reset: JobPostResponse } = JobPostResponseSL.actions;

export const JobPostStaticsSlice = JobPostStaticsSL.reducer,
  JobPostResponseSlice = JobPostResponseSL.reducer,
  getJobResponsePostSlice = getJobResponsePostSL.reducer;
