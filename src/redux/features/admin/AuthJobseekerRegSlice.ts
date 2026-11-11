import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";
export const authJobSeekerRegister: any = createAsyncThunk(
  "AuthJobSeekerRegister",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JS_REG,
        userInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);
const authJobSeekerRegsterSlice = createSlice({
  name: "AuthJobSeekerRegister",
  initialState: {
    res: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [authJobSeekerRegister.pending]: (state) => {
      state.loading = true;
    },
    [authJobSeekerRegister.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [authJobSeekerRegister.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.res = [];
    },
  },
});

export default authJobSeekerRegsterSlice.reducer;