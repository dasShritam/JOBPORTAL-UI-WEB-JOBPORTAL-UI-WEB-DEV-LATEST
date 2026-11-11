import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";
import API from "../../../../config/axios.config";

export const postFaqData: any = createAsyncThunk(
    "PostFAQ",
    async (dataInfo: any) => {
        try {
            const { data } = await API.post(
                API_ENDPOINTS.HELP_SUPPORT_POST_FAQ,
                dataInfo
            );
            return data;
        } catch (error: any) {
            return error;
        }
    }
);
const postFaqSlice = createSlice({
    name: "PostFAQ",
    initialState: {
        allPostFaq: [],
        allPostFaqLoading: true,
        allPostFaqError: "",
    },
    reducers: {
        reset: (state) => {
            state.allPostFaq = [];
            state.allPostFaqLoading = true;
            state.allPostFaqError = "";
        },
    },
    extraReducers: {
        [postFaqData.pending]: (state, action) => {
            state.allPostFaqLoading = true;
        },
        [postFaqData.fulfilled]: (state, action) => {
            state.allPostFaq = action.payload;
            state.allPostFaqError = "";
            state.allPostFaqLoading = false;
        },
        [postFaqData.error]: (state, action) => {
            state.allPostFaq = [];
            state.allPostFaqError = action.payload.response.data.message;
            state.allPostFaqLoading = false;
        },
    },
});

export const updateFaqData: any = createAsyncThunk(
    "UpdateFAQ",
    async (dataInfo: any) => {
        try {
            const { data } = await API.put(
                API_ENDPOINTS.HELP_SUPPORT_UPDATE_FAQ,
                dataInfo
            );
            return data;
        } catch (error: any) {
            return error;
        }
    }
);
const updateFaqSlice = createSlice({
    name: "UpdateFAQ",
    initialState: {
        updateAllFaq: [],
        updateAllFaqLoading: true,
        updateAllFaqError: "",
    },
    reducers: {
        reset: (state) => {
            state.updateAllFaq = [];
            state.updateAllFaqLoading = true;
            state.updateAllFaqError = "";
        },
    },
    extraReducers: {
        [updateFaqData.pending]: (state, action) => {
            state.updateAllFaqLoading = true;
        },
        [updateFaqData.fulfilled]: (state, action) => {
            state.updateAllFaq = action.payload;
            state.updateAllFaqError = "";
            state.updateAllFaqLoading = false;
        },
        [updateFaqData.error]: (state, action) => {
            state.updateAllFaq = [];
            state.updateAllFaqError = action.payload.response.data.message;
            state.updateAllFaqLoading = false;
        },
    },
});

export const fetchFaq: any = createAsyncThunk(
    "FetchFAQ",
    async (dataInfo: any) => {
        try {
            const { data } = await API.post(
                API_ENDPOINTS.HELP_SUPPORT_FETCH_FAQ,
                dataInfo
            );

            return data.data;
        } catch (error: any) {
            return error;
        }
    }
);
const fetchFaqSlice = createSlice({
    name: "FetchFAQ",
    initialState: {
        allFetchFaq: [],
        fetchFaqLoading: true,
        fetchFaqError: "",
    },
    reducers: {
        reset: (state) => {
            state.allFetchFaq = [];
            state.fetchFaqLoading = true;
            state.fetchFaqError = "";
        },
    },
    extraReducers: {
        [fetchFaq.pending]: (state, action) => {
            state.fetchFaqLoading = true;
        },
        [fetchFaq.fulfilled]: (state, action) => {
            state.allFetchFaq = action.payload;
            state.fetchFaqError = "";
            state.fetchFaqLoading = false;
        },
        [fetchFaq.error]: (state, action) => {
            state.allFetchFaq = [];
            state.fetchFaqError = action.payload.response.data.message;
            state.fetchFaqLoading = false;
        },
    },
});

