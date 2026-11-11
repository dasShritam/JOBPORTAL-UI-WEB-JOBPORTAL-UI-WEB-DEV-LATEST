import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const jobSeekerProfileMasterData: any = createAsyncThunk(
  "JobSeekerProfileMasterData",
  async (dataInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_MASTER_DATA, dataInfo);
      return data.data.data;
    } catch (error: any) {
      return error;
    }
  }
);

export const contactInfoMasterData: any = createAsyncThunk(
  "ContactInfoMasterData",
  async (dataInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_MASTER_DATA, dataInfo);
      return data.data.data;
    } catch (error: any) {
      return error;
    }
  }
);

const jobSeekerProfileMasterDataSlice = createSlice({
  name: "JobSeekerProfileMasterData",
  initialState: {
    JSMasterData: [],
    loading: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.JSMasterData = [];
      state.loading = true;
      state.error = "";
    },
  },
  extraReducers: {
    [jobSeekerProfileMasterData.pending]: (state, action) => {
      state.loading = true;
    },
    [jobSeekerProfileMasterData.fulfilled]: (state, action) => {
      state.loading = false;
      state.JSMasterData = action.payload;
      state.error = "";
    },
    [jobSeekerProfileMasterData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.JSMasterData = [];
    },
  },
});

const contactInfoMasterDataSlice1 = createSlice({
  name: "ContactInfoMasterData",
  initialState: {
    CInfoMasterData: [],
    ciloading: false,
    cierror: "",
  },
  reducers: {
    reset: (state) => {
      state.CInfoMasterData = [];
      state.ciloading = false;
      state.cierror = "";
    },
  },
  extraReducers: {
    [contactInfoMasterData.pending]: (state, action) => {
      state.ciloading = true;
    },
    [contactInfoMasterData.fulfilled]: (state, action) => {
      state.ciloading = false;
      state.CInfoMasterData = action.payload;
      state.cierror = "";
    },
    [contactInfoMasterData.rejected]: (state, action) => {
      state.ciloading = false;
      state.cierror = action.payload.response.data.message;
      state.CInfoMasterData = [];
    },
  },
});

export const { reset: resetJobSeekerProfileMasterData } =
  jobSeekerProfileMasterDataSlice.actions;
export default jobSeekerProfileMasterDataSlice.reducer;

export const contactInfoMasterDataSlice = contactInfoMasterDataSlice1.reducer;

export const { reset: resetContactInfoMasterData } =
  contactInfoMasterDataSlice1.actions;
