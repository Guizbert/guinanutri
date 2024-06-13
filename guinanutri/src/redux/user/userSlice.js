import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userConnected: null,
    error: null,
    loading: false
}


const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.userConnected = action.payload;
            state.loading= false;
            state.error = null;
        },
        loginFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.userConnected = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.userConnected = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutSuccess: (state) => {
            state.userConnected = null;
            state.loading = false;
            state.error = null;
        }
    },
});

export const {loginStart, 
    loginSuccess, 
    loginFail, 
    updateStart,
    updateSuccess,
    updateFail,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFail,
    logoutSuccess} = userSlice.actions;

export default userSlice.reducer;