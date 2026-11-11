import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";



export const PatchPublication: any = createAsyncThunk(
    "publication",
    async (user_info: any) => {
        const { id, title, uri, month, desc, year } = user_info
        try {
            const { data } = await API.patch(API_ENDPOINTS.MAC_PUBLICATION,
                {
                    "_id": id,
                    "title": title,
                    "uri": uri,
                    "year": year ? `${year.label}` : null,
                    "month": month ? month.label : null,
                    "desc": desc
                }
            )

            return data

        } catch (error: any) {
            return error.response.data.message
        }
    }


)

const publicationSlicee = createSlice({
    name: "publiation",
    initialState: {
        res: [],
        loading: false,
        error: "",
    }, reducers: {},
    extraReducers: {
        [PatchPublication.pending]: (state, action) => {
            state.loading = true;
        },
        [PatchPublication.fulfilled]: (state, action) => {
            state.loading = false;
            state.res = action.payload;
            state.error = "";
        },
        [PatchPublication.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.response.data.message;
            state.res = [];
        }
    }
})



export const DeletePublication: any = createAsyncThunk(
    "deletepublication",
    async (id: any) => {

        try {
            const { data } = await API.delete(`${API_ENDPOINTS.MAC_PUBLICATION}/${id}`)

            return data

        } catch (error: any) {
            return error.response.data.message
        }
    }


)

const deletepublicationSlicee = createSlice({
    name: "deletepublication",
    initialState: {
        message: [],
        load: false,
        err: "",
    }, reducers: {},
    extraReducers: {
        [DeletePublication.pending]: (state, action) => {
            state.load = true;
        },
        [DeletePublication.fulfilled]: (state, action) => {
            state.load = false;
            state.message = action.payload;
            state.err = "";
        },
        [DeletePublication.rejected]: (state, action) => {
            state.load = false;
            state.err = action.payload.response.data.message;
            state.message = [];
        }
    }
})








export const publicationSlice = publicationSlicee.reducer,

    deletepublicationSlice = deletepublicationSlicee.reducer
