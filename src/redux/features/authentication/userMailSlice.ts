import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const validateUser: any = createAsyncThunk(
  "UserCheck",
  async (userDetails: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.AUTH_EXISTS, userDetails);
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

const UserDetailSlice = createSlice({
  name: "userCheck",
  initialState: {
    UserCheck: [],
    loadingU: false,
    errorU: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingU = false;
      state.errorU = "";
      state.UserCheck = [];
    },
  },
  extraReducers: {
    [validateUser.pending]: (state, action) => {
      state.loadingU = true;
    },
    [validateUser.fulfilled]: (state, action) => {
      state.loadingU = false;
      state.UserCheck = action.payload;
      state.errorU = "";
    },
    [validateUser.rejected]: (state, action) => {
      state.loadingU = false;
      state.errorU = action.payload.response.data.message;
      state.UserCheck = [];
    },
  },
});
export const { reset: resetEmpActionCreator } = UserDetailSlice.actions;
export default UserDetailSlice.reducer;
