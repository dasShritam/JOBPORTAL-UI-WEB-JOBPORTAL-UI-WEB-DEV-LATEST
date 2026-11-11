import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const JobApply: any = createAsyncThunk("ApplyJob", async (datas: any) => {
  try {

    const { data } = await API.patch(API_ENDPOINTS.MAC_JOB_JOBSEEKER_ACTION, datas);
    return data;
  } catch (error: any) {
    return error.response.data    
  }
});

const ApplyJobSlicee = createSlice({
  name: "ApplyJob",
  initialState: {
    applyJob: [],
    loadjobs: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.applyJob = [];
      state.loadjobs = false;
      state.error = "";
    },
  },
  extraReducers: {
    
    [JobApply.pending]: (state, action) => {
      state.loadjobs = true;
    },
    [JobApply.fulfilled]: (state, action) => {
      state.loadjobs = false;
      state.applyJob = action.payload;
      state.error = "";
    },
    [JobApply.rejected]: (state, action) => {
      state.loadjobs = false;
      state.error = action.payload.response.data.message;
      state.applyJob = [];
    },
  },
  
  
  

}  

);
export const { reset: resetApplyJob } = ApplyJobSlicee.actions;
export const ApplyJobSlice = ApplyJobSlicee.reducer;
