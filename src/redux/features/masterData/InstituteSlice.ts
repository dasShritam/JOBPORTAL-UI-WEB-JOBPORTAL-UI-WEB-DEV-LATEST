import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const universitiesMasterData: any = createAsyncThunk(
  "universitiesMasterData",
  async (dat: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_UNIVERSITIES, dat);

      return data.data;
    } catch (error: any) {
      return error;
    }
  }
);
const universitiesMasterDataSlice = createSlice({
  name: "universitiesMasterData",
  initialState: {
    universityData: [],
    universityloading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.universityData = [];
      state.universityloading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [universitiesMasterData.pending]: (state, action) => {
      state.universityloading = true;
    },
    [universitiesMasterData.fulfilled]: (state, action) => {
      state.universityloading = false;
      state.universityData = action.payload;
      state.error = "";
    },
    [universitiesMasterData.rejected]: (state, action) => {
      state.universityloading = false;
      state.error = action.payload.response.data.message;
      state.universityData = [];
    },
  },
});

export const { reset: resetUniversityData } =
  universitiesMasterDataSlice.actions;
export default universitiesMasterDataSlice.reducer;
