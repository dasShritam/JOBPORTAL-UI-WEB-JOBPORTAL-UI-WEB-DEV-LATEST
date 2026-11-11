import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const patchEmpSetPwd: any = createAsyncThunk(
  "EmpolyerSetPwd",
  async (empSetPwd: any) => {
    try {

      let body = new URLSearchParams()
      body.set('empPassword', empSetPwd.empPassword);
      body.set('token', empSetPwd.token);

      const { data } = await API.patch(
        API_ENDPOINTS.AUTH_EMP_REG_PASSWORD, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const EmpSetPwdSlice = createSlice({
  name: "EmployerSetPasword",
  initialState: {
    EmpSetPwd: [],
    loadingP: false,
    errorP: "",
  },
  reducers: {
    reset: (state) => {
      state.EmpSetPwd = [];
      state.loadingP = false;
      state.errorP = "";
    },
  },
  extraReducers: {
    [patchEmpSetPwd.pending]: (state, action) => {
      state.loadingP = true;
    },
    [patchEmpSetPwd.fulfilled]: (state, action) => {
      state.loadingP = false;
      state.EmpSetPwd = action.payload;
      state.errorP = "";
    },
    [patchEmpSetPwd.rejected]: (state, action) => {
      state.loadingP = false;
      state.errorP = action.payload.response.data.message;
      state.EmpSetPwd = [];
    },
  },
});

export const { reset: resetSetPwdActionCreator } = EmpSetPwdSlice.actions;
export default EmpSetPwdSlice.reducer;
