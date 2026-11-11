import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const SetEmailNotification: any = createAsyncThunk(
  "EmailNotification",

  async (datas: any) => {
    try {
      console.log(datas);

      const { data } = await API.post(
        `${API_ENDPOINTS.MAC_EMAIL_SUBSCRIPTION}/${datas}`
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const SetEmailNotificationSlice = createSlice({
  name: "EmailNotification",
  initialState: {
    emailSub: [],
    loadEmailSub: false,
    emailSubError: "",
  },
  reducers: {
    reset: (state) => {
      state.loadEmailSub = false;
      state.emailSub = [];
      state.emailSubError = "";
    },
  },
  extraReducers: {
    [SetEmailNotification.pending]: (state, action) => {
      state.loadEmailSub = true;
    },
    [SetEmailNotification.fulfilled]: (state, action) => {
      state.loadEmailSub = false;
      state.emailSub = action.payload;
      state.emailSubError = "";
    },
    [SetEmailNotification.rejected]: (state, action) => {
      state.loadEmailSub = false;
      state.emailSubError = action.payload.response.data.message;
      state.emailSub = [];
    },
  },
});

export const setEmailNotificationSlice1 = SetEmailNotificationSlice.reducer;
export const { reset: resetGetTermsAndConditions } =
  SetEmailNotificationSlice.actions;
