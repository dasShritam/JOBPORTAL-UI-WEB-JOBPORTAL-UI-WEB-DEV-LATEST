import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const updatePresentationDetails: any = createAsyncThunk(
  "PresentationDetails",
  async (presentationData) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JS_PPT,
        presentationData
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const PresentationDetailsSlice = createSlice({
  name: "PresentationDetails",
  initialState: {
    PresentationDetails: [],
    Persentationloading: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.PresentationDetails = [];
      state.Persentationloading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [updatePresentationDetails.pending]: (state, action) => {
      state.Persentationloading = true;
    },
    [updatePresentationDetails.fulfilled]: (state, action) => {
      state.Persentationloading = false;
      state.PresentationDetails = action.payload;
      state.error = "";
    },
    [updatePresentationDetails.rejected]: (state, action) => {
      state.Persentationloading = false;
      state.error = action.payload;
      state.PresentationDetails = [];
    },
  },
});

export const deletePresentationDetail: any = createAsyncThunk(
  "deletePresentationDetail",
  async (id) => {
    try {
      const { data } = await API.delete(
        `${API_ENDPOINTS.MAC_PRESENTATION}/${id}`
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const DeletePresentationDetailSlice = createSlice({
  name: "deletePresentationDetail",
  initialState: {
    PresentationDetailsRes: [],
    deletePresentationLoading: true,
    deletePresentationError: "",
  },
  reducers: {
    reset: (state) => {
      state.PresentationDetailsRes = [];
      state.deletePresentationLoading = false;
      state.deletePresentationError = "";
    },
  },
  extraReducers: {
    [deletePresentationDetail.pending]: (state, action) => {
      state.deletePresentationLoading = true;
    },
    [deletePresentationDetail.fulfilled]: (state, action) => {
      state.deletePresentationLoading = false;
      state.PresentationDetailsRes = action.payload;
      state.deletePresentationError = "";
    },
    [deletePresentationDetail.rejected]: (state, action) => {
      state.deletePresentationLoading = false;
      state.deletePresentationError = action.payload;
      state.PresentationDetailsRes = [];
    },
  },
});

export const { reset: resetPresentationSl } = PresentationDetailsSlice.actions;
export const { reset: resetDeletePresentationSl } =
  DeletePresentationDetailSlice.actions;
export const Presentation = PresentationDetailsSlice.reducer,
  deletePresentationDetailS1 = DeletePresentationDetailSlice.reducer;
