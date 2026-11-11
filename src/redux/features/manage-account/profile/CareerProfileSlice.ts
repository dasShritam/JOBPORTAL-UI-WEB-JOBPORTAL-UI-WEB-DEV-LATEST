import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const patchUpdateCareerProfile: any = createAsyncThunk(
    "updateCareerProfile",
    async (updateCareerProfile: any) => {
        try {
            const { data } = await API.patch(API_ENDPOINTS.MAC_JS_CAREER, updateCareerProfile);
            return data;
        } catch (error: any) {
            return error.response.data.message;
        }
    }
);


const CareerProfileSlice = createSlice({
    name: "updateCareerProfile",
    initialState: {
        UpdatedCareerProfile: [],
        loading: true,
        error: "",
    },
    reducers: {
        reset:(state:any)=>{
            state.UpdatedCareerProfile= [];
            state.loading= true;
            state.error= "";
        }
    },
    extraReducers: {
        [patchUpdateCareerProfile.pending]: (state, action) => {
            state.loading = true;
        },
        [patchUpdateCareerProfile.fulfilled]: (state, action) => {
            state.loading = false;
            state.UpdatedCareerProfile = action.payload;
            state.error = "";
        },
        [patchUpdateCareerProfile.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.UpdatedCareerProfile = [];
        },
    },
});
export const {reset: resetCareerProfile } = CareerProfileSlice.actions;
export default CareerProfileSlice.reducer;