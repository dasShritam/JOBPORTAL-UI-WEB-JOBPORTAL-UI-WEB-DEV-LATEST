import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const patchUpdateKeySkills: any = createAsyncThunk(
  "updateKeySkills",
  async (updateKeySkillsDetails: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JS_KEY_SKILLS,
        updateKeySkillsDetails
      );
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const UpdateKeySkillSlice = createSlice({
  name: "updateKeySkills",
  initialState: {
    UpdatedSkills: [],
    loadingState: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.UpdatedSkills = [];
      state.loadingState = false;
      state.error = "";
    },
  },
  extraReducers: {
    [patchUpdateKeySkills.pending]: (state, action) => {
      state.loadingState = true;
    },
    [patchUpdateKeySkills.fulfilled]: (state, action) => {
      state.loadingState = false;
      state.UpdatedSkills = action.payload;
      state.error = "";
    },
    [patchUpdateKeySkills.rejected]: (state, action) => {
      state.loadingState = false;
      state.error = action.payload.response.data.message;
      state.UpdatedSkills = [];
    },
  },
});
export const { reset: resetKeySkillsSl } = UpdateKeySkillSlice.actions;
export default UpdateKeySkillSlice.reducer;
