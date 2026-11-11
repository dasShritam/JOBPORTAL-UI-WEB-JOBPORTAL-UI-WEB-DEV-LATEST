import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const downloadAppImage: any = createAsyncThunk(
  "downloadImage",
  async (datamdl) => {
    try {
      const { data } = await API.post(
        `${API_ENDPOINTS.MAC_JOB_SAS_TOKEN}`,
        datamdl
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);
const downloadAppImageSl = createSlice({
  name: "downloadImageSlice",
  initialState: { image: [], load: true, error: "" },
  reducers: {},
  extraReducers: {
    [downloadAppImage.pending]: (state, action) => {
      state.load = true;
    },
    [downloadAppImage.fulfilled]: (state, action) => {
      state.load = false;
      state.image = action.payload;
      state.error = "";
    },
    [downloadAppImage.rejected]: (state, action) => {
      state.load = false;
      state.error = action.payload;
      state.image = [];
    },
  },
});
