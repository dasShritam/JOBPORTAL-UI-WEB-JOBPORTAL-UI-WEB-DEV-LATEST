import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";
import { API_ENDPOINTS } from "../../../shared/api-endpoint.shared";

// Post Create

export const createComment: any = createAsyncThunk(
  "CreateComments",
  async (Status: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_CREATE_COMMENT,
        Status
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const createCommentSl = createSlice({
  name: "CreateComments",
  initialState: {
    Comments: [],
    loadingS: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.loadingS = true;
      state.Comments = [];
      state.error = "";
    },
  },
  extraReducers: {
    [createComment.pending]: (state, action) => {
      state.loadingS = true;
    },
    [createComment.fulfilled]: (state, action) => {
      state.loadingS = false;
      state.Comments = action.payload;
      state.error = "";
    },
    [createComment.rejected]: (state, action) => {
      state.loadingS = false;
      state.error = action.payload;
      state.Comments = [];
    },
  },
});

// fetch Create

export const fetchComment: any = createAsyncThunk(
  "fetchComments",
  async (Status: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_FETCH_COMMENT,
        Status
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const fetchCommentSl = createSlice({
  name: "fetchComments",
  initialState: {
    FComments: [],
    loadingF: true,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [fetchComment.pending]: (state, action) => {
      state.loadingF = true;
    },
    [fetchComment.fulfilled]: (state, action) => {
      state.loadingF = false;
      state.FComments = action.payload;
      state.error = "";
    },
    [fetchComment.rejected]: (state, action) => {
      state.loadingF = false;
      state.error = action.payload;
      state.FComments = [];
    },
  },
});

// Uodate comment

export const updateComment: any = createAsyncThunk(
  "updateComment",
  async (Status: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_UPDATE_COMMENT,
        Status
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const updateCommentSl = createSlice({
  name: "updateComment",
  initialState: {
    UComments: [],
    loadingU: true,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [updateComment.pending]: (state, action) => {
      state.loadingU = true;
      state.UComments = [];
      state.error = "";
    },
    [updateComment.fulfilled]: (state, action) => {
      state.loadingU = false;
      state.UComments = action.payload;
      state.error = "";
    },
    [updateComment.rejected]: (state, action) => {
      state.loadingU = false;
      state.error = action.payload;
      state.UComments = [];
    },
  },
});

//delete comment

export const deleteComment: any = createAsyncThunk(
  "deleteComments",
  async (Status: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_JOB_DELETE_COMMENT,
        Status
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const deleteCommentSl = createSlice({
  name: "deleteComments",
  initialState: {
    DComments: [],
    loadingD: true,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [deleteComment.pending]: (state, action) => {
      state.loadingD = true;
      state.DComments = [];
      state.error = "";
    },
    [deleteComment.fulfilled]: (state, action) => {
      state.loadingD = false;
      state.DComments = action.payload;
      state.error = "";
    },
    [deleteComment.rejected]: (state, action) => {
      state.loadingD = false;
      state.error = action.payload;
      state.DComments = [];
    },
  },
});

export const { reset: resetcreateComment } = createCommentSl.actions;
export const createCommentSlice = createCommentSl.reducer,
  fetchCommentSlice = fetchCommentSl.reducer,
  updateCommentSlice = updateCommentSl.reducer,
  deleteCommentSlice = deleteCommentSl.reducer;
