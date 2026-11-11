import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const updateBasicDetails: any = createAsyncThunk(
  "BasicDetails",
  async (basicData) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JS_BASIC_DETAILS,
        basicData
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const BasicDetailSl = createSlice({
  name: "BasicDetails",
  initialState: {
    BasicDetails: [],
    loadingBS: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.BasicDetails = [];
      state.loadingBS = false;
      state.error = "";
    },
  },
  extraReducers: {
    [updateBasicDetails.pending]: (state, action) => {
      state.loadingBS = true;
    },
    [updateBasicDetails.fulfilled]: (state, action) => {
      state.loadingBS = false;
      state.BasicDetails = action.payload;
      state.error = "";
    },
    [updateBasicDetails.rejected]: (state, action) => {
      state.loadingBS = false;
      state.error = action.payload;
      state.BasicDetails = [];
    },
  },
});

export const profileStrength: any = createAsyncThunk(
  "ProfileStrength",
  async () => {
    try {
      const { data } = await API.get(API_ENDPOINTS.MAC_PROF_METER);
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const ProfileStrengthSl = createSlice({
  name: "ProfileStrength",
  initialState: {
    pflStrnRes: [],
    loading2: true,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [profileStrength.pending]: (state, action) => {
      state.loading2 = true;
    },
    [profileStrength.fulfilled]: (state, action) => {
      state.loading2 = false;
      state.pflStrnRes = action.payload;
      state.error = "";
    },
    [profileStrength.rejected]: (state, action) => {
      state.loading2 = false;
      state.error = action.payload;
      state.pflStrnRes = [];
    },
  },
});

export const { reset: resetBasicDetSl } = BasicDetailSl.actions;
export const BasicDetailSlice = BasicDetailSl.reducer,
  ProfileStrengthSlice = ProfileStrengthSl.reducer;
