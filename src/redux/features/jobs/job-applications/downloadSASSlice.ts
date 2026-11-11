import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const downloadSAS: any = createAsyncThunk(
  "downloadSAS",
  async (id: any) => {
    try {
      const { data } = await API.post(`${API_ENDPOINTS.MAC_JOB_SAS_TOKEN}`, id);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);
const successState: any = { code: 200, message: "", data: [] };
const downloadSASSlice = createSlice({
  name: "downloadSAS",
  initialState: {
    sasData: [],
    load: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.sasData = [];
      state.load = false;
      state.error = "";
    },
    success: (state) => {
      state.sasData = successState;
      state.load = false;
      state.error = "";
    },
  },
  extraReducers: {
    [downloadSAS.pending]: (state, action) => {
      state.load = true;
    },
    [downloadSAS.fulfilled]: (state, action) => {
      state.load = false;
      state.sasData = action.payload;
      state.error = "";
    },
    [downloadSAS.rejected]: (state, action) => {
      state.load = false;
      state.error = action.payload;
      state.sasData = [];
    },
  },
});

export const { reset: resetSAS, success: successSAS } =
  downloadSASSlice.actions;
export default downloadSASSlice.reducer;
