import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { stringify } from "qs";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const empRegister: any = createAsyncThunk(
  "EmployerRegistration",
  async (userMail: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.AUTH_EMP_REG, stringify(userMail),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const EmpRegisterSlice = createSlice({
  name: "EmployerRegistration",
  initialState: {
    empReg: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.empReg = [];
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [empRegister.pending]: (state, action) => {
      state.loading = true;
    },
    [empRegister.fulfilled]: (state, action) => {
      state.loading = false;
      state.empReg = action.payload;
      state.error = "";
    },
    [empRegister.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.empReg = [];
    },
  },
});
export const { reset: resetEmpRegActionCreator } = EmpRegisterSlice.actions;
export default EmpRegisterSlice.reducer;
