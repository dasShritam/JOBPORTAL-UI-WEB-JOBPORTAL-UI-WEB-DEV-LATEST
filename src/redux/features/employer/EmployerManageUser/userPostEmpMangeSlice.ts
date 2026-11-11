import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";
import API from "../../../../config/axios.config";

export const postEmpUserManage: any = createAsyncThunk(
  "postUserManage",
  async (datas: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_POST_EMP_MANAGE_USER,
        datas
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const userPostEmpManagementSlice = createSlice({
  name: "postUserManage",
  initialState: {
    userDataP: [],
    loadingUP: false,
    errorUP: "",
  },
  reducers: {
    reset: (state) => {
      state.userDataP = [];
      state.loadingUP = false;
      state.errorUP = "";
    },
  },
  extraReducers: {
    [postEmpUserManage.pending]: (state) => {
      state.loadingUP = true;
    },
    [postEmpUserManage.fulfilled]: (state, action) => {
      state.loadingUP = false;
      state.userDataP = action.payload;
      state.errorUP = "";
    },
    [postEmpUserManage.rejected]: (state, action) => {
      state.loadingUP = false;
      state.userDataP = [];
      state.errorUP = action.payload;
    },
  },
});

export const { reset: postEmpUserManageSliceReset } =
  userPostEmpManagementSlice.actions;
export default userPostEmpManagementSlice.reducer;
