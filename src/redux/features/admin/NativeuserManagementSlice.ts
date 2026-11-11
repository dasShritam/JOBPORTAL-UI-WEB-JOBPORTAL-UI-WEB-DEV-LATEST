import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const getNativeUserManage: any = createAsyncThunk(
  "getUserManage",
  async (datas: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_FETCH_USER, datas);

      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const GetNativeuserManagementSlicee = createSlice({
  name: "getUserManage",
  initialState: {
    nativeUserData: [],
    loadingG: false,
    errorU: "",
  },
  reducers: {
    reset: (state) => {
      state.nativeUserData = [];
      state.loadingG = false;
      state.errorU = "";
    },
  },
  extraReducers: {
    [getNativeUserManage.pending]: (state) => {
      state.loadingG = true;
    },
    [getNativeUserManage.fulfilled]: (state, action) => {
      state.loadingG = false;
      state.nativeUserData = action.payload;
      state.errorU = "";
    },
    [getNativeUserManage.rejected]: (state, action) => {
      state.loadingG = false;
      state.nativeUserData = [];
      state.errorU = action.payload;
    },
  },
});

//Post API
export const PostNativeUserManage: any = createAsyncThunk(
  "postUserManage",
  async (datass: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_INVITE_NATIVE_USER,
        datass
      );

      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const PostNativeuserManagementSlicee = createSlice({
  name: "postUserManage",
  initialState: {
    nativeUserList: [],
    loadingS: false,
    errorS: "",
  },
  reducers: {
    reset: (state) => {
      state.nativeUserList = [];
      state.loadingS = false;
      state.errorS = "";
    },
  },
  extraReducers: {
    [PostNativeUserManage.pending]: (state) => {
      state.loadingS = true;
    },
    [PostNativeUserManage.fulfilled]: (state, action) => {
      state.loadingS = false;
      state.nativeUserList = action.payload;
      state.errorS = "";
    },
    [PostNativeUserManage.rejected]: (state, action) => {
      state.loadingS = false;
      state.nativeUserList = [];
      state.errorS = action.payload;
    },
  },
});

//Patch API
export const PatchNativeUserManage: any = createAsyncThunk(
  "patchUserManage",
  async (datasss: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_NATIVE_USER_DETAILS,
        datasss
      );

      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const PatchNativeuserManagementSlicee = createSlice({
  name: "patchUserManage",
  initialState: {
    patchnativeUserList: [],
    loadingP: false,
    errorP: "",
  },
  reducers: {
    reset: (state) => {
      state.patchnativeUserList = [];
      state.loadingP = false;
      state.errorP = "";
    },
  },

  extraReducers: {
    [PatchNativeUserManage.pending]: (state) => {
      state.loadingP = true;
    },
    [PatchNativeUserManage.fulfilled]: (state, action) => {
      state.loadingP = false;
      state.patchnativeUserList = action.payload;
      state.errorP = "";
    },
    [PatchNativeUserManage.rejected]: (state, action) => {
      state.loadingP = false;
      state.patchnativeUserList = [];
      state.errorP = action.payload;
    },
  },
});

//patch toggleswitch

export const PatchNativeToggleSwitch: any = createAsyncThunk(
  "patchToggleUserManage",
  async (datasss: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_USER_ACCESSIBILITY,
        datasss
      );

      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const PatchNativeToggleSwitchSlicee = createSlice({
  name: "patchToggleUserManage",
  initialState: {
    patchnativeToggle: [],
    loadingT: false,
    errorT: "",
  },
  reducers: {
    reset: (state) => {
      state.patchnativeToggle = [];
      state.loadingT = false;
      state.errorT = "";
    },
  },
  extraReducers: {
    [PatchNativeToggleSwitch.pending]: (state) => {
      state.loadingT = true;
    },
    [PatchNativeToggleSwitch.fulfilled]: (state, action) => {
      state.loadingT = false;
      state.patchnativeToggle = action.payload;
      state.errorT = "";
    },
    [PatchNativeToggleSwitch.rejected]: (state, action) => {
      state.loadingT = false;
      state.patchnativeToggle = [];
      state.errorT = action.payload;
    },
  },
});

export const { reset: getNativeUserManageSliceReset } =
    GetNativeuserManagementSlicee.actions,
  { reset: postNativeUserManageSliceReset } =
    PostNativeuserManagementSlicee.actions,
  { reset: patchNativeUserManageSliceReset } =
    PatchNativeuserManagementSlicee.actions,
  { reset: PatchNativeToggleSwitchSliceReset } =
    PatchNativeToggleSwitchSlicee.actions,
  GetNativeuserManagementSlice = GetNativeuserManagementSlicee.reducer,
  PostNativeuserManagementSlice = PostNativeuserManagementSlicee.reducer,
  PatchNativeuserManagementSlice = PatchNativeuserManagementSlicee.reducer,
  PatchNativeToggleSwitchSlice = PatchNativeToggleSwitchSlicee.reducer;
