import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const PostInternalOrRefJob: any = createAsyncThunk(
  "InternalOrRefJob",
  async (input: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_POST_INT_JOB,
        input
      );
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

export const PatchInternalOrRefJob: any = createAsyncThunk(
  "Patch_InternalOrRefJob",
  async (input: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JOB_PATCH_INT_JOB,
        input
      );
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

export const GetHiringManagers: any = createAsyncThunk(
  "HiringManager",
  async () => {
    try {
      const { data } = await API.get(API_ENDPOINTS.MAC_EMP_CONTACTS);
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

export const GetInternalOrRefJob: any = createAsyncThunk(
  "Get_InternalOrRefJob",
  async (input: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MJOB_GET_INT_JOB, input);
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

const PostInternalOrRefJobSliceItem = createSlice({
  name: "InternalOrRefJob",
  initialState: {
    postJobRes: "",
    pjloading: false,
    pjerror: "",
  },
  reducers: {
    reset: (state) => {
      state.pjloading = false;
      state.pjerror = "";
      state.postJobRes = "";
    },
  },
  extraReducers: {
    [PostInternalOrRefJob.pending]: (state, action) => {
      state.pjloading = true;
    },
    [PostInternalOrRefJob.fulfilled]: (state, action) => {
      state.pjloading = false;
      state.postJobRes = action.payload;
      state.pjerror = "";
    },
    [PostInternalOrRefJob.rejected]: (state, action) => {
      state.pjloading = false;
      state.pjerror = action.payload.response.data.message;
      state.postJobRes = "";
    },
  },
});

const PatchInternalOrRefJobSliceItem = createSlice({
  name: "Patch_InternalOrRefJob",
  initialState: {
    patchJobRes: "",
    patchJobloading: false,
    patchJoberror: "",
  },
  reducers: {
    reset: (state) => {
      state.patchJobloading = false;
      state.patchJoberror = "";
      state.patchJobRes = "";
    },
  },
  extraReducers: {
    [PatchInternalOrRefJob.pending]: (state, action) => {
      state.patchJobloading = true;
    },
    [PatchInternalOrRefJob.fulfilled]: (state, action) => {
      state.patchJobloading = false;
      state.patchJobRes = action.payload;
      state.patchJoberror = "";
    },
    [PatchInternalOrRefJob.rejected]: (state, action) => {
      state.patchJobloading = false;
      state.patchJoberror = action.payload.response.data.message;
      state.patchJobRes = "";
    },
  },
});

const GetHiringManagersSliceItem = createSlice({
  name: "HiringManager",
  initialState: {
    hmdata: [],
    hmloading: false,
    hmerror: "",
  },
  reducers: {
    reset: (state) => {
      state.hmloading = false;
      state.hmerror = "";
      state.hmdata = [];
    },
  },
  extraReducers: {
    [GetHiringManagers.pending]: (state, action) => {
      state.hmloading = true;
    },
    [GetHiringManagers.fulfilled]: (state, action) => {
      state.hmloading = false;
      state.hmdata = action.payload;
      state.hmerror = "";
    },
    [GetHiringManagers.rejected]: (state, action) => {
      state.hmloading = false;
      state.hmerror = action.payload.response.data.message;
      state.hmdata = [];
    },
  },
});

const GetInternalOrRefJobSliceItem = createSlice({
  name: "Get_InternalOrRefJob",
  initialState: {
    jobData: [],
    jobLoading: false,
    jobError: "",
  },
  reducers: {
    reset: (state) => {
      state.jobLoading = false;
      state.jobError = "";
      state.jobData = [];
    },
  },
  extraReducers: {
    [GetInternalOrRefJob.pending]: (state, action) => {
      state.jobLoading = true;
    },
    [GetInternalOrRefJob.fulfilled]: (state, action) => {
      state.jobLoading = false;
      state.jobData = action.payload;
      state.jobError = "";
    },
    [GetInternalOrRefJob.rejected]: (state, action) => {
      state.jobLoading = false;
      state.jobError = action.payload.response.data.message;
      state.jobData = [];
    },
  },
});

export const PostInternalOrRefJobSlice = PostInternalOrRefJobSliceItem.reducer,
  GetHiringManagersSlice = GetHiringManagersSliceItem.reducer,
  GetInternalOrRefJobSlice = GetInternalOrRefJobSliceItem.reducer,
  PatchInternalOrRefJobSlice=PatchInternalOrRefJobSliceItem.reducer;
export const { reset: resetPostInternalOrRefJob } =
  PostInternalOrRefJobSliceItem.actions;
export const { reset: resetHiringManager } = GetHiringManagersSliceItem.actions;
export const { reset: resetGetInternalJob } = GetInternalOrRefJobSliceItem.actions;
export const { reset: resetPatchInternalJob } = PatchInternalOrRefJobSliceItem.actions;
