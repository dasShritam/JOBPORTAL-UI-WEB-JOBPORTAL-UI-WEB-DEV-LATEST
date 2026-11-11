import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

export const LocationcityMasterData: any = createAsyncThunk("LocationcityMasterData", async (dat: any) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.MAC_LOCATIONS, dat);

    return data.data;
  } catch (error: any) {
    return error;
  }
});
const LocationcityMasterDataSlice = createSlice({
  name: "LocationcityMasterData",
  initialState: {
    LocationcityData: [],
    Locationloading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.LocationcityData = [];
      state.Locationloading = true;
      state.error = "";
    },
  },
  extraReducers: {
    [LocationcityMasterData.pending]: (state, action) => {
      state.Locationloading = true;
    },
    [LocationcityMasterData.fulfilled]: (state, action) => {
      state.Locationloading = false;
      state.LocationcityData = action.payload;
      state.error = "";
    },
    [LocationcityMasterData.rejected]: (state, action) => {
      state.Locationloading = false;
      state.error = action.payload.response.data.message;
      state.LocationcityData = [];
    },
  },
});
export const { reset: resetLocationcityMasterData } = LocationcityMasterDataSlice.actions;
export default LocationcityMasterDataSlice.reducer;
