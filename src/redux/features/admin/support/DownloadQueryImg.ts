import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const downloadQueryImg: any = createAsyncThunk(
  "downloadQImg",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_DOWNLOAD_QUERY_IMG,
        userInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const downloadQueryImgS1 = createSlice({
  name: "downloadQueryImgSlice",
  initialState: {
    image: [],
    load: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.image = [];
      state.load = false;
      state.error = "";
    },
  },
  extraReducers: {
    [downloadQueryImg.pending]: (state, action) => {
      state.load = true;
    },
    [downloadQueryImg.fulfilled]: (state, action) => {
      state.load = false;
      state.image = action.payload;
      state.error = "";
    },
    [downloadQueryImg.rejected]: (state, action) => {
      state.load = false;
      state.error = action.payload.response.data.message;
      state.image = [];
    },
  },
});

export const { reset: resetDownloadQueryImg } = downloadQueryImgS1.actions;

export const downloadQueryImgSlice = downloadQueryImgS1.reducer;
