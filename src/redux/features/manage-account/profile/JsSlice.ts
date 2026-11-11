
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const getJobSeekerrData: any = createAsyncThunk(
  "jobSeekerProfileData",
  async () => {
    try {
      const { data } = await API.get(API_ENDPOINTS.MAC_JS_DETAILS);
      if (data.code === 200) {
        return data.data;
      }
      return [];
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const JobSeekerProfile2Slice = createSlice({
  name: "jobSeekerProfileData",
  initialState: {
    JobSeekerProfile: [],
    loading: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.JobSeekerProfile = [];
      state.loading = true;
      state.error = "";
    },
  },
  extraReducers: {
    [getJobSeekerrData.pending]: (state, action) => {
      state.loading = true;
    },

    [getJobSeekerrData.fulfilled]: (state, action) => {
      state.loading = false;
      state.JobSeekerProfile = action.payload;

      state.error = "";
    },
    [getJobSeekerrData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.JobSeekerProfile = [];
    },
  },
});

export const { reset: resetjobSeekerProfileData } =
  JobSeekerProfile2Slice.actions;
export default JobSeekerProfile2Slice.reducer;
