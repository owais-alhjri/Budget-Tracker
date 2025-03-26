import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../Features/UserSlice";

export const Store = configureStore({
    reducer:{
        users:usersReducer,
    },
});