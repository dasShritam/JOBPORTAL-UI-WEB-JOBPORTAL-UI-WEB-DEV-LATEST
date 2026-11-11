import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const updateOnlineProfile: any = createAsyncThunk(
  "OnlineProfileDetails",
  async (profileData) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JS_ONLINE_PROFILE,
        profileData
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const OnlineProfileDetails = createSlice({
  name: "OnlineProfileDetails",
  initialState: {
    OnlineProfileDetails: [],
    loadingState: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.OnlineProfileDetails = [];
      state.loadingState = false;
      state.error = "";
    },
  },
  extraReducers: {
    [updateOnlineProfile.pending]: (state, action) => {
      state.loadingState = true;
    },
    [updateOnlineProfile.fulfilled]: (state, action) => {
      state.loadingState = false;
      state.OnlineProfileDetails = action.payload;
      state.error = "";
    },
    [updateOnlineProfile.rejected]: (state, action) => {
      state.loadingState = false;
      state.error = action.payload;
      state.OnlineProfileDetails = [];
    },
  },
});

export const deleteOnlineProfile: any = createAsyncThunk(
  "DeleteProfileDetails",
  async (id) => {
    try {
      const { data } = await API.delete(
        `${API_ENDPOINTS.MAC_ONLINE_PROFILE}/${id}`
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const DeleteProfileDetails = createSlice({
  name: "DeleteProfileDetails",
  initialState: {
    DeleteProfileDetails: [],
    loadingDS: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.DeleteProfileDetails = [];
      state.loadingDS = false;
      state.error = "";
    },
  },
  extraReducers: {
    [deleteOnlineProfile.pending]: (state, action) => {
      state.loadingDS = true;
    },
    [deleteOnlineProfile.fulfilled]: (state, action) => {
      state.loadingDS = false;
      state.DeleteProfileDetails = action.payload;
      state.error = "";
    },
    [deleteOnlineProfile.rejected]: (state, action) => {
      state.loadingDS = false;
      state.error = action.payload;
      state.DeleteProfileDetails = [];
    },
  },
});
export const { reset: resetOnlineProfileSl } = OnlineProfileDetails.actions;
export const { reset: resetDeletedProfileSl } = DeleteProfileDetails.actions;
export default OnlineProfileDetails.reducer;
export const deleteProfileDetails = DeleteProfileDetails.reducer;
