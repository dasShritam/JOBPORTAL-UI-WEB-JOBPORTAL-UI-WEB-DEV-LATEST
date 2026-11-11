import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../../shared/api-endpoint.shared";

export const viewIjpRjpApplication: any = createAsyncThunk(
  "viewIjpRjpApplication",
  async (filters: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_IJP_RJP_VIEW_APPICATION,
        filters
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const ViewIjpRjpApplicationSlice = createSlice({
  name: "viewIjpRjpApplication",
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
    [viewIjpRjpApplication.pending]: (state) => {
      state.loadingV = true;
    },
    [viewIjpRjpApplication.fulfilled]: (state, action) => {
      state.loadingV = false;
      state.viewApp = action.payload;
      state.errorV = "";
    },
    [viewIjpRjpApplication.rejected]: (state, action) => {
      state.loadingV = false;
      state.viewApp = [];
      state.errorV = action.payload;
    },
  },
});

export const { reset: resetViewIjpRjpAppActionCreator } =
  ViewIjpRjpApplicationSlice.actions;
export default ViewIjpRjpApplicationSlice.reducer;
