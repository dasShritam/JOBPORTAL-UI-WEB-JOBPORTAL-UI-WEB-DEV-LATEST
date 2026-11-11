import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const InrRefApplicantData: any = createAsyncThunk(
  "InrRefApplicantPreview",
  async (applicant_info: any) => {
    try {
      const { data } = await API.get(
        API_ENDPOINTS.MAC_FETCH_INTERNAL_APPLICATION,
        applicant_info
      );

      return data.data;
    } catch (error: any) {
      return error;
    }
  }
);

const InrRefApplicantSlicee = createSlice({
  name: "InrRefApplicantPreview",
  initialState: {
    InrRefApplicantArray: [],
    loadingInrRefApplicant: true,
    errorInrRef: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingInrRefApplicant = true;
      state.InrRefApplicantArray = [];
      state.errorInrRef = "";
    },
  },
  extraReducers: {
    [InrRefApplicantData.pending]: (state, action) => {
      state.loadingInrRefApplicant = true;
    },
    [InrRefApplicantData.fulfilled]: (state, action) => {
      state.loadingInrRefApplicant = false;
      state.InrRefApplicantArray = action.payload;
      state.errorInrRef = "";
    },
    [InrRefApplicantData.rejected]: (state, action) => {
      state.loadingInrRefApplicant = false;
      state.errorInrRef = action.payload.response.data.message;
      state.InrRefApplicantArray = [];
    },
  },
});
export const { reset: resetInrRef } = InrRefApplicantSlicee.actions;
export const InrRefApplicantSlice = InrRefApplicantSlicee.reducer;
