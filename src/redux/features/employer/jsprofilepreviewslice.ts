import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const getApplicantInfo: any = createAsyncThunk(
  "ApplicantInfo",
  async (applicantCred: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_APPLICANT_INFO,
        applicantCred
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const ApplicantInfoSl = createSlice({
  name: "ApplicantInfo",
  initialState: {
    ApplicantInfo: [],
    loading: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = "";
      state.ApplicantInfo = [];
    },
  },
  extraReducers: {
    [getApplicantInfo.pending]: (state, action) => {
      state.loading = true;
    },
    [getApplicantInfo.fulfilled]: (state, action) => {
      state.loading = false;
      state.ApplicantInfo = action.payload;
      state.error = "";
    },
    [getApplicantInfo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.ApplicantInfo = [];
    },
  },
});

export const { reset: resetApplicatInfo } = ApplicantInfoSl.actions;
export const applicantInfoSlice = ApplicantInfoSl.reducer;
