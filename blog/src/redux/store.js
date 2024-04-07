import { createSlice, configureStore } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLogin: false,
    },
    reducers: {
        login(state) {
            state.isLogin = true;
        },
        logout(state) {
            state.isLogin = false;
        },
    },
});

export const { login, logout } = authSlice.actions;


const tokenSlice = createSlice({
    name: "token",
    initialState: localStorage.getItem("token") || "",
    reducers: {
        setToken(state, action) {
            localStorage.setItem("token", action.payload);
            return action.payload;
        },
        clearToken(state) {
            localStorage.removeItem("token");
            return "";
        },
    },
});

export const { setToken, clearToken } = tokenSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        token: tokenSlice.reducer,
    },
});


const setupAxiosInterceptors = (token) => {
    axios.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = token;
            } else {
                delete config.headers.Authorization;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};


setupAxiosInterceptors(store.getState().token);

const unsubscribe = store.subscribe(() => {
    const token = store.getState().token;
    setupAxiosInterceptors(token);
});

store.subscribe(() => {
    unsubscribe();
});
