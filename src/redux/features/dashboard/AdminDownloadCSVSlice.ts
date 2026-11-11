import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const totalDownloadCsvFile: any = createAsyncThunk(
  "totalDownloadCsvFile",
  async (dataInfo: any) => {
    try {
      const res = await API.post(
          API_ENDPOINTS.MAC_DOWNLOAD_CSV_FILE,
          dataInfo
          //   { responseType: "text" }
        ),
        filename = `applicants-list-${new Date().getTime()}`,
        blob = new Blob([res.data], { type: "text/csv" }),
        url = window.URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      // return data;
    } catch (error: any) {
      return error;
    }
  }
);
const totalDownloadCsvFileSlice = createSlice({
  name: "totalDownloadCsvFile",
  initialState: {
    downCsvFile: [],
    downCsvFileLoading: false,
    downCsvFileError: "",
  },
  reducers: {
    reset: (state) => {
      state.downCsvFile = [];
      state.downCsvFileLoading = true;
      state.downCsvFileError = "";
    },
  },
  extraReducers: {
    [totalDownloadCsvFile.pending]: (state, action) => {
      state.downCsvFileLoading = true;
    },
    [totalDownloadCsvFile.fulfilled]: (state, action) => {
      state.downCsvFile = action.payload;
      state.downCsvFileError = "";
      state.downCsvFileLoading = false;
    },
    [totalDownloadCsvFile.error]: (state, action) => {
      state.downCsvFile = [];
      state.downCsvFileError = action.payload.response.data.message;
      state.downCsvFileLoading = false;
    },
  },
});
export const { reset: resetDownloadCsv } = totalDownloadCsvFileSlice.actions;
export const TotalDownloadCsvFileSlice = totalDownloadCsvFileSlice.reducer;
