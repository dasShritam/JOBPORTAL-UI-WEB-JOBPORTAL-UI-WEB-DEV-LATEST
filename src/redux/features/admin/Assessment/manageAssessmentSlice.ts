import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";
import API from "../../../../config/axios.config";

//Add assesment API
export const addAssessment: any = createAsyncThunk(
  "AddAssessment",
  async (Assessment: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.ADMIN_ADD_ASSESSMENT,
        Assessment
      );
      return data;
    } catch (error: any) {
      return error.response;
    }
  }
);

const addAssessmentDataSl = createSlice({
  name: "AddAssessment",
  initialState: {
    AddAssessRes: [],
    AddAssessloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.AddAssessRes = [];
      state.AddAssessloading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [addAssessment.pending]: (state, action) => {
      state.AddAssessloading = true;
    },
    [addAssessment.fulfilled]: (state, action) => {
      state.AddAssessloading = false;
      state.AddAssessRes = action.payload;
      state.error = "";
    },
    [addAssessment.rejected]: (state, action) => {
      state.AddAssessloading = false;
      state.error = action.payload;
      state.AddAssessRes = [];
    },
  },
});

//Update Test

export const updateAssessment: any = createAsyncThunk(
  "uAssessment",
  async (Assessment: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.ADMIN_UPDATE_ASSESSMENT,
        Assessment
      );
      return data;
    } catch (error: any) {
      return error.response;
    }
  }
);

const updateAssessmentSl = createSlice({
  name: "uAssessment",
  initialState: {
    updateAssessRes: [],
    updateAssessloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.updateAssessRes = [];
      state.updateAssessloading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [updateAssessment.pending]: (state, action) => {
      state.updateAssessloading = true;
    },
    [updateAssessment.fulfilled]: (state, action) => {
      state.updateAssessloading = false;
      state.updateAssessRes = action.payload;
      state.error = "";
    },
    [updateAssessment.rejected]: (state, action) => {
      state.updateAssessloading = false;
      state.error = action.payload;
      state.updateAssessRes = [];
    },
  },
});

//update Cost

export const UpdateCost: any = createAsyncThunk(
  "UpdateCost",
  async (Assessment: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.ADMIN_UPDATE_ASSESSMENT_COST,
        Assessment
      );
      return data;
    } catch (error: any) {
      return error.response;
    }
  }
);

const UpdateCurrencyS1 = createSlice({
  name: "UpdateCost",
  initialState: {
    UpdateCurrency: [],
    UpdateCostloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.UpdateCurrency = [];
      state.UpdateCostloading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [UpdateCost.pending]: (state, action) => {
      state.UpdateCostloading = true;
    },
    [UpdateCost.fulfilled]: (state, action) => {
      state.UpdateCostloading = false;
      state.UpdateCurrency = action.payload;
      state.error = "";
    },
    [UpdateCost.rejected]: (state, action) => {
      state.UpdateCostloading = false;
      state.error = action.payload;
      state.UpdateCurrency = [];
    },
  },
});

//Update Status toggel

export const EnableDisableAssessment: any = createAsyncThunk(
  "TestStatus",
  async (datas: any) => {
    try {
      const { data } = await API.patch(
        `${API_ENDPOINTS.JS_ASSESSMENT_STATUS}/${datas.testS}/${datas.idtest}`
      );

      return data;
    } catch (error: any) {
      return error.response;
    }
  }
);
const EnableDisableAssessmentSL = createSlice({
  name: "TestStatus",
  initialState: {
    statusAssessRes: [],
    updateStatusloading: true,
    errors: "",
  },
  reducers: {
    reset: (state: any) => {
      state.statusAssessRes = [];
      state.updateStatusloading = true;
      state.error = "";
    },
  },
  extraReducers: {
    [EnableDisableAssessment.pending]: (state, action) => {
      state.updateStatusloading = true;
    },
    [EnableDisableAssessment.fulfilled]: (state, action) => {
      state.updateStatusloading = false;
      state.statusAssessRes = action.payload;
      state.errors = "";
    },
    [EnableDisableAssessment.rejected]: (state, action) => {
      state.updateStatusloading = false;
      state.errors = action.payload;
      state.statusAssessRes = [];
    },
  },
});

