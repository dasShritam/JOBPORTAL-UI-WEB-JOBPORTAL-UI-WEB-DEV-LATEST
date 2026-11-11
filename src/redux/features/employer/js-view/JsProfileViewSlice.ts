import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const jsProfileDetails: any = createAsyncThunk(
  "JsProfileView",
  async (user_id) => {
    try {
      const { data } = await API.get(
        `${API_ENDPOINTS.MAC_JOB_JS_Info}/${user_id}`
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const JsProfileViewSlicel = createSlice({
  name: "JsProfileView",
  initialState: {
    details: [],
    loadingg: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingg = false;
      state.details = [];
      state.error = "";
    },
  },
  extraReducers: {
    [jsProfileDetails.pending]: (state, action) => {
      state.loadingg = true;
    },
    [jsProfileDetails.fulfilled]: (state, action) => {
      state.loadingg = false;
      state.details = action.payload;
      state.error = "";
    },
    [jsProfileDetails.rejected]: (state, action) => {
      state.loadingg = false;
      state.error = action.payload;
      state.details = [];
    },
  },
});

export const JsProfileViewSlice = JsProfileViewSlicel.reducer;
export const { reset: resetJsProfileViewSlice } = JsProfileViewSlicel.actions;
