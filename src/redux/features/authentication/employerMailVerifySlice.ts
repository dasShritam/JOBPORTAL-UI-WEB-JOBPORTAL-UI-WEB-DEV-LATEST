import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const patchEmpMailVeify: any = createAsyncThunk("EmployerMailVerify", async (empMail: any) => {
  try {
    const { data } = await API.get(`${API_ENDPOINTS.AUTH_EMP_MAIL_VERIFY}/${empMail}`);
    if (data.code === 200) {
      sessionStorage.setItem("access_token", data.data.temp_token);
    }
    return data;
  } catch (error: any) {
    return error;
  }
});

const empMailVerifySlice = createSlice({
  name: "EmployerMailverify",
  initialState: {
    EmpMail: [],
    loadingM: false,
    errorM: "",
  },
  reducers: {},
  extraReducers: {
    [patchEmpMailVeify.pending]: (state, action) => {
      state.loadingM = true;
    },
    [patchEmpMailVeify.fulfilled]: (state, action) => {
      state.loadingM = false;
      state.EmpMail = action.payload;
      state.errorM = "";
    },
    [patchEmpMailVeify.rejected]: (state, action) => {
      state.loadingM = false;
      state.errorM = action.payload.response.data.message;
      state.EmpMail = [];
    },
  },
});

export default empMailVerifySlice.reducer;
