import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

let myAction: string = "";
export const getNotifications: any = createAsyncThunk(
  "getNotifications",
  async (filters: any) => {
    try {
      myAction = filters?.action;
      filters = {
        pageId: filters?.pageId,
        pageLimit: filters?.pageLimit,
      };
      const { data } = await API.post(
        API_ENDPOINTS.NOTIFY_GET_NOTIFICATIONS,
        filters
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

export const viewNotification: any = createAsyncThunk(
  "viewNotification",
  async (filters: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.NOTIFY_VIEW_NOTIFICATION,
        filters
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const getNotifySlice = createSlice({
  name: "getNotifications",
  initialState: {
    actionGn: "",
    getNotify: [],
    loadNg: false,
    errorNg: "",
  },
  reducers: {
    reset: (state) => {
      state.actionGn = "";
      state.getNotify = [];
      state.loadNg = false;
      state.errorNg = "";
    },
  },
  extraReducers: {
    [getNotifications.pending]: (state) => {
      state.actionGn = "";
      state.loadNg = true;
    },
    [getNotifications.fulfilled]: (state, action) => {
      state.actionGn = myAction;
      state.getNotify = action.payload;
      state.loadNg = false;
      state.errorNg = "";
    },
    [getNotifications.rejected]: (state, action) => {
      state.getNotify = [];
      state.loadNg = false;
      state.errorNg = action.payload;
    },
  },
});

const viewNotifySlice = createSlice({
  name: "viewNotification",
  initialState: {
    viewNotify: [],
    loadNv: false,
    errorNv: "",
  },
  reducers: {
    reset: (state) => {
      state.viewNotify = [];
      state.loadNv = false;
      state.errorNv = "";
    },
  },
  extraReducers: {
    [viewNotification.pending]: (state) => {
      state.loadNv = true;
    },
    [viewNotification.fulfilled]: (state, action) => {
      state.viewNotify = action.payload;
      state.loadNv = false;
      state.errorNv = "";
    },
    [viewNotification.rejected]: (state, action) => {
      state.viewNotify = [];
      state.loadNv = false;
      state.errorNv = action.payload;
    },
  },
});

export const { reset: getNotifyReset } = getNotifySlice.actions;
export const { reset: viewNotifyReset } = viewNotifySlice.actions;
export const getNotificationSlice = getNotifySlice.reducer,
  viewNotificationSlice = viewNotifySlice.reducer;
