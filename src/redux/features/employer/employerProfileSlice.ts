import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const uploadPrfimg: any = createAsyncThunk(
  "uploadPrfimg",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_PROFILE_IMG, userInfo);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const uploadProfileImgSl = createSlice({
  name: "uploadPrfimg",
  initialState: {
    response: [],
    loads: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loads = false;
      state.response = [];
      state.error = "";
    },
  },
  extraReducers: {
    [uploadPrfimg.pending]: (state, action) => {
      state.loads = true;
    },
    [uploadPrfimg.fulfilled]: (state, action) => {
      state.loads = false;
      state.response = action.payload;
      state.error = "";
    },
    [uploadPrfimg.rejected]: (state, action) => {
      state.loads = false;
      state.error = action.payload;
      state.response = [];
    },
  },
});
export const { reset: resetProfileImg } = uploadProfileImgSl.actions;
export const uploadProfileImgSlice = uploadProfileImgSl.reducer;
