import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const getYearMonth: any = createAsyncThunk("YearMonth", async (dataInfo: any) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.MAC_COMMON_MASTER, dataInfo);
    return data.data.data;
  } catch (error: any) {
    return error;
  }
});
const yearmonthSlice = createSlice({
  name: "YearMonth",
  initialState: {
    allYearMonth: [],
    loadingI: false,
    errorI: "",
  },
  reducers: {
    reset: (state) => {
      state.allYearMonth = [];
      state.loadingI = true;
      state.errorI = "";
    },
  },
  extraReducers: {
    [getYearMonth.pending]: (state, action) => {
      state.loadingI = true;
    },
    [getYearMonth.fulfilled]: (state, action) => {
      state.allYearMonth = action.payload;
      state.errorI = "";
      state.loadingI = false;
    },
    [getYearMonth.error]: (state, action) => {
      state.allYearMonth = [];
      state.errorI = action.payload.response.data.message;
      state.loadingI = false;
    },
  },
});
export const { reset: resetYearMonth } = yearmonthSlice.actions;
export default yearmonthSlice.reducer;
