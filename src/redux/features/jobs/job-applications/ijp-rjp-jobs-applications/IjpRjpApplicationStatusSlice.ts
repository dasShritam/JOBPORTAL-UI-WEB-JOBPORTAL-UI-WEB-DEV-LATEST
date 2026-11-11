import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../../shared/api-endpoint.shared";

let appln_info: any = null;
export const updateIjpRjpAppStatus2: any = createAsyncThunk(
  "ApplicationStatus2",
  async (Data: any) => {
    try {
      appln_info = {
        user_id: Data.applicants_info[0].applicant_id,
        jobid: Data.applicants_info[0].job_id,
        status: Data.status,
      };
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JOB_IJP_RJP_APPLICATION_STATUS,
        Data
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const IjpRjpApplicantStatusSlice = createSlice({
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
    [updateIjpRjpAppStatus2.pending]: (state, action) => {
      state.loadingStatus2 = true;
    },
    [updateIjpRjpAppStatus2.fulfilled]: (state, action) => {
      state.appln_info = appln_info;
      state.loadingStatus2 = false;
      state.ApplicationStatus2 = action.payload;
      state.error2 = "";
    },
    [updateIjpRjpAppStatus2.rejected]: (state, action) => {
      state.appln_info = null;
      state.loadingStatus2 = false;
      state.error2 = action.payload;
      state.ApplicationStatus2 = [];
    },
  },
});

export const { reset: resetAppIjpRjpStatusRestset2 } =
  IjpRjpApplicantStatusSlice.actions;
export const applicantIjpRjpStatusSlice2 = IjpRjpApplicantStatusSlice.reducer;
