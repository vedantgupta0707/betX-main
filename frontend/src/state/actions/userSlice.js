import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};



const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
        reduceWalletAmount: (state, action) => {
            state.currentUser.wallet -= action.payload;
        },

    }
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    reduceWalletAmount
} = userSlice.actions;

export default userSlice.reducer;