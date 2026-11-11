import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const patchEmpUserManage: any = createAsyncThunk(
  "patchUserManage",
  async (datas: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_PATCH_EMP_MANAGE_USER,
        datas
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const userPatchEmpManagementSlice = createSlice({
  name: "patchUserManage",
  initialState: {
    userDataPa: [],
    loadingUPa: false,
    errorUPa: "",
  },
  reducers: {
    reset: (state) => {
      state.userDataPa = [];
      state.loadingUPa = false;
      state.errorUPa = "";
    },
  },
  extraReducers: {
    [patchEmpUserManage.pending]: (state) => {
      state.loadingUPa = true;
    },
    [patchEmpUserManage.fulfilled]: (state, action) => {
      state.loadingUPa = false;
      state.userDataPa = action.payload;
      state.errorUPa = "";
    },
    [patchEmpUserManage.rejected]: (state, action) => {
      state.loadingUPa = false;
      state.userDataPa = [];
      state.errorUPa = action.payload;
    },
  },
});

export const { reset: patchEmpUserManageSliceReset } =
  userPatchEmpManagementSlice.actions;
export default userPatchEmpManagementSlice.reducer;
