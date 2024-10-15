import { createSlice } from "@reduxjs/toolkit";

// auth slice
export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null
    },
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        setLogout: (state) => {
            state.user = null
            state.token = null
        },
        setUser: (state, action) => {
            state.user = action.payload.user
        }
    } 
})

export const { setLogin, setLogout, setUser} = authSlice.actions

export default authSlice.reducer