export const fetchSingleFaq: any = createAsyncThunk(
    "FetchSingleFAQ",
    async (dataInfo: any) => {
        try {
            const { data } = await API.post(
                API_ENDPOINTS.HELP_SUPPORT_FETCH_FAQ,
                dataInfo
            );

            return data.data;
        } catch (error: any) {
            return error;
        }
    }
);
const fetchSingleFaqSlice = createSlice({
    name: "FetchSingleFAQ",
    initialState: {
        singleFaqRes: [],
        singleFaqLoading: true,
        singleFaqError: "",
    },
    reducers: {
        reset: (state) => {
            state.singleFaqRes = [];
            state.singleFaqLoading = true;
            state.singleFaqError = "";
        },
    },
    extraReducers: {
        [fetchSingleFaq.pending]: (state, action) => {
            state.singleFaqLoading = true;
        },
        [fetchSingleFaq.fulfilled]: (state, action) => {
            state.singleFaqRes = action.payload;
            state.singleFaqError = "";
            state.singleFaqLoading = false;
        },
        [fetchSingleFaq.error]: (state, action) => {
            state.singleFaqRes = [];
            state.singleFaqError = action.payload.response.data.message;
            state.singleFaqLoading = false;
        },
    },
});

export const deleteFaqData: any = createAsyncThunk(
    "DeleteFAQ",
    async (dataInfo: any) => {
        try {
            const { data } = await API.delete(
                `${API_ENDPOINTS.HELP_SUPPORT_DELETE_FAQ}/${dataInfo}`

            );

            return data;
        } catch (error: any) {
            return error;
        }
    }
);

const deleteFaqSlice = createSlice({
    name: "DeleteFAQ",
    initialState: {
        deleteFaq: [],
        deleteFaqLoading: true,
        deleteFaqError: "",
    },
    reducers: {
        reset: (state) => {
            state.deleteFaq = [];
            state.deleteFaqLoading = true;
            state.deleteFaqError = "";
        },
    },
    extraReducers: {
        [deleteFaqData.pending]: (state, action) => {
            state.deleteFaqLoading = true;
        },
        [deleteFaqData.fulfilled]: (state, action) => {
            state.deleteFaq = action.payload;
            state.deleteFaqError = "";
            state.deleteFaqLoading = false;
        },
        [deleteFaqData.error]: (state, action) => {
            state.deleteFaq = [];
            state.deleteFaqError = action.payload.response.data.message;
            state.deleteFaqLoading = false;
        },
    },
});

export const voteFaq: any = createAsyncThunk(
    "PostVoteFAQ",
    async (dataInfo: any) => {
        try {
            const { data } = await API.post(
                API_ENDPOINTS.HELP_SUPPORT_POST_VOTE_FAQ, dataInfo
            );
            return data;
        } catch (error: any) {
            return error;
        }
    }
);

const voteFaqSlice = createSlice({
    name: "PostVoteFAQ",
    initialState: {
        voteFaqRes: [],
        voteFaqLoading: true,
        voteFaqError: "",
    },
    reducers: {
        reset: (state) => {
            state.voteFaqRes = [];
            state.voteFaqLoading = true;
            state.voteFaqError = "";
        },
    },
    extraReducers: {
        [voteFaq.pending]: (state, action) => {
            state.voteFaqLoading = true;
        },
        [voteFaq.fulfilled]: (state, action) => {
            state.voteFaqRes = action.payload;
            state.voteFaqError = "";
            state.voteFaqLoading = false;
        },
        [voteFaq.error]: (state, action) => {
            state.voteFaqRes = [];
            state.voteFaqError = action.payload.response.data.message;
            state.voteFaqLoading = false;
        },
    },
});


export const { reset: resetPostFaq } = postFaqSlice.actions;
export const { reset: resetFetchFaq } = fetchFaqSlice.actions;
export const { reset: resetSingleFaq } = fetchSingleFaqSlice.actions;
export const { reset: resetDeleteFaq } = deleteFaqSlice.actions;
export const { reset: resetUpdateFaq } = updateFaqSlice.actions;
export const { reset: resetVoteFaq } = voteFaqSlice.actions;

export const PostFaqSlice = postFaqSlice.reducer,
    FetchSingleFaqSlice = fetchSingleFaqSlice.reducer,
    FetchFaqSlice = fetchFaqSlice.reducer,
    DeleteFaqSlice = deleteFaqSlice.reducer,
    UpdateFaqSlice = updateFaqSlice.reducer,
    VoteFaqSlice = voteFaqSlice.reducer;