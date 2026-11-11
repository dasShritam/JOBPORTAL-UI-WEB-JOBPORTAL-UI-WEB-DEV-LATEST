import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const patchUpdateCertification: any = createAsyncThunk(
  "updateCertification",
  async (updateCertificationDetails: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JS_CERT,
        updateCertificationDetails
      );
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const CertificationSlicee = createSlice({
  name: "updateCertification",
  initialState: {
    UpdatedCertification: [],
    loadingCert: true,
    errorCert: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingCert = false;
      state.UpdatedCertification = [];
      state.errorCert = "";
    },
  },
  extraReducers: {
    [patchUpdateCertification.pending]: (state, action) => {
      state.loadingCert = true;
    },
    [patchUpdateCertification.fulfilled]: (state, action) => {
      state.loadingCert = false;
      state.UpdatedCertification = action.payload;
      state.errorCert = "";
    },
    [patchUpdateCertification.rejected]: (state, action) => {
      state.loadingCert = false;
      state.errorCert = action.payload;
      state.UpdatedCertification = [];
    },
  },
});

export const deleteCertification: any = createAsyncThunk(
  "deleteCertification",
  async (deleteCertificationDetails: any) => {
    try {
      const { data } = await API.delete(
        `${API_ENDPOINTS.MAC_CERT}/${deleteCertificationDetails}`
      );
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const CertificationDeleteSlicee = createSlice({
  name: "deleteCertification",
  initialState: {
    DeletedCertification: [],
    loadingCerti: true,
    errorCerti: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingCerti = false;
      state.DeletedCertification = [];
      state.errorCerti = "";
    },
  },
  extraReducers: {
    [deleteCertification.pending]: (state, action) => {
      state.loadingCerti = true;
    },
    [deleteCertification.fulfilled]: (state, action) => {
      state.loadingCerti = false;
      state.DeletedCertification = action.payload;
      state.errorCerti = "";
    },
    [deleteCertification.rejected]: (state, action) => {
      state.loadingCerti = false;
      state.errorCerti = action.payload;
      state.DeletedCertification = [];
    },
  },
});
export const { reset: resetDelete } = CertificationDeleteSlicee.actions;
export default CertificationDeleteSlicee.reducer;

export const { reset: resetCertificateSl } = CertificationSlicee.actions;
export const CertificationSlice = CertificationSlicee.reducer,
  CertificationDeleteSlice = CertificationDeleteSlicee.reducer;
