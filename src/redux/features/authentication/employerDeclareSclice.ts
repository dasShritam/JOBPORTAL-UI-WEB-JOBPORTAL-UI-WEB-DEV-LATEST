import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const patchEmpDeclare: any = createAsyncThunk(
  "EmployerDeclare",
  async (empDeclare: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.AUTH_EMP_DECLARE,
        empDeclare
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const EmpDeclareSlice = createSlice({
  name: "EmployerDecalre",
  initialState: {
    EmpDeclare: [],
    loadingD: false,
    errorD: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingD = false;
      state.errorD = "";
      state.EmpDeclare = [];
    },
  },
  extraReducers: {
    [patchEmpDeclare.pending]: (state, action) => {
      state.loadingD = true;
    },
    [patchEmpDeclare.fulfilled]: (state, action) => {
      state.loadingD = false;
      state.EmpDeclare = action.payload;
      state.errorD = "";
    },
    [patchEmpDeclare.rejected]: (state, action) => {
      state.loadingD = false;
      state.errorD = action.payload.response.data.message;
      state.EmpDeclare = [];
    },
  },
});
export const { reset: resetDeclareActionCreator } = EmpDeclareSlice.actions;
export default EmpDeclareSlice.reducer;
