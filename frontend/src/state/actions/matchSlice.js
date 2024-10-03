import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    matches: [],
    loading: false,
    error: null
}

const matchSlice = createSlice({
    name: "match",
    initialState,
    reducers: {
        matchRequest: (state) => {
            state.loading = true;
        },
        matchSuccess: (state, action) => {
            state.loading = false;
            state.matches = action.payload;
        },
        matchFail: (state) => {
            state.loading = false;
            state.error = true;
        }

    }
});

export default matchSlice.reducer;

export const { matchRequest, matchSuccess, matchFail } = matchSlice.actions;

