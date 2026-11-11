import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";
import API from "../../../config/axios.config";

//Get assesment API
export const getAssessmentData: any = createAsyncThunk(
  "AssessmentDetails",
  async (AssessDetails: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.JS_ASSESSMENT_DATA,
        AssessDetails
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const AssessmentDataSl = createSlice({
  name: "AssessmentDetails",
  initialState: {
    jsAssRes: [],
    jsloading: true,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.jsloading = false;
      state.jsAssRes = [];
      state.error = "";
    },
  },
  extraReducers: {
    [getAssessmentData.pending]: (state, action) => {
      state.jsloading = true;
    },
    [getAssessmentData.fulfilled]: (state, action) => {
      state.jsloading = false;
      state.jsAssRes = action.payload;
      state.error = "";
    },
    [getAssessmentData.rejected]: (state, action) => {
      state.jsloading = false;
      state.error = action.payload.response.data.message;
      state.jsAssRes = [];
    },
  },
});

export const getAssessmentStatistics: any = createAsyncThunk(
  "getAssessmentStatistics",
  async () => {
    try {
      const { data } = await API.get(API_ENDPOINTS.MAC_ASSESSMENT_STATISTICS);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const AssessmentStatisticsSl = createSlice({
  name: "getAssessmentStatistics",
  initialState: {
    Res: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.loading = false;
      state.Res = [];
      state.error = "";
    },
  },
  extraReducers: {
    [getAssessmentStatistics.pending]: (state, action) => {
      state.loading = true;
    },
    [getAssessmentStatistics.fulfilled]: (state, action) => {
      state.loading = false;
      state.Res = action.payload;
      state.error = "";
    },
    [getAssessmentStatistics.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.Res = [];
    },
  },
});

export const updateReportData: any = createAsyncThunk(
  "UpateReport",
  async (reportId: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.JS_UPDATE_REPORT,
        reportId
      );

      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const reportDataSl = createSlice({
  name: "UpateReport",
  initialState: {
    reportRes: [],
    reportloading: false,
    reportError: "",
  },
  reducers: {
    reset: (state: any) => {
      state.reportloading = false;
      state.reportRes = [];
      state.error = "";
    },
  },
  extraReducers: {
    [updateReportData.pending]: (state, action) => {
      state.reportloading = true;
    },
    [updateReportData.fulfilled]: (state, action) => {
      state.reportloading = false;
      state.reportRes = action.payload;
      state.reportError = "";
    },
    [updateReportData.rejected]: (state, action) => {
      state.reportloading = false;
      state.reportError = action.payload.response.data.message;
      state.reportRes = [];
    },
  },
});

//Get assesment API for Jobseeker
export const getJSAssessmentData: any = createAsyncThunk(
  "JSAssessmentDetails",
  async (AssessDetails: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.JS_ASSESSMENT_DATA_FOR_JS,
        AssessDetails
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const JSAssessmentDataSl = createSlice({
  name: "JSAssessmentDetails",
  initialState: {
    JsAssRes: [],
    Jsloading: true,
    Jserror: "",
  },
  reducers: {
    reset: (state: any) => {
      state.JsAssRes = [];
      state.Jserror = "";
    },
  },
  extraReducers: {
    [getJSAssessmentData.pending]: (state, action) => {
      state.Jsloading = true;
    },
    [getJSAssessmentData.fulfilled]: (state, action) => {
      state.Jsloading = false;
      state.JsAssRes = action.payload;
      state.Jserror = "";
    },
    [getJSAssessmentData.rejected]: (state, action) => {
      state.Jsloading = false;
      state.Jserror = action.payload.response.data.message;
      state.JsAssRes = [];
    },
  },
});

// for dashboard
export const getJobSeekrAssessment: any = createAsyncThunk(
  "getJobSeekrAssessment",
  async (Assess: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.JS_ASSESSMENT_JS, Assess);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const getJobSeekrAssessmentSL = createSlice({
  name: "getJobSeekrAssessment",
  initialState: {
    jobSeekerAssess: [],
    Jobseekerloading: true,
    Jserror: "",
  },
  reducers: {
    reset: (state: any) => {
      state.jobSeekerAssess = [];
      state.Jserror = "";
    },
  },
  extraReducers: {
    [getJobSeekrAssessment.pending]: (state, action) => {
      state.Jobseekerloading = true;
    },
    [getJobSeekrAssessment.fulfilled]: (state, action) => {
      state.Jobseekerloading = false;
      state.jobSeekerAssess = action.payload;
      state.Jserror = "";
    },
    [getJobSeekrAssessment.rejected]: (state, action) => {
      state.Jobseekerloading = false;
      state.Jserror = action.payload.response.data.message;
      state.jobSeekerAssess = [];
    },
  },
});

//Filter in  Assessments API
export const filterAssessmentData: any = createAsyncThunk(
  "FilteredAssessment",
  async (MatchingAssess: any) => {
    try {
      const { data } = await API.get(
        API_ENDPOINTS.JS_ASSESSMENT_FILTER,
        MatchingAssess
      );
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const FilteredAssessmentSl = createSlice({
  name: "FilteredAssessment",
  initialState: {
    matchFilter: [],
    matchloading: true,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.matchFilter = [];
      state.matchloading = true;
      state.error = "";
    },
  },
  extraReducers: {
    [filterAssessmentData.pending]: (state, action) => {
      state.matchloading = true;
    },
    [filterAssessmentData.fulfilled]: (state, action) => {
      state.matchloading = false;
      state.matchFilter = action.payload;
      state.error = "";
    },
    [filterAssessmentData.rejected]: (state, action) => {
      state.matchloading = false;
      state.error = action.payload;
      state.matchFilter = [];
    },
  },
});

// Get assessment Statistics

export const getJSAssessmentStatistics: any = createAsyncThunk(
  "getJSAssessmentStatistics",
  async () => {
    try {
      const { data } = await API.get(API_ENDPOINTS.JS_ASSESSMENT_STATISTICS);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const JSAssessmentStatisticsSl = createSlice({
  name: "getJSAssessmentStatistics",
  initialState: {
    StatRes: [],
    Statloading: false,
    Staterror: "",
  },
  reducers: {
    reset: (state: any) => {
      state.Statloading = false;
      state.StatRes = [];
      state.Staterror = "";
    },
  },

  extraReducers: {
    [getJSAssessmentStatistics.pending]: (state, action) => {
      state.Statloading = true;
    },

    [getJSAssessmentStatistics.fulfilled]: (state, action) => {
      state.Statloading = false;

      state.StatRes = action.payload;

      state.Staterror = "";
    },

    [getJSAssessmentStatistics.rejected]: (state, action) => {
      state.Statloading = false;
      state.Staterror = action.payload.response.data.message;
      state.StatRes = [];
    },
  },
});

//Get assessment brief deatails

export const getAssessmentBrief: any = createAsyncThunk(
  "GetAssessmentBrief",
  async (id: any) => {
    try {
      const { data } = await API.get(
        `${API_ENDPOINTS.JS_ASSESSMENT_BRIEF}/${id}`
      );
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const getAssessmentBriefSl = createSlice({
  name: "GetAssessmentBrief",
  initialState: {
    assessmentBrief: [],
    assessLoading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.assessmentBrief = [];
      state.assessLoading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [getAssessmentBrief.pending]: (state, action) => {
      state.assessLoading = true;
    },
    [getAssessmentBrief.fulfilled]: (state, action) => {
      state.assessLoading = false;
      state.assessmentBrief = action.payload;
      state.error = "";
    },
    [getAssessmentBrief.rejected]: (state, action) => {
      state.assessLoading = false;
      state.error = action.payload;
      state.assessmentBrief = [];
    },
  },
});

//Paymentbeforetxn

export const Paymentbeforetxn: any = createAsyncThunk(
  "Paymentbeforetxn",
  async (paymentDetails: any) => {
    try {
      return await API.post(
        API_ENDPOINTS.JS_ASSESSMENT_PAYMENTBTXN,
        paymentDetails
      );
      // return data;
    } catch (error: any) {
      return error;
    }
  }
);

const PaymentbeforetxnSl = createSlice({
  name: "Paymentbeforetxn",
  initialState: {
    PayBtxn: [],
    PayBtxnLoading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.PayBtxn = [];
      state.PayBtxnLoading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [Paymentbeforetxn.pending]: (state, action) => {
      state.PayBtxnLoading = true;
    },
    [Paymentbeforetxn.fulfilled]: (state, action) => {
      state.PayBtxnLoading = false;
      state.PayBtxn = action.payload;
      state.error = "";
    },
    [Paymentbeforetxn.rejected]: (state, action) => {
      state.PayBtxnLoading = false;
      state.error = action.payload.response.data.message;
      state.PayBtxn = [];
    },
  },
});

//Paymentaftertxn

export const PaymentAftertxn: any = createAsyncThunk(
  "PaymentAftertxn",
  async (paymentDetails: any) => {
    try {
      return await API.post(
        API_ENDPOINTS.JS_ASSESSMENT_PAYAFTERTXN,
        paymentDetails
      );
      // return data;
    } catch (error: any) {
      return error;
    }
  }
);

const PaymentAftertxnSl = createSlice({
  name: "PaymentAftertxn",
  initialState: {
    PayafterBtxn: [],
    PayafterBtxnLoading: false,
    errors: "",
  },
  reducers: {
    reset: (state: any) => {
      state.PayafterBtxn = [];
      state.PayafterBtxnLoading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [PaymentAftertxn.pending]: (state, action) => {
      state.PayafterBtxnLoading = true;
    },
    [PaymentAftertxn.fulfilled]: (state, action) => {
      state.PayafterBtxnLoading = false;
      state.PayafterBtxn = action.payload;
      state.errors = "";
    },
    [PaymentAftertxn.rejected]: (state, action) => {
      state.PayafterBtxnLoading = false;
      state.errors = action.payload.response.data.message;
      state.PayafterBtxn = [];
    },
  },
});

//Report Job seeker

export const ReportJobseeker: any = createAsyncThunk(
  "reportJs",
  async (id: any) => {
    try {
      const { data } = await API.get(
        `${API_ENDPOINTS.JS_ASSESSMENT_REPORT}/${id}`
      );
      return data;
    } catch (error: any) {
      return error.response;
    }
  }
);

const ReportJobseekerSL = createSlice({
  name: "reportJs",
  initialState: {
    ReportData: [],
    ReportLoad: true,
    errors: "",
  },
  reducers: {
    reset: (state: any) => {
      state.ReportData = [];
      state.ReportLoad = true;
      state.error = "";
    },
  },
  extraReducers: {
    [ReportJobseeker.pending]: (state, action) => {
      state.ReportLoad = true;
    },
    [ReportJobseeker.fulfilled]: (state, action) => {
      state.ReportLoad = false;
      state.ReportData = action.payload;
      state.errors = "";
    },
    [ReportJobseeker.rejected]: (state, action) => {
      state.ReportLoad = false;
      state.errors = action.payload;
      state.ReportData = [];
    },
  },
});

export const { reset: resetAssessmentData } = AssessmentDataSl.actions;
export const { reset: resetUpdatereportData } = reportDataSl.actions;
export const { reset: resetJSAssessmentData } = JSAssessmentDataSl.actions;
export const { reset: FilteredAssessmentData } = FilteredAssessmentSl.actions;
export const { reset: resetgetAssessmentBriefData } =
  getAssessmentBriefSl.actions;
export const { reset: ResetPaymentbeforetxnData } = PaymentbeforetxnSl.actions;
export const { reset: ResetPaymentAftertxnData } = PaymentAftertxnSl.actions;
export const { reset: ResetAssessmentStatistics } =
  AssessmentStatisticsSl.actions;
export const { reset: ResetJSAssessmentStatistics } =
  JSAssessmentStatisticsSl.actions;

export const AssessmentDataSlice = AssessmentDataSl.reducer,
  JSAssessmentDataSlice = JSAssessmentDataSl.reducer,
  getJobSeekrAssessmentSlice = getJobSeekrAssessmentSL.reducer,
  FilteredAssessmentSlice = FilteredAssessmentSl.reducer,
  getAssessmentBriefSlice = getAssessmentBriefSl.reducer,
  PaymentbeforetxnSlSlice = PaymentbeforetxnSl.reducer,
  PaymentAftertxnSlSlice = PaymentAftertxnSl.reducer,
  ReportJobseekerSlice = ReportJobseekerSL.reducer,
  reportDataSlice = reportDataSl.reducer,
  AssessmentStatisticsSlice = AssessmentStatisticsSl.reducer,
  JSAssessmentStatisticsSlice = JSAssessmentStatisticsSl.reducer;
