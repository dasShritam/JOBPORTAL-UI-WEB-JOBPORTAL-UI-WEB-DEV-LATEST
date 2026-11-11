import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const postJobSeekerPrivateDB: any = createAsyncThunk(
    "JobSeekerPrivateDB",
    async (userInfo: any) => {
        try {
            const { data } = await API.post(
                API_ENDPOINTS.MAC_JOB_POST_JS_PRIVATE_DB,
                userInfo
            );
            return data;
        } catch (error: any) {
            return error;
        }
    }
);

const PostJobSeekerPrivateDBSlice = createSlice({
    name: "JobSeekerPrivateDB",
    initialState: {
        response: [],
        privatejsload: false,
        errors: "",
    },
    reducers: {
        reset: (state) => {
            state.privatejsload = false;
            state.response = [];
            state.errors = "";
        },
    },
    extraReducers: {
        [postJobSeekerPrivateDB.pending]: (state) => {
            state.privatejsload = true;
        },
        [postJobSeekerPrivateDB.fulfilled]: (state, action) => {
            state.privatejsload = false;
            state.response = action.payload;
            state.errors = "";
        },
        [postJobSeekerPrivateDB.rejected]: (state, action) => {
            state.privatejsload = false;
            state.errors = action.payload;
            state.response = [];
        },
    },
});


export const fetchJsPrivateDbData: any = createAsyncThunk(
    "JSPrivateDb",
    async (dataInfo: any) => {
        try {
            const { data } = await API.post(
                API_ENDPOINTS.MAC_JOB_FETCH_JS_PRIVATE,
                dataInfo
            );

            return data.data;

        } catch (error: any) {
            return error;
        }
    }
);

const jsPrivateDbDataSlice = createSlice({
    name: "JSPrivateDb",
    initialState: {
        jsPrivateRes: [],
        jsPrivateLoading: true,
        jsPrivateError: "",
    },
    reducers: {
        reset: (state) => {
            state.jsPrivateLoading = true;
            state.jsPrivateRes = [];
            state.jsPrivateError = "";
        },
    },
    extraReducers: {
        [fetchJsPrivateDbData.pending]: (state, action) => {
            state.jsPrivateLoading = true;
        },
        [fetchJsPrivateDbData.fulfilled]: (state, action) => {
            state.jsPrivateLoading = false;
            state.jsPrivateRes = action.payload;
            state.jsPrivateError = "";
        },
        [fetchJsPrivateDbData.rejected]: (state, action) => {
            state.jsPrivateLoading = false;
            state.jsPrivateError = action.payload.response.data.message;
            state.jsPrivateRes = [];
        },
    },
});

export const { reset: resetPostJsPrivateDB } = PostJobSeekerPrivateDBSlice.actions;
export const { reset: resetFetchJsPrivateDB } = jsPrivateDbDataSlice.actions;

export const postjsPrivateDB = PostJobSeekerPrivateDBSlice.reducer,
    fetchjsPrivateDB = jsPrivateDbDataSlice.reducer;