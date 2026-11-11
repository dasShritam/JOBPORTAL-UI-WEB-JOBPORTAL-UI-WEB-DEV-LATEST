import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../../shared/api-endpoint.shared";

export const PostPrivateJob: any = createAsyncThunk(
  "PrivateJob",
  async (datas: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_JOB_POST_JOB, datas);
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

export const GetQuestionTemplates: any = createAsyncThunk(
  "Templates",

  async (input) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_FETCH_QN_TEMPLATE,
        input
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

export const PostTemplate: any = createAsyncThunk(
  "TemplatePost",
  async (input: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_POST_QN_TEMPLATE,
        input
      );
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);
export const deleteTemplate: any = createAsyncThunk(
  "Templatedelete",
  async (id: any) => {
    try {
      const { data } = await API.delete(
        `${API_ENDPOINTS. MAC_JOB_DELETE_QN_TEMPLATE}/${id}`
      );
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);
const deleteTemplateSlice = createSlice({
  name: "Templatedelete",
  initialState: {
    deletetemplates: [],
    dloadingTemplate: true,
    derrorTemplate: "",
  },
  reducers: {
    reset: (state) => {
      state.dloadingTemplate = false;
      state.derrorTemplate = "";
      state.deletetemplates = [];
    },
  },
  extraReducers: {
    [deleteTemplate.pending]: (state, action) => {
      state.dloadingTemplate = true;
    },
    [deleteTemplate.fulfilled]: (state, action) => {
      state.dloadingTemplate = false;
      state.deletetemplates = action.payload;
      state.derrorTemplate = "";
    },
    [deleteTemplate.rejected]: (state, action) => {
      state.dloadingTemplate = false;
      state.derrorTemplate = action.payload.response.data.message;
      state.deletetemplates = [];
    },
  },
});

const PostPrivateJobSlicee = createSlice({
  name: "PrivateJob",
  initialState: {
    res: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = "";
      state.res = [];
    },
  },
  extraReducers: {
    [PostPrivateJob.pending]: (state, action) => {
      state.loading = true;
    },
    [PostPrivateJob.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [PostPrivateJob.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.res = [];
    },
  },
});

const GetTemplateSlice = createSlice({
  name: "Templates",
  initialState: {
    templates: [],
    loadingTemplate: true,
    errorTemplate: "",
  },
  reducers: {},
  extraReducers: {
    [GetQuestionTemplates.pending]: (state, action) => {
      state.loadingTemplate = true;
    },
    [GetQuestionTemplates.fulfilled]: (state, action) => {
      state.loadingTemplate = false;
      state.templates = action.payload;
      state.errorTemplate = "";
    },
    [GetQuestionTemplates.rejected]: (state, action) => {
      state.loadingTemplate = false;
      state.errorTemplate = action.payload.response.data.message;
      state.templates = [];
    },
  },
});

const PostTemplatesSlice = createSlice({
  name: "TemplatePost",
  initialState: {
    templatePost: [],
    loadingTemplatePost: true,
    errorTemplatePost: "",
  },
  reducers: {},
  extraReducers: {
    [PostTemplate.pending]: (state, action) => {
      state.loadingTemplatePost = true;
    },
    [PostTemplate.fulfilled]: (state, action) => {
      state.loadingTemplatePost = false;
      state.templatePost = action.payload;
      state.errorTemplatePost = "";
    },
    [PostTemplate.rejected]: (state, action) => {
      state.loadingTemplatePost = false;
      state.errorTemplatePost = action.payload.response.data.message;
      state.templatePost = [];
    },
  },
});

export const PatchPrivateJob: any = createAsyncThunk(
  "PatchPrivateJob",
  async (datas: any) => {
    try {
      const { data } = await API.patch(API_ENDPOINTS.MAC_JOB_UPDATE_JOB, datas);
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);

const PatchPrivateJobSlicee = createSlice({
  name: "PrivateJob",
  initialState: {
    res: [],
    loading: false,
    error: "",
  },
  reducers: {
    resetUpdatejob: (state) => {
      state.loading = false;
      state.error = "";
      state.res = [];
    },
  },

  extraReducers: {
    [PatchPrivateJob.pending]: (state, action) => {
      state.loading = true;
    },
    [PatchPrivateJob.fulfilled]: (state, action) => {
      state.loading = false;
      state.res = action.payload;
      state.error = "";
    },
    [PatchPrivateJob.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.response.data.message;
      state.res = [];
    },
  },
});

export const RolesAndResponsibility: any = createAsyncThunk(
  "RolesAndResponsibility",
  async (id: any) => {
    try {
      const { data } = await API.get(
        `${API_ENDPOINTS.MAC_ROLES_RESPONSIBILITY}/${id}`
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const RolesAndResponsibilitySlicee = createSlice({
  name: "RolesAndResponsibility",
  initialState: {
    roles: [],
    loadingI: true,
    errorI: "",
  },
  reducers: {},
  extraReducers: {
    [RolesAndResponsibility.pending]: (state, action) => {
      state.loadingI = true;
    },
    [RolesAndResponsibility.fulfilled]: (state, action) => {
      state.roles = action.payload;
      state.errorI = "";
      state.loadingI = false;
    },
    [RolesAndResponsibility.error]: (state, action) => {
      state.roles = [];
      state.errorI = action.payload.response.data.message;
      state.loadingI = false;
    },
  },
});

export const GetPremiumCollege: any = createAsyncThunk(
  "GetPremiumCollege",
  async (params: any) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.MAC_UNIVERSITIES,
        params
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const GetPremiumCollegeSlicee = createSlice({
  name: "GetPremiumCollege",
  initialState: {
    data: [],
    loadingI: true,
    errorI: "",
  },
  reducers: {},
  extraReducers: {
    [GetPremiumCollege.pending]: (state, action) => {
      state.loadingI = true;
    },
    [GetPremiumCollege.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.errorI = "";
      state.loadingI = false;
    },
    [GetPremiumCollege.error]: (state, action) => {
      state.data = [];
      state.errorI = action.payload.response.data.message;
      state.loadingI = false;
    },
  },
});

export const PostPrivateJobSlice = PostPrivateJobSlicee.reducer,
  GetTemplatesSlice = GetTemplateSlice.reducer,
  PostTemplateSlice = PostTemplatesSlice.reducer,
  PatchPrivateJobSlice = PatchPrivateJobSlicee.reducer,
  RolesAndResponsibilitySlice = RolesAndResponsibilitySlicee.reducer,
  GetPremiumCollegeSlice = GetPremiumCollegeSlicee.reducer,
  DeleteTemplateSlice=deleteTemplateSlice.reducer;

export const { reset: resetPostJob } = PostPrivateJobSlicee.actions,
  { resetUpdatejob: resetUpdatejob } = PatchPrivateJobSlicee.actions;
;
