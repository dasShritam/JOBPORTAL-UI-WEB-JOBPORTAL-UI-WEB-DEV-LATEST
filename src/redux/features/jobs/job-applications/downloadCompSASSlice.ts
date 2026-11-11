import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const companySAS: any = createAsyncThunk(
  "downloadCompanySAS",
  async (id: any) => {
    try {
      const { data } = await API.post(
        `${API_ENDPOINTS.MAC_JOB_COMPANY_SAS}`,
        id
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);
const successCompState: any = { code: 200, message: "", data: [] };
const downloadCompSASSlice = createSlice({
  name: "downloadCompanySAS",
  initialState: {
    sasComp: [],
    loadC: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.sasComp = [];
      state.loadC = false;
      state.error = "";
    },
    success: (state) => {
      state.sasComp = successCompState;
      state.loadC = false;
      state.error = "";
    },
  },
  extraReducers: {
    [companySAS.pending]: (state, action) => {
      state.loadC = true;
    },
    [companySAS.fulfilled]: (state, action) => {
      state.loadC = false;
      state.sasComp = action.payload;
      state.error = "";
    },
    [companySAS.rejected]: (state, action) => {
      state.loadC = false;
      state.error = action.payload;
      state.sasComp = [];
    },
  },
});

export const { reset: resetCompnySAS, success: successCompnySAS } =
  downloadCompSASSlice.actions;
export default downloadCompSASSlice?.reducer;
