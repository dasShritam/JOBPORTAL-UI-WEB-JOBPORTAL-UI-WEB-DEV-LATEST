import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const fetchTickets: any = createAsyncThunk(
  "FetchTickets",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_FETCH_TICKETS,
        userInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const fetchTicketsSlice = createSlice({
  name: "fetchTickets",
  initialState: {
    ftresponse: [],
    ftloading: false,
    fterrors: "",
  },
  reducers: {
    reset: (state) => {
      state.ftloading = false;
      state.ftresponse = [];
      state.fterrors = "";
    },
  },
  extraReducers: {
    [fetchTickets.pending]: (state) => {
      state.ftloading = true;
    },
    [fetchTickets.fulfilled]: (state, action) => {
      state.ftloading = false;
      state.ftresponse = action.payload;
      state.fterrors = "";
    },
    [fetchTickets.rejected]: (state, action) => {
      state.ftloading = false;
      state.fterrors = action.payload.response.data.message;
      state.ftresponse = [];
    },
  },
});

export const fetchTicketsSlice1 = fetchTicketsSlice.reducer;
export const { reset: resetFetchTickets } = fetchTicketsSlice.actions;
