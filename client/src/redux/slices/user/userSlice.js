import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    error : null,
    loading : false
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=> {
            state.loading = true;
        },
        signInSuccess:(state,action)=>{
            state.loading = false;
            state.error = false;
            state.currentUser = action.payload;
        },
        signInFailure:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart:(state)=> {
            state.loading = true;
        },
        updateUserSuccess:(state,action)=> {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateUserFail:(state,action)=> {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart:(state)=> {
            state.loading = true;
        },
        deleteUserSuccess:(state)=> {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        deleteUserFail:(state,action)=> {
            state.loading = false;
            state.error = action.payload;
        },
        signOutUserStart:(state)=> {
            state.loading = true;
        },
        signOutUserSuccess:(state)=> {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        signOutUserFail:(state,action)=> {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {signInStart,signInSuccess,signInFailure,updateUserStart,updateUserSuccess,updateUserFail,
    deleteUserStart,deleteUserSuccess,deleteUserFail,signOutUserFail,signOutUserStart,signOutUserSuccess
} = userSlice.actions;

export default userSlice.reducer;