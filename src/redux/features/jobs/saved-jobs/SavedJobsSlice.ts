import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const GetSavedJobs: any = createAsyncThunk(
  "SavedJobs",
  async (datas: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_FETCH_JOB_APPLICATION,
        datas
      );
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

export const PatchSaveUnSaveJob: any = createAsyncThunk(
  "SaveOrUnsave",
  async (datas: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JOB_JOBSEEKER_ACTION,
        datas
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const PatchSaveUnSavedJobSlice = createSlice({
  name: "SaveOrUnsave",
  initialState: {
    saveOrUnsave: [],
    loadingSave: false,
    errorSave: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingSave = false;
      state.saveOrUnsave = [];
      state.errorSave = "";
    },
  },
  extraReducers: {
    [PatchSaveUnSaveJob.pending]: (state, action) => {
      state.loadingSave = true;
    },
    [PatchSaveUnSaveJob.fulfilled]: (state, action) => {
      state.loadingSave = false;
      state.saveOrUnsave = action.payload;
      state.errorSave = "";
    },
    [PatchSaveUnSaveJob.rejected]: (state, action) => {
      state.loadingSave = true;
      state.errorSave = action.payload.response.data.message;
      state.saveOrUnsave = [];
    },
  },
});

export const PatchSaveUnSaveJobSlice = PatchSaveUnSavedJobSlice.reducer;
export const { reset: resetSaveUnsaveCreator } =
  PatchSaveUnSavedJobSlice.actions;

const GetSavedJobsSlicee = createSlice({
  name: "SavedJobs",
  initialState: {
    savedjobs: [],
    loadjobs: false,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [GetSavedJobs.pending]: (state, action) => {
      state.loadjobs = true;
    },
    [GetSavedJobs.fulfilled]: (state, action) => {
      state.loadjobs = false;
      state.savedjobs = action.payload;
      state.error = "";
    },
    [GetSavedJobs.rejected]: (state, action) => {
      state.loadjobs = false;
      state.error = action.payload.response.data.message;
      state.savedjobs = [];
    },
  },
});

export const GetSavedJobsSlice = GetSavedJobsSlicee.reducer;
