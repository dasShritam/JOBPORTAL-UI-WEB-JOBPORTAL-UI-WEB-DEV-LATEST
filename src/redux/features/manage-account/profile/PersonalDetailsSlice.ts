import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";
export const patchUpdatePersonalDetails: any = createAsyncThunk(
    "updatePersonal",
    async (updatePersonalDetails: any) => {
        try {
            const { data } = await API.patch(
                API_ENDPOINTS.MAC_JS_PERSONAL_DETAILS,
                updatePersonalDetails
            );
            return data;
        } catch (error: any) {
            return error.response.data.message;
        }
    }
);
const PersonalDetailSlice = createSlice({
    name: "updatePersonal",
    initialState: { UpdatedPersonalDetails: [], loading: true, error: "" },
    reducers: {
        reset: (state: any) => {
            state.UpdatedPersonalDetails = [];
            state.loading = false;
            state.error = "";
        },
    },
    extraReducers: {
        [patchUpdatePersonalDetails.pending]: (state, action) => {
            state.loading = true;
        },
        [patchUpdatePersonalDetails.fulfilled]: (state, action) => {
            state.loading = false;
            state.UpdatedPersonalDetails = action.payload;
            state.error = "";
        },
        [patchUpdatePersonalDetails.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.UpdatedPersonalDetails = [];
        },
    },
});
export const deleteLanguage: any = createAsyncThunk(
    "DeletePersonalLang",
    async (id) => {
        try {
            const { data } = await API.delete(`${API_ENDPOINTS.MAC_LANGUAGE}/${id}`);
            return data;
        } catch (error: any) {
            return error.message;
        }
    }
);
const DeletePersonalLang = createSlice({
    name: "DeletePersonalLang",
    initialState: { DeletePersonalLang: [], loadingDS: true, error: "" },
    reducers: {
        reset: (state) => {
            state.DeletePersonalLang = [];
            state.loadingDS = false;
            state.error = "";
        },
    },
    extraReducers: {
        [deleteLanguage.pending]: (state, action) => {
            state.loadingDS = true;
        },
        [deleteLanguage.fulfilled]: (state, action) => {
            state.loadingDS = false;
            state.DeletePersonalLang = action.payload;
            state.error = "";
        },
        [deleteLanguage.rejected]: (state, action) => {
            state.loadingDS = false;
            state.error = action.payload;
            state.DeletePersonalLang = [];
        },
    },
});
export const { reset: resetPersonalDetailsCreator } =
    PersonalDetailSlice.actions;
export const { reset: resetDeletedPersonalLang } = DeletePersonalLang.actions;
export default PersonalDetailSlice.reducer;
export const deletePersonalLang = DeletePersonalLang.reducer;
export const { reset: resetDelereActionCreator } = DeletePersonalLang.actions;
