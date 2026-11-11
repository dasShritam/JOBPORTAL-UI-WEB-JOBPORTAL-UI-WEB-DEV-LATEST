import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const updateAppStatus: any = createAsyncThunk(
  "ApplicationStatus",
  async (Status: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JOB_APPLICATION_STATUS,
        Status
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const ApplicantStatusSl = createSlice({
  name: "ApplicationStatus",
  initialState: {
    ApplicationStatus: [],
    loadingStatus: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.ApplicationStatus = [];
      state.loadingStatus = false;
      state.error = "";
    },
  },
  extraReducers: {
    [updateAppStatus.pending]: (state, action) => {
      state.loadingStatus = true;
    },
    [updateAppStatus.fulfilled]: (state, action) => {
      state.loadingStatus = false;
      state.ApplicationStatus = action.payload;
      state.error = "";
    },
    [updateAppStatus.rejected]: (state, action) => {
      state.loadingStatus = false;
      state.error = action.payload;
      state.ApplicationStatus = [];
    },
  },
});

export const { reset: resetAppStatusRestset } = ApplicantStatusSl.actions;
export const applicantStatusSlice = ApplicantStatusSl.reducer;
