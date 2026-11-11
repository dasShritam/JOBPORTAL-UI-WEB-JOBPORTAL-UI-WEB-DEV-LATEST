import { createSlice } from "@reduxjs/toolkit";

export interface CountryState {
  id: Number;
  name: string;
}

const initialState: CountryState[] = [
  { id: 1, name: "India" },
  { id: 2, name: "UAE" },
];

export const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    getCountries: (state) => {
      state = state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getCountries } = countrySlice.actions;

export default countrySlice.reducer;
