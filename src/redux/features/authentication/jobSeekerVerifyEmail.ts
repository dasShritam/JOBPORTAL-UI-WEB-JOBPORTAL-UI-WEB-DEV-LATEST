import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";
import API from "../../../config/axios.config";

export const JobSeekerSendOtp: any = createAsyncThunk(
    "JobSeekerEmail",
    async (emailInfo: any) => {
        try {
            const { data } = await API.post(API_ENDPOINTS.AUTH_SEND_OTP, emailInfo);
            return data;
        } catch (error: any) {
            
            return error
        }
    }
);

const jobSeekerSendEmailSlice = createSlice({
    name: "JobSeekerEmail",
    initialState: {
        sendOtpRes: [],
        loading: false,
        error: "",
    },
    reducers: {
        resetSendEmail: (state: any) => {
            state.sendOtpRes = [];
            state.loading = false;
            state.error = "";
        }
    },
    extraReducers: {
        [JobSeekerSendOtp.pending]: (state, action) => {
            state.loading = true;
        },
        [JobSeekerSendOtp.fulfilled]: (state, action) => {
            state.loading = false;
            state.sendOtpRes = action.payload;
            state.error = "";
        },
        [JobSeekerSendOtp.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.response.data.message;
            state.sendOtpRes = [];
        },
    }
});

export const JobSeekerVerifyOtpEmail: any = createAsyncThunk(
    "JobSeekerVerifyEmail",
    async (otpInfo: any) => {
        try {
            const { data } = await API.post(API_ENDPOINTS.AUTH_JS_VERIFY_REG, otpInfo);
            return data;
        } catch (error: any) {
            return error
        }
    }
);

const jobSeekerVerifyEmailSlice = createSlice({
    name: "JobSeekerVerifyEmail",
    initialState: {
        verifyOtpRes: [],
        loading: false,
        error: "",
    },
    reducers: {
        reset: (state) => {
            state.loading = false;
            state.verifyOtpRes = [];
            state.error = "";
        },
    },
    extraReducers: {
        [JobSeekerVerifyOtpEmail.pending]: (state, action) => {
            state.loading = true;
        },
        [JobSeekerVerifyOtpEmail.fulfilled]: (state, action) => {
            state.loading = false;
            state.verifyOtpRes = action.payload;
            state.error = "";
        },
        [JobSeekerVerifyOtpEmail.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.response.data.message;
            state.verifyOtpRes = [];
        },
    }
});


export const { reset: resetOtpActionCreator } = jobSeekerVerifyEmailSlice.actions;
export const { resetSendEmail: resetSendEmailCreator } = jobSeekerSendEmailSlice.actions
export const jobSeekerSendEmailSlices = jobSeekerSendEmailSlice.reducer,
    jobSeekerVerifyotpSlices = jobSeekerVerifyEmailSlice.reducer;