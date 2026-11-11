import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const getEpmMails: any = createAsyncThunk(
  "getEpmMails",
  async (datas: any) => {
    try {
      const { data } = await API.get(API_ENDPOINTS.MAC_EMP_CONTACTS, datas);
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const getEpmMailSlice = createSlice({
  name: "getEpmMails",
  initialState: {
    MailIDs: [],
    loadingM: false,
    errorM: "",
  },
  reducers: {
    reset: (state) => {
      state.MailIDs = [];
      state.loadingM = false;
      state.errorM = "";
    },
  },
  extraReducers: {
    [getEpmMails.pending]: (state) => {
      state.loadingM = true;
    },
    [getEpmMails.fulfilled]: (state, action) => {
      state.loadingM = false;
      state.MailIDs = action.payload;
      state.errorM = "";
    },
    [getEpmMails.rejected]: (state, action) => {
      state.loadingM = false;
      state.MailIDs = [];
      state.errorM = action.payload;
    },
  },
});

export const { reset: getEpmMailSliceReset } = getEpmMailSlice.actions;
export default getEpmMailSlice.reducer;
