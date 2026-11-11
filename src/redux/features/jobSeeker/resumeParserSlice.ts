import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";
import API from "../../../config/axios.config";

export const getResumeData: any = createAsyncThunk(
  "ResumeData",
  async (rdata: any) => {
    try {
      const { data } = await API.get(
        API_ENDPOINTS.MAC_FETCH_RESUME_DATA,
        rdata
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const getResumeDataSlice = createSlice({
  name: "ResumeData",
  initialState: {
    rmArray: [],
    rmloading: true,
    rmerror: "",
  },
  reducers: {
    reset: (state: any) => {
      state.rmloading = false;
      state.rmArray = [];
      state.rmerror = "";
    },
  },
  extraReducers: {
    [getResumeData.pending]: (state, action) => {
      state.rmloading = true;
    },
    [getResumeData.fulfilled]: (state, action) => {
      state.rmloading = false;
      state.rmArray = action.payload;
      state.rmerror = "";
    },
    [getResumeData.rejected]: (state, action) => {
      state.rmloading = false;
      state.rmerror = action.payload.response.data.message;
      state.rmArray = [];
    },
  },
});

export const { reset: resetResumeData } = getResumeDataSlice.actions;
export const ResumeData = getResumeDataSlice.reducer;
