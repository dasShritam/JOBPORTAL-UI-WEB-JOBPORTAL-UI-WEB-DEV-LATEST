import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

export const updateProjectDetails: any = createAsyncThunk(
  "ProjectDetails",
  async (projectData) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_JS_PROJECT,
        projectData
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const ProjectDetailsSl = createSlice({
  name: "ProjectDetails",
  initialState: {
    ProjectDetails: [],
    projectLoadingState: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.ProjectDetails = [];
      state.projectLoadingState = false;
      state.error = "";
    },
  },
  extraReducers: {
    [updateProjectDetails.pending]: (state, action) => {
      state.projectLoadingState = true;
    },
    [updateProjectDetails.fulfilled]: (state, action) => {
      state.projectLoadingState = false;
      state.ProjectDetails = action.payload;
      state.error = "";
    },
    [updateProjectDetails.rejected]: (state, action) => {
      state.projectLoadingState = false;
      state.error = action.payload;
      state.ProjectDetails = [];
    },
  },
});

export const deleteProjectData: any = createAsyncThunk(
  "DeleteProject",
  async (id) => {
    try {
      const { data } = await API.delete(`${API_ENDPOINTS.MAC_JS_PROJECT}/${id} `);
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const DeleteProjectSl = createSlice({
  name: "DeleteProject",
  initialState: {
    res: [],
    loadingState: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.res = [];
      state.loadingState = false;
      state.error = "";
    },
  },
  extraReducers: {
    [deleteProjectData.pending]: (state, action) => {
      state.loadingState = true;
    },
    [deleteProjectData.fulfilled]: (state, action) => {
      state.loadingState = false;
      state.res = action.payload;
      state.error = "";
    },
    [deleteProjectData.rejected]: (state, action) => {
      state.loadingState = false;
      state.error = action.payload;
      state.res = [];
    },
  },
});
export const { reset: resetProjectSl } = ProjectDetailsSl.actions;
export const { reset: resetDeleteProjSl } = DeleteProjectSl.actions;
export const ProjectDetailsSlice = ProjectDetailsSl.reducer,
  DeleteProjectSlice = DeleteProjectSl.reducer;
