import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const authEmpRegister: any = createAsyncThunk(
  "AuthEmployerRegistration",
  async (userMail: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_EMP_REG, userMail);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const authEmpRegisterSlice = createSlice({
  name: "AuthEmployerRegistration",
  initialState: {
    authEmpReg: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [authEmpRegister.pending]: (state, action) => {
      state.loading = true;
    },
    [authEmpRegister.fulfilled]: (state, action) => {
      state.loading = false;
      state.authEmpReg = action.payload;
      state.error = "";
    },
    [authEmpRegister.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.authEmpReg = [];
    },
  },
});

export const downloadUserInfo: any = createAsyncThunk(
  "downUserInfo",
  async ({ userType, id }: any) => {
    try {
      const { data } = await API.get(
          `${API_ENDPOINTS.MAC_DOWNLOAD_USER_INFO}/${userType}${
            id ? `/${id}` : ""
          }`
        ),
        filename = `${userType}-${new Date().getTime()}`,
        blob = new Blob([data], { type: "text/csv" }),
        url = window.URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const downloadUserInfoS1 = createSlice({
  name: "downUserInfo",
  initialState: {
    downUserInfo: [],
    loadingD: false,
    errorD: "",
  },
  reducers: {
    reset: (state: any) => {
      state.loadingD = false;
      state.downUserInfo = [];
      state.errorD = "";
    },
  },
  extraReducers: {
    [downloadUserInfo.pending]: (state, action) => {
      state.loadingD = true;
    },
    [downloadUserInfo.fulfilled]: (state, action) => {
      state.loadingD = false;
      state.downUserInfo = action.payload;
      state.errorD = "";
    },
    [downloadUserInfo.rejected]: (state, action) => {
      state.loadingD = false;
      state.errorD = action.payload.response.data.message;
      state.downUserInfo = [];
    },
  },
});

export const addUserLimit: any = createAsyncThunk(
  "AddUserLimit",
  async (Assessment: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_UPDATE_EMP_LIMIT,
        Assessment
      );
      return data;
    } catch (error: any) {
      return error.response;
    }
  }
);

const addUserLimitDataSl = createSlice({
  name: "AddUserLimit",
  initialState: {
    AddUserlimitRes: [],
    AddUserlimitloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.AddUserlimitRes = [];
      state.AddUserlimitloading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [addUserLimit.pending]: (state, action) => {
      state.AddUserlimitloading = true;
    },
    [addUserLimit.fulfilled]: (state, action) => {
      state.AddUserlimitloading = false;
      state.AddUserlimitRes = action.payload;
      state.error = "";
    },
    [addUserLimit.rejected]: (state, action) => {
      state.AddUserlimitloading = false;
      state.error = action.payload;
      state.AddUserlimitRes = [];
    },
  },
});

export const getMasterDataLimit: any = createAsyncThunk(
  "getCommonMasterDataLimit",
  async (dataInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_MASTERDATA, dataInfo);
      return data.data;
    } catch (error: any) {
      return error;
    }
  }
);

const commonMasterDataLimitS1 = createSlice({
  name: "getCommonMasterDataLimit",
  initialState: {
    cmasterDataLimit: [],
    cmasterDataloading: false,
    cmasterDataerror: "",
  },
  reducers: {
    reset: (state: any) => {
      state.cmasterDataLimit = [];
      state.cmasterDataloading = false;
      state.cmasterDataerror = "";
    },
  },
  extraReducers: {
    [getMasterDataLimit.pending]: (state, action) => {
      state.cmasterDataloading = true;
    },
    [getMasterDataLimit.fulfilled]: (state, action) => {
      state.cmasterDataloading = false;
      state.cmasterDataLimit = action.payload;
      state.cmasterDataerror = "";
    },
    [getMasterDataLimit.rejected]: (state, action) => {
      state.cmasterDataloading = false;
      state.cmasterDataerror = action.payload.response.data.message;
      state.cmasterDataLimit = [];
    },
  },
});
export default authEmpRegisterSlice.reducer;
export const { reset: resetDownloadUserInfo } = downloadUserInfoS1.actions;
export const DownloadUserInfoSlice = downloadUserInfoS1.reducer;
export const AddUserLimitSlice = addUserLimitDataSl.reducer;
export const { reset: resetUserLimit } = addUserLimitDataSl.actions;
export const commonMasterDataLimitSlice = commonMasterDataLimitS1.reducer;
export const { reset: resetMaterDataLimit } = commonMasterDataLimitS1.actions;
