import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

//Job counts
export const fetchJobSummary: any = createAsyncThunk(
  "JobSummary",
  async (JobSummary: any) => {
    try {
      const { data } = await API.get(API_ENDPOINTS.JOB_JOB_SUMMARY, JobSummary);
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const JobSummarySlice = createSlice({
  name: "JobSummary",
  initialState: {
    jbSRes: [],
    jbload: true,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.jbSRes = [];
      state.jbload = true;
      state.error = "";
    },
  },
  extraReducers: {
    [fetchJobSummary.pending]: (state, action) => {
      state.jbload = true;
    },
    [fetchJobSummary.fulfilled]: (state, action) => {
      state.jbload = false;
      state.jbSRes = action.payload;
      state.error = "";
    },
    [fetchJobSummary.rejected]: (state, action) => {
      state.jbload = false;
      state.error = action.payload;
      state.jbSRes = [];
    },
  },
});

//Matching Jobs
export const fetchMatchingJobs: any = createAsyncThunk(
  "MatchingJobSummary",
  async (MatchingJobSummary: any) => {
    try {
      const { data } = await API.get(
        API_ENDPOINTS.JOB_MATCHING_JOBS,
        MatchingJobSummary
      );
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const MatchingJobsSlice = createSlice({
  name: "MatchingJobSummary",
  initialState: {
    matchingUserJobs: [],
    jsMatchingloading: true,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.matchingUserJobs = [];
      state.jsMatchingloading = true;
      state.error = "";
    },
  },
  extraReducers: {
    [fetchMatchingJobs.pending]: (state, action) => {
      state.jsMatchingloading = true;
    },
    [fetchMatchingJobs.fulfilled]: (state, action) => {
      state.jsMatchingloading = false;
      state.matchingUserJobs = action.payload;
      state.error = "";
    },
    [fetchMatchingJobs.rejected]: (state, action) => {
      state.jsMatchingloading = false;
      state.error = action.payload;
      state.matchingUserJobs = [];
    },
  },
});

export const { reset: JobSummary } = JobSummarySlice.actions;
export const { reset: MatchingJobSummary } = MatchingJobsSlice.actions;

export const DashboardJobSummarySlice = JobSummarySlice.reducer,
  DashboardMatchingJobSlice = MatchingJobsSlice.reducer;
