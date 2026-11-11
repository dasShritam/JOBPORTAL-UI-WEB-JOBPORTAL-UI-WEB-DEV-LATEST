import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";
import API from "../../../../config/axios.config";

export const viewApplication: any = createAsyncThunk(
  "viewApplication",
  async (filters: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_VIEW_APPICATION,
        filters
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const ViewApplicationSlice = createSlice({
  name: "viewApplication",
  initialState: {
    viewApp: [],
    loadingV: false,
    errorV: "",
  },
  reducers: {
    reset: (state) => {
      state.viewApp = [];
      state.loadingV = false;
      state.errorV = "";
    },
  },
  extraReducers: {
    [viewApplication.pending]: (state) => {
      state.loadingV = true;
    },
    [viewApplication.fulfilled]: (state, action) => {
      state.loadingV = false;
      state.viewApp = action.payload;
      state.errorV = "";
    },
    [viewApplication.rejected]: (state, action) => {
      state.loadingV = false;
      state.viewApp = [];
      state.errorV = action.payload;
    },
  },
});

export const { reset: resetViewAppActionCreator } =
  ViewApplicationSlice.actions;
export default ViewApplicationSlice.reducer;
