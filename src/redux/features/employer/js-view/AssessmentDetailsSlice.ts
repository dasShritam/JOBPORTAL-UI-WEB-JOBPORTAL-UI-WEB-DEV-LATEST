import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const GetAssessmentData: any = createAsyncThunk(
  "GetAssessmentData",
  async (datas) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_FETCH_ASSESSMENT_DETAIL,
        datas
      );
      return data.data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const GetAssessmentDataSlice = createSlice({
  name: "GetAssessmentData",
  initialState: {
    Assdetails: [],
    Assloading: true,
    Asserror: "",
  },
  reducers: {},
  extraReducers: {
    [GetAssessmentData.pending]: (state, action) => {
      state.Assloading = true;
    },
    [GetAssessmentData.fulfilled]: (state, action) => {
      state.Assloading = false;
      state.Assdetails = action.payload;
      state.Asserror = "";
    },
    [GetAssessmentData.rejected]: (state, action) => {
      state.Assloading = false;
      state.Asserror = action.payload;
      state.Assdetails = [];
    },
  },
});

export const getAssessmentDataSlice = GetAssessmentDataSlice.reducer;
