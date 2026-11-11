import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const downloadImage: any = createAsyncThunk("downloadImage", async () => {
  try {
    const { data } = await API.get(API_ENDPOINTS.MAC_DOWNLOAD_IMAGE);
    return data;
  } catch (error: any) {
    return error;
  }
});

const downloadImageSl = createSlice({
  name: "downloadImageSlice",
  initialState: {
    image: [],
    load: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.image = [];
      state.load = true;
      state.error = "";
    },
  },
  extraReducers: {
    [downloadImage.pending]: (state, action) => {
      state.load = true;
    },
    [downloadImage.fulfilled]: (state, action) => {
      state.load = false;
      state.image = action.payload;
      state.error = "";
    },
    [downloadImage.rejected]: (state, action) => {
      state.load = false;
      state.error = action.payload;
      state.image = [];
    },
  },
});

export const downloadResume: any = createAsyncThunk("downloadResume", async () => {
  try {
    const { data } = await API.get(API_ENDPOINTS.MAC_DOWNLOAD_RESUME);
    return data;
  } catch (error: any) {
    return error;
  }
});

const downloadResumeSl = createSlice({
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
    [downloadResume.pending]: (state, action) => {
      state.loading1 = true;
    },
    [downloadResume.fulfilled]: (state, action) => {
      state.loading1 = false;
      state.resume = action.payload;
      state.error1 = "";
    },
    [downloadResume.rejected]: (state, action) => {
      state.loading1 = false;
      state.error1 = action.payload;
      state.resume = [];
    },
  },
});

export const downloadVideo: any = createAsyncThunk("downloadVideo", async () => {
  try {
    const { data } = await API.get(API_ENDPOINTS.MAC_DOWNLOAD_VIDEO);
    return data;
  } catch (error: any) {
    return error;
  }
});

const downloadVideoSl = createSlice({
  name: "downloadVideoSlice",
  initialState: {
    video: [],
    loading: true,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [downloadVideo.pending]: (state, action) => {
      state.loading = true;
    },
    [downloadVideo.fulfilled]: (state, action) => {
      state.loading = false;
      state.video = action.payload;
      state.error = "";
    },
    [downloadVideo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.video = [];
    },
  },
});

export const uploadFile: any = createAsyncThunk("uploadFile", async (dataModal: any) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.MAC_JS_REG_FILE, dataModal);
    return data;
  } catch (error: any) {
    if (error.toString().includes("413"))
      return {
        code: 413,
        message: "Selected File  size  Exceeds the Maximum Limit",
      };
    return error;
  }
});

const uploadFileSl = createSlice({
  name: "uploadFile",
  initialState: {
    fileUpload: [],
    uploadLoading: true,
    resumeError: "",
  },
  reducers: {
    reset: (state) => {
      state.uploadLoading = false;
      state.fileUpload = [];
      state.resumeError = "";
    },
  },
  extraReducers: {
    [uploadFile.pending]: (state, action) => {
      state.uploadLoading = true;
    },
    [uploadFile.fulfilled]: (state, action) => {
      state.uploadLoading = false;
      state.fileUpload = action.payload;
      state.resumeError = "";
    },
    [uploadFile.rejected]: (state, action) => {
      state.uploadLoading = false;
      state.resumeError = action.payload;
      state.fileUpload = [];
    },
  },
});

export const DeletejobseekerFile: any = createAsyncThunk("deletejobseekerFile", async (name: any) => {
  try {
    const { data } = await API.delete(`${API_ENDPOINTS.MAC_JS_DOC}/${name}`);
    return data;
  } catch (error: any) {
    return error.response.data.message;
  }
});

const jobseekerfileDeleteSlicee = createSlice({
  name: "deletejobseekerFile",
  initialState: {
    message: [],
    load: false,
    err: "",
  },
  reducers: {
    reset: (state) => {
      state.load = false;
      state.message = [];
      state.err = "";
    },
  },
  extraReducers: {
    [DeletejobseekerFile.pending]: (state, action) => {
      state.load = true;
    },
    [DeletejobseekerFile.fulfilled]: (state, action) => {
      state.load = false;
      state.message = action.payload;
      state.err = "";
    },
    [DeletejobseekerFile.rejected]: (state, action) => {
      state.load = false;
      state.err = action.payload.response.data.message;
      state.message = [];
    },
  },
});

export const { reset: resetDownloadResume } = downloadResumeSl.actions;
export const { reset: resetFileUpload } = uploadFileSl.actions;
export const { reset: resetDeleteJSFile } = jobseekerfileDeleteSlicee.actions;
export const { reset: resetdownloadImageSlice } = downloadImageSl.actions;
export const downloadImageSlice = downloadImageSl.reducer,
  downloadResumeSlice = downloadResumeSl.reducer,
  downloadVideoSlice = downloadVideoSl.reducer,
  uploadFileSlice = uploadFileSl.reducer,
  DeletejobseekerFileSlice = jobseekerfileDeleteSlicee.reducer;
