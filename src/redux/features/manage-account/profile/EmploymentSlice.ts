import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const updateEmployementDetails: any = createAsyncThunk(
  "EmployementDetails",
  async (employmentData) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JS_EMPLOYMENT,
        employmentData
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  });

const employmentDetailsSlice = createSlice({
  name: "EmploymentDetails",
  initialState: {
    employmentDetails: [],
    loading1: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.employmentDetails = [];
      state.loading1 = false;
      state.error = "";
    },
  },
  extraReducers: {
    [updateEmployementDetails.pending]: (state, action) => {
      state.loading1 = true;
    },
    [updateEmployementDetails.fulfilled]: (state, action) => {
      state.loading1 = false;
      state.employmentDetails = action.payload;
      state.error = "";
    },
    [updateEmployementDetails.rejected]: (state, action) => {
      state.loading1 = false;
      state.error = action.payload;
      state.employmentDetails = [];
    },
  },
});


export const deleteEmployement: any = createAsyncThunk(
  "deleteEmployement",
  async (id: any) => {
    try {
      const { data } = await API.delete(`${API_ENDPOINTS.MAC_EMPLOYMENT}/${id}`);
      return data;
    } catch (error: any) {
      return error;
    }
  });

const deleteEmpl = createSlice({
  name: "deleteEmployement",
  initialState: {
    deleteEmpl: [],
    deleteEmplLoading: true,
    deleteEmplError: "",
  },
  reducers: {
    reset: (state) => {
      state.deleteEmpl = [];
      state.deleteEmplLoading = true;
      state.deleteEmplError = "";
    },
  },
  extraReducers: {
    [deleteEmployement.pending]: (state, action) => {
      state.deleteEmplLoading = true;
    },
    [deleteEmployement.fulfilled]: (state, action) => {
      state.deleteEmplLoading = false;
      state.deleteEmpl = action.payload;
      state.deleteEmplError = "";
    },
    [deleteEmployement.rejected]: (state, action) => {
      state.deleteEmplLoading = false;
      state.deleteEmplError = action.payload;
      state.deleteEmpl = [];
    },
  },
});

export const getFutureyearmonth: any = createAsyncThunk(
  "getFutureyearmonth",
  async (dataInfo: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_COMMON_MASTER, dataInfo);
      return data.data.data
    } catch (error: any) {
      return error;
    }
  });
const FutureyearmonthSlice = createSlice({
  name: "getFutureyearmonth",
  initialState: {
    futureYearMonth: [],
    floadingI: false,
    errorI: "",
  },
  reducers: {},
  extraReducers: {
    [getFutureyearmonth.pending]: (state, action) => {
      state.floadingI = true;
    },
    [getFutureyearmonth.fulfilled]: (state, action) => {
      state.futureYearMonth = action.payload;
      state.errorI = "";
      state.floadingI = false;
    },
    [getFutureyearmonth.error]: (state, action) => {
      state.futureYearMonth = [];
      state.errorI = action.payload.response.data.message;
      state.floadingI = false;
    },
  },
});
export const Futureyearmonth = FutureyearmonthSlice.reducer;
export const { reset: resetDeleteEmployement } = deleteEmpl.actions;
export const { reset: resetEmployement } = employmentDetailsSlice.actions;
export const employmentDetails = employmentDetailsSlice.reducer,
  deleteEmployementDeatails = deleteEmpl.reducer;

