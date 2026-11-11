import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";
import API from "../../../config/axios.config";
import { useEffect } from "react";

export const JobSeekerData: any = createAsyncThunk(
  "JobSeeker",
  async (dat: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_FETCH_USER, dat);

      return data.data;
    } catch (error: any) {
      return error;
    }
  }
);

const JobSeekerSlicee = createSlice({
  name: "JobSeeker",
  initialState: {
    JobSeekerArray: [],
    loadingJobSeeker: false,
    errorJobSeeker: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingJobSeeker = false;
      state.JobSeekerArray = [];
      state.errorJobSeeker = "";
    },
  },
  extraReducers: {
    [JobSeekerData.pending]: (state, action) => {
      state.loadingJobSeeker = true;
    },
    [JobSeekerData.fulfilled]: (state, action) => {
      state.loadingJobSeeker = false;
      state.JobSeekerArray = action.payload;
      state.errorJobSeeker = "";
    },
    [JobSeekerData.rejected]: (state, action) => {
      state.loadingJobSeeker = false;
      state.errorJobSeeker = action.payload.response.data.message;
      state.JobSeekerArray = [];
    },
  },
});
export const { reset: resetUserInfo } = JobSeekerSlicee.actions;
export const JobSeekerSlice = JobSeekerSlicee.reducer;
