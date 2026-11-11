import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const postTermsAndCondition: any = createAsyncThunk(
  "PostTermsAndCondition",
  async (termsInfo: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_TC_PRIVACYPOLICY,
        termsInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const gettermsAndCondition: any = createAsyncThunk(
  "GetTermsAndCondition",
  async (termsInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_GET_TC_PRIVACYPOLICY,
        termsInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const postSettings: any = createAsyncThunk(
  "PostSettings",
  async (termsInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_UPDATE_APP_SETTING,
        termsInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const gettermsSettings: any = createAsyncThunk(
  "GetTermsSettings",
  async (termsInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_MASTERDATA_SETTINGS,
        termsInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);
const getTermsAndConditionSlice1 = createSlice({
  name: "GetTermsAndCondition",
  initialState: {
    termsAndPolicy: [],
    termsAndPolicyLoading: false,
    termsAndPolicyError: "",
  },
  reducers: {
    reset: (state) => {
      state.termsAndPolicyLoading = false;
      state.termsAndPolicy = [];
      state.termsAndPolicyError = "";
    },
  },
  extraReducers: {
    [gettermsAndCondition.pending]: (state) => {
      state.termsAndPolicyLoading = true;
    },
    [gettermsAndCondition.fulfilled]: (state, action) => {
      state.termsAndPolicyLoading = false;
      state.termsAndPolicy = action.payload;
      state.termsAndPolicyError = "";
    },
    [gettermsAndCondition.rejected]: (state, action) => {
      state.termsAndPolicyLoading = false;
      state.termsAndPolicyError = action.payload.response.data.message;
      state.termsAndPolicy = [];
    },
  },
});

const termsAndConditionSlice1 = createSlice({
  name: "TermsAndCondition",
  initialState: {
    termsArray: [],
    termsLoading: false,
    termsError: "",
  },
  reducers: {
    reset: (state) => {
      state.termsLoading = false;
      state.termsArray = [];
      state.termsError = "";
    },
  },
  extraReducers: {
    [postTermsAndCondition.pending]: (state) => {
      state.termsLoading = true;
    },
    [postTermsAndCondition.fulfilled]: (state, action) => {
      state.termsLoading = false;
      state.termsArray = action.payload;
      state.termsError = "";
    },
    [postTermsAndCondition.rejected]: (state, action) => {
      state.termsLoading = false;
      state.termsError = action.payload.response.data.message;
      state.termsArray = [];
    },
  },
});

const patchTermsAndConditionSlice1 = createSlice({
  name: "PostSettings",
  initialState: {
    termsSettings: [],
    termsSettingsLoading: false,
    termsSettingsError: "",
  },
  reducers: {
    reset: (state) => {
      state.termsSettingsLoading = false;
      state.termsSettings = [];
      state.termsSettingsError = "";
    },
  },
  extraReducers: {
    [postSettings.pending]: (state) => {
      state.termsSettingsLoading = true;
    },
    [postSettings.fulfilled]: (state, action) => {
      state.termsSettingsLoading = false;
      state.termsSettings = action.payload;
      state.termsSettingsError = "";
    },
    [postSettings.rejected]: (state, action) => {
      state.termsSettingsLoading = false;
      state.termsSettingsError = action.payload.response.data.message;
      state.termsSettings = [];
    },
  },
});

const getTermsSettingsSlice1 = createSlice({
  name: "GetTermsSettings",
  initialState: {
    termsSettings1: [],
    termsSettingsLoading1: false,
    termsSettingsError1: "",
  },
  reducers: {
    reset: (state) => {
      state.termsSettingsLoading1 = false;
      state.termsSettings1 = [];
      state.termsSettingsError1 = "";
    },
  },
  extraReducers: {
    [gettermsSettings.pending]: (state) => {
      state.termsSettingsLoading1 = true;
    },
    [gettermsSettings.fulfilled]: (state, action) => {
      state.termsSettingsLoading1 = false;
      state.termsSettings1 = action.payload;
      state.termsSettingsError1 = "";
    },
    [gettermsSettings.rejected]: (state, action) => {
      state.termsSettingsLoading1 = false;
      state.termsSettingsError1 = action.payload.response.data.message;
      state.termsSettings1 = [];
    },
  },
});

export const termsAndConditionSlice = termsAndConditionSlice1.reducer,
  getTermsAndConditionSlice = getTermsAndConditionSlice1.reducer,
  patchTermsAndConditionSlice = patchTermsAndConditionSlice1.reducer,
  getTermsSettingsSlice = getTermsSettingsSlice1.reducer;
export const { reset: resetPostTermsAndCondition } =
    termsAndConditionSlice1.actions,
  { reset: resetGetTermsAndCondition } = termsAndConditionSlice1.actions,
  { reset: resetTermsSettings } = patchTermsAndConditionSlice1.actions,
  { reset: resetGetTermsSettings } = getTermsSettingsSlice1.actions;
