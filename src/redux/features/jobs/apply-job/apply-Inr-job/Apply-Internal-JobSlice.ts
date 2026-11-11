import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../../shared/api-endpoint.shared";

export const PostIntJobApply: any = createAsyncThunk(
  "InternalJobApply",
  async (dataInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_POST_INT_JOB_APPLY,
        dataInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);
const PostInternalJobApplySlice = createSlice({
  name: "InternalJobApply",
  initialState: {
    postIntJobRes: [],
    intJobLoading: false,
    intJobError: "",
  },
  reducers: {
    reset: (state) => {
      state.intJobLoading = false;
      state.intJobError = "";
      state.postIntJobRes = [];
    },
  },
  extraReducers: {
    [PostIntJobApply.pending]: (state, action) => {
      state.intJobLoading = true;
    },
    [PostIntJobApply.fulfilled]: (state, action) => {
      state.intJobLoading = false;
      state.postIntJobRes = action.payload;
      state.intJobError = "";
    },
    [PostIntJobApply.rejected]: (state, action) => {
      state.intJobLoading = false;
      state.intJobError = action.payload.response.data.message;
      state.postIntJobRes = [];
    },
  },
});

export const fetchIjpRjpInfo: any = createAsyncThunk(
  "fetchIjpRjpJobPost",
  async (dataInfo: any) => {
    try {
      const { data } = await API.get(
        `${API_ENDPOINTS.MAC_FETCH_IJP_RJP}/${dataInfo}`
      );
      return data.data;
    } catch (error: any) {
      return error;
    }
  }
);
const FetchInternalJobApplySlice = createSlice({
  name: "fetchIjpRjpJobPost",
  initialState: {
    fetchJobRes: [],
    fetchJobLoading: true,
    fetchJobError: "",
  },
  reducers: {
    reset: (state) => {
      state.fetchJobLoading = true;
      state.fetchJobError = "";
      state.fetchJobRes = [];
    },
  },
  extraReducers: {
    [fetchIjpRjpInfo.pending]: (state, action) => {
      state.fetchJobLoading = true;
    },
    [fetchIjpRjpInfo.fulfilled]: (state, action) => {
      state.fetchJobLoading = false;
      state.fetchJobRes = action.payload;
      state.fetchJobError = "";
    },
    [fetchIjpRjpInfo.rejected]: (state, action) => {
      state.fetchJobLoading = false;
      state.fetchJobError = action.payload;
      state.fetchJobRes = [];
    },
  },
});

export const postIntApplication: any = createAsyncThunk(
  "findIntApplication",
  async (dataInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.FIND_INT_APPLICATION,
        dataInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);
const PostIntApplicationSlice = createSlice({
  name: "findIntApplication",
  initialState: {
    PostIntAppRes: [],
    PostIntAppLoading: false,
    PostIntAppError: "",
  },
  reducers: {
    reset: (state) => {
      state.PostIntAppLoading = false;
      state.PostIntAppError = "";
      state.PostIntAppRes = [];
    },
  },
  extraReducers: {
    [postIntApplication.pending]: (state, action) => {
      state.PostIntAppLoading = true;
    },
    [postIntApplication.fulfilled]: (state, action) => {
      state.PostIntAppLoading = false;
      state.PostIntAppRes = action.payload;
      state.PostIntAppError = "";
    },
    [postIntApplication.rejected]: (state, action) => {
      state.PostIntAppLoading = false;
      state.PostIntAppError = action.payload;
      state.PostIntAppRes = [];
    },
  },
});

export const fetchValidInternalJob: any = createAsyncThunk(
  "fetchvalidjob",
  async (dataInfo: any) => {
    try {
      const { data } = await API.get(
        `${API_ENDPOINTS.MAC_VALID_INTERNAL_JOB}/${dataInfo}`
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);
const fetchValidInternalJobSlice = createSlice({
  name: "fetchvalidjob",
  initialState: {
    fetchValidJobRes: [],
    fetchValidJobLoading: true,
    fetchValidJobError: "",
  },
  reducers: {
    reset: (state) => {
      state.fetchValidJobLoading = true;
      state.fetchValidJobError = "";
      state.fetchValidJobRes = [];
    },
  },
  extraReducers: {
    [fetchValidInternalJob.pending]: (state, action) => {
      state.fetchValidJobLoading = true;
    },
    [fetchValidInternalJob.fulfilled]: (state, action) => {
      state.fetchValidJobLoading = false;
      state.fetchValidJobRes = action.payload;
      state.fetchValidJobError = "";
    },
    [fetchValidInternalJob.rejected]: (state, action) => {
      state.fetchValidJobLoading = false;
      state.fetchValidJobError = action.payload;
      state.fetchValidJobRes = [];
    },
  },
});

export const PostIntJobApplySlice = PostInternalJobApplySlice.reducer;
export const { reset: resetIntJobApply } = PostInternalJobApplySlice.actions;
export const FetchIJPRJPSlice = FetchInternalJobApplySlice.reducer;
export const { reset: resetFetchJob } = FetchInternalJobApplySlice.actions;
export const PostIntAppSlice = PostIntApplicationSlice.reducer;
export const { reset: resetFindJob } = PostIntApplicationSlice.actions;
export const fetchValidJobSlice = fetchValidInternalJobSlice.reducer;
export const { reset: resetFetchValidJob } = fetchValidInternalJobSlice.actions;
