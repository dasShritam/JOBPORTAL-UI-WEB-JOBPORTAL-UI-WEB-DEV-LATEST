import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const updateTicketStatus: any = createAsyncThunk(
  "UpdateTicketStatus",
  async (userInfo: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_UPDATE_TICKET_STATUS,
        userInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const updateTicketStatusSlice1 = createSlice({
  name: "UpdateTicketStatus",
  initialState: {
    tsResponse: [],
    tsloading: false,
    tserrors: "",
  },
  reducers: {
    reset: (state) => {
      state.tsloading = false;
      state.tsResponse = [];
      state.tserrors = "";
    },
  },
  extraReducers: {
    [updateTicketStatus.pending]: (state) => {
      state.tsloading = true;
    },
    [updateTicketStatus.fulfilled]: (state, action) => {
      state.tsloading = false;
      state.tsResponse = action.payload;
      state.tserrors = "";
    },
    [updateTicketStatus.rejected]: (state, action) => {
      state.tsloading = false;
      state.tserrors = action.payload.response.data.message;
      state.tsResponse = [];
    },
  },
});

export const updateTicketStatusSlice = updateTicketStatusSlice1.reducer;
export const { reset: resetUpdateTicketStatus } =
  updateTicketStatusSlice1.actions;
