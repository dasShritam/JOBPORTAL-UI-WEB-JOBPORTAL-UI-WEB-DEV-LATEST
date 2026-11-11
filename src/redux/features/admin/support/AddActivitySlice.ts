import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const addActivity: any = createAsyncThunk(
  "AddActivity",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_ADD_TICKET_ACTIVITY,
        userInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const addActivitySlice = createSlice({
  name: "addActivity",
  initialState: {
    acresponse: [],
    acloading: false,
    acerrors: "",
  },
  reducers: {
    reset: (state) => {
      state.acloading = false;
      state.acresponse = [];
      state.acerrors = "";
    },
  },
  extraReducers: {
    [addActivity.pending]: (state) => {
      state.acloading = true;
    },
    [addActivity.fulfilled]: (state, action) => {
      state.acloading = false;
      state.acresponse = action.payload;
      state.acerrors = "";
    },
    [addActivity.rejected]: (state, action) => {
      state.acloading = false;
      state.acerrors = action.payload.response.data.message;
      state.acresponse = [];
    },
  },
});

export const addActivitySlice1 = addActivitySlice.reducer;
export const { reset: resetAddActivityCreator } = addActivitySlice.actions;
