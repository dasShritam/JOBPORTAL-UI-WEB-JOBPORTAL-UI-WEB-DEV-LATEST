import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const GetPolls: any = createAsyncThunk(
  "GetPolls",
  async (datas: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_FETCH_POLLS, datas);
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const FetchPollSlicee = createSlice({
  name: "GetPolls",
  initialState: {
    PollArray: [],
    loadpolls: false,
    pollerror: "",
  },
  reducers: {
    reset: (state) => {
      state.PollArray = [];
      state.loadpolls = true;
      state.pollerror = "";
    },
  },
  extraReducers: {
    [GetPolls.pending]: (state, action) => {
      state.loadpolls = true;
    },
    [GetPolls.fulfilled]: (state, action) => {
      state.loadpolls = false;
      state.PollArray = action.payload;
      state.pollerror = "";
    },
    [GetPolls.rejected]: (state, action) => {
      state.loadpolls = false;
      state.pollerror = action?.payload?.response?.data?.message;
      state.PollArray = [];
    },
  },
});

export const DeletePoll: any = createAsyncThunk(
  "deletePoll",
  async (datas: any) => {
    try {
      const { data } = await API.delete(
        `${API_ENDPOINTS.MAC_DELETE_POLL}/${datas}`
      );
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

const DeletePollSlicee = createSlice({
  name: "deletePoll",
  initialState: {
    DeletepollArray: [],
    deleteloadpolls: false,
    deletepollerror: "",
  },
  reducers: {
    reset: (state) => {
      state.DeletepollArray = [];
      state.deleteloadpolls = true;
      state.deletepollerror = "";
    },
  },
  extraReducers: {
    [DeletePoll.pending]: (state, action) => {
      state.deleteloadpolls = true;
    },
    [DeletePoll.fulfilled]: (state, action) => {
      state.deleteloadpolls = false;
      state.DeletepollArray = action.payload;
      state.deletepollerror = "";
    },
    [DeletePoll.rejected]: (state, action) => {
      state.deleteloadpolls = false;
      state.deletepollerror = action?.payload?.response?.data?.message;
      state.DeletepollArray = [];
    },
  },
});

export const PostPoll: any = createAsyncThunk(
  "PostPoll",
  async (dataInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_POST_POLL, dataInfo);
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);
const postPollSlicee = createSlice({
  name: "PostPoll",
  initialState: {
    PostPollArray: [],
    PostPollLoading: true,
    PollPostError: "",
  },
  reducers: {
    reset: (state) => {
      state.PostPollArray = [];
      state.PostPollLoading = true;
      state.PollPostError = "";
    },
  },
  extraReducers: {
    [PostPoll.pending]: (state, action) => {
      state.PostPollLoading = true;
    },
    [PostPoll.fulfilled]: (state, action) => {
      state.PostPollArray = action.payload;
      state.PollPostError = "";
      state.PostPollLoading = false;
    },
    [PostPoll.error]: (state, action) => {
      state.PostPollArray = [];
      state.PollPostError = action.payload.response.data.message;
      state.PostPollLoading = false;
    },
  },
});
export const FetchPollSlice = FetchPollSlicee.reducer,
  { reset: resetFetchPollSlice } = FetchPollSlicee.actions;

export const DeletePollSlice = DeletePollSlicee.reducer,
  { reset: resetDeletePollSlice } = DeletePollSlicee.actions;

export const PostPollSlice = postPollSlicee.reducer,
  { reset: resetPostPollSlice } = postPollSlicee.actions;
