import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

let appln_info: any = null;
export const updateAppStatus2: any = createAsyncThunk(
  "ApplicationStatus2",
  async (Data: any) => {
    try {
      appln_info = {
        user_id: Data.applicants_info[0].applicant_id,
        jobid: Data.applicants_info[0].job_id,
        status: Data.status,
      };
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JOB_APPLICATION_STATUS,
        Data
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const ApplicantStatusS2 = createSlice({
  name: "ApplicationStatus2",
  initialState: {
    appln_info: null,
    ApplicationStatus2: [],
    loadingStatus2: true,
    error2: "",
  },
  reducers: {
    reset: (state) => {
      state.appln_info = null;
      state.ApplicationStatus2 = [];
      state.loadingStatus2 = false;
      state.error2 = "";
    },
  },
  extraReducers: {
    [updateAppStatus2.pending]: (state, action) => {
      state.loadingStatus2 = true;
    },
    [updateAppStatus2.fulfilled]: (state, action) => {
      state.appln_info = appln_info;
      state.loadingStatus2 = false;
      state.ApplicationStatus2 = action.payload;
      state.error2 = "";
    },
    [updateAppStatus2.rejected]: (state, action) => {
      state.appln_info = null;
      state.loadingStatus2 = false;
      state.error2 = action.payload;
      state.ApplicationStatus2 = [];
    },
  },
});

export const { reset: resetAppStatusRestset2 } = ApplicantStatusS2.actions;
export const applicantStatusSlice2 = ApplicantStatusS2.reducer;
