import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const updateLanguageList: any = createAsyncThunk(
  "updateLanguage",
  async (data: any) => {
    return data;
  }
);

const languageSlice = createSlice({
  name: "updateLanguage",
  initialState: {
    languageList: [
      {
        _id: "1234",
        name: "",
        level: { canRead: false, canWrite: false, canSpeak: false },
        prof: "",
      },
    ],
    languageLoading: false,
    languageError: "",
  },
  reducers: {
    update: (state, action) => {
      state.languageList = action.payload;
      state.languageLoading = false;
      state.languageError = "";
    },
  },
});

export default languageSlice.reducer;
