import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const getCommonMasterData: any = createAsyncThunk(
  "getCommonMasterData",
  async (dataInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_COMMON_MASTER, dataInfo);
      return data.data.data;
    } catch (error: any) {
      return error;
    }
  }
);

const commonMasterDataSlice = createSlice({
  name: "CommonMasterData",
  initialState: { 
    cmasterData: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [getCommonMasterData.pending]: (state, action) => {
      state.loading = true;
    },
    [getCommonMasterData.fulfilled]: (state, action) => {
      state.loading = false;
      state.cmasterData = action.payload;
      state.error = "";
    },
    [getCommonMasterData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.cmasterData = [];
    },
  },
});

export default commonMasterDataSlice.reducer;