//view assessment

export const viewAssessment: any = createAsyncThunk(
  "viewAssessment",
  async (Assessment: any) => {
    try {
      const { data } = await API.get(
        `${API_ENDPOINTS.MAC_view_assessment}/${Assessment}`
      );
      return data;
    } catch (error: any) {
      return error.response;
    }
  }
);
const viewAssessmentSl = createSlice({
  name: "viewAssessment",
  initialState: {
    viewAssessmentRes: [],
    viewAssessmentloading: false,
    error: "",
  },
  reducers: {
    reset: (state: any) => {
      state.viewAssessmentRes = [];
      state.viewAssessmentloading = false;
      state.error = ""
    },
  },
  extraReducers: {
    [viewAssessment.pending]: (state, action) => {
      state.viewAssessmentloading = true;
    },
    [viewAssessment.fulfilled]: (state, action) => {
      state.viewAssessmentloading = false;
      state.viewAssessmentRes = action.payload;
      state.error = "";
    },
    [viewAssessment.rejected]: (state, action) => {
      state.viewAssessmentloading = false;
      state.error = action.payload;
      state.viewAssessmentRes = [];
    },
  },
});

//download csv file
export const getDownloadAssessment: any = createAsyncThunk(
  "DownloadAssessment",
  async (id: any) => {
    try {
      const res = await API.get(
        `${API_ENDPOINTS.MAC_DOWNLOAD_ASSESSMENT}/${id}`, { responseType: "text" }
      ),
        filename = `applicants-list-${new Date().getTime()}`,
        blob = new Blob([res.data], { type: "text/csv" }),
        url = window.URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error: any) {
      return error;
    }
  }
);
const DownloadAssessmentStastisticsS1 = createSlice({
  name: "getAssessmentStatistics",
  initialState: {
    downloadRes: [],
    downloadLoading: false,
    dwnloadError: "",
  },
  reducers: {
    reset: (state: any) => {
      state.downloadLoading = false;
      state.downloadRes = [];
      state.dwnloadError = "";
    },
  },
  extraReducers: {
    [getDownloadAssessment.pending]: (state, action) => {
      state.downloadLoading = true;
    },
    [getDownloadAssessment.fulfilled]: (state, action) => {
      state.downloadLoading = false;
      state.downloadRes = action.payload;
      state.dwnloadError = "";
    },
    [getDownloadAssessment.rejected]: (state, action) => {
      state.downloadLoading = false;
      state.dwnloadError = action.payload.response.data.message;
      state.downloadRes = [];
    },
  },
});

export const { reset: resetAddAssessment } = addAssessmentDataSl.actions;
export const { reset: resetStatusAssessment } =
  EnableDisableAssessmentSL.actions;
export const { reset: resetEditAssessment } = updateAssessmentSl.actions;
export const { reset: resetUpdateCurrency } = UpdateCurrencyS1.actions;
export const { reset: resetviewAssessmentSl } = viewAssessmentSl.actions;
export const { reset: resetDownloadAssessmentS1 } = DownloadAssessmentStastisticsS1.actions;
export const AddAssessmentSlice = addAssessmentDataSl.reducer,
  UpdateAssessmentSlice = updateAssessmentSl.reducer,
  UpdateStaustSlice = EnableDisableAssessmentSL.reducer,
  viewAssessmentSlice = viewAssessmentSl.reducer,
  UpdateCurrencySlice = UpdateCurrencyS1.reducer,
  DownloadAssessmentSlice = DownloadAssessmentStastisticsS1.reducer;
