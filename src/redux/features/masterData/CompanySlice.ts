import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const CompanyMasterData: any = createAsyncThunk("CompanyMasterData", async (dat: any) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.MAC_COM_NAMES, dat);

    return data.data;
  } catch (error: any) {
    return error;
  }
});
const CompanyMasterDataSlice = createSlice({
  name: "CompanyMasterData",
  initialState: {
    CompanyData: [],
    Cmploading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.CompanyData = [];
      state.Cmploading = true;
      state.error = "";
    },
  },
  extraReducers: {
    [CompanyMasterData.pending]: (state, action) => {
      state.Cmploading = true;
    },
    [CompanyMasterData.fulfilled]: (state, action) => {
      state.Cmploading = false;
      state.CompanyData = action.payload;
      state.error = "";
    },
    [CompanyMasterData.rejected]: (state, action) => {
      state.Cmploading = false;
      state.error = action.payload.response.data.message;
      state.CompanyData = [];
    },
  },
});
export const { reset: resetCompanyMasterData } = CompanyMasterDataSlice.actions;
export default CompanyMasterDataSlice.reducer;
