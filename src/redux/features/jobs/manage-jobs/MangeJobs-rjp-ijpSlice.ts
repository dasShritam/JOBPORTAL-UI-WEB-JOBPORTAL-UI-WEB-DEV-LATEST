import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const internalJobsData: any = createAsyncThunk(
    "InternalJobs",
    async (dataInfo: any) => {
        try {
            const { data } = await API.post(
                API_ENDPOINTS.MAC_FETCH_INTERNAL_JOBS,
                dataInfo
            );

            return data.data;
        } catch (error: any) {
            return error;
        }
    }
);
const internalJobsSlice = createSlice({
    name: "InternalJobs",
    initialState: {
        internalJobsRes: [],
        internalJobLoading: true,
        internalJobError: "",
    },
    reducers: {
        reset: (state) => {
            state.internalJobsRes = [];
            state.internalJobLoading = true;
            state.internalJobError = "";
        },
    },
    extraReducers: {
        [internalJobsData.pending]: (state, action) => {
            state.internalJobLoading = true;
        },
        [internalJobsData.fulfilled]: (state, action) => {
            state.internalJobsRes = action.payload;
            state.internalJobError = "";
            state.internalJobLoading = false;
        },
        [internalJobsData.error]: (state, action) => {
            state.internalJobsRes = [];
            state.internalJobError = action.payload.response.data.message;
            state.internalJobLoading = false;
        },
    },
});

export const updateInternalJobStatus: any = createAsyncThunk(
    "UpdateInternalJobs",
    async (dataInfo: any) => {
        try {
            const { data } = await API.patch(
                API_ENDPOINTS.MAC_JOB_UPDATE_INT_JOBSTATUS,
                dataInfo
            );
            return data;
        } catch (error: any) {
            return error;
        }
    }
);
const updateInternalJobStatusSlice = createSlice({
    name: "UpdateInternalJobs",
    initialState: {
        updateInterjobsSts: [],
        updateInterjobsStsLoading: false,
        uupdateInterjobsStsError: "",
    },
    reducers: {
        reset: (state) => {
            state.updateInterjobsStsLoading = false;
            state.uupdateInterjobsStsError = "";
            state.updateInterjobsSts = [];
        },
    },
    extraReducers: {
        [updateInternalJobStatus.pending]: (state, action) => {
            state.updateInterjobsStsLoading = true;
        },
        [updateInternalJobStatus.fulfilled]: (state, action) => {
            state.updateInterjobsSts = action.payload;
            state.uupdateInterjobsStsError = "";
            state.updateInterjobsStsLoading = false;
        },
        [updateInternalJobStatus.error]: (state, action) => {
            state.updateInterjobsSts = [];
            state.uupdateInterjobsStsError = action.payload.response.data.message;
            state.updateInterjobsStsLoading = false;
        },
    },
});

export const empInternalStatisticsDatas: any = createAsyncThunk(
    "EmpInternalStatistics",
    async (dataInfo: any) => {
        try {
            const { data } = await API.post(
                API_ENDPOINTS.MAC_JOB_EMP_INTERNAL_STATISTICS,
                dataInfo
            );
            return data.data;

        } catch (error: any) {
            return error;
        }
    }
);
const empInternalStatisticsSlice = createSlice({
    name: "EmpInternalStatistics",
    initialState: {
        empIntStatisticsData: [],
        empIntStatisticsLoading: false,
        empIntStatisticsError: "",
    },
    reducers: {
        reset: (state) => {
            state.empIntStatisticsLoading = false;
            state.empIntStatisticsError = "";
            state.empIntStatisticsData = [];
        },
    },
    extraReducers: {
        [empInternalStatisticsDatas.pending]: (state, action) => {
            state.empIntStatisticsLoading = true;
        },
        [empInternalStatisticsDatas.fulfilled]: (state, action) => {
            state.empIntStatisticsData = action.payload;
            state.empIntStatisticsError = "";
            state.empIntStatisticsLoading = false;
        },
        [empInternalStatisticsDatas.error]: (state, action) => {
            state.empIntStatisticsData = [];
            state.empIntStatisticsError = action.payload.response.data.message;
            state.empIntStatisticsLoading = false;
        },
    },
});

export const intTotalJobApplicantsData: any = createAsyncThunk(
    "IntTotalJobApplicants",
    async (dataInfo: any) => {
        try {
            const res = await API.post(
                API_ENDPOINTS.MAC_JOB_INTJOB_APPLICANT_JOB,
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
const intTotalJobApplicantsSlice = createSlice({
    name: "IntTotalJobApplicants",
    initialState: {
        intTotalJobsApplicants: [],
        intTotalJobApplicantsLoading: false,
        intTotalJobApplicantsError: "",
    },
    reducers: {
        reset: (state) => {
            state.intTotalJobsApplicants = [];
            state.intTotalJobApplicantsLoading = true;
            state.intTotalJobApplicantsError = "";
        },
    },
    extraReducers: {
        [intTotalJobApplicantsData.pending]: (state, action) => {
            state.intTotalJobApplicantsLoading = true;
        },
        [intTotalJobApplicantsData.fulfilled]: (state, action) => {
            state.intTotalJobsApplicants = action.payload;
            state.intTotalJobApplicantsError = "";
            state.intTotalJobApplicantsLoading = false;
        },
        [intTotalJobApplicantsData.error]: (state, action) => {
            state.intTotalJobsApplicants = [];
            state.intTotalJobApplicantsError = action.payload.response.data.message;
            state.intTotalJobApplicantsLoading = false;
        },
    },
});


export const { reset: resetEmpIntStatistics } = empInternalStatisticsSlice.actions;
export const { reset: resetInternalJobs } = internalJobsSlice.actions;
export const { reset: resetUpdateIntJobSts } = updateInternalJobStatusSlice.actions;
export const { reset: resetIntTotalApplicants } = intTotalJobApplicantsSlice.actions;
export const InternalJobsSlice = internalJobsSlice.reducer,
    IntTotalJobsApplicantsSlice = intTotalJobApplicantsSlice.reducer,
    UpdateInternalJobStatusSlice = updateInternalJobStatusSlice.reducer,
    EmpIntStatisticsSlice = empInternalStatisticsSlice.reducer;