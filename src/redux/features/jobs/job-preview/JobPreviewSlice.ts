// export {}

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const JobPreviewData: any = createAsyncThunk(
  "PreviewJob",
  async (dat: any) => {
    try {
      
      const { data } = await API.post(API_ENDPOINTS.MAC_JOB_FETCH_JOB,dat)
      return data;
    
    } catch (error: any) {
      return error;
    }
  }
);

const JobPreviewSlicee = createSlice({
  name: "PreviewJob",
  initialState: {
    JobPreviewDetails: [],
    loadingJobPreview: true ,
    errorJobPreview: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingJobPreview = true;
      state.JobPreviewDetails = [];
      state.errorJobPreview = "";
    },
  },
  extraReducers: {
    [JobPreviewData.pending]: (state, action) => {
      state.loadingJobPreview = true;
    },
    [JobPreviewData.fulfilled]: (state, action) => {
      state.loadingJobPreview = false;
      state.JobPreviewDetails = action.payload;
      state.errorJobPreview = "";
    },
    [JobPreviewData.rejected]: (state, action) => {
      state.loadingJobPreview = false;
      state.errorJobPreview = action.payload.response.data.message;
      state.JobPreviewDetails = [];
    },
  },
});
export const {reset: resetPreviewJob} = JobPreviewSlicee.actions
export const JobPreviewSlice = JobPreviewSlicee.reducer;
