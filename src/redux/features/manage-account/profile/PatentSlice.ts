import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const updatePatentDetails: any = createAsyncThunk(
  "PatentDetails",
  async (dat: any) => {
    try {
      const { data } = await API.patch(API_ENDPOINTS.MAC_JS_PATENT, dat);
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);
export const deletePatentDetails: any = createAsyncThunk(
  "PatentDetails",
  async (id: any) => {
    try {
      const { data } = await API.delete(`${API_ENDPOINTS.MAC_JS_PATENT}/${id}`);
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const deletePatentSlice = createSlice({
  name: "DetelePatentDetails",
  initialState: {
    deletePatent: [],
    dloading: true,
    derror: "",
  },
  reducers: {},
  extraReducers: {
    [deletePatentDetails.pending]: (state, action) => {
      state.dloading = true;
    },
    [deletePatentDetails.fulfilled]: (state, action) => {
      state.dloading = false;
      state.deletePatent = action.payload;
      state.derror = "";
    },
    [deletePatentDetails.rejected]: (state, action) => {
      state.dloading = false;
      state.derror = action.payload;
      state.deletePatent = [];
    },
  },
});


const PatentSlice = createSlice({
  name: "PatentDetails",
  initialState: {
    Patent: [],
    loading: true,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [updatePatentDetails.pending]: (state, action) => {
      state.loading = true;
    },
    [updatePatentDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.Patent = action.payload;
      state.error = "";
    },
    [updatePatentDetails.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.Patent = [];
    },
  },
});

export const PatentDetails = PatentSlice.reducer;
export default deletePatentSlice.reducer;
