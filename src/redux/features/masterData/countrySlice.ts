import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export interface CountryCode {
  name: string;
  code: string;
}

export const getCountryCode: any = createAsyncThunk("countryCode", async () => {
  try {
    const { data } = await API.get(API_ENDPOINTS.MAC_MASTER_COUNTRY);
    return data;
  } catch (error: any) {
    return error;
  }
});

const countrySlice = createSlice({
  name: "countryCode",
  initialState: {
    CountryCode: [],
    loadingCC: false,
    errorCC: "",
  },
  reducers: {
    reset: (state) => {
      state.CountryCode = [];
      state.loadingCC = true;
      state.errorCC = "";
    },
  },
  extraReducers: {
    [getCountryCode.pending]: (state, action) => {
      state.loadingCC = true;
    },
    [getCountryCode.fulfilled]: (state, action) => {
      state.loadingCC = false;
      state.CountryCode = action.payload;
      state.errorCC = "";
    },
    [getCountryCode.error]: (state, action) => {
      state.loadingCC = false;
      state.CountryCode = [];
      state.errorCC = action.payload.response.data.message;
    },
  },
});
export const { reset: resetcountryCode } = countrySlice.actions;
export default countrySlice.reducer;
