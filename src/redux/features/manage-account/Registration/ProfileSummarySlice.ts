import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const patchUpdateProfileSummary: any = createAsyncThunk(
    "updateProfileSummary",
    async (updateProfileSummaryDetails: any) => {
        try {
            const { data } = await API.patch(API_ENDPOINTS.MAC_JS_SUMMARY, updateProfileSummaryDetails);
            return data;
        } catch (error: any) {
            return error.response.data.message;
        }
    }
);

const ProfileSummarySlice = createSlice({
    name: "updateProfileSummary",
    initialState: {
        UpdatedProfileSummary: [],
        loading: true,
        error: "",
    },
    reducers: {},
    extraReducers: {
        [patchUpdateProfileSummary.pending]: (state, action) => {
            state.loading = true;
        },
        [patchUpdateProfileSummary.fulfilled]: (state, action) => {
            state.loading = false;
            state.UpdatedProfileSummary = action.payload;
            state.error = "";
        },
        [patchUpdateProfileSummary.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.UpdatedProfileSummary = [];
        },
    },
});

export default ProfileSummarySlice.reducer;

