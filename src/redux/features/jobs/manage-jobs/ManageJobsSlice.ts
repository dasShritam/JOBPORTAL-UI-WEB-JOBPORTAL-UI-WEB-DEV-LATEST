import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const manageJobsData: any = createAsyncThunk(
  "ManageJobs",
  async (dataInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_LISTING_JOB,
        dataInfo
      );
      return data.data;
    } catch (error: any) {
      return error;
    }
  }
);
const manageJobSlice = createSlice({
  name: "ManageJobs",
  initialState: {
    allManageJobs: [],
    manageJobLoading: true,
    manageJobError: "",
  },
  reducers: {
    reset: (state) => {
      state.allManageJobs = [];
      state.manageJobLoading = true;
      state.manageJobError = "";
    },
  },
  extraReducers: {
    [manageJobsData.pending]: (state, action) => {
      state.manageJobLoading = true;
    },
    [manageJobsData.fulfilled]: (state, action) => {
      state.allManageJobs = action.payload;
      state.manageJobError = "";
      state.manageJobLoading = false;
    },
    [manageJobsData.error]: (state, action) => {
      state.allManageJobs = [];
      state.manageJobError = action.payload.response.data.message;
      state.manageJobLoading = false;
    },
  },
});

export const totalJobApplicantsData: any = createAsyncThunk(
  "TotalJobApplicants",
  async (dataInfo: any) => {
    try {
      const res = await API.post(
        API_ENDPOINTS.MAC_JOB_APPLICTION_JOB,
        dataInfo,
        { responseType: "text" }
      ),
        filename = `applicants-list-${new Date().getTime()}`,
        blob = new Blob([res.data], { type: "text/csv" }),
        url = window.URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      // return data;
    } catch (error: any) {
      return error;
    }
  }
);
const totalJobApplicantsSlice = createSlice({
  name: "TotalJobApplicants",
  initialState: {
    totalJobsApplicants: [],
    totalJobApplicantsLoading: false,
    totalJobApplicantsError: "",
  },
  reducers: {
    reset: (state) => {
      state.totalJobsApplicants = [];
      state.totalJobApplicantsLoading = true;
      state.totalJobApplicantsError = "";
    },
  },
  extraReducers: {
    [totalJobApplicantsData.pending]: (state, action) => {
      state.totalJobApplicantsLoading = true;
    },
    [totalJobApplicantsData.fulfilled]: (state, action) => {
      state.totalJobsApplicants = action.payload;
      state.totalJobApplicantsError = "";
      state.totalJobApplicantsLoading = false;
    },
    [totalJobApplicantsData.error]: (state, action) => {
      state.totalJobsApplicants = [];
      state.totalJobApplicantsError = action.payload.response.data.message;
      state.totalJobApplicantsLoading = false;
    },
  },
});

export const empStatisticsDatas: any = createAsyncThunk(
  "EmpStatistics",
  async (dataInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_EMP_STATISTICS,
        dataInfo
      );
      return data.data;
    } catch (error: any) {
      return error;
    }
  }
);
const empStatisticsSlice = createSlice({
  name: "EmpStatistics",
  initialState: {
    empStatisticsData: [],
    empStatisticsLoading: false,
    empStatisticsError: "",
  },
  reducers: {
    reset: (state) => {
      state.empStatisticsLoading = false;
      state.empStatisticsError = "";
      state.empStatisticsData = [];
    },
  },
  extraReducers: {
    [empStatisticsDatas.pending]: (state, action) => {
      state.empStatisticsLoading = true;
    },
    [empStatisticsDatas.fulfilled]: (state, action) => {
      state.empStatisticsData = action.payload;
      state.empStatisticsError = "";
      state.empStatisticsLoading = false;
    },
    [empStatisticsDatas.error]: (state, action) => {
      state.empStatisticsData = [];
      state.empStatisticsError = action.payload.response.data.message;
      state.empStatisticsLoading = false;
    },
  },
});

export const updateJobStatus: any = createAsyncThunk(
  "UpdateJobs",
  async (dataInfo: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JOB_UPDATE_JOB_STATUS,
        dataInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);
const updateJobStatusSlice = createSlice({
  name: "UpdateJobs",
  initialState: {
    updatejobsStatus: [],
    updatejobsStatusLoading: false,
    updatejobsStatusError: "",
  },
  reducers: {
    reset: (state) => {
      state.updatejobsStatusLoading = false;
      state.updatejobsStatusError = "";
      state.updatejobsStatus = [];
    },
  },
  extraReducers: {
    [updateJobStatus.pending]: (state, action) => {
      state.updatejobsStatusLoading = true;
    },
    [updateJobStatus.fulfilled]: (state, action) => {
      state.updatejobsStatus = action.payload;
      state.updatejobsStatusError = "";
      state.updatejobsStatusLoading = false;
    },
    [updateJobStatus.error]: (state, action) => {
      state.updatejobsStatus = [];
      state.updatejobsStatusError = action.payload.response.data.message;
      state.updatejobsStatusLoading = false;
    },
  },
});

export const listingMinimalJobs: any = createAsyncThunk(
  "ListingJobs",
  async (dataInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_LISTING_JOB,
        dataInfo
      );
      return data.data;
    } catch (error: any) {
      return error;
    }
  }
);
const listingMinimalJobsSlicee = createSlice({
  name: "ListingJobs",
  initialState: {
    allManageJobs: [],
    manageJobLoading: false,
    manageJobError: "",
  },
  reducers: {
    reset: (state) => {
      state.allManageJobs = [];
      state.manageJobLoading = true;
      state.manageJobError = "";
    }
  },
  extraReducers: {
    [listingMinimalJobs.pending]: (state, action) => {
      state.manageJobLoading = true;
    },
    [listingMinimalJobs.fulfilled]: (state, action) => {
      state.allManageJobs = action.payload;
      state.manageJobError = "";
      state.manageJobLoading = false;
    },
    [listingMinimalJobs.error]: (state, action) => {
      state.allManageJobs = [];
      state.manageJobError = action.payload.response.data.message;
      state.manageJobLoading = false;
    },
  },
});

export const { reset: resetManageJobs } = manageJobSlice.actions;
export const { reset: resetUpdateStatus } = updateJobStatusSlice.actions;
export const { reset: resetEmpStatistics } = empStatisticsSlice.actions;
export const { reset: resetTotalApplicants } = totalJobApplicantsSlice.actions;
export const { reset: resetlistingMinimalJob } = listingMinimalJobsSlicee.actions;



export const ManageJobsSlice = manageJobSlice.reducer,
  TotalJobsApplicantsSlice = totalJobApplicantsSlice.reducer,
  EmpStatisticsSlice = empStatisticsSlice.reducer,
  UpdateJobsStatusSlice = updateJobStatusSlice.reducer,
  listingMinimalJobsSlice = listingMinimalJobsSlicee.reducer;
