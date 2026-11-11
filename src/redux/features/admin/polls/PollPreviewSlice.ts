import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

//Get all polls
export const PollPreview: any = createAsyncThunk(
  "PollPreview",
  async (datas: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.JOB_POLLS, datas);
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const PollPreviewSlice = createSlice({
  name: "PollPreview",
  initialState: {
    pollResponse: [],
    ploading: true,
    pollerror: "",
  },
  reducers: {},
  extraReducers: {
    [PollPreview.pending]: (state, action) => {
      state.ploading = true;
    },
    [PollPreview.fulfilled]: (state, action) => {
      state.ploading = false;
      state.pollResponse = action.payload;
      state.pollerror = "";
    },
    [PollPreview.rejected]: (state, action) => {
      state.ploading = false;
      state.pollerror = action?.payload?.response?.data?.message;
      state.pollResponse = [];
    },
  },
});

//get single poll
export const GetSinglePoll: any = createAsyncThunk(
  "GetSinglePoll",
  async (datas: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.JOB_POLLS, datas);
      return data.data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const SinglePollSlice = createSlice({
  name: "GetSinglePoll",
  initialState: {
    singlepollResponse: [],
    sploading: true,
    spollerror: "",
  },
  reducers: {
    reset: (state: any) => {
      state.singlepollResponse = [];
      state.sploading = false;
      state.spollerror = "";
    },
  },
  extraReducers: {
    [GetSinglePoll.pending]: (state, action) => {
      state.sploading = true;
    },
    [GetSinglePoll.fulfilled]: (state, action) => {
      state.sploading = false;
      state.singlepollResponse = action.payload;
      state.spollerror = "";
    },
    [GetSinglePoll.rejected]: (state, action) => {
      state.sploading = false;
      state.spollerror = action?.payload?.response?.data?.message;
      state.singlepollResponse = [];
    },
  },
});

// for graph
export const GetSinglePollGraph: any = createAsyncThunk(
  "GetSinglePollGraph",
  async (datas: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.JOB_POLLS, datas);
      return data.data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const SinglePollGraphSlice = createSlice({
  name: "GetSinglePollGraph",
  initialState: {
    singleGraphpollResponse: [],
    spGloading: true,
    spGollerror: "",
  },
  reducers: {
    reset: (state: any) => {
      state.singleGraphpollResponse = [];
      state.spGloading = false;
      state.spGollerror = "";
    },
  },
  extraReducers: {
    [GetSinglePollGraph.pending]: (state, action) => {
      state.spGloading = true;
    },
    [GetSinglePollGraph.fulfilled]: (state, action) => {
      state.spGloading = false;
      state.singleGraphpollResponse = action.payload;
      state.spGollerror = "";
    },
    [GetSinglePollGraph.rejected]: (state, action) => {
      state.spGloading = false;
      state.spGollerror = action?.payload?.response?.data?.message;
      state.singleGraphpollResponse = [];
    },
  },
});

//Save poll answer
export const SavePollAnswer: any = createAsyncThunk(
  "savePollAnswer",
  async (datas: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.JOB_POLL_ANSWER, datas);
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const SavePollAnswerSlice = createSlice({
  name: "savePollAnswer",
  initialState: {
    savedResponse: [],
    sloading: true,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.savedResponse = [];
      state.sloading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [SavePollAnswer.pending]: (state, action) => {
      state.sloading = false;
    },
    [SavePollAnswer.fulfilled]: (state, action) => {
      state.sloading = false;
      state.savedResponse = action.payload;
      state.error = "";
    },
    [SavePollAnswer.rejected]: (state, action) => {
      state.sloading = false;
      state.error = action?.payload?.response?.data?.message;
      state.savedResponse = [];
    },
  },
});
export const { reset: resetPollRes } = SavePollAnswerSlice.actions,
  { reset: resetSinglepoll } = SinglePollSlice.actions;

export const fetchPollPreviewSlice = PollPreviewSlice.reducer,
  savePollAnswerSlice = SavePollAnswerSlice.reducer,
  singlePollSlice = SinglePollSlice.reducer,
  singlePollGraphSlice = SinglePollGraphSlice.reducer;
