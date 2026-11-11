import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const DepartmentMasterData: any = createAsyncThunk("DepartmentMasterData", async (dat: any) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.MAC_DEPARTMENTS, dat);
    return data.data;
  } catch (error: any) {
    return error;
  }
});
const DepartmentMasterDataSlice = createSlice({
  name: "DepartmentMasterData",
  initialState: {
    DepartmentData: [],
    dptloading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.DepartmentData = [];
      state.dptloading = true;
      state.error = "";
    },
  },
  extraReducers: {
    [DepartmentMasterData.pending]: (state, action) => {
      state.dptloading = true;
    },
    [DepartmentMasterData.fulfilled]: (state, action) => {
      state.dptloading = false;
      state.DepartmentData = action.payload;
      state.error = "";
    },
    [DepartmentMasterData.rejected]: (state, action) => {
      state.dptloading = false;
      state.error = action.payload.response.data.message;
      state.DepartmentData = [];
    },
  },
});
export const { reset: resetDepartmentMasterData } = DepartmentMasterDataSlice.actions;
export default DepartmentMasterDataSlice.reducer;
