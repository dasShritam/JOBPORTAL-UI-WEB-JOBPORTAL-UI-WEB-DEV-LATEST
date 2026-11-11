import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const getEmpUserManage: any = createAsyncThunk(
  "getUserManage",
  async (datas: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_GET_EMP_MANAGE_USER,
        datas
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const userGetEmpManagementSlice = createSlice({
  name: "getUserManage",
  initialState: {
    userData: [],
    loadingU: false,
    errorU: "",
  },
  reducers: {
    reset: (state) => {
      state.userData = [];
      state.loadingU = false;
      state.errorU = "";
    },
  },
  extraReducers: {
    [getEmpUserManage.pending]: (state) => {
      state.loadingU = true;
    },
    [getEmpUserManage.fulfilled]: (state, action) => {
      state.loadingU = false;
      state.userData = action.payload;
      state.errorU = "";
    },
    [getEmpUserManage.rejected]: (state, action) => {
      state.loadingU = false;
      state.userData = [];
      state.errorU = action.payload;
    },
  },
});

export const { reset: getEmpUserManageSliceReset } =
  userGetEmpManagementSlice.actions;
export default userGetEmpManagementSlice.reducer;
