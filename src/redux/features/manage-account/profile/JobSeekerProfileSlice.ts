import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const jobSeekerprofile: any = createAsyncThunk(
  "JobSeekerProfile",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_JS_REG_FILE, userInfo);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const jobSeekerprofileSlice = createSlice({
  name: "JobSeekerProfile",
  initialState: {
    response: [],
    loading: false,
    errors: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.response = [];
      state.errors = "";
    },
  },
  extraReducers: {
    [jobSeekerprofile.pending]: (state) => {
      state.loading = true;
    },
    [jobSeekerprofile.fulfilled]: (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.errors = "";
    },
    [jobSeekerprofile.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
      state.response = [];
    },
  },
});

export const { reset: resetProfile } = jobSeekerprofileSlice.actions;
export default jobSeekerprofileSlice.reducer;
