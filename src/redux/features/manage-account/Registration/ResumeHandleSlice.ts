import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";


export const patchUpdateResumeHeadline: any = createAsyncThunk(
    "updateResumeHeadline",
    async (updateResumeHeadlineDetails: any) => {
        try {
            const { data } = await API.patch(API_ENDPOINTS.MAC_JS_HEADLINE, updateResumeHeadlineDetails);
            return data;
        } catch (error: any) {
            return error.response.data.message;
        }
    }
);

const ResumeHeadlineSlice = createSlice({
    name: "updateResumeHeadline",
    initialState: {
        UpdatedResumeHeadline: [],
        loading: true,
        error: "",
    },
    reducers: {
        reset:(state:any)=>{
            state.UpdatedResumeHeadline= [];
            state.loading= true;
            state.error= "";
        }
    },
    extraReducers: {
        [patchUpdateResumeHeadline.pending]: (state, action) => {
            state.loading = true;
        },
        [patchUpdateResumeHeadline.fulfilled]: (state, action) => {
            state.loading = false;
            state.UpdatedResumeHeadline = action.payload;
            state.error = "";
        },
        [patchUpdateResumeHeadline.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.UpdatedResumeHeadline = [];
        },
    },
});

export const {reset: resetResumeHeadline} = ResumeHeadlineSlice.actions;
export default ResumeHeadlineSlice.reducer;

