import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const SkillsMasterData: any = createAsyncThunk(
  "SkillsMasterData",
  async (dat) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_SKILL_MASTER_DATA, dat);
      return data.data;
    } catch (error: any) {
      return error;
    }
  }
);
const SkillsSlice = createSlice({
  name: "SkillsMasterData",
  initialState: {
    SkillsData: [],
    Skillsloading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.SkillsData = [];
      state.Skillsloading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [SkillsMasterData.pending]: (state, action) => {
      state.Skillsloading = true;
    },
    [SkillsMasterData.fulfilled]: (state, action) => {
      state.Skillsloading = false;
      state.SkillsData = action.payload;
      state.error = "";
    },
    [SkillsMasterData.rejected]: (state, action) => {
      state.Skillsloading = false;
      state.error = action.payload.response.data.message;
      state.SkillsData = [];
    },
  },
});

export const { reset: resetSkillMasterData } = SkillsSlice.actions;
export default SkillsSlice.reducer;
