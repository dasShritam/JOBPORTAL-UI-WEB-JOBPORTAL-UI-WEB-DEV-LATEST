import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const getJobApplicationStatus: any = createAsyncThunk(
  "getJobApplication",
  async (dat) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_FETCH_JOB_APPLICATION,
        dat
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const JobApplicationSlicee = createSlice({
  name: "getJobApplication",
  initialState: {
    ApplicationStatuss: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = "";
      state.ApplicationStatuss = [];
    },
  },
  extraReducers: {
    [getJobApplicationStatus.pending]: (state, action) => {
      state.loading = true;
    },
    [getJobApplicationStatus.fulfilled]: (state, action) => {
      state.ApplicationStatuss = action.payload;
      state.error = "";
      state.loading = false;
    },
    [getJobApplicationStatus.error]: (state, action) => {
      state.ApplicationStatuss = [];
      state.error = action.payload.response.data.message;
      state.loading = false;
    },
  },
});

export const getJobAddApplicationStatus: any = createAsyncThunk(
  "getJobApplications",
  async (dat) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_FETCH_JOB_APPLICATION,
        dat
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const JobAdditionalApplicationSlicee = createSlice({
  name: "getJobApplications",
  initialState: {
    AddApplicationStatuss: [],
    loadingA: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingA = false;
      state.error = "";
      state.AddApplicationStatuss = [];
    },
  },
  extraReducers: {
    [getJobAddApplicationStatus.pending]: (state, action) => {
      state.loadingA = true;
    },
    [getJobAddApplicationStatus.fulfilled]: (state, action) => {
      state.AddApplicationStatuss = action.payload;
      state.error = "";
      state.loadingA = false;
    },
    [getJobAddApplicationStatus.error]: (state, action) => {
      state.AddApplicationStatuss = [];
      state.error = action.payload.response.data.message;
      state.loadingA = false;
    },
  },
});

export const getJobAppliedCount: any = createAsyncThunk(
  "getJobAppliedCount",
  async (dat) => {
    try {
      const { data } = await API.get(API_ENDPOINTS.MAC_JOB_STATISTICS);

      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const JobAppliedCountSlicee = createSlice({
  name: "getJobAppliedCount",
  initialState: {
    AppliedCount: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [getJobAppliedCount.pending]: (state, action) => {
      state.loading = true;
    },
    [getJobAppliedCount.fulfilled]: (state, action) => {
      state.AppliedCount = action.payload;
      state.error = "";
      state.loading = false;
    },
    [getJobAppliedCount.error]: (state, action) => {
      state.AppliedCount = [];
      state.error = action.payload.response.data.message;
      state.loading = false;
    },
  },
});

export const getEmpDetailsStatus: any = createAsyncThunk(
  "getJobFollow",
  async (dat) => {
    try {
      const { data } = await API.patch(API_ENDPOINTS.MAC_JOB_FOLLOW, dat);

      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const EmplDetailsSlicee = createSlice({
  name: "getJobFollow",
  initialState: {
    EmpDetailStatus: [],
    loadingE: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingE = false;
      state.error = "";
      state.EmpDetailStatus = [];
    },
  },
  extraReducers: {
    [getEmpDetailsStatus.pending]: (state, action) => {
      state.loadingE = true;
    },
    [getEmpDetailsStatus.fulfilled]: (state, action) => {
      state.EmpDetailStatus = action.payload;
      state.error = "";
      state.loadingE = false;
    },
    [getEmpDetailsStatus.error]: (state, action) => {
      state.EmpDetailStatus = [];
      state.error = action.payload.response.data.message;
      state.loadingE = false;
    },
  },
});

export const { reset: resetJobApplication } = JobApplicationSlicee.actions,
  { reset: resetEmplDetails } = EmplDetailsSlicee.actions,
  JobApplicationSlice = JobApplicationSlicee.reducer,
  JobAdditionalApplicationSlice = JobAdditionalApplicationSlicee.reducer,
  JobAppliedCountSlice = JobAppliedCountSlicee.reducer,
  EmplDetailsSlice = EmplDetailsSlicee.reducer;
