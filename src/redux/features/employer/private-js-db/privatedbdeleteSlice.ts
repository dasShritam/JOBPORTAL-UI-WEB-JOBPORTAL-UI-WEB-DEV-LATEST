import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";
import API from "../../../../config/axios.config";

export const deletePrivateResume: any = createAsyncThunk(
  "deletePrivateResume",
  async (id: any) => {
    try {
      const { data } = await API.delete(
        `${API_ENDPOINTS.MAC_JOB_DELETE_PRIVATE_DB_RESUME}/${id}`
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const deletePrivateResumeSlice = createSlice({
  name: "deletePrivateResume",
  initialState: {
    delPrivateRes: [],
    loadingDr: false,
    errorDr: "",
  },
  reducers: {
    reset: (state) => {
      state.delPrivateRes = [];
      state.loadingDr = false;
      state.errorDr = "";
    },
  },
  extraReducers: {
    [deletePrivateResume.pending]: (state) => {
      state.loadingDr = true;
    },
    [deletePrivateResume.fulfilled]: (state, action) => {
      state.loadingDr = false;
      state.delPrivateRes = action.payload;
      state.errorDr = "";
    },
    [deletePrivateResume.rejected]: (state, action) => {
      state.loadingDr = false;
      state.delPrivateRes = [];
      state.errorDr = action.payload;
    },
  },
});

export const { reset: resetDelPrivateResCreator } =
  deletePrivateResumeSlice.actions;
export default deletePrivateResumeSlice.reducer;
