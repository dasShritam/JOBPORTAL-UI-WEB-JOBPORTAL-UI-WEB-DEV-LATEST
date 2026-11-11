import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const postQuery: any = createAsyncThunk(
  "PostQuery",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_POST_QUERY, userInfo);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const patchContactInfo: any = createAsyncThunk(
  "PatchContactInfo",
  async (userInfo: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_PATCH_CONTACT_INFO,
        userInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const postQuerySlice = createSlice({
  name: "postQuery",
  initialState: {
    response: [],
    loading: false,
    errors: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.response = [];
      state.errors = "";
    },
  },
  extraReducers: {
    [postQuery.pending]: (state) => {
      state.loading = true;
    },
    [postQuery.fulfilled]: (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.errors = "";
    },
    [postQuery.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload.response.data.message;
      state.response = [];
    },
  },
});

const patchContactInfoSlice1 = createSlice({
  name: "PatchContactInfo",
  initialState: {
    patchResponse: [],
    patchloading: false,
    patcherrors: "",
  },
  reducers: {
    reset: (state) => {
      state.patchloading = false;
      state.patchResponse = [];
      state.patcherrors = "";
    },
  },
  extraReducers: {
    [patchContactInfo.pending]: (state) => {
      state.patchloading = true;
    },
    [patchContactInfo.fulfilled]: (state, action) => {
      state.patchloading = false;
      state.patchResponse = action.payload;
      state.patcherrors = "";
    },
    [patchContactInfo.rejected]: (state, action) => {
      state.patchloading = false;
      state.patcherrors = action.payload.response.data.message;
      state.patchResponse = [];
    },
  },
});

export const postQuerySlice1 = postQuerySlice.reducer;
export const { reset: resetPostQuery } = postQuerySlice.actions;

export const patchContactInfoSlice = patchContactInfoSlice1.reducer;
export const { reset: resetPatchContactInfo } = patchContactInfoSlice1.actions;
