import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export interface Industry {
  name: string;
}

export const getIndustryType: any = createAsyncThunk(
  "industryType",
  async (dat) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_MASTER_INDUSTRY, dat);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const industrySlice = createSlice({
  name: "industryType",
  initialState: {
    IndustryType: [],
    loadingI: false,
    errorI: "",
  },
  reducers: {
    reset: (state) => {
      state.IndustryType = [];
      state.loadingI = false;
      state.errorI = "";
    },
  },
  extraReducers: {
    [getIndustryType.pending]: (state, action) => {
      state.loadingI = true;
    },
    [getIndustryType.fulfilled]: (state, action) => {
      state.IndustryType = action.payload;
      state.errorI = "";
      state.loadingI = false;
    },
    [getIndustryType.error]: (state, action) => {
      state.IndustryType = [];
      state.errorI = action.payload.response.data.message;
      state.loadingI = false;
    },
  },
});

export const { reset: resetIndustryType } = industrySlice.actions;
export default industrySlice.reducer;
