import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const SearchProfiles: any = createAsyncThunk(
  "SearchProfile",
  async (datas: any) => {
    try {
        const { data } = await API.post(API_ENDPOINTS.MAC_JOB_SEARCH_PROFILE, datas);  
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);



const PostSearchProfileSlice = createSlice({
  name: "SearchProfile",
  initialState: {
    SearchProfileData: [],
    loadingSp: false,
    errorSp: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingSp = false;
      state.SearchProfileData = [];
      state.errorSp = "";
    },
  },
  extraReducers: {
    [SearchProfiles.pending]: (state, action) => {
      state.loadingSp = true;
    },
    [SearchProfiles.fulfilled]: (state, action) => {
      state.loadingSp = false;
      state.SearchProfileData = action.payload;
      state.errorSp = "";
    },
    [SearchProfiles.rejected]: (state, action) => {
      state.loadingSp = false;
      state.errorSp = action.payload.response.data.message;
      state.SearchProfileData = [];
    },
  },
});

export const PostSearchProfilesSlice = PostSearchProfileSlice.reducer;
export const { reset: resetPostSearchProfile } =
PostSearchProfileSlice.actions;

