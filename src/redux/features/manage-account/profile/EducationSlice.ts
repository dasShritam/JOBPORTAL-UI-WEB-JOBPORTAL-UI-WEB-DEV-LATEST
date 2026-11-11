import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const postEducationDetails: any = createAsyncThunk(
  "postEducation",
  async (dat: any) => {
    try {
      const { data } = await API.patch(API_ENDPOINTS.MAC_JS_EDU, dat);
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

export const updateEducationDetails: any = createAsyncThunk(
  "EducationPatch",
  async (dat: any) => {
    try {
      const { data } = await API.patch(API_ENDPOINTS.MAC_JS_EDU, dat);
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

export const deleteEducationDetails: any = createAsyncThunk(
  "EducationDelete",
  async (dat: any) => {
    try {
      const { data } = await API.delete(`${API_ENDPOINTS.MAC_JS_EDU}/${dat}`);
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const EducationDataPostSlice = createSlice({
  name: "postEducation",
  initialState: {
    PostEducation: [],
    Postloading: false,
   Posterror: "",
  },
  reducers: {
    reset:(state:any)=>{
       state.PostEducation= [];
      state.Postloading= true;
      state.Posterror= "";
    }
  },
  extraReducers: {
    [postEducationDetails.pending]: (state, action) => {
      state.Postloading = true;
    },
    [postEducationDetails.fulfilled]: (state, action) => {
      state.Postloading = false;
      state.PostEducation = action.payload;
      state.Posterror = "";
    },
    [postEducationDetails.rejected]: (state, action) => {
      state.Postloading = false;
      state.Posterror = action.payload;
      state.PostEducation = [];
    },
  },
});

const EducationDataPatchSlice = createSlice({
  name: "EducationPatch",
  initialState: {
    EducationPatch: [],
    Patchloading: false,
    Patcherror: "",
  },
  reducers: {
    reset:(state:any)=>{
       state.EducationPatch= [];
      state.Patchloading= true;
      state.Patcherror= "";
    }
  },
  extraReducers: {
    [updateEducationDetails.pending]: (state, action) => {
      state.Patchloading = true;
    },
    [updateEducationDetails.fulfilled]: (state, action) => {
      state.Patchloading = false;
      state.EducationPatch = action.payload;
      state.Patcherror = "";
    },
    [updateEducationDetails.rejected]: (state, action) => {
      state.Patchloading = false;
      state.Patcherror = action.payload;
      state.EducationPatch = [];
    },
  },
});

const EducationDataDeleteSlice = createSlice({
  name: "EducationDelete",
  initialState: {
    EducationDelete: [],
    loadingDelete: false,
    errorDelete: "",
  },
  reducers: {
    reset:(state:any)=>{
      state.EducationDelete= [];
      state.loadingDelete= false;
      state.errorDelete= "";
    }
  },
  extraReducers: {
    [deleteEducationDetails.pending]: (state, action) => {
      state.loadingDelete = true;
    },
    [deleteEducationDetails.fulfilled]: (state, action) => {
      state.loadingDelete = false;
      state.EducationDelete = action.payload;
      state.errorDelete = "";
    },
    [deleteEducationDetails.rejected]: (state, action) => {
      state.loadingDelete = false;
      state.errorDelete = action.payload;
      state.EducationDelete = [];
    },
  },
});


export const {reset: resetEducationPost} = EducationDataPostSlice.actions,
 {reset: resetEducationPatch} = EducationDataPatchSlice.actions,
{reset: resetEducationDelete} = EducationDataDeleteSlice.actions;

export const EducationPostSlice=EducationDataPostSlice.reducer,
EducationPatchSlice=EducationDataPatchSlice.reducer, 
EducationDeleteSlice=EducationDataDeleteSlice.reducer
