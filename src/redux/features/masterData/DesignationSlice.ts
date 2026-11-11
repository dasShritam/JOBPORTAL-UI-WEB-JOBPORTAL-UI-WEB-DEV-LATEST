import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const DesignationMasterData: any = createAsyncThunk("DesignationMasterData", async (dat: any) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.MAC_DESIGNATION, dat);
    return data.data;
  } catch (error: any) {
    return error;
  }
});
const DesignationMasterDataSlice = createSlice({
  name: "DesignationMasterData",
  initialState: {
    DesignationData: [],
    desloading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.DesignationData = [];
      state.desloading = true;
      state.error = "";
    },
  },
  extraReducers: {
    [DesignationMasterData.pending]: (state, action) => {
      state.desloading = true;
    },
    [DesignationMasterData.fulfilled]: (state, action) => {
      state.desloading = false;
      state.DesignationData = action.payload;
      state.error = "";
    },
    [DesignationMasterData.rejected]: (state, action) => {
      state.desloading = false;
      state.error = action.payload.response.data.message;
      state.DesignationData = [];
    },
  },
});
export const { reset: resetDesignationMasterData } = DesignationMasterDataSlice.actions;
export default DesignationMasterDataSlice.reducer;
