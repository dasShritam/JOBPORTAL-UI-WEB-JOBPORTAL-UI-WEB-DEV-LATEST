import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../../config/axios.config";
import { API_ENDPOINTS } from "../../../../shared/api-endpoint.shared";

/* Employer profile */
export const getProfileDetails: any = createAsyncThunk(
  "EmployerProfile",
  async () => {
    try {
      const { data } = await API.get(API_ENDPOINTS.MAC_EMP_PROFILE);
      return data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const employerProfileSl = createSlice({
  name: "EmployerProfile",
  initialState: {
    EmployerProfile: [],
    loading: false,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.EmployerProfile = [];
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [getProfileDetails.pending]: (state, action) => {
      state.loading = true;
    },
    [getProfileDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.EmployerProfile = action.payload;
      state.error = "";
    },
    [getProfileDetails.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.EmployerProfile = [];
    },
  },
});

/* end Employer profile */

/* Company  Details update */

export const companyDetails: any = createAsyncThunk(
  "CompanyInfo",
  async (companydata: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_EMP_COMPANY_INFO,
        companydata
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const companyDetailsSl = createSlice({
  name: "CompanyInfo",
  initialState: {
    companyInfo: [],
    loading: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.companyInfo = [];
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [companyDetails.pending]: (state, action) => {
      state.loading = true;
    },
    [companyDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.companyInfo = action.payload;
      state.error = "";
    },
    [companyDetails.rejected]: (state, action) => {
      state.loading = false;
      state.companyInfo = [];
      state.error = action.payload;
    },
  },
});

/* End Company  Details update */

/* Account Details update */

export const accountDetails: any = createAsyncThunk(
  "AccountInfo",
  async (accountData: any) => {
    try {
      const { data } = await API.patch(
        API_ENDPOINTS.MAC_EMP_ACC_INFO,
        accountData
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const accountDetailsSl = createSlice({
  name: "AccountInfo",
  initialState: {
    AccountInfo: [],
    loading: true,
    error: "",
  },
  reducers: {
    reset: (state) => {
      state.AccountInfo = [];
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: {
    [accountDetails.pending]: (state, action) => {
      state.loading = true;
    },
    [accountDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.AccountInfo = action.payload;
      state.error = "";
    },
    [accountDetails.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.AccountInfo = [];
    },
  },
});

/*END  Account Details update */

// Start upload logo

export const uploadLogo: any = createAsyncThunk(
  "UploadLogo",
  async (userInfo: any) => {
    try {
      const { data } = await API.post(
        API_ENDPOINTS.MAC_EMP_UPLOAD_COM_LOGO,
        userInfo
      );
      return data;
    } catch (error: any) {
      return error;
    }
  }
);

const UploadCompanyLogoSl = createSlice({
  name: "UploadLogo",
  initialState: {
    response: [],
    loading: false,
    errorss: "",
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.response = [];
      state.errorss = "";
    },
  },
  extraReducers: {
    [uploadLogo.pending]: (state) => {
      state.loading = true;
    },
    [uploadLogo.fulfilled]: (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.errorss = "";
    },
    [uploadLogo.rejected]: (state, action) => {
      state.loading = false;
      state.errorss = action.payload;
      state.response = [];
    },
  },
});

/* End Upload logo */

/* Download logo */

export const downloadLogo: any = createAsyncThunk("DownloadLogo", async () => {
  try {
    const { data } = await API.get(API_ENDPOINTS.MAC_DOWNLOAD_COM_LOGO);
    return data;
  } catch (error: any) {
    return error;
  }
});

const downloadLogoSl = createSlice({
  name: "downloadVideoSlice",
  initialState: {
    companyLogo: [],
    loads: true,
    error: "",
  },
  reducers: {},
  extraReducers: {
    [downloadLogo.pending]: (state, action) => {
      state.loads = true;
    },
    [downloadLogo.fulfilled]: (state, action) => {
      state.loads = false;
      state.companyLogo = action.payload;
      state.error = "";
    },
    [downloadLogo.rejected]: (state, action) => {
      state.loads = false;
      state.error = action.payload;
      state.companyLogo = [];
    },
  },
});

/*End  Download logo */
export const { reset: resetProfile } = UploadCompanyLogoSl.actions;
export const { reset: resetEmpProfile } = employerProfileSl.actions;
export const { reset: resetAccountDetails } = accountDetailsSl.actions;
export const { reset: resetCompanyDetails } = companyDetailsSl.actions;
export const employeerProfileSlice = employerProfileSl.reducer,
  companyInfoSlice = companyDetailsSl.reducer,
  accountInfoSlice = accountDetailsSl.reducer,
  downloadLogoSlice = downloadLogoSl.reducer,
  UploadCompanyLogoSlice = UploadCompanyLogoSl.reducer;
