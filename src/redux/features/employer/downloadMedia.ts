import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const downloadAppImage: any = createAsyncThunk(
  "downloadImage",
  async (id) => {
    try {
      const { data } = await API.get(
        `${API_ENDPOINTS.MAC_JOB_DOWNLOAD_PROFILE_IMG}/${id}`
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const downloadAppImageSl = createSlice({
  name: "downloadImageSlice",
  initialState: {
    image: [],
    load: true,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [downloadAppImage.pending]: (state, action) => {
      state.load = true;
    },
    [downloadAppImage.fulfilled]: (state, action) => {
      state.load = false;
      state.image = action.payload;
      state.error = "";
    },
    [downloadAppImage.rejected]: (state, action) => {
      state.load = false;
      state.error = action.payload;
      state.image = [];
    },
  },
});

export const downloadAppResume: any = createAsyncThunk(
  "downloadResume",
  async (id) => {
    try {
      const { data } = await API.get(
        `${API_ENDPOINTS.MAC_JOB_DOWNLOAD_RESUME}/${id}`
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const downloadAppResumeSl = createSlice({
  name: "downloadResumeSlice",
  initialState: {
    resume: [],
    loading1: true,
    error1: "",
  },
  reducers: {
    reset: (state) => {
      state.resume = [];
      state.loading1 = false;
      state.error1 = "";
    },
  },
  extraReducers: {
    [downloadAppResume.pending]: (state, action) => {
      state.loading1 = true;
    },
    [downloadAppResume.fulfilled]: (state, action) => {
      state.loading1 = false;
      state.resume = action.payload;
      state.error1 = "";
    },
    [downloadAppResume.rejected]: (state, action) => {
      state.loading1 = false;
      state.error1 = action.payload;
      state.resume = [];
    },
  },
});

export const downloadAppVideo: any = createAsyncThunk(
  "downloadVideo",
  async (id) => {
    try {
      const { data } = await API.get(
        `${API_ENDPOINTS.MAC_JOB_DOWNLOAD_VIDEO}/${id}`
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const downloadAppVideoSl = createSlice({
  name: "downloadVideoSlice",
  initialState: {
    video: [],
    loading: true,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [downloadAppVideo.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadAppVideo.fulfilled]: (state, action) => {
      state.loading = false;
      state.video = action.payload;
      state.error = "";
    },
    [downloadAppVideo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.video = [];
    },
  },
});

export const { reset: resetDownloadResume } = downloadAppResumeSl.actions;

export const downloadAppImageSlice = downloadAppImageSl.reducer,
  downloadAppResumeSlice = downloadAppResumeSl.reducer,
  downloadAppVideoSlice = downloadAppVideoSl.reducer;
