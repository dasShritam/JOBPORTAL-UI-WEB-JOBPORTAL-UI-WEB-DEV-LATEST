import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

//User-Statistics
export const fetchUserStaticts: any = createAsyncThunk(
  "UserStaticts",
  async (userInfo: any) => {
    try {
      const { data } = await API.get(
        API_ENDPOINTS.JOB_USER_STATISTIC,
        userInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const UserStatictsSlice = createSlice({
  name: "UserStaticts",
  initialState: {
    adUserStatictsRes: [],
    usloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.adUserStatictsRes = [];
      state.usloading = true;
      state.error = "";
    },
  },

  extraReducers: {
    [fetchUserStaticts.pending]: (state) => {
      state.usloading = true;
    },
    [fetchUserStaticts.fulfilled]: (state, action) => {
      state.usloading = false;
      state.adUserStatictsRes = action.payload;
      state.error = "";
    },
    [fetchUserStaticts.rejected]: (state, action) => {
      state.usloading = false;
      state.error = action.payload;
      state.adUserStatictsRes = [];
    },
  },
});

//AdminReg
export const fetchRegTrend: any = createAsyncThunk(
  "AdminReg",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.JOB_REGISTRATION_TRENDS,
        userInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const AdminRegTrendSlice = createSlice({
  name: "AdminReg",
  initialState: {
    adRegistrationCountsRes: [],
    jsloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.adRegistrationCountsRes = [];
      state.jsloading = true;
      state.error = "";
    },
  },

  extraReducers: {
    [fetchRegTrend.pending]: (state) => {
      state.jsloading = true;
    },
    [fetchRegTrend.fulfilled]: (state, action) => {
      state.jsloading = false;
      state.adRegistrationCountsRes = action.payload;
      state.error = "";
    },
    [fetchRegTrend.rejected]: (state, action) => {
      state.jsloading = false;
      state.error = action.payload;
      state.adRegistrationCountsRes = [];
    },
  },
});

//JobPost
export const fetchJobPostTrend: any = createAsyncThunk(
  "JobPost",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.JOB_JOBPOST_TREND,
        userInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const JobPostTrendSlice = createSlice({
  name: "JobPost",
  initialState: {
    adjobpostRes: [],
    jploading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.adjobpostRes = [];
      state.jploading = true;
      state.error = "";
    },
  },

  extraReducers: {
    [fetchJobPostTrend.pending]: (state) => {
      state.jploading = true;
    },
    [fetchJobPostTrend.fulfilled]: (state, action) => {
      state.jploading = false;
      state.adjobpostRes = action.payload;
      state.error = "";
    },
    [fetchJobPostTrend.rejected]: (state, action) => {
      state.jploading = false;
      state.error = action.payload;
      state.adjobpostRes = [];
    },
  },
});

//Support-Ticket
export const fetchSupportTktTrend: any = createAsyncThunk(
  "SuppTkt",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.JOB_SUPPORT_TICKET_TREND,
        userInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const SupportTktTrendSlice = createSlice({
  name: "SuppTkt",
  initialState: {
    adSupportTktRes: [],
    jstloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.adSupportTktRes = [];
      state.jstloading = true;
      state.error = "";
    },
  },

  extraReducers: {
    [fetchSupportTktTrend.pending]: (state) => {
      state.jstloading = true;
    },
    [fetchSupportTktTrend.fulfilled]: (state, action) => {
      state.jstloading = false;
      state.adSupportTktRes = action.payload;
      state.error = "";
    },
    [fetchSupportTktTrend.rejected]: (state, action) => {
      state.jstloading = false;
      state.error = action.payload;
      state.adSupportTktRes = [];
    },
  },
});

// Assessment Dashboard

export const getAssessmentTred: any = createAsyncThunk(
  "assessmentTred",
  async (assessmetInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.ASSESSMENT_TREAD,
        assessmetInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const assessmentTredSL = createSlice({
  name: "assessmentTred",
  initialState: {
    assessmentTredRes: [],
    assessloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.assessmentTredRes = [];
      state.assessloading = true;
      state.error = "";
    },
  },

  extraReducers: {
    [getAssessmentTred.pending]: (state) => {
      state.assessloading = true;
    },
    [getAssessmentTred.fulfilled]: (state, action) => {
      state.assessloading = false;
      state.assessmentTredRes = action.payload;
      state.error = "";
    },
    [getAssessmentTred.rejected]: (state, action) => {
      state.assessloading = false;
      state.error = action.payload;
      state.assessmentTredRes = [];
    },
  },
});

export const { reset: RegTrend } = AdminRegTrendSlice.actions,
  { reset: JobPostTrend } = JobPostTrendSlice.actions,
  { reset: UserStatistics } = UserStatictsSlice.actions,
  { reset: SupportTktTrend } = SupportTktTrendSlice.actions;

export const regTrendSlice = AdminRegTrendSlice.reducer,
  jobPostTrend = JobPostTrendSlice.reducer,
  userStatistics = UserStatictsSlice.reducer,
  supportTktTrend = SupportTktTrendSlice.reducer,
  assessmentTredSlice = assessmentTredSL.reducer;
