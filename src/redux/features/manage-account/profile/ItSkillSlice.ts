import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../../../config/axios.config';
import { API_ENDPOINTS } from '../../../../shared/api-endpoint.shared';

export const postITSkillDetails: any = createAsyncThunk(
  'PatchItSkill',
  async (dat: any) => {
    try {
      const { data } = await API.patch(API_ENDPOINTS.MAC_JS_SKILLS, dat);
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

export const updateITSkillDetails: any = createAsyncThunk(
  'PatchItSkill',
  async dat => {
    try {
      const { data } = await API.patch(API_ENDPOINTS.MAC_JS_SKILLS, dat);
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const ITSkillSlice = createSlice({
  name: 'PatchItSkill',
  initialState: {
    ItSkillResponse: [],
    itSkillLoading: true,
    itSkillError: '',
  },
  reducers: {
    reset: state => {
      state.ItSkillResponse = [];
      state.itSkillLoading = false;
      state.itSkillError = '';
    },
  },
  extraReducers: {
    [updateITSkillDetails.pending]: (state, action) => {
      state.itSkillLoading = true;
    },
    [updateITSkillDetails.fulfilled]: (state, action) => {
      state.itSkillLoading = false;
      state.ItSkillResponse = action.payload;
      state.itSkillError = '';
    },
    [updateITSkillDetails.rejected]: (state, action) => {
      state.itSkillLoading = false;
      state.itSkillError = action.payload;
      state.ItSkillResponse = [];
    },
  },
});

export const deleteITSkillDetails: any = createAsyncThunk(
  'DeleteItSkill',
  async (id: any) => {
    try {
      const { data } = await API.delete(`${API_ENDPOINTS.MAC_JS_SKILLS}/${id}`);
      return data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const deleteITSkillDetailsSlice = createSlice({
  name: 'DeleteItSkill',
  initialState: {
    response: [],
    load: false,
    errors: '',
  },
  reducers: {
    reset: state => {
      state.load = false;
      state.response = [];
      state.errors = '';
    },
  },
  extraReducers: {
    [deleteITSkillDetails.pending]: state => {
      state.load = true;
    },
    [deleteITSkillDetails.fulfilled]: (state, action) => {
      state.load = false;
      state.response = action.payload;
      state.errors = '';
    },
    [deleteITSkillDetails.rejected]: (state, action) => {
      state.load = false;
      state.errors = action.payload;
      state.response = [];
    },
  },
});

export const { reset: resetITSkillsSl } = ITSkillSlice.actions;
export const { reset: resetDeleteItSkillsSl } =
  deleteITSkillDetailsSlice.actions;

export const iTSkillSlice = ITSkillSlice.reducer,
  DeleteITSkillDetailsSlice = deleteITSkillDetailsSlice.reducer;
