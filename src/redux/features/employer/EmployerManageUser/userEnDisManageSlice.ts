import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const EnDisUser: any = createAsyncThunk(
  "empEnDisUser",
  async (datas: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_EMP_ENABLE_DISABLE_USER,
        datas
      );
      return data;
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

const userEnDisManageSlice = createSlice({
  name: "empEnDisUser",
  initialState: {
    empStateData: [],
    loadingE: false,
    errorE: "",
  },
  reducers: {
    reset: (state) => {
      state.empStateData = [];
      state.loadingE = false;
      state.errorE = "";
    },
  },
  extraReducers: {
    [EnDisUser.pending]: (state) => {
      state.loadingE = true;
    },
    [EnDisUser.fulfilled]: (state, action) => {
      state.loadingE = false;
      state.empStateData = action.payload;
      state.errorE = "";
    },
    [EnDisUser.rejected]: (state, action) => {
      state.loadingE = false;
      state.empStateData = [];
      state.errorE = action.payload;
    },
  },
});

export const { reset: userEnDisManageReset } = userEnDisManageSlice.actions;
export default userEnDisManageSlice.reducer;
