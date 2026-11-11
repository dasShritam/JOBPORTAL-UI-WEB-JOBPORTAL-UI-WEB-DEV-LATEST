import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const GetTermsAndConditions: any = createAsyncThunk(
  "TermsAndConditions",
  async (datas: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_GET_TERMS_PRIVACY_CONCENT,
        datas
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const GetTermsAndConditionsSlice = createSlice({
  name: "TermsAndConditions",
  initialState: {
    conditions: [],
    loadConditions: false,
    conditionsError: "",
  },
  reducers: {
    reset: (state) => {
      state.loadConditions = false;
      state.conditions = [];
      state.conditionsError = "";
    },
  },
  extraReducers: {
    [GetTermsAndConditions.pending]: (state, action) => {
      state.loadConditions = true;
    },
    [GetTermsAndConditions.fulfilled]: (state, action) => {
      state.loadConditions = false;
      state.conditions = action.payload;
      state.conditionsError = "";
    },
    [GetTermsAndConditions.rejected]: (state, action) => {
      state.loadConditions = false;
      state.conditionsError = action.payload.response.data.message;
      state.conditions = [];
    },
  },
});

export const GetTermsAndConditionsSlice1 = GetTermsAndConditionsSlice.reducer;
export const { reset: resetGetTermsAndConditions } =
  GetTermsAndConditionsSlice.actions;
