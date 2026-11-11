import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const sendEmailToRecruiter: any = createAsyncThunk(
  "Emails",
  async (emailCred: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_SEND_MAIL,
        emailCred
      );
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

const EmailSl = createSlice({
  name: "Emails",
  initialState: {
    Emails: [],
    loadReM: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.Emails = [];
      state.loadReM = true;
      state.error = "";
    },
  },
  extraReducers: {
    [sendEmailToRecruiter.pending]: (state, action) => {
      state.loadReM = true;
    },
    [sendEmailToRecruiter.fulfilled]: (state, action) => {
      state.loadReM = false;
      state.Emails = action.payload;
      state.error = "";
    },
    [sendEmailToRecruiter.rejected]: (state, action) => {
      state.loadReM = false;
      state.error = action.payload;
      state.Emails = [];
    },
  },
});

export const { reset: recruitmentMailReset } = EmailSl.actions;
export const emailSendSlice = EmailSl.reducer;
