import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {

};


const userSlice = createSlice({
    name: 'user',
    initialState: INITIAL_STATE,
    reducers: {

    },
    extraReducers: (builder)=>{
        // builder.addCase()
    }
});

export const userState = (state) => state.user;

export const userReducer = userSlice.reducer;

export const userActions = userSlice.actions;