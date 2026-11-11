import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";



export const PatchWorkSample: any = createAsyncThunk(
    "workSample",
    async (user_info: any) => {
      
        const { id, WorkTitle, uri, Description, DurationFrommonth, DurationFrom, DurationTomonth, DurationTo } = user_info
        try {
            const { data } = await API.patch(API_ENDPOINTS.MAC_WORK_SAMPLE,
                {
                    "_id": id ? id : "",
                    "title": WorkTitle,
                    "uri": uri,
                    "DurationFrommonth": DurationFrommonth ? DurationFrommonth.label : null,
                    "DurationFrom": DurationFrom ? `${DurationFrom.label}` : null,
                    "DurationTomonth": DurationTomonth ? DurationTomonth.label : null,
                    "DurationTo": DurationTo ? `${DurationTo.label}` : null,
                    "desc": Description
                }

            )

            return data

        } catch (error: any) {
            return error.response.data.message
        }
    }


)

const worksampleSlicee = createSlice({
    name: "workSample",
    initialState: {
        res: [],
        loading: false,
        error: "",
    }, reducers: {},
    extraReducers: {
        [PatchWorkSample.pending]: (state, action) => {
            state.loading = true;
        },
        [PatchWorkSample.fulfilled]: (state, action) => {
            state.loading = false;
            state.res = action.payload;
            state.error = "";
        },
        [PatchWorkSample.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.response.data.message;
            state.res = [];
        }
    }
})




export const DeleteWorkSample: any = createAsyncThunk(
    "deleteworkSample",
    async (id: any) => {

        try {
            const { data } = await API.delete(`${API_ENDPOINTS.MAC_DELETE_WORK_SAMPLE}/${id}`)
            return data

        } catch (error: any) {
            return error.response.data.message
        }
    }


)

const worksampleDeleteSlicee = createSlice({
    name: "deleteworkSample",
    initialState: {
        message: [],
        load: false,
        err: "",
    }, reducers: {},
    extraReducers: {
        [DeleteWorkSample.pending]: (state, action) => {
            state.load = true;
        },
        [DeleteWorkSample.fulfilled]: (state, action) => {
            state.load = false;
            state.message = action.payload;
            state.err = "";
        },
        [DeleteWorkSample.rejected]: (state, action) => {
            state.load = false;
            state.err = action.payload.response.data.message;
            state.message = [];
        }
    }
});






export const worksampleSlice = worksampleSlicee.reducer,
    worksampleDeleteSlice = worksampleDeleteSlicee.reducer

